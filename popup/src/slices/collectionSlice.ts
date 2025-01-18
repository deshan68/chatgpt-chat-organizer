import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Collection } from "../utils/types";

interface CollectionsState {
  collections: Collection[];
}

const initialState: CollectionsState = {
  collections: [],
};

const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    addCollection: (state, action: PayloadAction<Collection>) => {
      state.collections.push(action.payload);
    },
    deleteCollection: (state, action: PayloadAction<string[]>) => {
      state.collections = state.collections.filter(
        (c) => !action.payload.includes(c.id)
      );
    },
    removeFileIdFromCollection: (state, action: PayloadAction<string>) => {
      state.collections = state.collections.map((c) =>
        c.fileIds.includes(action.payload)
          ? { ...c, fileIds: c.fileIds.filter((id) => id !== action.payload) }
          : c
      );
    },
    addFileToCollection: (
      state,
      action: PayloadAction<{ fileId: string; collectionId: string }>
    ) => {
      state.collections = state.collections.map((c) => {
        if (c.id === action.payload.collectionId) {
          c.fileIds.push(action.payload.fileId);
        }
        return c;
      });
    },
    removeFileFromCollection: (
      state,
      action: PayloadAction<{ fileId: string; collectionId: string }>
    ) => {
      state.collections = state.collections.map((c) => {
        if (c.id === action.payload.collectionId) {
          return {
            ...c,
            fileIds: c.fileIds.filter((id) => id !== action.payload.fileId),
          };
        }
        return c;
      });
    },
    loadCollections: (state, action: PayloadAction<Collection[]>) => {
      state.collections = action.payload;
    },
  },
});

export const {
  addCollection,
  deleteCollection,
  removeFileIdFromCollection,
  loadCollections,
  addFileToCollection,
  removeFileFromCollection,
} = collectionSlice.actions;
export default collectionSlice.reducer;
