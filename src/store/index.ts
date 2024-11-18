import { configureStore } from '@reduxjs/toolkit';
import preferencesReducer, { PreferencesState } from './preferencesSlice';

// 定义 RootState 接口
export interface RootState {
  preferences: PreferencesState;
}

export const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
  },
});

export type AppDispatch = typeof store.dispatch; 