import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface PreferencesState {
  prefersDarkMode: boolean;
}

const initialState: PreferencesState = {
  prefersDarkMode: false,
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.prefersDarkMode = !state.prefersDarkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.prefersDarkMode = action.payload;
    },
  },
});

export const { toggleDarkMode, setDarkMode } = preferencesSlice.actions;
export default preferencesSlice.reducer; 