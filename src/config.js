import { storage } from './storage.js';

const CONFIG_KEY = 'nutrition-tracker-config';

/**
 * Save user configuration
 * @param {Object} config - User configuration
 * @param {string} config.aiEndpoint - AI endpoint URL
 * @param {string} config.aiApiKey - AI API key
 * @param {string} config.defaultUnit - Default unit (g, ml, etc.)
 * @param {string[]} config.customNutrients - Custom nutrient names
 * @returns {Promise<void>}
 */
export async function saveConfig(config) {
  storage.setItem(CONFIG_KEY, JSON.stringify(config));
}

/**
 * Get user configuration
 * @returns {Promise<Object>} User configuration with defaults
 */
export async function getConfig() {
  const raw = storage.getItem(CONFIG_KEY);
  if (!raw) {
    return {
      aiEndpoint: '',
      aiApiKey: '',
      defaultUnit: 'g',
      customNutrients: []
    };
  }
  try {
    return JSON.parse(raw);
  } catch {
    return {
      aiEndpoint: '',
      aiApiKey: '',
      defaultUnit: 'g',
      customNutrients: []
    };
  }
}