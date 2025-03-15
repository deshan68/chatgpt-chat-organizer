import {
  _Collection,
  Chat,
  ChatDetails,
  CollectionType,
  UrlCheckResult,
} from "../../../shared/types";

export const findCollectionType = (urlType: UrlCheckResult): CollectionType => {
  if (urlType.isChatGPT) {
    return CollectionType.CHAT_GPT;
  }

  return CollectionType.DEEP_SEEK;
};

export const getFilteredCollection = (
  collections: _Collection[],
  urlType: UrlCheckResult
): _Collection[] => {
  return collections.filter(
    (c) => c.collectionType === findCollectionType(urlType)
  );
};

export const getFilteredChat = (
  chat: Chat[],
  urlType: UrlCheckResult
): Chat[] => {
  return chat.filter((c) => c.chatType === findCollectionType(urlType));
};

export const isCurrentChatFound = (currentChat: ChatDetails): boolean => {
  return (
    currentChat.chatID !== "" &&
    currentChat.chatName !== null &&
    currentChat.chatUrl !== ""
  );
};
