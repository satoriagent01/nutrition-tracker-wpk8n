/**
 * User configuration management.
 * Stores AI endpoint configuration and custom nutrients.
 * Uses localStorage in browser, in-memory store in Node.js.
 */

const STORAGE_KEY = 'nutrition_tracker_config';

/**
 * Storage abstraction that works in both browser and Node.js.
 */
const storage = {
  get(key) {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return storage._memory[key] || null;
  },
  set(key, value) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    } else {
      storage._memory[key] = value;
    }
  },
  remove(key) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    } else {
      delete storage._memory[key];
    }
  },
  _memory: {}
};

/**
 * Default configuration.
 */
const DEFAULT_CONFIG = {
  aiEndpoint: '',
  aiApiKey: '',
  defaultUnit: 'g',
  customNutrients: []
};

/**
 * Get the current configuration.
 * @returns {Object} Configuration object
 */
export function getConfig() {
  try {
    const data = storage.get(STORAGE_KEY);
    if (data) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Failed to read config:', e);
  }
  return { ...DEFAULT_CONFIG };
}

/**
 * Save configuration.
 * @param {Object} config - Configuration object
 */
export function saveConfig(config) {
  try {
    const currentConfig = getConfig();
    const mergedConfig = { ...currentConfig, ...config };
    storage.set(STORAGE_KEY, JSON.stringify(mergedConfig));
  } catch (e) {
    console.error('Failed to save config:', e);
  }
}

/**
 * Reset configuration to defaults.
 */
export function resetConfig() {
  storage.remove(STORAGE_KEY);
}