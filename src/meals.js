import { store } from './storage.js';

const MEALS_KEY = 'nutrition-tracker-meals';

/**
 * Get all meals from storage
 * @returns {Array} Array of meal objects
 */
function getAllMealsFromStorage() {
  const raw = store.getItem(MEALS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Save all meals to storage
 * @param {Array} meals - Array of meal objects
 */
function saveAllMealsToStorage(meals) {
  store.setItem(MEALS_KEY, JSON.stringify(meals));
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Create a new meal
 * @param {string} name - Meal name
 * @param {string} date - Meal date (ISO string)
 * @returns {string} Meal ID
 */
export function createMeal(name, date) {
  const meals = getAllMealsFromStorage();
  const id = generateId();
  const meal = {
    id,
    name,
    date: date || new Date().toISOString().split('T')[0],
    items: []
  };
  meals.push(meal);
  saveAllMealsToStorage(meals);
  return id;
}

/**
 * Add a product to a meal
 * @param {string} mealId - Meal ID
 * @param {string} productId - Product ID
 * @param {number} amount - Amount to add
 * @param {string} unit - Unit of measurement
 * @returns {Object} The added meal item
 */
export function addProductToMeal(mealId, productId, amount, unit) {
  const meals = getAllMealsFromStorage();
  const mealIndex = meals.findIndex(m => m.id === mealId);
  if (mealIndex === -1) {
    throw new Error(`Meal with ID ${mealId} not found`);
  }

  const meal = meals[mealIndex];

  // Check if product already exists in meal
  const existingItemIndex = meal.items.findIndex(
    item => item.productId === productId && item.unit === unit
  );

  if (existingItemIndex >= 0) {
    // Update existing item amount
    meal.items[existingItemIndex].amount += amount;
  } else {
    // Add new item
    meal.items.push({
      productId,
      amount,
      unit: unit || 'g',
      nutrition: {}
    });
  }

  saveAllMealsToStorage(meals);
  return meal.items[existingItemIndex >= 0 ? existingItemIndex : meal.items.length - 1];
}

/**
 * Get a meal by ID
 * @param {string} id - Meal ID
 * @returns {Object|null} Meal object or null
 */
export function getMeal(id) {
  const meals = getAllMealsFromStorage();
  return meals.find(m => m.id === id) || null;
}

/**
 * Get all meals
 * @returns {Array} Array of all meal objects
 */
export function getAllMeals() {
  return getAllMealsFromStorage();
}

/**
 * Delete a meal by ID
 * @param {string} id - Meal ID
 * @returns {boolean} Whether the meal was deleted
 */
export function deleteMeal(id) {
  const meals = getAllMealsFromStorage();
  const filtered = meals.filter(m => m.id !== id);
  if (filtered.length === meals.length) {
    return false;
  }
  saveAllMealsToStorage(filtered);
  return true;
}

/**
 * Remove an item from a meal
 * @param {string} mealId - Meal ID
 * @param {string} productId - Product ID
 * @param {string} unit - Unit of measurement
 * @returns {boolean} Whether the item was removed
 */
export function removeProductFromMeal(mealId, productId, unit) {
  const meals = getAllMealsFromStorage();
  const mealIndex = meals.findIndex(m => m.id === mealId);
  if (mealIndex === -1) {
    return false;
  }

  const meal = meals[mealIndex];
  const itemIndex = meal.items.findIndex(
    item => item.productId === productId && item.unit === unit
  );

  if (itemIndex === -1) {
    return false;
  }

  meal.items.splice(itemIndex, 1);
  saveAllMealsToStorage(meals);
  return true;
}