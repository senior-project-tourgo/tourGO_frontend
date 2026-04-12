import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Accordion } from '@/components/Accordion';
import { Place, OpeningHours, PriceRange } from '@/features/place/place.types';
import colors from '@/theme/colors';
import { VIBES } from '@/constants/vibes';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, Linking, Pressable, ScrollView, View } from 'react-native';
import { PromotionCard } from '../PromotionCard';
import { getPlaceOpeningStatus } from '@/utils/openingHours';
import type { ApiPromotion } from '@/services/promotion.service';
import { getPlaceGoogleDetails } from '@/services/place.service';

type PlaceInfoProps = {
  place: Place;
  promotions: ApiPromotion[];
  isSaved: boolean;
  saving: boolean;
  onToggleSave: () => void;
};

type GoogleReview = {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
};

type GoogleData = {
  description?: string;
  address?: string;
  totalRatings?: number;
  reviews?: GoogleReview[];
};

const DAYS: (keyof OpeningHours)[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

const FACILITY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  parking: 'car-outline',
  wifi: 'wifi-outline',
  wheelchair: 'accessibility-outline',
  restroom: 'water-outline',
  atm: 'card-outline',
  restaurant: 'restaurant-outline',
  'kid-friendly': 'happy-outline',
  photography: 'camera-outline',
  'guided tour': 'person-outline',
  souvenir: 'bag-outline',
  prayer: 'book-outline',
  meditation: 'leaf-outline'
};

const VIBE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  thrill: 'rocket-outline',
  mountain: 'triangle-outline',
  spiritual: 'leaf-outline',
  culture: 'book-outline',
  nature: 'leaf-outline',
  foodie: 'restaurant-outline',
  chill: 'moon-outline',
  social: 'people-outline',
  photo: 'camera-outline',
  budget: 'wallet-outline',
  luxury: 'star-outline',
  family: 'home-outline',
  romantic: 'heart-outline',
  solo: 'person-outline',
  offbeat: 'compass-outline',
  wellness: 'fitness-outline',
  nightlife: 'moon-outline',
  bars_and_pubs: 'wine-outline',
  shopping: 'bag-outline',
  arts: 'color-palette-outline',
  music: 'musical-notes-outline',
  sports: 'football-outline',
  history: 'library-outline',
  beaches: 'sunny-outline'
};

function getFacilityIcon(facility: string): keyof typeof Ionicons.glyphMap {
  return FACILITY_ICONS[facility.toLowerCase()] ?? 'checkmark-circle-outline';
}

function getVibeIcon(id: string): keyof typeof Ionicons.glyphMap {
  return VIBE_ICONS[id] ?? 'sparkles-outline';
}

function formatTimeRange(open: string, close: string): string {
  const fmt = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${period}`;
  };
  return `${fmt(open)} – ${fmt(close)}`;
}

function formatDayHours(ranges: { open: string; close: string }[]): string {
  if (!ranges || ranges.length === 0) return 'Closed';
  return ranges.map(r => formatTimeRange(r.open, r.close)).join(', ');
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatVibeLabel(id: string): string {
  return id
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .replace(' And ', ' & ');
}

export function PlaceInfoCard({
  place,
  promotions,
  isSaved,
  saving,
  onToggleSave
}: PlaceInfoProps) {
  const openingStatus = getPlaceOpeningStatus(place.openingHours);
  const todayName =
    DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const [googleData, setGoogleData] = useState<GoogleData>({});

  useEffect(() => {
    if (!place.mapsLinkKey) return;
    getPlaceGoogleDetails(place.mapsLinkKey)
      .then(data => {
        setGoogleData({
          description: data.description ?? place.description ?? undefined,
          address: data.address ?? place.address ?? undefined,
          totalRatings: data.totalRatings ?? undefined,
          reviews: data.reviews
        });
      })
      .catch(() => {});
  }, [place.mapsLinkKey, place.description, place.address]);

  const openMaps = () => {
    const { lat, lng } = place.location;
    const hasPlaceId = place.mapsLinkKey?.startsWith('ChI');
    const query = hasPlaceId
      ? `place_id:${place.mapsLinkKey}`
      : place.placeName
        ? `${place.placeName} ${lat},${lng}`
        : `${lat},${lng}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    Linking.openURL(url);
  };

  const sm = place.socialMedia;
  const waNumber = sm?.whatsapp?.number ?? sm?.whatsapp?.handle;

  type SocialLink = {
    platform: string;
    icon: keyof typeof Ionicons.glyphMap;
    url: string;
    subtitle: string;
  };
  const socialLinks: SocialLink[] = [];
  if (sm?.instagram?.handle || sm?.instagram?.page) {
    const url =
      sm.instagram?.page ?? `https://www.instagram.com/${sm.instagram?.handle}`;
    socialLinks.push({
      platform: 'Instagram',
      icon: 'logo-instagram',
      url,
      subtitle: sm.instagram?.handle ? `@${sm.instagram.handle}` : 'Instagram'
    });
  }
  if (sm?.facebook?.page) {
    const shortPage = sm.facebook.page.replace(
      /https?:\/\/(www\.)?facebook\.com\//,
      ''
    );
    socialLinks.push({
      platform: 'Facebook',
      icon: 'logo-facebook',
      url: sm.facebook.page,
      subtitle: `/${shortPage}`
    });
  }
  if (sm?.tiktok?.handle || sm?.tiktok?.page) {
    const url =
      sm.tiktok?.page ?? `https://www.tiktok.com/@${sm.tiktok?.handle}`;
    socialLinks.push({
      platform: 'TikTok',
      icon: 'logo-tiktok',
      url,
      subtitle: sm.tiktok?.handle ? `@${sm.tiktok.handle}` : 'TikTok'
    });
  }
  if (waNumber) {
    const cleanNumber = String(waNumber).replace(/\s/g, '');
    socialLinks.push({
      platform: 'WhatsApp',
      icon: 'logo-whatsapp',
      url: `https://wa.me/${cleanNumber.replace('+', '')}`,
      subtitle: waNumber
    });
  }

  const staticMapUrl = `${process.env.EXPO_PUBLIC_API_URL}/places/static-map?lat=${place.location.lat}&lng=${place.location.lng}`;

  const Separator = () => (
    <View
      style={{
        height: 1,
        backgroundColor: colors.brand.neutrals,
        marginVertical: 2
      }}
    />
  );

  return (
    <View
      style={{
        backgroundColor: colors.surface.background,
        paddingHorizontal: 20,
        paddingBottom: 80,
        paddingTop: 20,
        gap: 20
      }}
    >
      {/* ── Header: Name · Bookmark · Rating · Status · Vibes ── */}
      <View style={{ gap: 6 }}>
        {/* Name + bookmark */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}
        >
          <AppText variant="heading24" style={{ flex: 1, paddingRight: 12 }}>
            {place.placeName}
          </AppText>
          <Pressable
            onPress={onToggleSave}
            disabled={saving}
            hitSlop={10}
            style={{ paddingTop: 4 }}
          >
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={26}
              color={isSaved ? colors.brand.primary : colors.text.DEFAULT}
            />
          </Pressable>
        </View>

        {/* Rating + area + price */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 4
          }}
        >
          <Ionicons name="star" size={14} color={colors.brand.primary} />
          <AppText
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: colors.text.DEFAULT
            }}
          >
            {place.averageRating}
          </AppText>
          {googleData.totalRatings ? (
            <AppText style={{ fontSize: 12, color: '#94a3b8' }}>
              ({googleData.totalRatings.toLocaleString()} reviews)
            </AppText>
          ) : null}
          <AppText style={{ fontSize: 12, color: '#cbd5e1' }}> · </AppText>
          <AppText style={{ fontSize: 13, color: '#64748b' }}>
            {place.location.area}
          </AppText>
          <AppText style={{ fontSize: 12, color: '#cbd5e1' }}> · </AppText>
          <AppText style={{ fontSize: 13, color: '#64748b' }}>
            {place.priceRange === '$' && 'रु 500'}
            {place.priceRange === '$$' && 'रु 500–1,500'}
            {place.priceRange === '$$$' && 'रु 1,500–4,000'}
            {place.priceRange === '$$$$' && 'रु 4,000+'}
          </AppText>
        </View>

        {/* Open/Closed */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: openingStatus.isOpenNow
                ? colors.status.success
                : colors.status.error
            }}
          />
          <AppText
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: openingStatus.isOpenNow
                ? colors.status.success
                : colors.status.error
            }}
          >
            {openingStatus.isOpenNow ? 'Open Now' : 'Closed'}
          </AppText>
          {openingStatus.nextTime && (
            <AppText style={{ fontSize: 13, color: '#94a3b8' }}>
              {openingStatus.nextTime.type === 'close'
                ? `· Closes ${openingStatus.nextTime.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : `· Opens ${openingStatus.nextTime.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
            </AppText>
          )}
        </View>

        {/* Vibe hashtag pills */}
        {(Array.isArray(place.vibe) ? place.vibe : []).length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: 4
            }}
          >
            {(Array.isArray(place.vibe) ? place.vibe : []).map((id: string) => {
              const label =
                VIBES.find(v => v.id === id)?.title ?? formatVibeLabel(id);
              return (
                <View
                  key={id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    backgroundColor: colors.brand.neutrals,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 20
                  }}
                >
                  <Ionicons
                    name={getVibeIcon(id)}
                    size={12}
                    color={colors.brand.secondary}
                  />
                  <AppText
                    style={{
                      fontSize: 12,
                      color: colors.brand.secondary,
                      fontWeight: '600'
                    }}
                  >
                    #{label}
                  </AppText>
                </View>
              );
            })}
          </View>
        )}
      </View>

      <Separator />

      {/* ── Typical Time Spent ── */}
      {!!place.typicalTimeSpent && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            backgroundColor: colors.brand.neutrals,
            padding: 14,
            borderRadius: 14
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: colors.brand.secondary + '20',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Ionicons
              name="time-outline"
              size={20}
              color={colors.brand.secondary}
            />
          </View>
          <View>
            <AppText style={{ fontSize: 11, color: colors.brand.secondary }}>
              Typical Time Spent
            </AppText>
            <AppText
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.text.DEFAULT
              }}
            >
              {place.typicalTimeSpent}
            </AppText>
          </View>
        </View>
      )}

      {/* ── Price Range ── */}
      {!!place.priceRange && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            backgroundColor: colors.brand.neutrals,
            padding: 14,
            borderRadius: 14
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: colors.brand.secondary + '20',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Ionicons
              name="wallet-outline"
              size={20}
              color={colors.brand.secondary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={{ fontSize: 11, color: colors.brand.secondary }}>
              Price Range
            </AppText>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                marginTop: 2
              }}
            >
              {(['$', '$$', '$$$', '$$$$'] as PriceRange[]).map(tier => {
                const active = place.priceRange === tier;
                return (
                  <View
                    key={tier}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 8,
                      backgroundColor: active
                        ? colors.brand.primary
                        : colors.brand.secondary + '15'
                    }}
                  >
                    <AppText
                      style={{
                        fontSize: 13,
                        fontWeight: active ? '700' : '400',
                        color: active ? 'white' : colors.brand.secondary + '80'
                      }}
                    >
                      {tier}
                    </AppText>
                  </View>
                );
              })}
              <AppText
                style={{ fontSize: 12, color: '#94a3b8', marginLeft: 4 }}
              >
                {place.priceRange === '$' && 'Under रु 500'}
                {place.priceRange === '$$' && 'रु 500 – 1,500'}
                {place.priceRange === '$$$' && 'रु 1,500 – 4,000'}
                {place.priceRange === '$$$$' && 'रु 4,000+'}
              </AppText>
            </View>
          </View>
        </View>
      )}

      {/* ── Google Description ── */}
      {googleData.description ? (
        <View
          style={{
            padding: 16,
            backgroundColor: colors.brand.neutrals + '80',
            borderRadius: 14,
            borderLeftWidth: 3,
            borderLeftColor: colors.brand.primary
          }}
        >
          <AppText
            style={{ fontSize: 13, lineHeight: 20, color: colors.text.DEFAULT }}
          >
            {googleData.description}
          </AppText>
        </View>
      ) : null}

      {/* ── Address ── */}
      {googleData.address || place.address ? (
        <Pressable
          onPress={openMaps}
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 10,
            backgroundColor: colors.brand.neutrals + '80',
            padding: 12,
            borderRadius: 12
          }}
        >
          <Ionicons
            name="location-outline"
            size={16}
            color={colors.brand.primary}
            style={{ marginTop: 1 }}
          />
          <AppText
            style={{
              fontSize: 13,
              color: colors.brand.primary,
              flex: 1,
              lineHeight: 19
            }}
          >
            {googleData.address || place.address}
          </AppText>
        </Pressable>
      ) : null}

      {/* ── Static Map ── */}
      {staticMapUrl ? (
        <Pressable
          onPress={openMaps}
          style={{ borderRadius: 16, overflow: 'hidden' }}
        >
          <Image
            source={{ uri: staticMapUrl }}
            style={{ width: '100%', height: 150 }}
            resizeMode="cover"
          />
          <View
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              backgroundColor: 'white',
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 6,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              shadowColor: '#000',
              shadowOpacity: 0.12,
              shadowRadius: 6,
              elevation: 4
            }}
          >
            <Ionicons
              name="map-outline"
              size={13}
              color={colors.brand.primary}
            />
            <AppText
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: colors.brand.primary
              }}
            >
              Open in Maps
            </AppText>
          </View>
        </Pressable>
      ) : null}

      {/* ── Facilities ── */}
      {place.specialFacilities?.length > 0 && (
        <>
          <Separator />
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginBottom: 14
              }}
            >
              <Ionicons
                name="business-outline"
                size={16}
                color={colors.brand.secondary}
              />
              <AppText style={{ fontSize: 15, fontWeight: '600' }}>
                Facilities
              </AppText>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {place.specialFacilities.map(f => (
                <View
                  key={f}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: colors.brand.neutrals,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 10
                  }}
                >
                  <Ionicons
                    name={getFacilityIcon(f)}
                    size={14}
                    color={colors.brand.secondary}
                  />
                  <AppText
                    style={{ fontSize: 12, color: colors.brand.secondary }}
                  >
                    {capitalize(f)}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        </>
      )}

      {/* ── Best For ── */}
      {place.suitableFor?.length > 0 && (
        <>
          <Separator />
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginBottom: 14
              }}
            >
              <Ionicons
                name="people-outline"
                size={16}
                color={colors.brand.secondary}
              />
              <AppText style={{ fontSize: 15, fontWeight: '600' }}>
                Best For
              </AppText>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {place.suitableFor.map(s => (
                <Badge key={s} label={capitalize(s)} />
              ))}
            </View>
          </View>
        </>
      )}

      {/* ── Opening Hours (Accordion) ── */}
      <Separator />
      <Accordion
        icon="time-outline"
        title="Opening Hours"
        summary={
          openingStatus.isOpenNow
            ? openingStatus.nextTime
              ? `Closes ${openingStatus.nextTime.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : 'Open now'
            : 'Closed today'
        }
      >
        {DAYS.map(day => (
          <View
            key={day}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <AppText
              style={{
                fontSize: 13,
                width: 90,
                textTransform: 'capitalize',
                fontWeight: day === todayName ? '700' : '400',
                color:
                  day === todayName ? colors.brand.primary : colors.text.DEFAULT
              }}
            >
              {day}
            </AppText>
            <AppText
              style={{
                fontSize: 13,
                color: day === todayName ? colors.brand.primary : '#64748b'
              }}
            >
              {formatDayHours(place.openingHours[day])}
            </AppText>
          </View>
        ))}
      </Accordion>

      {/* ── Contact ── */}
      {(place.contactNumber || socialLinks.length > 0) && (
        <>
          <Separator />
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginBottom: 14
              }}
            >
              <Ionicons
                name="call-outline"
                size={16}
                color={colors.brand.secondary}
              />
              <AppText style={{ fontSize: 15, fontWeight: '600' }}>
                Contact
              </AppText>
            </View>

            {/* Phone number pill */}
            {place.contactNumber ? (
              <Pressable
                onPress={() => Linking.openURL(`tel:${place.contactNumber}`)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  backgroundColor: colors.brand.neutrals,
                  padding: 14,
                  borderRadius: 14,
                  marginBottom: socialLinks.length > 0 ? 16 : 0
                }}
              >
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 21,
                    backgroundColor: colors.brand.primary + '20',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Ionicons
                    name="call-outline"
                    size={19}
                    color={colors.brand.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText style={{ fontSize: 11, color: '#94a3b8' }}>
                    Phone
                  </AppText>
                  <AppText
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                      color: colors.brand.primary
                    }}
                  >
                    {place.contactNumber}
                  </AppText>
                </View>
                <Ionicons name="call" size={16} color={colors.brand.primary} />
              </Pressable>
            ) : null}

            {/* Social media circular icons */}
            {socialLinks.length > 0 && (
              <View style={{ flexDirection: 'row', gap: 20, flexWrap: 'wrap' }}>
                {socialLinks.map(link => (
                  <Pressable
                    key={link.platform}
                    onPress={() => Linking.openURL(link.url)}
                    style={{ alignItems: 'center', gap: 6, minWidth: 56 }}
                  >
                    <View
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 26,
                        backgroundColor: colors.brand.neutrals,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1.5,
                        borderColor: colors.brand.primary + '30'
                      }}
                    >
                      <Ionicons
                        name={link.icon}
                        size={24}
                        color={colors.brand.secondary}
                      />
                    </View>
                    <AppText
                      style={{
                        fontSize: 10,
                        color: '#64748b',
                        textAlign: 'center',
                        maxWidth: 72
                      }}
                      numberOfLines={1}
                    >
                      {link.subtitle}
                    </AppText>
                    <AppText
                      style={{
                        fontSize: 9,
                        color: '#94a3b8',
                        textAlign: 'center'
                      }}
                    >
                      {link.platform}
                    </AppText>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </>
      )}

      {/* ── Save CTA ── */}
      <Separator />
      <Button
        title={
          saving
            ? 'Saving...'
            : isSaved
              ? 'Saved to Wishlist'
              : 'Save to Wishlist'
        }
        onPress={onToggleSave}
        disabled={saving}
        className={isSaved ? 'bg-colors-surface-muted' : ''}
        textColor={isSaved ? colors.brand.secondary : colors.text.inverse}
      />

      {/* ── Promotions ── */}
      {promotions.length > 0 && (
        <>
          <Separator />
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginBottom: 14
              }}
            >
              <Ionicons
                name="pricetag-outline"
                size={16}
                color={colors.brand.secondary}
              />
              <AppText style={{ fontSize: 15, fontWeight: '600' }}>
                Exclusive Offers
              </AppText>
            </View>
            <View style={{ gap: 12 }}>
              {promotions.map(promo => (
                <PromotionCard key={promo.promotionId} promo={promo} />
              ))}
            </View>
          </View>
        </>
      )}

      {/* ── Traveller Reviews (from Google) ── */}
      {googleData.reviews && googleData.reviews.length > 0 && (
        <>
          <Separator />
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginBottom: 14
              }}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={16}
                color={colors.brand.secondary}
              />
              <AppText style={{ fontSize: 15, fontWeight: '600' }}>
                Traveller Reviews
              </AppText>
              {googleData.totalRatings ? (
                <AppText
                  style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto' }}
                >
                  {googleData.totalRatings.toLocaleString()} total
                </AppText>
              ) : null}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingRight: 4 }}
            >
              {googleData.reviews.map((review, i) => (
                <View
                  key={i}
                  style={{
                    width: 260,
                    backgroundColor: colors.brand.neutrals + '60',
                    padding: 14,
                    borderRadius: 14,
                    gap: 8,
                    borderWidth: 1,
                    borderColor: colors.brand.neutrals
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <AppText
                      style={{
                        fontWeight: '600',
                        fontSize: 13,
                        flex: 1,
                        paddingRight: 8
                      }}
                      numberOfLines={1}
                    >
                      {review.author_name}
                    </AppText>
                    <View style={{ flexDirection: 'row', gap: 2 }}>
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Ionicons
                          key={si}
                          name={si < review.rating ? 'star' : 'star-outline'}
                          size={11}
                          color={colors.brand.primary}
                        />
                      ))}
                    </View>
                  </View>
                  <AppText
                    style={{ fontSize: 12, lineHeight: 18, color: '#555' }}
                    numberOfLines={5}
                  >
                    {review.text}
                  </AppText>
                  <AppText style={{ fontSize: 11, color: '#94a3b8' }}>
                    {review.relative_time_description}
                  </AppText>
                </View>
              ))}
            </ScrollView>
          </View>
        </>
      )}

      {/* ── Community Reviews (from our database) ── */}
      {place.reviews && place.reviews.length > 0 && (
        <>
          <Separator />
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginBottom: 14
              }}
            >
              <Ionicons
                name="people-circle-outline"
                size={16}
                color={colors.brand.secondary}
              />
              <AppText style={{ fontSize: 15, fontWeight: '600' }}>
                Community Reviews
              </AppText>
              <AppText
                style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto' }}
              >
                {place.reviews.length} review
                {place.reviews.length !== 1 ? 's' : ''}
              </AppText>
            </View>

            {/* Average rating bar */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                backgroundColor: colors.brand.neutrals + '60',
                padding: 14,
                borderRadius: 14,
                marginBottom: 12
              }}
            >
              <AppText
                style={{
                  fontSize: 36,
                  fontWeight: '800',
                  color: colors.brand.primary
                }}
              >
                {(
                  place.reviews.reduce((s, r) => s + r.rating, 0) /
                  place.reviews.length
                ).toFixed(1)}
              </AppText>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={{ flexDirection: 'row', gap: 3 }}>
                  {Array.from({ length: 5 }).map((_, si) => {
                    const avg =
                      place.reviews!.reduce((s, r) => s + r.rating, 0) /
                      place.reviews!.length;
                    return (
                      <Ionicons
                        key={si}
                        name={si < Math.round(avg) ? 'star' : 'star-outline'}
                        size={16}
                        color={colors.brand.primary}
                      />
                    );
                  })}
                </View>
                <AppText style={{ fontSize: 12, color: '#64748b' }}>
                  Based on {place.reviews.length} review
                  {place.reviews.length !== 1 ? 's' : ''}
                </AppText>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingRight: 4 }}
            >
              {place.reviews.slice(0, 5).map((review, i) => (
                <View
                  key={i}
                  style={{
                    width: 260,
                    backgroundColor: colors.brand.neutrals + '60',
                    padding: 14,
                    borderRadius: 14,
                    gap: 8,
                    borderWidth: 1,
                    borderColor: colors.brand.neutrals
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    {/* Author avatar */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        flex: 1
                      }}
                    >
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: colors.brand.primary,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <AppText
                          style={{
                            fontSize: 12,
                            fontWeight: '700',
                            color: 'white'
                          }}
                        >
                          {review.author?.charAt(0)?.toUpperCase() ?? '?'}
                        </AppText>
                      </View>
                      <AppText
                        style={{ fontWeight: '600', fontSize: 13, flex: 1 }}
                        numberOfLines={1}
                      >
                        {review.author ?? 'Anonymous'}
                      </AppText>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 2 }}>
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Ionicons
                          key={si}
                          name={si < review.rating ? 'star' : 'star-outline'}
                          size={11}
                          color={colors.brand.primary}
                        />
                      ))}
                    </View>
                  </View>
                  {review.text ? (
                    <AppText
                      style={{ fontSize: 12, lineHeight: 18, color: '#555' }}
                      numberOfLines={5}
                    >
                      {review.text}
                    </AppText>
                  ) : null}
                  {review.time ? (
                    <AppText style={{ fontSize: 11, color: '#94a3b8' }}>
                      {new Date(review.time).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </AppText>
                  ) : null}
                </View>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
}
