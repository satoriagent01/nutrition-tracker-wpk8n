/**
 * Frontend application for Nutrition Tracker
 * Handles UI interactions and calls backend modules
 */

import { extractNutrition } from '../src/ocr.js';
import { saveProduct, getAllProducts, deleteProduct } from '../src/products.js';
import { createMeal, addProductToMeal, getMeal, getAllMeals, deleteMeal } from '../src/meals.js';
import { calculateNutrition, calculateMealTotal } from '../src/nutrition.js';
import { saveConfig, getConfig } from '../src/config.js';

// State
let currentScanData = null;
let currentMealId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadMeals();
  setDefaultDate();
  setupDragAndDrop();
});

// File Upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64Data = e.target.result.split(',')[1];
    
    try {
      const result = await extractNutrition(base64Data);
      currentScanData = result;
      displayScanResult(result);
    } catch (error) {
      alert('Failed to scan image: ' + error.message);
    }
  };
  reader.readAsDataURL(file);
}

function setupDragAndDrop() {
  const uploadArea = document.querySelector('.upload-area');
  const fileInput = document.getElementById('fileInput');

  uploadArea.addEventListener('click', () => {
    fileInput.click();
  });

  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#2c7a2c';
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#2c7a2c';
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#2c7a2c';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const input = document.getElementById('fileInput');
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      handleFileUpload({ target: input });
    }
  });

  fileInput.addEventListener('change', (e) => {
    handleFileUpload(e);
  });
}

function displayScanResult(result) {
  const scanResultDiv = document.getElementById('scanResult');
  const scanDataDiv = document.getElementById('scanData');
  
  let html = '<div class="nutrition-grid">';
  if (result.energy) {
    html += `<div class="nutrition-item"><div class="value">${result.energy.kcal || 0}</div><div class="label">kcal</div></div>`;
    html += `<div class="nutrition-item"><div class="value">${result.energy.kj || 0}</div><div class="label">kJ</div></div>`;
  }
  if (result.fat !== undefined) {
    html += `<div class="nutrition-item"><div class="value">${result.fat}g</div><div class="label">Fat</div></div>`;
  }
  if (result.saturatedFat !== undefined) {
    html += `<div class="nutrition-item"><div class="value">${result.saturatedFat}g</div><div class="label">Saturated Fat</div></div>`;
  }
  if (result.carbs !== undefined) {
    html += `<div class="nutrition-item"><div class="value">${result.carbs}g</div><div class="label">Carbs</div></div>`;
  }
  if (result.sugars !== undefined) {
    html += `<div class="nutrition-item"><div class="value">${result.sugars}g</div><div class="label">Sugars</div></div>`;
  }
  if (result.protein !== undefined) {
    html += `<div class="nutrition-item"><div class="value">${result.protein}g</div><div class="label">Protein</div></div>`;
  }
  if (result.salt !== undefined) {
    html += `<div class="nutrition-item"><div class="value">${result.salt}g</div><div class="label">Salt</div></div>`;
  }
  html += '</div>';
  
  scanDataDiv.innerHTML = html;
  scanResultDiv.classList.remove('hidden');
}

// Product List
async function loadProducts() {
  const products = await getAllProducts();
  const productListDiv = document.getElementById('productList');
  
  if (products.length === 0) {
    productListDiv.innerHTML = '<p>No products saved yet. Scan a nutrition label to add one.</p>';
    return;
  }
  
  let html = '';
  for (const product of products) {
    html += `<div class="product-item">
      <div class="meal-item-info">
        <strong>${product.name}</strong> ${product.brand ? '(' + product.brand + ')' : ''}
        <br>Per ${product.servingSize?.amount || 100}${product.servingSize?.unit || 'g'}: 
        ${product.energy?.kcal || 0} kcal
      </div>
      <div class="meal-item-actions">
        <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
      </div>
    </div>`;
  }
  productListDiv.innerHTML = html;
}

// Meal List
async function loadMeals() {
  const meals = await getAllMeals();
  const mealListDiv = document.getElementById('mealList');
  
  if (meals.length === 0) {
    mealListDiv.innerHTML = '<p>No meals created yet.</p>';
    return;
  }
  
  let html = '';
  for (const meal of meals) {
    html += `<div class="meal-item" style="margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 4px;">
      <div class="meal-item-info">
        <strong>${meal.name}</strong> (${meal.date})
        ${meal.items && meal.items.length > 0 ? '<br>Items: ' + meal.items.length : ''}
      </div>
      <div class="meal-item-actions">
        <button class="btn" onclick="addProductToMealUI('${meal.id}')">Add Product</button>
        <button class="btn btn-danger" onclick="deleteMeal('${meal.id}')">Delete</button>
      </div>
    </div>`;
  }
  mealListDiv.innerHTML = html;
}

// Create Meal
document.getElementById('createMealBtn').addEventListener('click', async () => {
  const name = document.getElementById('mealName').value;
  const date = document.getElementById('mealDate').value;
  
  if (!name || !date) {
    alert('Please enter meal name and date');
    return;
  }
  
  const id = await createMeal(name, date);
  currentMealId = id;
  document.getElementById('mealName').value = '';
  await loadMeals();
});

// Add Product to Meal
async function addProductToMealUI(mealId) {
  const productId = prompt('Enter product ID to add:');
  if (!productId) return;
  
  const amount = parseFloat(prompt('Enter amount:'));
  if (isNaN(amount)) return;
  
  const unit = prompt('Enter unit (g, ml, etc.):') || 'g';
  
  try {
    await addProductToMeal(mealId, productId, amount, unit);
    alert('Product added to meal!');
    await loadMeals();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Delete Meal
async function deleteMeal(mealId) {
  if (!confirm('Are you sure you want to delete this meal?')) return;
  await deleteMeal(mealId);
  await loadMeals();
}

// Delete Product
async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  await deleteProduct(productId);
  await loadProducts();
}

// Save Product from Scan
document.getElementById('saveProductBtn').addEventListener('click', async () => {
  if (!currentScanData) return;
  
  const name = prompt('Enter product name:') || 'Scanned Product';
  const brand = prompt('Enter brand (optional):') || '';
  
  const product = {
    name,
    brand,
    servingSize: currentScanData.servingSize || { amount: 100, unit: 'g' },
    energy: currentScanData.energy,
    fat: currentScanData.fat,
    saturatedFat: currentScanData.saturatedFat,
    carbs: currentScanData.carbs,
    sugars: currentScanData.sugars,
    protein: currentScanData.protein,
    salt: currentScanData.salt,
    per100g: currentScanData.per100g
  };
  
  await saveProduct(product);
  alert('Product saved!');
  await loadProducts();
});

// Set default date
function setDefaultDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('mealDate').value = today;
}

// Make functions available globally for onclick handlers
window.deleteProduct = deleteProduct;
window.deleteMeal = deleteMeal;
window.addProductToMealUI = addProductToMealUI;