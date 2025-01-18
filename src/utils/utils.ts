export const checkUrl = (url: string): boolean => {
  if (!(url.includes("chatgpt.com") && url.includes("/c/"))) {
    return false;
  }
  return true;
};
