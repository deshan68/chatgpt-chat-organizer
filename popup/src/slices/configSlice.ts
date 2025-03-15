import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatDetails, UrlCheckResult } from "../../../shared/types";

export enum ThemeColor {
  deepSeekTheme = "#556af5",
  chatGptTheme = "#00B48C",
}

interface ConfigState {
  isValidUrl: boolean;
  currentWorkingFileId: string;
  urlType: UrlCheckResult;
  themeColor: ThemeColor;
  currentChatDetails: ChatDetails;
}

const initialState: ConfigState = {
  isValidUrl: false,
  currentWorkingFileId: "",
  themeColor: ThemeColor.chatGptTheme,
  urlType: {
    isChatGPT: false,
    isDeepSeek: false,
  },
  currentChatDetails: {
    chatID: "",
    chatName: null,
    chatUrl: "",
  },
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
    updateCurrentUrlType: (state, action: PayloadAction<UrlCheckResult>) => {
      state.urlType = action.payload;
      console.log(state.urlType);
    },
    updateTheme: (state, action: PayloadAction<ThemeColor>) => {
      state.themeColor = action.payload;
    },
    updateCurrentChatDetails: (state, action: PayloadAction<ChatDetails>) => {
      state.currentChatDetails = action.payload;
      console.log(state.currentChatDetails);
    },
  },
});

export const {
  updateUrlState,
  updateCurrentWorkingFileId,
  updateCurrentUrlType,
  updateTheme,
  updateCurrentChatDetails,
} = configSlice.actions;
export default configSlice.reducer;
