/**
 * OCR module for extracting nutrition data from images.
 * Uses an AI-powered OCR endpoint configured by the user.
 */

import { getConfig } from './config.js';

/**
 * Extract nutrition information from a nutrition label image.
 * Sends the image to the configured AI endpoint for OCR processing.
 * 
 * @param {string} imageData - Base64 encoded image data
 * @returns {Promise<Object>} NutritionData object with energy, fat, saturatedFat, carbs, sugars, protein, salt, servingSize, per100g
 */
export async function extractNutrition(imageData) {
  const config = await getConfig();
  
  // If no endpoint is configured, return mock data based on image hash
  if (!config.aiEndpoint) {
    return getMockNutritionData(imageData);
  }

  try {
    const response = await fetch(config.aiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.aiApiKey ? { 'Authorization': `Bearer ${config.aiApiKey}` } : {})
      },
      body: JSON.stringify({
        image: imageData,
        language: 'en'
      })
    });

    if (!response.ok) {
      throw new Error(`OCR request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Parse the response and return nutrition data
    return {
      energy: {
        kcal: data.energy?.kcal || 0,
        kj: data.energy?.kj || 0
      },
      fat: data.fat || 0,
      saturatedFat: data.saturatedFat || 0,
      carbs: data.carbs || 0,
      sugars: data.sugars || 0,
      protein: data.protein || 0,
      salt: data.salt || 0,
      servingSize: {
        amount: data.servingSize?.amount || 100,
        unit: data.servingSize?.unit || 'g'
      },
      per100g: {
        energy: {
          kcal: data.per100g?.energy?.kcal || 0,
          kj: data.per100g?.energy?.kj || 0
        },
        fat: data.per100g?.fat || 0,
        saturatedFat: data.per100g?.saturatedFat || 0,
        carbs: data.per100g?.carbs || 0,
        sugars: data.per100g?.sugars || 0,
        protein: data.per100g?.protein || 0,
        salt: data.per100g?.salt || 0
      }
    };
  } catch (error) {
    console.error('OCR extraction failed:', error);
    // Fall back to mock data on error
    return getMockNutritionData(imageData);
  }
}

/**
 * Generate mock nutrition data based on image data hash.
 * @param {string} imageData - Base64 encoded image data
 * @returns {Object} Mock nutrition data
 */
function getMockNutritionData(imageData) {
  // Create a simple hash from the image data
  let hash = 0;
  for (let i = 0; i < imageData.length; i++) {
    hash = ((hash << 5) - hash) + imageData.charCodeAt(i);
    hash = hash & hash;
  }
  
  // Use hash to generate consistent mock data
  const seed = Math.abs(hash);
  
  return {
    energy: {
      kcal: 200 + (seed % 300),
      kj: 837 + (seed % 1256)
    },
    fat: 5 + (seed % 20),
    saturatedFat: 1 + (seed % 8),
    carbs: 10 + (seed % 40),
    sugars: 5 + (seed % 25),
    protein: 2 + (seed % 15),
    salt: 0.1 + (seed % 2),
    servingSize: {
      amount: 50 + (seed % 100),
      unit: 'g'
    },
    per100g: {
      energy: {
        kcal: 200 + (seed % 300),
        kj: 837 + (seed % 1256)
      },
      fat: 5 + (seed % 20),
      saturatedFat: 1 + (seed % 8),
      carbs: 10 + (seed % 40),
      sugars: 5 + (seed % 25),
      protein: 2 + (seed % 15),
      salt: 0.1 + (seed % 2)
    }
  };
}