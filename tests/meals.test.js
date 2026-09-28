import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createMeal, addProductToMeal, getMeal, getAllMeals } from "../src/meals.js";

describe("Meals - createMeal", () => {
  test("AC-8: creates a meal and returns an ID", async () => {
    const id = await createMeal("Lunch", "2024-01-15");
    assert.ok(typeof id === "string", "Should return a string ID");
    assert.ok(id.length > 0, "ID should not be empty");
  });

  test("AC-8: creates a meal with name and date", async () => {
    const id = await createMeal("Dinner", "2024-01-15");
    const meal = await getMeal(id);
    assert.ok(meal !== null, "Should retrieve the meal");
    assert.strictEqual(meal.name, "Dinner");
    assert.strictEqual(meal.date, "2024-01-15");
  });
});

describe("Meals - addProductToMeal", () => {
  test("AC-9: adds a product to a meal", async () => {
    const mealId = await createMeal("Snack", "2024-01-15");
    const productId = "test-product-id";
    const mealItem = await addProductToMeal(mealId, productId, 100, "g");
    assert.ok(mealItem !== null, "Should return a meal item");
    assert.strictEqual(mealItem.productId, productId);
    assert.strictEqual(mealItem.amount, 100);
    assert.strictEqual(mealItem.unit, "g");
  });

  test("AC-9: adds multiple products to a meal", async () => {
    const mealId = await createMeal("Breakfast", "2024-01-15");
    await addProductToMeal(mealId, "product-1", 50, "g");
    await addProductToMeal(mealId, "product-2", 200, "ml");
    const meal = await getMeal(mealId);
    assert.strictEqual(meal.items.length, 2, "Should have 2 items");
  });
});

describe("Meals - getMeal", () => {
  test("AC-10: retrieves a meal by ID", async () => {
    const mealId = await createMeal("Test Meal", "2024-01-15");
    const meal = await getMeal(mealId);
    assert.ok(meal !== null, "Should return the meal");
    assert.strictEqual(meal.name, "Test Meal");
    assert.strictEqual(meal.date, "2024-01-15");
  });

  test("AC-10: returns null for non-existent meal", async () => {
    const meal = await getMeal("non-existent-meal-id");
    assert.strictEqual(meal, null, "Should return null for non-existent meal");
  });
});

describe("Meals - getAllMeals", () => {
  test("AC-11: returns all saved meals", async () => {
    await createMeal("Meal A", "2024-01-15");
    await createMeal("Meal B", "2024-01-16");
    const meals = await getAllMeals();
    assert.ok(Array.isArray(meals), "Should return an array");
    assert.strictEqual(meals.length, 2, "Should have 2 meals");
  });

  test("AC-11: returns empty array when no meals exist", async () => {
    const meals = await getAllMeals();
    assert.ok(Array.isArray(meals), "Should return an array");
    assert.strictEqual(meals.length, 0, "Should have 0 meals");
  });
});