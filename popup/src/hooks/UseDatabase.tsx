import { setStorage } from "../../../shared/chrome-utils";
import { Chat, STORAGE_KEYS } from "../../../shared/types";
import { CollectionInstance } from "../lib/collectionInstance";
import { loadChats } from "../slices/chatSlice";
import { addCollection, loadCollections } from "../slices/collectionSlice";
import { findCollectionType, isCurrentChatFound } from "../utils/utils";
import { useAppDispatch, useAppSelector } from "./UseReduxType";

const UseDatabase = () => {
  const dispatch = useAppDispatch();
  const collections = useAppSelector((state) => state.collection.collections);
  const chats = useAppSelector((state) => state.chat.chats);
  const urlType = useAppSelector((state) => state.config.urlType);
  const currentChatDetails = useAppSelector(
    (state) => state.config.currentChatDetails
  );

  const insertChat = async (collectionId: string) => {
    if (!isCurrentChatFound(currentChatDetails)) return;

    const collection = collections.find((c) => c.id === collectionId);
    if (!collection) return;

    const checkChatExists = collection.chats.some(
      (c) => c === currentChatDetails.chatID
    );
    if (checkChatExists) return;

    const updatedCollection = {
      ...collection,
      chats: [...collection.chats, currentChatDetails.chatID],
    };

    const updatedCollections = collections.map((c) =>
      c.id === collectionId ? updatedCollection : c
    );

    await setStorage(
      STORAGE_KEYS.COLLECTION,
      JSON.stringify(updatedCollections)
    );

    dispatch(loadCollections(updatedCollections));

    updateChats();
  };

  const updateChats = async () => {
    const checkChatExists = chats.some(
      (c) => c.id === currentChatDetails.chatID
    );
    if (checkChatExists) return;

    const newChat: Chat = {
      id: currentChatDetails.chatID,
      name: currentChatDetails.chatName!,
      date: new Date().toISOString(),
      tags: [],
    };

    const updatedChatList = [...chats, newChat];

    await setStorage(STORAGE_KEYS.CHAT, JSON.stringify(updatedChatList));
    dispatch(loadChats(updatedChatList));
  };

  const insertCollection = async (collectionName: string) => {
    const collection = new CollectionInstance(
      collectionName,
      findCollectionType(urlType)
    );

    const updatedCollections = [...collections, collection.getCollection()];

    await setStorage(
      STORAGE_KEYS.COLLECTION,
      JSON.stringify(updatedCollections)
    );

    dispatch(addCollection(collection.getCollection()));
  };

  const setAsFavorite = async (collectionId: string) => {
    const updatedCollections = collections.map((c) => {
      if (c.id === collectionId) {
        return {
          ...c,
          isFavorite: !c.isFavorite,
        };
      }
      return c;
    });

    await setStorage(
      STORAGE_KEYS.COLLECTION,
      JSON.stringify(updatedCollections)
    );

    dispatch(loadCollections(updatedCollections));
  };

  const deleteCollection = async (collectionId: string) => {
    const updatedCollections = collections.filter((c) => c.id !== collectionId);

    await setStorage(
      STORAGE_KEYS.COLLECTION,
      JSON.stringify(updatedCollections)
    );

    dispatch(loadCollections(updatedCollections));
  };

  return { insertChat, insertCollection, setAsFavorite, deleteCollection };
};

export default UseDatabase;
