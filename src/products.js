import { store } from './storage.js';

const PRODUCTS_KEY = 'nutrition-tracker-products';

/**
 * Get all products from storage
 * @returns {Array} Array of product objects
 */
function getAllProductsFromStorage() {
  const raw = store.getItem(PRODUCTS_KEY);
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
  store.setItem(PRODUCTS_KEY, JSON.stringify(products));
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
 * @param {string} product.servingSize - Serving size value
 * @param {string} product.servingUnit - Serving unit (e.g., 'g', 'ml', 'piece')
 * @param {Object} product.nutritionPerServing - Nutrition per serving
 * @param {string} [product.imageUrl] - Optional image URL
 * @returns {string} Product ID
 */
export function saveProduct(product) {
  const products = getAllProductsFromStorage();
  const id = product.id || generateId();
  const newProduct = {
    id,
    name: product.name,
    brand: product.brand || '',
    servingSize: product.servingSize || '100',
    servingUnit: product.servingUnit || 'g',
    nutritionPerServing: product.nutritionPerServing || {},
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
 * @returns {Object|null} Product object or null
 */
export function getProduct(id) {
  const products = getAllProductsFromStorage();
  return products.find(p => p.id === id) || null;
}

/**
 * Get all products
 * @returns {Array} Array of all product objects
 */
export function getAllProducts() {
  return getAllProductsFromStorage();
}

/**
 * Delete a product by ID
 * @param {string} id - Product ID
 * @returns {boolean} Whether the product was deleted
 */
export function deleteProduct(id) {
  const products = getAllProductsFromStorage();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) {
    return false;
  }
  saveAllProductsToStorage(filtered);
  return true;
}