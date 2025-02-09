import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { getStorage, sendMessageToContent } from "../../../shared/chrome-utils";
import {
  _Collection,
  Chat,
  ChatDetails,
  MessageTypes,
  STORAGE_KEYS,
  UrlCheckResult,
} from "../../../shared/types";
import { loadCollections } from "../slices/collectionSlice";
import { useAppDispatch } from "../hooks/UseReduxType";
import {
  ThemeColor,
  updateCurrentChatDetails,
  updateCurrentUrlType,
  updateTheme,
} from "../slices/configSlice";
import { loadChats } from "../slices/chatSlice";

interface AppContextType {
  isValidUrl: boolean;
  // loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const checkCurrentURLType = async () => {
    try {
      const response = (await sendMessageToContent({
        type: MessageTypes.OPEN_POPUP,
      })) as UrlCheckResult;
      if (response.isChatGPT || response.isDeepSeek) {
        dispatch(
          updateTheme(
            response.isChatGPT
              ? ThemeColor.chatGptTheme
              : ThemeColor.deepSeekTheme
          )
        );
        getCurrentChatDetails(response);
        setIsValidUrl(true);
      }
      dispatch(updateCurrentUrlType(response));
    } catch (error) {
      console.error("Error while checking current URL");
    }
  };

  const getCurrentChatDetails = async (urlType: UrlCheckResult) => {
    try {
      const response = (await sendMessageToContent<ChatDetails>({
        type: MessageTypes.PULL_CURRENT_URL_TYPE,
        body: { urlType: urlType },
      })) as ChatDetails;
      dispatch(updateCurrentChatDetails(response));
    } catch (error) {
      console.error("Error while getting current chat details");
    }
  };

  const loadInitialData = async () => {
    const collections = await getStorage<_Collection[]>(
      STORAGE_KEYS.COLLECTION
    );
    dispatch(loadCollections(collections || []));

    const chats = await getStorage<Chat[]>(STORAGE_KEYS.CHAT);
    dispatch(loadChats(chats || []));
  };

  useEffect(() => {
    isValidUrl && loadInitialData();
    checkCurrentURLType();
  }, [isValidUrl]);
  return (
    <AppContext.Provider value={{ isValidUrl }}>{children}</AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
