export enum STORAGE_KEYS {
  FILE = "file",
  CHAT = "chat",
  COLLECTION = "collection",
  CURRENT_WORKING_FILE_ID = "current-working-file-id",
}

export enum MessageTypes {
  LOAD_EXCALIDRAW_FILE = "LOAD_EXCALIDRAW_FILE",
  OPEN_POPUP = "OPEN_POPUP",
  PUSH_EXCALIDRAW_FILE = "PUSH_EXCALIDRAW_FILE",
  PUSH_CURRENT_WORKING_FILE_NAME = "PUSH_CURRENT_WORKING_FILE_NAME",
  PULL_CURRENT_WORKING_FILE_NAME = "PULL_CURRENT_WORKING_FILE_NAME",
  PULL_CURRENT_URL_TYPE = "PULL_CURRENT_URL_TYPE",
}

export type Message = {
  type: MessageTypes;
  body?: Record<string, unknown>;
};

export interface UrlCheckResult {
  isDeepSeek: boolean;
  isChatGPT: boolean;
}

export interface ChatDetails {
  chatName: string | null;
  chatID: string;
  chatUrl: string;
}

export enum CollectionType {
  CHAT_GPT = "chat-gpt",
  DEEP_SEEK = "deep-seek",
}
export interface _Collection {
  id: string;
  name: string;
  date: string;
  isFavorite: boolean;
  chats: string[];
  collectionType: CollectionType;
}

export interface Chat {
  id: string;
  name: string;
  date: string;
  tags: string[];
}

export interface Tag {
  id: string;
  name: string;
  colorCode: string;
}
