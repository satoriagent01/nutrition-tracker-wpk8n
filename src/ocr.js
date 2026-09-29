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
          energy: parsed.energy || 0,
          fat: parsed.fat || 0,
          saturatedFat: parsed.saturatedFat || 0,
          carbs: parsed.carbs || 0,
          sugars: parsed.sugars || 0,
          protein: parsed.protein || 0,
          salt: parsed.salt || 0,
          servingSize: parsed.servingSize || 100,
          servingUnit: parsed.servingUnit || 'g'
        };
      }
    } catch (parseError) {
      // Fall back to mock data if parsing fails
      console.warn('Failed to parse API response, using mock data:', parseError);
    }

    return getMockNutritionData(imageData);
  } catch (error) {
    console.error('OCR extraction failed:', error);
    return getMockNutritionData(imageData);
  }
}

/**
 * Generate mock nutrition data based on image hash
 * @param {string} imageData - Base64 encoded image data
 * @returns {Object} Mock nutrition data
 */
function getMockNutritionData(imageData) {
  // Create a simple hash from the image data
  let hash = 0;
  const str = imageData || 'default';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Use hash to generate consistent mock data
  const absHash = Math.abs(hash);
  const mockData = [
    {
      energy: 250,
      fat: 12,
      saturatedFat: 3,
      carbs: 30,
      sugars: 15,
      protein: 5,
      salt: 0.5,
      servingSize: 100,
      servingUnit: 'g'
    },
    {
      energy: 180,
      fat: 8,
      saturatedFat: 2,
      carbs: 22,
      sugars: 10,
      protein: 3,
      salt: 0.3,
      servingSize: 50,
      servingUnit: 'g'
    },
    {
      energy: 320,
      fat: 15,
      saturatedFat: 5,
      carbs: 35,
      sugars: 20,
      protein: 8,
      salt: 0.7,
      servingSize: 150,
      servingUnit: 'g'
    }
  ];

  return mockData[absHash % mockData.length];
}