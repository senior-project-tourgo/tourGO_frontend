import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { VIBES } from '@/constants/vibes/vibes';
import { OpeningHours, Place } from '@/features/place/place.types';
import { getPlaceGoogleDetails } from '@/services/place/place.service';
import type { ApiPromotion } from '@/services/promotion.service';
import colors from '@/theme/colors';
import { getPlaceOpeningStatus } from '@/utils/openingHours';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, Linking, Pressable, ScrollView, View } from 'react-native';
import { PromotionCard } from '../PromotionCard';
import { FACILITY_ICONS } from '@/constants/facilityIcons';
import type { GoogleData } from '@/services/place/placeGoogle.types';
import { BaseCard } from '../../BaseCard';
import { PillTabs } from '@/components/PillTabs';
import { BaseChip } from '@/components/BaseChip';
import { VIBE_ICONS } from '@/constants/vibes/vibeIcons';
import { FOR_ICONS } from '@/constants/bestforIcons';
import SocialLinksGrid, {
  type SocialLink as SocialLinkGridItem
} from '@/components/place-info/SocialLinksGrid';

type PlaceInfoProps = {
  place: Place;
  promotions: ApiPromotion[];
  isSaved: boolean;
  saving: boolean;
  onToggleSave: () => void;
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

function getFacilityIcon(facility: string): keyof typeof Ionicons.glyphMap {
  return FACILITY_ICONS[facility.toLowerCase()] ?? 'checkmark-circle-outline';
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
  const [placeDetailsTab, setPlaceDetailsTab] = useState<'about' | 'reviews'>(
    'about'
  );

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

  type PlaceSocialLink = {
    platform: string;
    icon: keyof typeof Ionicons.glyphMap;
    url: string;
    subtitle: string;
  };
  const socialLinks: PlaceSocialLink[] = [];
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
  const vibes = Array.isArray(place.vibe) ? place.vibe : [];
  function getVibeIcon(id: string): keyof typeof Ionicons.glyphMap {
    return VIBE_ICONS[id] ?? 'sparkles-outline';
  }

  const contactLinks: SocialLinkGridItem[] = [
    ...(place.contactNumber
      ? [
          {
            platform: 'Phone',
            icon: 'call-outline',
            onPress: () => {
              void Linking.openURL(`tel:${place.contactNumber}`);
            }
          } satisfies SocialLinkGridItem
        ]
      : []),
    ...socialLinks
  ];

  const hasAnyReviews =
    (googleData.reviews && googleData.reviews.length > 0) ||
    (place.reviews && place.reviews.length > 0);

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
            {vibes.length > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginTop: 4
                }}
              >
                {vibes.map(id => {
                  const label =
                    VIBES.find(v => v.id === id)?.title ?? formatVibeLabel(id);

                  return (
                    <BaseChip key={id} label={label} icon={getVibeIcon(id)} />
                  );
                })}
              </View>
            )}
          </View>
        )}
      </View>

      <Separator />

      <PillTabs
        options={[
          { id: 'about', label: 'About', icon: 'information-circle-outline' },
          { id: 'reviews', label: 'Reviews', icon: 'chatbubbles-outline' }
        ]}
        selectedId={placeDetailsTab}
        onChange={id => setPlaceDetailsTab(id as 'about' | 'reviews')}
      />

      {placeDetailsTab === 'about' && (
        <>
          {/* ── Google Description ── */}
          {googleData.description ? (
            <View className="gap-1">
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <Ionicons
                  name="business-outline"
                  size={18}
                  color={colors.text.DEFAULT}
                />
                <AppText variant="subtitle">About This Place</AppText>
              </View>
              <AppText variant="muted">{googleData.description}</AppText>
            </View>
          ) : null}

          {/* ── Typical Time Spent ── */}
          {!!place.typicalTimeSpent && (
            <BaseCard>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: colors.text.DEFAULT + '20',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={colors.text.DEFAULT}
                  />
                </View>

                <View>
                  <AppText style={{ fontSize: 11 }}>Typical Time Spent</AppText>
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
            </BaseCard>
          )}

          {/* ── Price Range ── */}
          {!!place.priceRange && (
            <BaseCard>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: colors.text.DEFAULT + '20',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Ionicons
                    name="wallet-outline"
                    size={20}
                    color={colors.text.DEFAULT}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <AppText style={{ fontSize: 11 }}>Price Range</AppText>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 2
                    }}
                  >
                    <AppText
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: colors.text.DEFAULT
                      }}
                    >
                      {place.priceRange === '$' && 'Under रु 500'}
                      {place.priceRange === '$$' && 'रु 500 – 1,500'}
                      {place.priceRange === '$$$' && 'रु 1,500 – 4,000'}
                      {place.priceRange === '$$$$' && 'रु 4,000+'}
                    </AppText>
                  </View>
                </View>
              </View>
            </BaseCard>
          )}

          {/* ── Address ── */}
          {googleData.address || place.address ? (
            <BaseCard>
              <Pressable
                onPress={openMaps}
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 10
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: colors.text.DEFAULT + '20',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={colors.text.DEFAULT}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <AppText style={{ fontSize: 11 }}>Location</AppText>

                  <AppText
                    style={{
                      fontSize: 13,
                      color: colors.brand.primary,
                      lineHeight: 19
                    }}
                  >
                    {googleData.address || place.address}
                  </AppText>
                </View>
              </Pressable>
            </BaseCard>
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
                  borderRadius: 22,
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
            <View className="gap-1">
              {/* Header */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <Ionicons
                  name="cog-outline"
                  size={18}
                  color={colors.text.DEFAULT}
                />
                <AppText variant="subtitle">Facilities</AppText>
              </View>

              {/* Chips */}
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8
                }}
              >
                {place.specialFacilities.map(f => (
                  <BaseChip
                    key={f}
                    label={capitalize(f)}
                    icon={getFacilityIcon(f)}
                  />
                ))}
              </View>
            </View>
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
                    size={18}
                    color={colors.text.DEFAULT}
                  />
                  <AppText variant="subtitle">Best For</AppText>
                </View>

                <View
                  style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}
                >
                  {place.suitableFor.map(s => (
                    <BaseChip
                      key={s}
                      label={capitalize(s)}
                      icon={
                        FOR_ICONS[s as keyof typeof FOR_ICONS] ??
                        'help-circle-outline'
                      }
                    />
                  ))}
                </View>
              </View>
            </>
          )}

          <Separator />
          {/* ── Opening Hours ── */}
          <View className="gap-2">
            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={18}
                color={colors.text.DEFAULT}
              />
              <AppText variant="subtitle">Opening Hours</AppText>

              {/* Status pill (optional but nice match with modern UI) */}
              <View
                style={{
                  marginLeft: 'auto',
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 999,
                  backgroundColor: openingStatus.isOpenNow
                    ? '#16a34a20'
                    : '#ef444420'
                }}
              >
                <AppText
                  style={{
                    fontSize: 11,
                    color: openingStatus.isOpenNow ? '#16a34a' : '#ef4444',
                    fontWeight: '600'
                  }}
                >
                  {openingStatus.isOpenNow ? 'Open' : 'Closed'}
                </AppText>
              </View>
            </View>

            {/* Content card */}
            <BaseCard>
              <View style={{ gap: 10 }}>
                {DAYS.map(day => (
                  <View
                    key={day}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: 4,
                      paddingHorizontal: 6,
                      borderRadius: 22,
                      backgroundColor:
                        day === todayName
                          ? colors.text.DEFAULT + '08'
                          : 'transparent'
                    }}
                  >
                    <AppText
                      style={{
                        fontSize: 13,
                        textTransform: 'capitalize',
                        fontWeight: day === todayName ? '600' : '400',
                        color: colors.text.DEFAULT
                      }}
                    >
                      {day}
                    </AppText>

                    <AppText
                      style={{
                        fontSize: 13,
                        color: '#64748b'
                      }}
                    >
                      {formatDayHours(place.openingHours[day])}
                    </AppText>
                  </View>
                ))}
              </View>
            </BaseCard>
          </View>

          {/* ── Contact ── */}
          {contactLinks.length > 0 && (
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
                    name="share-social-outline"
                    size={18}
                    color={colors.brand.secondary}
                  />
                  <AppText variant="subtitle">Contact</AppText>
                </View>

                <SocialLinksGrid socialLinks={contactLinks} />
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
        </>
      )}

      {placeDetailsTab === 'reviews' && (
        <>
          {!hasAnyReviews ? (
            <View
              style={{
                paddingVertical: 28,
                alignItems: 'center',
                gap: 10
              }}
            >
              <Ionicons name="chatbubbles-outline" size={40} color="#94a3b8" />
              <AppText
                variant="muted"
                style={{ textAlign: 'center', paddingHorizontal: 24 }}
              >
                No reviews yet for this place.
              </AppText>
            </View>
          ) : null}

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
                      style={{
                        fontSize: 12,
                        color: '#94a3b8',
                        marginLeft: 'auto'
                      }}
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
                              name={
                                si < review.rating ? 'star' : 'star-outline'
                              }
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
                    size={18}
                    color={colors.text.DEFAULT}
                  />
                  <AppText variant="subtitle">Community Reviews</AppText>
                  <AppText
                    style={{
                      fontSize: 12,
                      color: '#94a3b8',
                      marginLeft: 'auto'
                    }}
                  >
                    {place.reviews.length} review
                    {place.reviews.length !== 1 ? 's' : ''}
                  </AppText>
                </View>

                {/* Average rating bar */}
                <BaseCard className="mb-3">
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10
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
                              name={
                                si < Math.round(avg) ? 'star' : 'star-outline'
                              }
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
                </BaseCard>

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
                              name={
                                si < review.rating ? 'star' : 'star-outline'
                              }
                              size={11}
                              color={colors.brand.primary}
                            />
                          ))}
                        </View>
                      </View>
                      {review.text ? (
                        <AppText
                          style={{
                            fontSize: 12,
                            lineHeight: 18,
                            color: '#555'
                          }}
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
        </>
      )}
    </View>
  );
}
