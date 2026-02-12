import { getPlaceOpeningStatus } from './openingHours';

describe('getPlaceOpeningStatus', () => {
  const openingHours = {
    monday: [{ open: '09:00', close: '17:00' }],
    tuesday: [{ open: '09:00', close: '17:00' }],
    wednesday: [{ open: '09:00', close: '17:00' }],
    thursday: [{ open: '09:00', close: '17:00' }],
    friday: [{ open: '09:00', close: '17:00' }],
    saturday: [],
    sunday: []
  };

  it('returns open now when current time is within opening hours', () => {
    const now = new Date('2026-02-02T10:00:00'); // Monday

    const result = getPlaceOpeningStatus(openingHours, now);

    expect(result.isOpenNow).toBe(true);
    expect(result.nextTime?.type).toBe('close');
    expect(result.nextTime?.time.getHours()).toBe(17);
  });

  it('returns next open time later today when closed', () => {
    const now = new Date('2026-02-02T08:00:00'); // Monday

    const result = getPlaceOpeningStatus(openingHours, now);

    expect(result.isOpenNow).toBe(false);
    expect(result.nextTime?.type).toBe('open');
    expect(result.nextTime?.time.getHours()).toBe(9);
  });

  it('returns next opening day when closed for today', () => {
    const now = new Date('2026-02-02T18:00:00'); // Monday after close

    const result = getPlaceOpeningStatus(openingHours, now);

    expect(result.isOpenNow).toBe(false);
    expect(result.nextTime?.type).toBe('open');
    expect(result.nextTime?.time.getDay()).toBe(2); // Tuesday
    expect(result.nextTime?.time.getHours()).toBe(9);
  });

  it('handles overnight opening correctly (open before midnight)', () => {
    const overnightHours = {
      friday: [{ open: '18:00', close: '02:00' }],
      saturday: [],
      sunday: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: []
    };

    const now = new Date('2026-02-06T23:00:00'); // Friday 23:00

    const result = getPlaceOpeningStatus(overnightHours, now);

    expect(result.isOpenNow).toBe(true);
    expect(result.nextTime?.type).toBe('close');
    expect(result.nextTime?.time.getHours()).toBe(2);
  });

  it('handles overnight opening correctly (after midnight)', () => {
    const overnightHours = {
      friday: [{ open: '18:00', close: '02:00' }],
      saturday: [],
      sunday: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: []
    };

    const now = new Date('2026-02-07T01:00:00'); // Saturday 01:00

    const result = getPlaceOpeningStatus(overnightHours, now);

    expect(result.isOpenNow).toBe(true);
    expect(result.nextTime?.type).toBe('close');
    expect(result.nextTime?.time.getHours()).toBe(2);
  });

  it('returns null nextTime when no opening hours exist', () => {
    const now = new Date('2026-02-02T12:00:00');

    const result = getPlaceOpeningStatus(undefined, now);

    expect(result.isOpenNow).toBe(false);
    expect(result.nextTime).toBeNull();
  });
});
