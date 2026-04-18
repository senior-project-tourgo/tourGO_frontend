import { create } from 'zustand';

interface SaveStore {
  savedPlaces: string[];
  setSavedPlaces: (places: string[] | ((prev: string[]) => string[])) => void;
}

export const useSaveStore = create<SaveStore>(
  (set: (fn: (state: SaveStore) => Partial<SaveStore>) => void) => ({
    savedPlaces: [],
    setSavedPlaces: (places: string[] | ((prev: string[]) => string[])) =>
      set((state: SaveStore) => ({
        savedPlaces:
          typeof places === 'function' ? places(state.savedPlaces) : places
      }))
  })
);
