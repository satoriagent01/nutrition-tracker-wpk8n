// Unified storage abstraction working in both browser (localStorage) and Node.js (in-memory Map)
const isBrowser = typeof window !== 'undefined';

const store = {
  _data: new Map(),
  getItem(key) {
    if (isBrowser) {
      return localStorage.getItem(key);
    }
    return this._data.get(key) || null;
  },
  setItem(key, value) {
    if (isBrowser) {
      localStorage.setItem(key, value);
    } else {
      this._data.set(key, value);
    }
  },
  removeItem(key) {
    if (isBrowser) {
      localStorage.removeItem(key);
    } else {
      this._data.delete(key);
    }
  },
  clear() {
    if (isBrowser) {
      localStorage.clear();
    } else {
      this._data.clear();
    }
  }
};

export { store };