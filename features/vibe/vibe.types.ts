export type VibeId =
  | 'mountain'
  | 'spiritual'
  | 'lakeside'
  | 'heritage'
  | 'wildlife'
  | 'foodie'
  | 'viewpoint'
  | 'trekking';

export interface Vibe {
  id: VibeId;
  title: string;
  image: string;
}
