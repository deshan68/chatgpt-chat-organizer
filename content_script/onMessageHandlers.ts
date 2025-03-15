import { ChatDetails, UrlCheckResult } from "../shared/types";
import { checkUrlType } from "../shared/utils";

export const onOpenPopup = async (): Promise<UrlCheckResult> => {
  const url = window.location.href;
  const urlType = checkUrlType(url);

  return urlType;
};

export const isChatSelected = async (): Promise<boolean> => {
  const path = window.location.pathname;
  return path.startsWith("/c/") || path.startsWith("/a/chat/s/");
};

export const getCurrentChatDetails = async (
  urlType: UrlCheckResult
): Promise<ChatDetails> => {
  const url = window.location.href;
  const path = window.location.pathname;
  if (urlType.isChatGPT) {
    const chatName = getInnerTextByHref();
    const chatID = path.split("/").pop() || "";
    const chatUrl = url;

    return { chatName, chatID, chatUrl };
  }

  const selectedChatDiv = document.getElementsByClassName("f9edaa3c b64fb9ae");
  const innerText = (selectedChatDiv[0] as HTMLElement).innerText || null;
  const chatName = innerText;
  const chatID = path.split("/").pop() || "";
  const chatUrl = url;

  return { chatName, chatID, chatUrl };
};

function getInnerTextByHref() {
  const path = window.location.pathname;
  const links = document.getElementsByTagName("a");

  for (let link of links) {
    if (link.getAttribute("href") === path) {
      return link.innerText;
    }
  }
  return null;
}

export const navigateToChat = async (chatUrl: string) => {
  window.location.href = chatUrl;
};

export const onPushExcalidrawFile = async (
  excalidraw: string
): Promise<void> => {
  window.localStorage.setItem("excalidraw", excalidraw);
  location.reload();
};

export const onPushFileNameToExcalidraw = async (
  fileName: string
): Promise<void> => {
  const warningMessage = "Please choose the file before start Drawing";
  const removeFileNameDiv = () => {
    const element = document.querySelector(".file-name-div");
    if (element) element.remove();
  };

  removeFileNameDiv();

  const fileNameDiv = document.createElement("div");
  fileNameDiv.classList.add("file-name-div");
  fileNameDiv.textContent = fileName;

  fileNameDiv.style.position = "absolute";
  fileNameDiv.style.top = "5px";
  fileNameDiv.style.left = "48px";
  fileNameDiv.style.padding = "7px 12px";
  fileNameDiv.style.backgroundColor = "rgba(35, 35, 41)";
  fileNameDiv.style.fontStyle = fileName === warningMessage ? "italic" : "";
  fileNameDiv.style.color =
    fileName === warningMessage
      ? "rgba(222, 222, 227, 0.5)"
      : "rgba(222, 222, 227)";
  fileNameDiv.style.fontFamily = "Roboto, Arial, sans-serif";
  fileNameDiv.style.fontWeight = "300";
  fileNameDiv.style.fontSize = "12px";
  fileNameDiv.style.zIndex = "1000";

  const excalidrawContainer = document.querySelector(".App-menu");
  if (excalidrawContainer) {
    excalidrawContainer.appendChild(fileNameDiv);
  } else {
    console.error("Excalidraw App-menu div not found.");
  }
};

export const onPullFileNameFromExcalidraw = async (): Promise<string> => {
  const element = document.querySelector(".file-name-div");

  if (!element) return "";

  return element.textContent || "";
};
