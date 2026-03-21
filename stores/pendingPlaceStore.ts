import type { Place } from '@/features/place/place.types';

/**
 * Module-level store used to pass a selected place from the
 * add-place search screen back to the calling screen (review-trip or edit-trip).
 * The caller reads and clears on focus.
 */
let _pending: Place | null = null;

export const pendingPlaceStore = {
  set(place: Place) {
    _pending = place;
  },
  get(): Place | null {
    return _pending;
  },
  clear() {
    _pending = null;
  }
};
