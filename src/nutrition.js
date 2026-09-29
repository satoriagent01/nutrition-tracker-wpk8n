/**
 * Nutrition calculation module.
 * Calculates nutrition based on product data and amounts.
 */

/**
 * Calculate nutrition for a product with a given amount.
 * Uses per100g data if available, otherwise uses the product's own nutrition values.
 * @param {Object} product - Product object with energy, fat, saturatedFat, carbs, sugars, protein, salt, servingSize, per100g
 * @param {number} amount - Amount in grams or ml
 * @param {string} unit - Unit (default: 'g')
 * @returns {Object} NutritionData object with energy (kcal, kj), fat, saturatedFat, carbs, sugars, protein, salt
 */
export function calculateNutrition(product, amount, unit = 'g') {
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

  const servingSize = product.servingSize;
  const servingAmount = servingSize?.amount || 100;
  const servingUnit = servingSize?.unit || 'g';

  // Use per100g data if available, otherwise use the product's own values
  const hasPer100g = product.per100g && product.per100g.energy;

  let ratio;
  if (hasPer100g) {
    // per100g is always per 100g, so ratio is amount / 100
    ratio = amount / 100;
  } else {
    // Use the product's serving size
    ratio = amount / servingAmount;
  }

  if (hasPer100g) {
    return {
      energy: {
        kcal: product.per100g.energy.kcal * ratio,
        kj: product.per100g.energy.kj * ratio
      },
      fat: product.per100g.fat * ratio,
      saturatedFat: product.per100g.saturatedFat * ratio,
      carbs: product.per100g.carbs * ratio,
      sugars: product.per100g.sugars * ratio,
      protein: product.per100g.protein * ratio,
      salt: product.per100g.salt * ratio
    };
  }

  return {
    energy: {
      kcal: product.energy.kcal * ratio,
      kj: product.energy.kj * ratio
    },
    fat: product.fat * ratio,
    saturatedFat: product.saturatedFat * ratio,
    carbs: product.carbs * ratio,
    sugars: product.sugars * ratio,
    protein: product.protein * ratio,
    salt: product.salt * ratio
  };
}

/**
 * Calculate total nutrition for a meal.
 * @param {Object} meal - Meal object with items array
 * @param {Array} products - Array of product objects to look up by productId
 * @returns {Object} Total nutrition data with energy (kcal, kj), fat, saturatedFat, carbs, sugars, protein, salt
 */
export function calculateMealTotal(meal, products) {
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

  let total = {
    energy: { kcal: 0, kj: 0 },
    fat: 0,
    saturatedFat: 0,
    carbs: 0,
    sugars: 0,
    protein: 0,
    salt: 0
  };

  for (const item of meal.items) {
    if (item.productId) {
      const product = products?.find(p => p.name === item.productId) || products?.find(p => p.id === item.productId);
      if (product) {
        const nutrition = calculateNutrition(product, item.amount, item.unit);
        total.energy.kcal += nutrition.energy.kcal;
        total.energy.kj += nutrition.energy.kj;
        total.fat += nutrition.fat;
        total.saturatedFat += nutrition.saturatedFat;
        total.carbs += nutrition.carbs;
        total.sugars += nutrition.sugars;
        total.protein += nutrition.protein;
        total.salt += nutrition.salt;
      }
    }
  }

  return total;
}