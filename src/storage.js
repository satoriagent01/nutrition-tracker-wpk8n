// Unified storage abstraction working in both browser (localStorage) and Node.js (in-memory Map)
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const store = new Map();

export const storage = {
  getItem(key) {
    if (isBrowser) {
      return localStorage.getItem(key);
    }
    return store.get(key) || null;
  },
  setItem(key, value) {
    if (isBrowser) {
      localStorage.setItem(key, value);
    } else {
      store.set(key, value);
    }
  },
  removeItem(key) {
    if (isBrowser) {
      localStorage.removeItem(key);
    } else {
      store.delete(key);
    }
  }
};