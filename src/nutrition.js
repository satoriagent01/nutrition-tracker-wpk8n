/**
 * Calculate nutrition based on product and amount
 * @param {Object} product - Product object with nutrition data
 * @param {number} amount - Amount to calculate for
 * @param {string} unit - Unit of measurement
 * @returns {Promise<Object>} Nutrition data scaled to the amount
 */
export async function calculateNutrition(product, amount, unit) {
  if (!product) {
    return {
      energy: { kcal: 0, kj: 0 },
      fat: 0,
      saturatedFat: 0,
      carbs: 0,
      sugars: 0,
      protein: 0,
      salt: 0
    };
  }

  // Determine the base nutrition values and serving size
  let baseNutrition;
  let servingAmount;
  let servingUnit;

  // Check if product has per100g data
  if (product.per100g && product.per100g.energy) {
    baseNutrition = product.per100g;
    servingAmount = 100;
    servingUnit = 'g';
  } else if (product.nutritionPerServing) {
    baseNutrition = product.nutritionPerServing;
    servingAmount = product.servingSize?.amount || 100;
    servingUnit = product.servingSize?.unit || 'g';
  } else {
    // Use top-level fields
    baseNutrition = {
      energy: product.energy,
      fat: product.fat,
      saturatedFat: product.saturatedFat,
      carbs: product.carbs,
      sugars: product.sugars,
      protein: product.protein,
      salt: product.salt
    };
    servingAmount = product.servingSize?.amount || 100;
    servingUnit = product.servingSize?.unit || 'g';
  }

  // Calculate ratio based on amount vs serving size
  let ratio = 1;
  if (unit === servingUnit) {
    ratio = amount / servingAmount;
  } else {
    // For different units, assume 1:1 conversion (simplified)
    ratio = amount / servingAmount;
  }

  return {
    energy: {
      kcal: Math.round((baseNutrition.energy?.kcal || 0) * ratio * 10) / 10,
      kj: Math.round((baseNutrition.energy?.kj || 0) * ratio * 10) / 10
    },
    fat: Math.round((baseNutrition.fat || 0) * ratio * 10) / 10,
    saturatedFat: Math.round((baseNutrition.saturatedFat || 0) * ratio * 10) / 10,
    carbs: Math.round((baseNutrition.carbs || 0) * ratio * 10) / 10,
    sugars: Math.round((baseNutrition.sugars || 0) * ratio * 10) / 10,
    protein: Math.round((baseNutrition.protein || 0) * ratio * 10) / 10,
    salt: Math.round((baseNutrition.salt || 0) * ratio * 10) / 10
  };
}

/**
 * Calculate total nutrition for a meal
 * @param {Object} meal - Meal object with items
 * @returns {Promise<Object>} Total nutrition data
 */
export async function calculateMealTotal(meal) {
  if (!meal || !meal.items) {
    return {
      energy: { kcal: 0, kj: 0 },
      fat: 0,
      saturatedFat: 0,
      carbs: 0,
      sugars: 0,
      protein: 0,
      salt: 0
    };
  }

  const totals = {
    energy: { kcal: 0, kj: 0 },
    fat: 0,
    saturatedFat: 0,
    carbs: 0,
    sugars: 0,
    protein: 0,
    salt: 0
  };

  for (const item of meal.items) {
    if (item.nutrition) {
      totals.energy.kcal += item.nutrition.energy?.kcal || 0;
      totals.energy.kj += item.nutrition.energy?.kj || 0;
      totals.fat += item.nutrition.fat || 0;
      totals.saturatedFat += item.nutrition.saturatedFat || 0;
      totals.carbs += item.nutrition.carbs || 0;
      totals.sugars += item.nutrition.sugars || 0;
      totals.protein += item.nutrition.protein || 0;
      totals.salt += item.nutrition.salt || 0;
    }
  }

  // Round all values
  return {
    energy: {
      kcal: Math.round(totals.energy.kcal * 10) / 10,
      kj: Math.round(totals.energy.kj * 10) / 10
    },
    fat: Math.round(totals.fat * 10) / 10,
    saturatedFat: Math.round(totals.saturatedFat * 10) / 10,
    carbs: Math.round(totals.carbs * 10) / 10,
    sugars: Math.round(totals.sugars * 10) / 10,
    protein: Math.round(totals.protein * 10) / 10,
    salt: Math.round(totals.salt * 10) / 10
  };
}