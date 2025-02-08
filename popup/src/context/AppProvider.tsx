import { createContext, useContext, ReactNode, useEffect } from "react";
import { getStorage } from "../../../shared/chrome-utils";
import { _Collection } from "../constants/constants";
import { STORAGE_KEYS } from "../../../shared/types";
import { loadCollections } from "../slices/collectionSlice";
import { useAppDispatch } from "../hooks/UseReduxType";

interface AppContextType {
  // isValidUrl: boolean;
  // loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();

  const loadInitialData = async () => {
    console.log();
    const collections = await getStorage<_Collection[]>(
      STORAGE_KEYS.COLLECTION
    );

    dispatch(loadCollections(collections || []));
  };

  useEffect(() => {
    loadInitialData();
  }, []);
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
