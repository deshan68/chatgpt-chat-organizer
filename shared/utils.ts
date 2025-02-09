import { UrlCheckResult } from "./types";

export const checkIsValidUrl = (url: string): boolean => {
  if (url.includes("https://chatgpt.com/")) {
    return true;
  }

  return false;
};

export function checkUrlType(url: string): UrlCheckResult {
  const isDeepSeek = url.includes("https://chat.deepseek.com/");
  const isChatGPT = url.includes("https://chatgpt.com/");

  return {
    isDeepSeek,
    isChatGPT,
  };
}
