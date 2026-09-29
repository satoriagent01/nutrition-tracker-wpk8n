/**
 * Meal planning management using storage abstraction.
 * Provides create, add product, get, and getAll operations for meals.
 */

import { getItem, setItem } from './storage.js';

const STORAGE_KEY = 'nutrition_tracker_meals';

/**
 * Get all meals from storage.
 * @returns {Array} Array of meal objects
 */
function getAllMealsFromStorage() {
  try {
    const data = getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save meals to storage.
 * @param {Array} meals - Array of meal objects
 */
function saveMealsToStorage(meals) {
  setItem(STORAGE_KEY, JSON.stringify(meals));
}

/**
 * Generate a unique ID.
 * @returns {string} Unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Create a new meal.
 * @param {string} name - Meal name
 * @param {string} date - Meal date (ISO string)
 * @returns {string} Meal ID
 */
export function createMeal(name, date) {
  const meals = getAllMealsFromStorage();
  const meal = {
    id: generateId(),
    name: name || 'Untitled Meal',
    date: date || new Date().toISOString(),
    items: []
  };
  meals.push(meal);
  saveMealsToStorage(meals);
  return meal.id;
}

/**
 * Add a product to a meal.
 * @param {string} mealId - Meal ID
 * @param {string} productId - Product ID
 * @param {number} amount - Amount in grams
 * @param {string} unit - Unit (default: 'g')
 * @returns {Object} MealItem object
 */
export function addProductToMeal(mealId, productId, amount, unit = 'g') {
  const meals = getAllMealsFromStorage();
  const mealIndex = meals.findIndex(m => m.id === mealId);

  if (mealIndex === -1) {
    throw new Error(`Meal with ID ${mealId} not found`);
  }

  const meal = meals[mealIndex];

  // Check if product is already in this meal
  const existingItemIndex = meal.items.findIndex(
    item => item.productId === productId
  );

  const mealItem = {
    productId,
    amount: Number(amount) || 0,
    unit: unit || 'g',
    nutrition: {} // Will be calculated by the frontend or nutrition module
  };

  if (existingItemIndex >= 0) {
    // Update existing item
    meal.items[existingItemIndex] = mealItem;
  } else {
    meal.items.push(mealItem);
  }

  meals[mealIndex] = meal;
  saveMealsToStorage(meals);

  return mealItem;
}

/**
 * Get a meal by ID.
 * @param {string} id - Meal ID
 * @returns {Object|null} Meal object or null if not found
 */
export function getMeal(id) {
  const meals = getAllMealsFromStorage();
  return meals.find(m => m.id === id) || null;
}

/**
 * Get all meals.
 * @returns {Array} Array of all meal objects
 */
export function getAllMeals() {
  return getAllMealsFromStorage();
}

/**
 * Delete a meal by ID.
 * @param {string} id - Meal ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteMeal(id) {
  const meals = getAllMealsFromStorage();
  const filtered = meals.filter(m => m.id !== id);
  if (filtered.length === meals.length) {
    return false;
  }
  saveMealsToStorage(filtered);
  return true;
}