/**
 * Nutrition calculation module.
 * Calculates nutrition based on product data and amounts.
 */

/**
 * Calculate nutrition for a product with a given amount.
 * @param {Object} product - Product object with nutritionPerServing, servingSize, servingUnit
 * @param {number} amount - Amount in grams
 * @param {string} unit - Unit (default: 'g')
 * @returns {Object} NutritionData object
 */
export function calculateNutrition(product, amount, unit = 'g') {
  if (!product || !product.nutritionPerServing) {
    return {
      energy: 0,
      fat: 0,
      saturatedFat: 0,
      carbs: 0,
      sugars: 0,
      protein: 0,
      salt: 0
    };
  }

  const servingSize = product.servingSize || 1;
  const servingUnit = product.servingUnit || 'g';
  
  // Convert to grams if needed
  let amountInGrams = amount;
  if (unit !== 'g' && servingUnit === 'g') {
    // Simple conversion: assume 1ml = 1g for liquids
    amountInGrams = amount;
  }

  // Calculate ratio
  const ratio = amountInGrams / servingSize;

  const nutrition = product.nutritionPerServing;
  
  return {
    energy: Math.round(nutrition.energy * ratio * 100) / 100,
    fat: Math.round(nutrition.fat * ratio * 100) / 100,
    saturatedFat: Math.round(nutrition.saturatedFat * ratio * 100) / 100,
    carbs: Math.round(nutrition.carbs * ratio * 100) / 100,
    sugars: Math.round(nutrition.sugars * ratio * 100) / 100,
    protein: Math.round(nutrition.protein * ratio * 100) / 100,
    salt: Math.round(nutrition.salt * ratio * 100) / 100
  };
}

/**
 * Calculate total nutrition for a meal.
 * @param {Object} meal - Meal object with items array
 * @param {Function} getProduct - Function to get product by ID
 * @returns {Object} Total nutrition data
 */
export function calculateMealTotal(meal, getProduct) {
  if (!meal || !meal.items) {
    return {
      energy: 0,
      fat: 0,
      saturatedFat: 0,
      carbs: 0,
      sugars: 0,
      protein: 0,
      salt: 0
    };
  }

  let total = {
    energy: 0,
    fat: 0,
    saturatedFat: 0,
    carbs: 0,
    sugars: 0,
    protein: 0,
    salt: 0
  };

  for (const item of meal.items) {
    if (item.productId && getProduct) {
      const product = getProduct(item.productId);
      if (product) {
        const nutrition = calculateNutrition(product, item.amount, item.unit);
        total.energy += nutrition.energy;
        total.fat += nutrition.fat;
        total.saturatedFat += nutrition.saturatedFat;
        total.carbs += nutrition.carbs;
        total.sugars += nutrition.sugars;
        total.protein += nutrition.protein;
        total.salt += nutrition.salt;
      }
    }
  }

  // Round all values
  return {
    energy: Math.round(total.energy * 100) / 100,
    fat: Math.round(total.fat * 100) / 100,
    saturatedFat: Math.round(total.saturatedFat * 100) / 100,
    carbs: Math.round(total.carbs * 100) / 100,
    sugars: Math.round(total.sugars * 100) / 100,
    protein: Math.round(total.protein * 100) / 100,
    salt: Math.round(total.salt * 100) / 100
  };
}