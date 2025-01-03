/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userDetail: any | null;
}

const initialState: UserState = {
  userDetail: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userStore: (state: UserState, action: PayloadAction<any>) => {
      state.userDetail = action.payload;
    },
    logout: (state: UserState) => {
      state.userDetail = null;
    },
  },
});

export const { userStore, logout } = userSlice.actions;
export default userSlice.reducer;
