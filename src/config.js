import { store } from './storage.js';

const CONFIG_KEY = 'nutrition-tracker-config';

/**
 * Save user configuration
 * @param {Object} config - User configuration
 * @param {string} config.aiEndpoint - AI endpoint URL
 * @param {string} config.aiKey - AI API key
 * @param {string[]} config.customNutrients - Custom nutrient names
 */
export function saveConfig(config) {
  store.setItem(CONFIG_KEY, JSON.stringify(config));
}

/**
 * Get user configuration
 * @returns {Object} User configuration with defaults
 */
export function getConfig() {
  const raw = store.getItem(CONFIG_KEY);
  if (!raw) {
    return {
      aiEndpoint: '',
      aiKey: '',
      customNutrients: []
    };
  }
  try {
    return JSON.parse(raw);
  } catch {
    return {
      aiEndpoint: '',
      aiKey: '',
      customNutrients: []
    };
  }
}