import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { calculateNutrition, calculateMealTotal } from "../src/nutrition.js";

describe("Nutrition - calculateNutrition", () => {
  test("AC-12: calculates nutrition for a product with given amount", async () => {
    const product = {
      name: "Test Product",
      brand: "Test Brand",
      servingSize: { amount: 100, unit: "g" },
      energy: { kcal: 200, kj: 837 },
      fat: 10,
      saturatedFat: 3,
      carbs: 20,
      sugars: 15,
      protein: 5,
      salt: 0.5,
      per100g: {
        energy: { kcal: 200, kj: 837 },
        fat: 10,
        saturatedFat: 3,
        carbs: 20,
        sugars: 15,
        protein: 5,
        salt: 0.5,
      },
    };
    const result = await calculateNutrition(product, 50, "g");
    assert.strictEqual(result.energy.kcal, 100, "Should calculate half of 200 kcal");
    assert.strictEqual(result.fat, 5, "Should calculate half of 10g fat");
    assert.strictEqual(result.saturatedFat, 1.5, "Should calculate half of 3g saturated fat");
    assert.strictEqual(result.carbs, 10, "Should calculate half of 20g carbs");
    assert.strictEqual(result.sugars, 7.5, "Should calculate half of 15g sugars");
    assert.strictEqual(result.protein, 2.5, "Should calculate half of 5g protein");
    assert.strictEqual(result.salt, 0.25, "Should calculate half of 0.5g salt");
  });

  test("AC-12: calculates nutrition for 100g amount", async () => {
    const product = {
      name: "Test Product 2",
      brand: "Test Brand 2",
      servingSize: { amount: 100, unit: "g" },
      energy: { kcal: 300, kj: 1256 },
      fat: 15,
      saturatedFat: 5,
      carbs: 30,
      sugars: 20,
      protein: 8,
      salt: 0.8,
      per100g: {
        energy: { kcal: 300, kj: 1256 },
        fat: 15,
        saturatedFat: 5,
        carbs: 30,
        sugars: 20,
        protein: 8,
        salt: 0.8,
      },
    };
    const result = await calculateNutrition(product, 100, "g");
    assert.strictEqual(result.energy.kcal, 300, "Should return full 300 kcal");
    assert.strictEqual(result.fat, 15, "Should return full 15g fat");
  });

  test("AC-12: calculates nutrition for different units (ml)", async () => {
    const product = {
      name: "Test Product 3",
      brand: "Test Brand 3",
      servingSize: { amount: 200, unit: "ml" },
      energy: { kcal: 400, kj: 1673 },
      fat: 20,
      saturatedFat: 6,
      carbs: 40,
      sugars: 30,
      protein: 10,
      salt: 1.0,
      per100g: {
        energy: { kcal: 200, kj: 837 },
        fat: 10,
        saturatedFat: 3,
        carbs: 20,
        sugars: 15,
        protein: 5,
        salt: 0.5,
      },
    };
    const result = await calculateNutrition(product, 100, "ml");
    assert.strictEqual(result.energy.kcal, 200, "Should calculate 200 kcal for 100ml");
    assert.strictEqual(result.fat, 10, "Should calculate 10g fat for 100ml");
  });
});

describe("Nutrition - calculateMealTotal", () => {
  test("AC-13: calculates total nutrition for a meal", async () => {
    const product1 = {
      name: "Product 1",
      brand: "Brand 1",
      servingSize: { amount: 100, unit: "g" },
      energy: { kcal: 200, kj: 837 },
      fat: 10,
      saturatedFat: 3,
      carbs: 20,
      sugars: 15,
      protein: 5,
      salt: 0.5,
      per100g: {
        energy: { kcal: 200, kj: 837 },
        fat: 10,
        saturatedFat: 3,
        carbs: 20,
        sugars: 15,
        protein: 5,
        salt: 0.5,
      },
    };
    const product2 = {
      name: "Product 2",
      brand: "Brand 2",
      servingSize: { amount: 100, unit: "g" },
      energy: { kcal: 300, kj: 1256 },
      fat: 15,
      saturatedFat: 5,
      carbs: 30,
      sugars: 20,
      protein: 8,
      salt: 0.8,
      per100g: {
        energy: { kcal: 300, kj: 1256 },
        fat: 15,
        saturatedFat: 5,
        carbs: 30,
        sugars: 20,
        protein: 8,
        salt: 0.8,
      },
    };
    const meal = {
      id: "test-meal-id",
      name: "Test Meal",
      date: "2024-01-15",
      items: [
        { productId: "product-1", amount: 100, unit: "g", nutrition: null },
        { productId: "product-2", amount: 100, unit: "g", nutrition: null },
      ],
    };
    const result = await calculateMealTotal(meal, [product1, product2]);
    assert.strictEqual(result.energy.kcal, 500, "Should sum 200 + 300 kcal");
    assert.strictEqual(result.fat, 25, "Should sum 10 + 15g fat");
    assert.strictEqual(result.saturatedFat, 8, "Should sum 3 + 5g saturated fat");
    assert.strictEqual(result.carbs, 50, "Should sum 20 + 30g carbs");
    assert.strictEqual(result.sugars, 35, "Should sum 15 + 20g sugars");
    assert.strictEqual(result.protein, 13, "Should sum 5 + 8g protein");
    assert.strictEqual(result.salt, 1.3, "Should sum 0.5 + 0.8g salt");
  });

  test("AC-13: calculates total for a meal with one item", async () => {
    const product1 = {
      name: "Product 1",
      brand: "Brand 1",
      servingSize: { amount: 100, unit: "g" },
      energy: { kcal: 200, kj: 837 },
      fat: 10,
      saturatedFat: 3,
      carbs: 20,
      sugars: 15,
      protein: 5,
      salt: 0.5,
      per100g: {
        energy: { kcal: 200, kj: 837 },
        fat: 10,
        saturatedFat: 3,
        carbs: 20,
        sugars: 15,
        protein: 5,
        salt: 0.5,
      },
    };
    const meal = {
      id: "test-meal-id",
      name: "Test Meal",
      date: "2024-01-15",
      items: [
        { productId: "product-1", amount: 100, unit: "g", nutrition: null },
      ],
    };
    const result = await calculateMealTotal(meal, [product1]);
    assert.strictEqual(result.energy.kcal, 200, "Should return 200 kcal");
    assert.strictEqual(result.fat, 10, "Should return 10g fat");
  });

  test("AC-13: calculates total for an empty meal", async () => {
    const meal = {
      id: "test-meal-id",
      name: "Empty Meal",
      date: "2024-01-15",
      items: [],
    };
    const result = await calculateMealTotal(meal, []);
    assert.strictEqual(result.energy.kcal, 0, "Should return 0 kcal");
    assert.strictEqual(result.fat, 0, "Should return 0g fat");
    assert.strictEqual(result.saturatedFat, 0, "Should return 0g saturated fat");
    assert.strictEqual(result.carbs, 0, "Should return 0g carbs");
    assert.strictEqual(result.sugars, 0, "Should return 0g sugars");
    assert.strictEqual(result.protein, 0, "Should return 0g protein");
    assert.strictEqual(result.salt, 0, "Should return 0g salt");
  });
});