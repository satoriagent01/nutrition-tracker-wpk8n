/**
 * Product database management using localStorage.
 * Provides save, get, and getAll operations for products.
 */

const STORAGE_KEY = 'nutrition_tracker_products';

/**
 * Get all products from storage.
 * @returns {Array} Array of product objects
 */
function getAllProductsFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save products to storage.
 * @param {Array} products - Array of product objects
 */
function saveProductsToStorage(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

/**
 * Generate a unique ID.
 * @returns {string} Unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Save a product to the database.
 * @param {Object} product - Product object with id, name, brand, servingSize, servingUnit, nutritionPerServing, imageUrl
 * @returns {string} Product ID
 */
export function saveProduct(product) {
  const products = getAllProductsFromStorage();
  const productWithId = {
    id: product.id || generateId(),
    name: product.name || 'Unknown',
    brand: product.brand || '',
    servingSize: product.servingSize || 1,
    servingUnit: product.servingUnit || 'g',
    nutritionPerServing: product.nutritionPerServing || {
      energy: 0,
      fat: 0,
      saturatedFat: 0,
      carbs: 0,
      sugars: 0,
      protein: 0,
      salt: 0
    },
    imageUrl: product.imageUrl || ''
  };

  // Check if product with same ID exists, update it
  const existingIndex = products.findIndex(p => p.id === productWithId.id);
  if (existingIndex >= 0) {
    products[existingIndex] = productWithId;
  } else {
    products.push(productWithId);
  }

  saveProductsToStorage(products);
  return productWithId.id;
}

/**
 * Get a product by ID.
 * @param {string} id - Product ID
 * @returns {Object|null} Product object or null if not found
 */
export function getProduct(id) {
  const products = getAllProductsFromStorage();
  return products.find(p => p.id === id) || null;
}

/**
 * Get all products.
 * @returns {Array} Array of all product objects
 */
export function getAllProducts() {
  return getAllProductsFromStorage();
}

/**
 * Delete a product by ID.
 * @param {string} id - Product ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteProduct(id) {
  const products = getAllProductsFromStorage();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) {
    return false;
  }
  saveProductsToStorage(filtered);
  return true;
}