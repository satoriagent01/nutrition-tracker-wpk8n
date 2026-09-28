import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { saveProduct, getProduct, getAllProducts } from "../src/products.js";

describe("Products - saveProduct", () => {
  test("AC-5: saves a product and returns an ID", async () => {
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
    const id = await saveProduct(product);
    assert.ok(typeof id === "string", "Should return a string ID");
    assert.ok(id.length > 0, "ID should not be empty");
  });

  test("AC-5: saves a product with all required fields", async () => {
    const product = {
      name: "Test Product 2",
      brand: "Test Brand 2",
      servingSize: { amount: 50, unit: "g" },
      energy: { kcal: 150, kj: 628 },
      fat: 8,
      saturatedFat: 2,
      carbs: 15,
      sugars: 10,
      protein: 4,
      salt: 0.3,
      per100g: {
        energy: { kcal: 300, kj: 1256 },
        fat: 16,
        saturatedFat: 4,
        carbs: 30,
        sugars: 20,
        protein: 8,
        salt: 0.6,
      },
    };
    const id = await saveProduct(product);
    const retrieved = await getProduct(id);
    assert.strictEqual(retrieved.name, "Test Product 2");
    assert.strictEqual(retrieved.brand, "Test Brand 2");
  });
});

describe("Products - getProduct", () => {
  test("AC-6: retrieves a saved product by ID", async () => {
    const product = {
      name: "Retrieval Test",
      brand: "Brand",
      servingSize: { amount: 100, unit: "g" },
      energy: { kcal: 100, kj: 418 },
      fat: 5,
      saturatedFat: 1,
      carbs: 10,
      sugars: 5,
      protein: 3,
      salt: 0.2,
      per100g: {
        energy: { kcal: 100, kj: 418 },
        fat: 5,
        saturatedFat: 1,
        carbs: 10,
        sugars: 5,
        protein: 3,
        salt: 0.2,
      },
    };
    const id = await saveProduct(product);
    const retrieved = await getProduct(id);
    assert.ok(retrieved !== null, "Should return the product");
    assert.strictEqual(retrieved.name, "Retrieval Test");
  });

  test("AC-6: returns null for non-existent product", async () => {
    const retrieved = await getProduct("non-existent-id");
    assert.strictEqual(retrieved, null, "Should return null for non-existent ID");
  });
});

describe("Products - getAllProducts", () => {
  test("AC-7: returns all saved products", async () => {
    await saveProduct({
      name: "Product A",
      brand: "Brand A",
      servingSize: { amount: 100, unit: "g" },
      energy: { kcal: 100, kj: 418 },
      fat: 5,
      saturatedFat: 1,
      carbs: 10,
      sugars: 5,
      protein: 3,
      salt: 0.2,
      per100g: {
        energy: { kcal: 100, kj: 418 },
        fat: 5,
        saturatedFat: 1,
        carbs: 10,
        sugars: 5,
        protein: 3,
        salt: 0.2,
      },
    });
    await saveProduct({
      name: "Product B",
      brand: "Brand B",
      servingSize: { amount: 100, unit: "g" },
      energy: { kcal: 200, kj: 837 },
      fat: 10,
      saturatedFat: 2,
      carbs: 20,
      sugars: 10,
      protein: 6,
      salt: 0.4,
      per100g: {
        energy: { kcal: 200, kj: 837 },
        fat: 10,
        saturatedFat: 2,
        carbs: 20,
        sugars: 10,
        protein: 6,
        salt: 0.4,
      },
    });
    const products = await getAllProducts();
    assert.ok(Array.isArray(products), "Should return an array");
    assert.strictEqual(products.length, 2, "Should have 2 products");
  });
});