import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserDetails {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface UserState {
  token: string | null;
  user: UserDetails | null;
}

const initialState: UserState = {
  token: null,
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearUser(state) {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
