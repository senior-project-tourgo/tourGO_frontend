import { create } from 'zustand';

interface SaveStore {
  savedPlaces: string[];
  setSavedPlaces: (places: string[] | ((prev: string[]) => string[])) => void;
}

export const useSaveStore = create<SaveStore>(
  (set) => ({
    savedPlaces: [],
    setSavedPlaces: (places: string[] | ((prev: string[]) => string[])) =>
      set((state) => ({
        savedPlaces:
          typeof places === 'function' ? places(state.savedPlaces) : places
      }))
  })
);
