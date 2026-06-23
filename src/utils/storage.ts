export const safeSessionStorage = {
  getItem: (key: string) => {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        return window.sessionStorage.getItem(key);
      }
    } catch (e) {
      console.warn("sessionStorage access denied", e);
    }
    return null;
  },
  setItem: (key: string, value: string) => {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn("sessionStorage access denied", e);
    }
  },
  removeItem: (key: string) => {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.removeItem(key);
      }
    } catch (e) {
      console.warn("sessionStorage access denied", e);
    }
  }
};
