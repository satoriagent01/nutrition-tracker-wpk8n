import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { saveConfig, getConfig } from "../src/config.js";

describe("Config - saveConfig", () => {
  test("AC-14: saves user configuration", async () => {
    const config = {
      aiEndpoint: "https://api.example.com/ocr",
      aiApiKey: "test-api-key",
      defaultUnit: "g",
      customNutrients: ["sodium", "fiber"],
    };
    await saveConfig(config);
    const savedConfig = await getConfig();
    assert.strictEqual(savedConfig.aiEndpoint, "https://api.example.com/ocr");
    assert.strictEqual(savedConfig.aiApiKey, "test-api-key");
    assert.strictEqual(savedConfig.defaultUnit, "g");
    assert.deepStrictEqual(savedConfig.customNutrients, ["sodium", "fiber"]);
  });

  test("AC-14: updates existing configuration", async () => {
    const config1 = {
      aiEndpoint: "https://api.old.com/ocr",
      aiApiKey: "old-key",
      defaultUnit: "g",
      customNutrients: [],
    };
    const config2 = {
      aiEndpoint: "https://api.new.com/ocr",
      aiApiKey: "new-key",
      defaultUnit: "ml",
      customNutrients: ["sodium", "fiber", "cholesterol"],
    };
    await saveConfig(config1);
    await saveConfig(config2);
    const savedConfig = await getConfig();
    assert.strictEqual(savedConfig.aiEndpoint, "https://api.new.com/ocr");
    assert.strictEqual(savedConfig.aiApiKey, "new-key");
    assert.strictEqual(savedConfig.defaultUnit, "ml");
    assert.deepStrictEqual(savedConfig.customNutrients, ["sodium", "fiber", "cholesterol"]);
  });
});

describe("Config - getConfig", () => {
  test("AC-15: retrieves saved configuration", async () => {
    const config = {
      aiEndpoint: "https://api.example.com/ocr",
      aiApiKey: "test-api-key",
      defaultUnit: "g",
      customNutrients: ["sodium"],
    };
    await saveConfig(config);
    const savedConfig = await getConfig();
    assert.ok(savedConfig !== null, "Should return configuration");
    assert.strictEqual(savedConfig.aiEndpoint, "https://api.example.com/ocr");
    assert.strictEqual(savedConfig.aiApiKey, "test-api-key");
    assert.strictEqual(savedConfig.defaultUnit, "g");
    assert.deepStrictEqual(savedConfig.customNutrients, ["sodium"]);
  });

  test("AC-15: returns default configuration when nothing is saved", async () => {
    // Assuming no config is saved initially
    const savedConfig = await getConfig();
    assert.ok(savedConfig !== null, "Should return default configuration");
    assert.strictEqual(savedConfig.aiEndpoint, "", "Should have empty default endpoint");
    assert.strictEqual(savedConfig.aiApiKey, "", "Should have empty default API key");
    assert.strictEqual(savedConfig.defaultUnit, "g", "Should have 'g' as default unit");
    assert.deepStrictEqual(savedConfig.customNutrients, [], "Should have empty custom nutrients array");
  });
});