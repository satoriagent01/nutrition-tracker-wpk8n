/**
 * Storage abstraction that works in both browser (localStorage) and Node.js (in-memory).
 */

const store = {};

export function getItem(key) {
  if (typeof localStorage !== 'undefined' && localStorage !== null) {
    return localStorage.getItem(key);
  }
  return store[key] || null;
}

export function setItem(key, value) {
  if (typeof localStorage !== 'undefined' && localStorage !== null) {
    localStorage.setItem(key, value);
  } else {
    store[key] = value;
  }
}

export function removeItem(key) {
  if (typeof localStorage !== 'undefined' && localStorage !== null) {
    localStorage.removeItem(key);
  } else {
    delete store[key];
  }
}