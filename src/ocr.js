/**
 * OCR extraction of nutrition data from images using AI.
 * Calls the configured AI endpoint (OpenAI-compatible) to extract
 * nutritional information from a photo of a nutrition label.
 */

import { getConfig } from './config.js';

/**
 * Default mock data used when no AI endpoint is configured.
 * This simulates what the AI would return from analyzing a nutrition label.
 */
const MOCK_NUTRITION_DATA = {
  energy: {
    kcal: 200,
    kj: 837
  },
  fat: 10,
  saturatedFat: 3,
  carbs: 20,
  sugars: 15,
  protein: 5,
  salt: 0.5,
  servingSize: {
    amount: 100,
    unit: 'g'
  },
  per100g: {
    energy: {
      kcal: 200,
      kj: 837
    },
    fat: 10,
    saturatedFat: 3,
    carbs: 20,
    sugars: 15,
    protein: 5,
    salt: 0.5
  }
};

/**
 * Extracts nutrition data from an image using AI OCR.
 * @param {string} imageData - Base64-encoded image data or URL
 * @returns {Promise<Object>} Nutrition data object with energy, fat, saturatedFat, carbs, sugars, protein, salt, servingSize, per100g
 */
export async function extractNutrition(imageData) {
  const config = getConfig();
  const { aiEndpoint, aiApiKey } = config;

  if (!aiEndpoint || !aiApiKey) {
    // Return mock data when no AI endpoint is configured
    return { ...MOCK_NUTRITION_DATA };
  }

  // Prepare the request body for the AI endpoint
  const requestBody = {
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Extract the nutritional information from this nutrition label. Return ONLY a JSON object with the following fields: energy (object with kcal and kj), fat (number in g), saturatedFat (number in g), carbs (number in g), sugars (number in g), protein (number in g), salt (number in g), servingSize (object with amount and unit), per100g (object with energy (kcal and kj), fat, saturatedFat, carbs, sugars, protein, salt). If a value is not present, use 0.'
          },
          {
            type: 'image_url',
            image_url: {
              url: imageData.startsWith('data:') ? imageData : `data:image/jpeg;base64,${imageData}`
            }
          }
        ]
      }
    ],
    max_tokens: 500,
    response_format: { type: 'json_object' }
  };

  const response = await fetch(aiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${aiApiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`AI API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('No content returned from AI API');
  }

  try {
    const parsed = JSON.parse(content);
    return {
      energy: {
        kcal: Number(parsed.energy?.kcal) || 0,
        kj: Number(parsed.energy?.kj) || 0
      },
      fat: Number(parsed.fat) || 0,
      saturatedFat: Number(parsed.saturatedFat) || 0,
      carbs: Number(parsed.carbs) || 0,
      sugars: Number(parsed.sugars) || 0,
      protein: Number(parsed.protein) || 0,
      salt: Number(parsed.salt) || 0,
      servingSize: {
        amount: Number(parsed.servingSize?.amount) || 100,
        unit: parsed.servingSize?.unit || 'g'
      },
      per100g: {
        energy: {
          kcal: Number(parsed.per100g?.energy?.kcal) || 0,
          kj: Number(parsed.per100g?.energy?.kj) || 0
        },
        fat: Number(parsed.per100g?.fat) || 0,
        saturatedFat: Number(parsed.per100g?.saturatedFat) || 0,
        carbs: Number(parsed.per100g?.carbs) || 0,
        sugars: Number(parsed.per100g?.sugars) || 0,
        protein: Number(parsed.per100g?.protein) || 0,
        salt: Number(parsed.per100g?.salt) || 0
      }
    };
  } catch (e) {
    throw new Error(`Failed to parse AI response as JSON: ${content}`);
  }
}