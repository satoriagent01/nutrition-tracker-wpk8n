/**
 * Calculate nutrition based on product and amount
 * @param {Object} product - Product object with nutritionPerServing
 * @param {number} amount - Amount to calculate for
 * @param {string} unit - Unit of measurement
 * @returns {Object} Nutrition data scaled to the amount
 */
export function calculateNutrition(product, amount, unit) {
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

  const servingSize = parseFloat(product.servingSize) || 100;
  const servingUnit = product.servingUnit || 'g';
  
  // If units match, calculate ratio directly
  let ratio = 1;
  if (unit === servingUnit) {
    ratio = amount / servingSize;
  } else {
    // For different units, assume 1:1 conversion (simplified)
    // In a real app, you'd have conversion factors
    ratio = amount / servingSize;
  }

  const nutrition = product.nutritionPerServing;
  return {
    energy: Math.round((nutrition.energy || 0) * ratio * 10) / 10,
    fat: Math.round((nutrition.fat || 0) * ratio * 10) / 10,
    saturatedFat: Math.round((nutrition.saturatedFat || 0) * ratio * 10) / 10,
    carbs: Math.round((nutrition.carbs || 0) * ratio * 10) / 10,
    sugars: Math.round((nutrition.sugars || 0) * ratio * 10) / 10,
    protein: Math.round((nutrition.protein || 0) * ratio * 10) / 10,
    salt: Math.round((nutrition.salt || 0) * ratio * 10) / 10
  };
}

/**
 * Calculate total nutrition for a meal
 * @param {Object} meal - Meal object with items
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

  const totals = {
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
        totals.energy += nutrition.energy;
        totals.fat += nutrition.fat;
        totals.saturatedFat += nutrition.saturatedFat;
        totals.carbs += nutrition.carbs;
        totals.sugars += nutrition.sugars;
        totals.protein += nutrition.protein;
        totals.salt += nutrition.salt;
      }
    }
  }

  // Round all values
  return {
    energy: Math.round(totals.energy * 10) / 10,
    fat: Math.round(totals.fat * 10) / 10,
    saturatedFat: Math.round(totals.saturatedFat * 10) / 10,
    carbs: Math.round(totals.carbs * 10) / 10,
    sugars: Math.round(totals.sugars * 10) / 10,
    protein: Math.round(totals.protein * 10) / 10,
    salt: Math.round(totals.salt * 10) / 10
  };
}