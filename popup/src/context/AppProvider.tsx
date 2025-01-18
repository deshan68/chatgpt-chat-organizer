import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getStorage,
  sendMessageToContent,
  setStorage,
} from "../../../shared/chrome-utils";
import { MessageTypes, STORAGE_KEYS } from "../../../shared/types";
import { useAppDispatch } from "../hooks/UseReduxType";
import { Collection, File } from "../utils/types";
import { loadCollections } from "../slices/collectionSlice";
import { loadFiles } from "../slices/fileSlice";
import { updateCurrentWorkingFileId } from "../slices/configSlice";
import { warningMessage } from "../constants/constants";

interface AppContextType {
  isValidUrl: boolean;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();

  const [isValidUrl, setIsValidUrl] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const checkCurrentURL = async () => {
    try {
      const response = await sendMessageToContent({
        type: MessageTypes.OPEN_POPUP,
      });
      if (response) setIsValidUrl(true);
    } catch (error) {
      console.error("Error while checking current URL");
    }
  };

  const pullCurrentFileName = async () => {
    try {
      const response = await sendMessageToContent({
        type: MessageTypes.PULL_CURRENT_WORKING_FILE_NAME,
      });
      loadInitialData(response || "");
    } catch (error) {
      console.error("Error while getting current File name");
    }
  };

  const loadInitialData = async (fileName: string) => {
    try {
      const [collections, files, currentWorkingFileId] = await Promise.all([
        getStorage<Collection[]>(STORAGE_KEYS.COLLECTION),
        getStorage<File[]>(STORAGE_KEYS.FILE),
        getStorage<string>(STORAGE_KEYS.CURRENT_WORKING_FILE_ID),
      ]);

      dispatch(loadCollections(collections || []));

      dispatch(loadFiles(files || []));

      let _currentWorkingFileId = "";
      if (fileName !== warningMessage)
        _currentWorkingFileId = currentWorkingFileId || "";

      dispatch(updateCurrentWorkingFileId(_currentWorkingFileId));

      if (currentWorkingFileId && files) {
        await loadExcalidrawFile(currentWorkingFileId, files);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const loadExcalidrawFile = async (
    currentWorkingFileId: string,
    storageFiles: File[]
  ) => {
    try {
      const response = await sendMessageToContent({
        type: MessageTypes.LOAD_EXCALIDRAW_FILE,
      });

      if (!response) return;

      const updatedFiles: File[] = storageFiles.map((f) =>
        f.id === currentWorkingFileId ? { ...f, excalidraw: response } : f
      );

      await setStorage(STORAGE_KEYS.FILE, JSON.stringify(updatedFiles));
      dispatch(loadFiles(updatedFiles));
    } catch (error) {
      console.error("Error loading Excalidraw file:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await checkCurrentURL();
      if (isValidUrl) await pullCurrentFileName();
    };

    pullCurrentFileName();

    initialize();
  }, [isValidUrl]);

  return (
    <AppContext.Provider value={{ isValidUrl, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
