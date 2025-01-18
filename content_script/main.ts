import { Message, MessageTypes } from "../shared/types";
import {
  onLoadExcalidrawFile,
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
        case MessageTypes.LOAD_EXCALIDRAW_FILE: {
          onLoadExcalidrawFile().then((excalidraw) => {
            sendResponse(excalidraw);
          });
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
