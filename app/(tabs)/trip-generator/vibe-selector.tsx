import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { VibeCard } from '@/components/cards/variants/VibeCard';
import { HeaderWithBack } from '@/components/PageHeader';
import { PaceValue } from '@/constants/paceOptions';
import { TRANSPORT_OPTIONS, TransportMode } from '@/constants/transportOptions';
import { VIBES } from '@/constants/vibes/vibes';
import colors from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Modal,
  Pressable,
  View
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';

/** Minimum ms of idle (no vibe tapped) before the interstitial appears */
const IDLE_TIMEOUT_MS = 7000;

export default function VibeSelectorScreen() {
  const router = useRouter();
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [loadingSurprise, setLoadingSurprise] = useState(false);
  const [showIdleModal, setShowIdleModal] = useState(false);
  const params = useLocalSearchParams();

  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const resetIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(
      () => setShowIdleModal(true),
      IDLE_TIMEOUT_MS
    );
  };

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!showIdleModal) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 700,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true
        })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [showIdleModal, pulseAnim]);

  const toggleVibe = (id: string) => {
    resetIdleTimer();
    setSelectedVibes(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const normalizeStringParam = (param: string | string[] | undefined): string =>
    (Array.isArray(param) ? param[0] : param) || '';

  const handleContinue = () => {
    if (selectedVibes.length === 0) return;
    router.push({
      pathname: '/curating-trip',
      params: {
        ...params,
        vibes: JSON.stringify(selectedVibes),
        mode: 'generate'
      }
    });
  };

  const handleSurpriseMe = async () => {
    setShowIdleModal(false);
    if (loadingSurprise) return;
    setLoadingSurprise(true);
    try {
      router.push({ pathname: '/curating-trip', params: { mode: 'surprise' } });
    } catch {
      Alert.alert('Oops', 'Could not generate a surprise trip. Try again!');
    } finally {
      setLoadingSurprise(false);
    }
  };

  const insets = useSafeAreaInsets();

  const ListHeader = () => (
    <View style={{ marginBottom: 16 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}
      >
        <View style={{ flex: 1 }}>
          <HeaderWithBack title="Select Your Vibes" />
        </View>
        <Pressable
          onPress={handleSurpriseMe}
          disabled={loadingSurprise}
          style={{ padding: 8, flexShrink: 0 }}
        >
          <AppText
            style={{
              color: colors.brand.secondary,
              fontSize: 13,
              fontWeight: '700',
              textDecorationLine: 'underline'
            }}
          >
            Surprise Me
          </AppText>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      className="flex-1 bg-colors-surface-background"
    >
      <FlatList
        data={VIBES}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 16,
          paddingHorizontal: 16,
          paddingBottom: 24 + insets.bottom
        }}
        columnWrapperStyle={{
          gap: 16,
          justifyContent: 'space-between',
          marginBottom: 16
        }}
        ListHeaderComponent={<ListHeader />}
        ListFooterComponent={
          <View style={{ paddingHorizontal: 16, paddingBottom: 24, gap: 10 }}>
            <Button
              title="Generate Itinerary"
              onPress={handleContinue}
              disabled={selectedVibes.length === 0}
            />
          </View>
        }
        renderItem={({ item }) => (
          <VibeCard
            title={item.title}
            image={item.image}
            selected={selectedVibes.includes(item.id)}
            onPress={() => toggleVibe(item.id)}
          />
        )}
      />

      {/* Vibe mismatch is now handled in review-trip via params */}

      {/* ── Idle interstitial ── */}
      <Modal
        visible={showIdleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowIdleModal(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'flex-end'
          }}
          onPress={() => setShowIdleModal(false)}
        >
          <Pressable
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              padding: 28,
              gap: 20,
              alignItems: 'center'
            }}
            onPress={() => {}}
          >
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: colors.brand.primary + '20',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Ionicons name="shuffle" size={34} color={colors.brand.primary} />
            </View>

            <View style={{ alignItems: 'center', gap: 6 }}>
              <AppText
                style={{
                  fontSize: 20,
                  fontWeight: '800',
                  color: colors.text.DEFAULT
                }}
              >
                {"Can't Decide?"}
              </AppText>
              <AppText
                style={{
                  fontSize: 14,
                  color: '#64748b',
                  textAlign: 'center',
                  lineHeight: 20
                }}
              >
                Let us pick something unexpected for you.{'\n'}You might just
                love it.
              </AppText>
            </View>

            <Animated.View
              style={{ width: '100%', transform: [{ scale: pulseAnim }] }}
            >
              <Pressable
                onPress={handleSurpriseMe}
                style={{
                  backgroundColor: colors.brand.primary,
                  borderRadius: 16,
                  paddingVertical: 8,
                  alignItems: 'center',
                  gap: 8,
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}
              >
                <Ionicons name="shuffle-outline" size={20} color="white" />
                <AppText
                  style={{ color: 'white', fontWeight: '700', fontSize: 16 }}
                >
                  Surprise Me!
                </AppText>
              </Pressable>
            </Animated.View>

            <Pressable onPress={() => setShowIdleModal(false)}>
              <AppText style={{ color: '#94a3b8', fontSize: 13 }}>
                {"No thanks, I'll choose"}
              </AppText>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
