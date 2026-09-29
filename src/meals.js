import { storage } from './storage.js';
import { getProduct } from './products.js';
import { calculateNutrition } from './nutrition.js';

const MEALS_KEY = 'nutrition-tracker-meals';

/**
 * Get all meals from storage
 * @returns {Array} Array of meal objects
 */
function getAllMealsFromStorage() {
  const raw = storage.getItem(MEALS_KEY);
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
  storage.setItem(MEALS_KEY, JSON.stringify(meals));
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
 * @returns {Promise<string>} Meal ID
 */
export async function createMeal(name, date) {
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
 * @returns {Promise<Object>} The added meal item
 */
export async function addProductToMeal(mealId, productId, amount, unit) {
  const meals = getAllMealsFromStorage();
  const mealIndex = meals.findIndex(m => m.id === mealId);
  if (mealIndex === -1) {
    throw new Error(`Meal with ID ${mealId} not found`);
  }

  const meal = meals[mealIndex];

  // Get product info to calculate nutrition
  const product = await getProduct(productId);
  let nutrition = {};
  if (product) {
    nutrition = await calculateNutrition(product, amount, unit);
  }

  // Check if product already exists in meal
  const existingItemIndex = meal.items.findIndex(
    item => item.productId === productId && item.unit === unit
  );

  if (existingItemIndex >= 0) {
    // Update existing item amount
    meal.items[existingItemIndex].amount += amount;
    // Recalculate nutrition
    if (product) {
      nutrition = await calculateNutrition(product, meal.items[existingItemIndex].amount, unit);
    }
    meal.items[existingItemIndex].nutrition = nutrition;
  } else {
    // Add new item
    meal.items.push({
      productId,
      amount,
      unit,
      nutrition
    });
  }

  saveAllMealsToStorage(meals);

  return {
    productId,
    amount,
    unit,
    nutrition
  };
}

/**
 * Get a meal by ID
 * @param {string} id - Meal ID
 * @returns {Promise<Object|null>} Meal object or null
 */
export async function getMeal(id) {
  const meals = getAllMealsFromStorage();
  return meals.find(m => m.id === id) || null;
}

/**
 * Get all meals
 * @returns {Promise<Array>} Array of all meals
 */
export async function getAllMeals() {
  return getAllMealsFromStorage();
}

/**
 * Delete a meal by ID
 * @param {string} id - Meal ID
 * @returns {Promise<boolean>} Whether the meal was deleted
 */
export async function deleteMeal(id) {
  const meals = getAllMealsFromStorage();
  const index = meals.findIndex(m => m.id === id);
  if (index === -1) return false;
  meals.splice(index, 1);
  saveAllMealsToStorage(meals);
  return true;
}