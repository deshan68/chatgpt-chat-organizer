import { checkIsValidUrl } from "../shared/utils";

export const onOpenPopup = async (): Promise<boolean> => {
  const url = window.location.href;
  const urlValidation = checkIsValidUrl(url);
  return urlValidation;
};

export const onLoadExcalidrawFile = async (): Promise<string> => {
  const excalidrawFile = window.localStorage.getItem("excalidraw");

  return excalidrawFile || "";
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
