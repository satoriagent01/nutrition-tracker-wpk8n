import { storage } from './storage.js';

const PRODUCTS_KEY = 'nutrition-tracker-products';

/**
 * Get all products from storage
 * @returns {Array} Array of product objects
 */
function getAllProductsFromStorage() {
  const raw = storage.getItem(PRODUCTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Save all products to storage
 * @param {Array} products - Array of product objects
 */
function saveAllProductsToStorage(products) {
  storage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Save a product to the database
 * @param {Object} product - Product object
 * @param {string} product.name - Product name
 * @param {string} product.brand - Brand name
 * @param {Object} product.servingSize - Serving size { amount, unit }
 * @param {Object} product.energy - Energy { kcal, kj }
 * @param {number} product.fat - Fat in grams
 * @param {number} product.saturatedFat - Saturated fat in grams
 * @param {number} product.carbs - Carbohydrates in grams
 * @param {number} product.sugars - Sugars in grams
 * @param {number} product.protein - Protein in grams
 * @param {number} product.salt - Salt in grams
 * @param {Object} product.per100g - Per 100g nutrition data
 * @param {string} [product.imageUrl] - Optional image URL
 * @returns {Promise<string>} Product ID
 */
export async function saveProduct(product) {
  const products = getAllProductsFromStorage();
  const id = product.id || generateId();
  const newProduct = {
    id,
    name: product.name,
    brand: product.brand || '',
    servingSize: product.servingSize || { amount: 100, unit: 'g' },
    energy: product.energy || { kcal: 0, kj: 0 },
    fat: product.fat || 0,
    saturatedFat: product.saturatedFat || 0,
    carbs: product.carbs || 0,
    sugars: product.sugars || 0,
    protein: product.protein || 0,
    salt: product.salt || 0,
    per100g: product.per100g || {},
    imageUrl: product.imageUrl || ''
  };

  // Update existing or add new
  const existingIndex = products.findIndex(p => p.id === id);
  if (existingIndex >= 0) {
    products[existingIndex] = newProduct;
  } else {
    products.push(newProduct);
  }

  saveAllProductsToStorage(products);
  return id;
}

/**
 * Get a product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object|null>} Product object or null
 */
export async function getProduct(id) {
  const products = getAllProductsFromStorage();
  return products.find(p => p.id === id) || null;
}

/**
 * Get all products
 * @returns {Promise<Array>} Array of all products
 */
export async function getAllProducts() {
  return getAllProductsFromStorage();
}

/**
 * Delete a product by ID
 * @param {string} id - Product ID
 * @returns {Promise<boolean>} Whether the product was deleted
 */
export async function deleteProduct(id) {
  const products = getAllProductsFromStorage();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  saveAllProductsToStorage(products);
  return true;
}