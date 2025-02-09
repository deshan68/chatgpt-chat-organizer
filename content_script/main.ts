import { Message, MessageTypes, UrlCheckResult } from "../shared/types";
import {
  getCurrentChatDetails,
  onOpenPopup,
  onPullFileNameFromExcalidraw,
  onPushExcalidrawFile,
  onPushFileNameToExcalidraw,
} from "./onMessageHandlers";

const registerEventListeners = () => {
  chrome.runtime.onMessage.addListener(
    (message: Message, _sender, sendResponse) => {
      switch (message.type) {
        case MessageTypes.OPEN_POPUP: {
          onOpenPopup().then((urlValidation) => {
            sendResponse(urlValidation);
          });
          return true;
        }
        case MessageTypes.PULL_CURRENT_URL_TYPE: {
          getCurrentChatDetails(message.body?.urlType as UrlCheckResult).then(
            (chatDetails) => {
              sendResponse(chatDetails);
            }
          );
          return true;
        }
        case MessageTypes.PUSH_EXCALIDRAW_FILE: {
          onPushExcalidrawFile(message.body?.excalidraw as string);
          return true;
        }
        case MessageTypes.PUSH_CURRENT_WORKING_FILE_NAME: {
          onPushFileNameToExcalidraw(message.body?.fileName as string);
          return true;
        }
        case MessageTypes.PULL_CURRENT_WORKING_FILE_NAME: {
          onPullFileNameFromExcalidraw().then((fileName) => {
            sendResponse(fileName);
          });
          return true;
        }
        default:
          return false;
      }
    }
  );
};

(() => {
  registerEventListeners();
})();
