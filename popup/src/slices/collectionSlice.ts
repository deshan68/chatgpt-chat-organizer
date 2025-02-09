import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { _Collection } from "../../../shared/types";

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
    },
  },
});

export const { addCollection, deleteCollection, loadCollections } =
  collectionSlice.actions;
export default collectionSlice.reducer;
