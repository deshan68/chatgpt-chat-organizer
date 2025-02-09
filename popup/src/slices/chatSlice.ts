import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chat } from "../../../shared/types";

interface FileState {
  chats: Chat[];
}

const initialState: FileState = {
  chats: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    loadChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
  },
});

export const { loadChats } = chatSlice.actions;
export default chatSlice.reducer;
