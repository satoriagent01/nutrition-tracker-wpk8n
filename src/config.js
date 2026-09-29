/**
 * User configuration management using storage abstraction.
 * Stores AI endpoint configuration and custom nutrients.
 */

import { getItem, setItem } from './storage.js';

const STORAGE_KEY = 'nutrition_tracker_config';

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
    const data = getItem(STORAGE_KEY);
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
    setItem(STORAGE_KEY, JSON.stringify(mergedConfig));
  } catch (e) {
    console.error('Failed to save config:', e);
  }
}

/**
 * Reset configuration to defaults.
 */
export function resetConfig() {
  setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONFIG));
}