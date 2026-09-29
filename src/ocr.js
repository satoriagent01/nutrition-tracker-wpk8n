/**
 * OCR extraction of nutrition data from images using AI.
 * Calls the configured AI endpoint (OpenAI-compatible) to extract
 * nutritional information from a photo of a nutrition label.
 */

import { getConfig } from './config.js';

/**
 * Extracts nutrition data from an image using AI OCR.
 * @param {string} imageData - Base64-encoded image data or URL
 * @returns {Promise<Object>} Nutrition data object
 */
export async function extractNutrition(imageData) {
  const config = getConfig();
  const { aiEndpoint, apiKey } = config;

  if (!aiEndpoint || !apiKey) {
    throw new Error('AI endpoint and API key must be configured. Use saveConfig to set them up.');
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
            text: 'Extract the nutritional information from this nutrition label. Return ONLY a JSON object with the following fields: energy (number in kcal), fat (number in g), saturatedFat (number in g), carbs (number in g), sugars (number in g), protein (number in g), salt (number in g), servingSize (number), servingUnit (string like "g" or "ml"). If a value is not present, use 0.'
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
      'Authorization': `Bearer ${apiKey}`
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
      energy: Number(parsed.energy) || 0,
      fat: Number(parsed.fat) || 0,
      saturatedFat: Number(parsed.saturatedFat) || 0,
      carbs: Number(parsed.carbs) || 0,
      sugars: Number(parsed.sugars) || 0,
      protein: Number(parsed.protein) || 0,
      salt: Number(parsed.salt) || 0,
      servingSize: Number(parsed.servingSize) || 1,
      servingUnit: parsed.servingUnit || 'g'
    };
  } catch (e) {
    throw new Error(`Failed to parse AI response as JSON: ${content}`);
  }
}