import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { extractNutrition } from "../src/ocr.js";

describe("OCR - extractNutrition", () => {
  test("AC-1: extracts energy from a nutrition label image", async () => {
    const imageData = "base64_encoded_image_data";
    const result = await extractNutrition(imageData);
    assert.ok(result.energy !== undefined, "Should extract energy");
    assert.ok(result.energy.kcal !== undefined, "Should have kcal value");
    assert.ok(result.energy.kj !== undefined, "Should have kJ value");
  });

  test("AC-2: extracts macronutrients from a nutrition label image", async () => {
    const imageData = "base64_encoded_image_data";
    const result = await extractNutrition(imageData);
    assert.ok(result.fat !== undefined, "Should extract fat");
    assert.ok(result.saturatedFat !== undefined, "Should extract saturated fat");
    assert.ok(result.carbs !== undefined, "Should extract carbs");
    assert.ok(result.sugars !== undefined, "Should extract sugars");
    assert.ok(result.protein !== undefined, "Should extract protein");
    assert.ok(result.salt !== undefined, "Should extract salt");
  });

  test("AC-3: extracts serving size from a nutrition label image", async () => {
    const imageData = "base64_encoded_image_data";
    const result = await extractNutrition(imageData);
    assert.ok(result.servingSize !== undefined, "Should extract serving size");
    assert.ok(result.servingSize.amount !== undefined, "Should have serving size amount");
    assert.ok(result.servingSize.unit !== undefined, "Should have serving size unit");
  });

  test("AC-4: returns all values per 100g when available", async () => {
    const imageData = "base64_encoded_image_data";
    const result = await extractNutrition(imageData);
    assert.ok(result.per100g !== undefined, "Should have per 100g data");
    assert.ok(result.per100g.energy !== undefined, "Should have per 100g energy");
    assert.ok(result.per100g.fat !== undefined, "Should have per 100g fat");
    assert.ok(result.per100g.carbs !== undefined, "Should have per 100g carbs");
    assert.ok(result.per100g.protein !== undefined, "Should have per 100g protein");
  });
});