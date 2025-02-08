import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum PagesName {
  HomePage = "HomePage",
  AllCollectionsPage = "AllCollectionsPage",
  AllFilesPage = "AllFilesPage",
  CollectionsPage = "CollectionsPage",
  ChatListPage = "ChatListPage",
}

interface Screen {
  name: PagesName | string;
  title: string;
  params?: Record<string, any> | null;
}

interface NavigationState {
  currentScreen: Screen | null;
  history: Screen[];
}

const initialState: NavigationState = {
  currentScreen: { name: PagesName.HomePage, title: "Home" },
  history: [],
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    navigate: (state, action: PayloadAction<Screen>) => {
      if (state.currentScreen) {
        state.history.push(state.currentScreen);
      }
      state.currentScreen = action.payload;
    },
    goBack: (state) => {
      if (state.history.length > 0) {
        state.currentScreen = state.history.pop()!;
        state.currentScreen.params = null;
      }
    },
  },
});

export const { navigate, goBack } = navigationSlice.actions;
export default navigationSlice.reducer;
