import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { _Collection } from "../constants/constants";

interface CollectionsState {
  collections: _Collection[];
}

const initialState: CollectionsState = {
  collections: [],
};

const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    addCollection: (state, action: PayloadAction<_Collection>) => {
      state.collections.push(action.payload);
    },
    deleteCollection: (state, action: PayloadAction<string[]>) => {
      state.collections = state.collections.filter(
        (c) => !action.payload.includes(c.id)
      );
    },
    loadCollections: (state, action: PayloadAction<_Collection[]>) => {
      state.collections = action.payload;
      console.log(state.collections);
    },
    addAsFavorite: (state, action: PayloadAction<{ collectionId: string }>) => {
      state.collections = state.collections.map((c) => {
        if (c.id === action.payload.collectionId) {
          return {
            ...c,
            isFavorite: !c.isFavorite,
          };
        }
        return c;
      });
    },
  },
});

export const {
  addCollection,
  deleteCollection,
  loadCollections,
  addAsFavorite,
} = collectionSlice.actions;
export default collectionSlice.reducer;
