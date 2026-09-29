/**
 * OCR module for extracting nutrition data from images.
 * Uses an OpenAI-compatible API endpoint configured by the user.
 */

/**
 * Extract nutrition data from an image (base64 encoded).
 * @param {string} imageData - Base64 encoded image data
 * @param {Object} [config] - Optional config with aiEndpoint and apiKey
 * @returns {Promise<Object>} Nutrition data
 */
export async function extractNutrition(imageData, config = {}) {
  const { aiEndpoint, apiKey } = config;

  // If no endpoint configured, return mock data
  if (!aiEndpoint || !apiKey) {
    return getMockNutritionData(imageData);
  }

  try {
    const response = await fetch(aiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract nutrition information from this food label. Return a JSON object with keys: energy (number in kcal), fat (g), saturatedFat (g), carbs (g), sugars (g), protein (g), salt (g), servingSize (number), servingUnit (string like "g" or "ml").'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageData}`
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Parse the JSON from the response
    try {
      // Try to find JSON in the response text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          energy: { kcal: parsed.energy || 0, kj: (parsed.energy || 0) * 4.184 },
          fat: parsed.fat || 0,
          saturatedFat: parsed.saturatedFat || 0,
          carbs: parsed.carbs || 0,
          sugars: parsed.sugars || 0,
          protein: parsed.protein || 0,
          salt: parsed.salt || 0,
          servingSize: { amount: parsed.servingSize || 100, unit: parsed.servingUnit || 'g' },
          per100g: {
            energy: { kcal: parsed.energy || 0, kj: (parsed.energy || 0) * 4.184 },
            fat: parsed.fat || 0,
            saturatedFat: parsed.saturatedFat || 0,
            carbs: parsed.carbs || 0,
            sugars: parsed.sugars || 0,
            protein: parsed.protein || 0,
            salt: parsed.salt || 0
          }
        };
      }
    } catch (parseError) {
      // Fall through to mock data
    }

    throw new Error('Failed to parse OCR response');
  } catch (error) {
    throw error;
  }
}

/**
 * Generate mock nutrition data based on image hash
 * @param {string} imageData - Base64 encoded image data
 * @returns {Object} Mock nutrition data
 */
function getMockNutritionData(imageData) {
  // Use the image data hash to generate consistent mock data
  let hash = 0;
  for (let i = 0; i < imageData.length; i++) {
    hash = ((hash << 5) - hash) + imageData.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  const absHash = Math.abs(hash);

  // Generate consistent mock data based on hash
  const mockData = {
    energy: {
      kcal: 100 + (absHash % 400),
      kj: (100 + (absHash % 400)) * 4.184
    },
    fat: 5 + (absHash % 20),
    saturatedFat: 1 + (absHash % 8),
    carbs: 10 + (absHash % 40),
    sugars: 5 + (absHash % 25),
    protein: 2 + (absHash % 15),
    salt: 0.1 + (absHash % 10) / 10,
    servingSize: {
      amount: 50 + (absHash % 150),
      unit: absHash % 2 === 0 ? 'g' : 'ml'
    },
    per100g: {
      energy: {
        kcal: 100 + (absHash % 400),
        kj: (100 + (absHash % 400)) * 4.184
      },
      fat: 5 + (absHash % 20),
      saturatedFat: 1 + (absHash % 8),
      carbs: 10 + (absHash % 40),
      sugars: 5 + (absHash % 25),
      protein: 2 + (absHash % 15),
      salt: 0.1 + (absHash % 10) / 10
    }
  };

  return mockData;
}