import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConfigState {
  isValidUrl: boolean;
  currentWorkingFileId: string;
}

const initialState: ConfigState = {
  isValidUrl: false,
  currentWorkingFileId: "",
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    updateUrlState: (state, action: PayloadAction<boolean>) => {
      state.isValidUrl = action.payload;
    },
    updateCurrentWorkingFileId: (state, action: PayloadAction<string>) => {
      state.currentWorkingFileId = action.payload;
    },
  },
});

export const { updateUrlState, updateCurrentWorkingFileId } =
  configSlice.actions;
export default configSlice.reducer;
