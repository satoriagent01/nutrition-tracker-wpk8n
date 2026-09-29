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
  loadConfig();
  loadProducts();
  loadMeals();
  setDefaultDate();
  setupDragAndDrop();
});

// Configuration
function loadConfig() {
  const config = getConfig();
  if (config) {
    document.getElementById('aiEndpoint').value = config.aiEndpoint || '';
    document.getElementById('apiKey').value = config.apiKey || '';
  }
}

function saveConfig() {
  const endpoint = document.getElementById('aiEndpoint').value;
  const apiKey = document.getElementById('apiKey').value;
  saveConfigModule({ aiEndpoint: endpoint, apiKey });
  alert('Configuration saved!');
}

// File Upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64Data = e.target.result.split(',')[1];
    const config = getConfig();
    
    try {
      const result = await extractNutrition(base64Data, config);
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
  
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#2c7a2c';
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#ccc';
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ccc';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const input = document.getElementById('fileInput');
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      handleFileUpload({ target: input });
    }
  });
}

function displayScanResult(data) {
  const resultDiv = document.getElementById('scanResult');
  const outputDiv = document.getElementById('scanOutput');
  
  outputDiv.innerHTML = `
    <div class="nutrition-grid">
      <div class="nutrition-item">
        <div class="value">${data.energy}</div>
        <div class="label">kcal</div>
      </div>
      <div class="nutrition-item">
        <div class="value">${data.fat}g</div>
        <div class="label">Fat</div>
      </div>
      <div class="nutrition-item">
        <div class="value">${data.saturatedFat}g</div>
        <div class="label">Sat. Fat</div>
      </div>
      <div class="nutrition-item">
        <div class="value">${data.carbs}g</div>
        <div class="label">Carbs</div>
      </div>
      <div class="nutrition-item">
        <div class="value">${data.sugars}g</div>
        <div class="label">Sugars</div>
      </div>
      <div class="nutrition-item">
        <div class="value">${data.protein}g</div>
        <div class="label">Protein</div>
      </div>
      <div class="nutrition-item">
        <div class="value">${data.salt}g</div>
        <div class="label">Salt</div>
      </div>
    </div>
    <p style="margin-top: 10px; font-size: 12px; color: #666;">
      Serving: ${data.servingSize} ${data.servingUnit}
    </p>
  `;
  
  resultDiv.classList.remove('hidden');
}

function saveScannedProduct() {
  if (!currentScanData) return;
  
  const product = {
    name: 'Scanned Product',
    brand: '',
    servingSize: currentScanData.servingSize,
    servingUnit: currentScanData.servingUnit,
    nutritionPerServing: {
      energy: currentScanData.energy,
      fat: currentScanData.fat,
      saturatedFat: currentScanData.saturatedFat,
      carbs: currentScanData.carbs,
      sugars: currentScanData.sugars,
      protein: currentScanData.protein,
      salt: currentScanData.salt
    }
  };
  
  saveProduct(product);
  alert('Product saved!');
  loadProducts();
  currentScanData = null;
  document.getElementById('scanResult').classList.add('hidden');
}

// Product Management
function showAddProductForm() {
  document.getElementById('addProductForm').classList.remove('hidden');
}

function hideAddProductForm() {
  document.getElementById('addProductForm').classList.add('hidden');
}

function addProduct() {
  const product = {
    name: document.getElementById('productName').value,
    brand: document.getElementById('productBrand').value,
    servingSize: parseFloat(document.getElementById('productServingSize').value) || 100,
    servingUnit: document.getElementById('productServingUnit').value,
    nutritionPerServing: {
      energy: parseFloat(document.getElementById('productEnergy').value) || 0,
      fat: parseFloat(document.getElementById('productFat').value) || 0,
      saturatedFat: parseFloat(document.getElementById('productSaturatedFat').value) || 0,
      carbs: parseFloat(document.getElementById('productCarbs').value) || 0,
      sugars: parseFloat(document.getElementById('productSugars').value) || 0,
      protein: parseFloat(document.getElementById('productProtein').value) || 0,
      salt: parseFloat(document.getElementById('productSalt').value) || 0
    }
  };
  
  saveProduct(product);
  hideAddProductForm();
  loadProducts();
  
  // Clear form
  document.getElementById('productName').value = '';
  document.getElementById('productBrand').value = '';
  document.getElementById('productEnergy').value = '0';
  document.getElementById('productFat').value = '0';
  document.getElementById('productSaturatedFat').value = '0';
  document.getElementById('productCarbs').value = '0';
  document.getElementById('productSugars').value = '0';
  document.getElementById('productProtein').value = '0';
  document.getElementById('productSalt').value = '0';
}

function loadProducts() {
  const products = getAllProducts();
  const listDiv = document.getElementById('productList');
  
  if (products.length === 0) {
    listDiv.innerHTML = '<p>No products yet. Scan a label or add manually.</p>';
    return;
  }
  
  listDiv.innerHTML = products.map(p => `
    <div class="product-item">
      <strong>${p.name}</strong> ${p.brand ? '(' + p.brand + ')' : ''}
      <br><small>Serving: ${p.servingSize} ${p.servingUnit}</small>
      <br><small>
        ${p.nutritionPerServing.energy} kcal | 
        Fat: ${p.nutritionPerServing.fat}g | 
        Carbs: ${p.nutritionPerServing.carbs}g | 
        Protein: ${p.nutritionPerServing.protein}g
      </small>
      <button class="btn btn-danger" style="float: right; padding: 2px 8px; font-size: 12px;" 
              onclick="deleteProduct('${p.id}')">Delete</button>
    </div>
  `).join('');
}

// Meal Management
function setDefaultDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('mealDate').value = today;
}

function createMeal() {
  const name = document.getElementById('mealName').value;
  const date = document.getElementById('mealDate').value;
  
  if (!name) {
    alert('Please enter a meal name');
    return;
  }
  
  const mealId = createMealModule(name, date);
  currentMealId = mealId;
  alert('Meal created!');
  loadMeals();
  document.getElementById('mealName').value = '';
}

function addProductToMeal(productId) {
  const amount = prompt('Enter amount (in serving units):');
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    alert('Invalid amount');
    return;
  }
  
  addProductToMealModule(currentMealId, productId, parseFloat(amount), 'serving');
  loadMeals();
  updateNutritionSummary();
}

function loadMeals() {
  const meals = getAllMeals();
  const listDiv = document.getElementById('mealList');
  
  if (meals.length === 0) {
    listDiv.innerHTML = '<p>No meals yet.</p>';
    return;
  }
  
  listDiv.innerHTML = meals.map(m => `
    <div class="meal-item" onclick="selectMeal('${m.id}')" style="cursor: pointer;">
      <strong>${m.name}</strong> - ${m.date}
      <br><small>${m.items.length} item(s)</small>
      <button class="btn btn-danger" style="float: right; padding: 2px 8px; font-size: 12px;" 
              onclick="event.stopPropagation(); deleteMeal('${m.id}'); loadMeals(); updateNutritionSummary();">Delete</button>
    </div>
  `).join('');
}

function selectMeal(mealId) {
  currentMealId = mealId;
  const meal = getMeal(mealId);
  if (meal) {
    // Show items in the meal
    const itemsDiv = document.createElement('div');
    itemsDiv.innerHTML = meal.items.map(item => {
      // Find product name
      const products = getAllProducts();
      const product = products.find(p => p.id === item.productId);
      return `<div style="padding: 5px 0; border-bottom: 1px solid #eee;">
        ${product ? product.name : 'Unknown'} - ${item.amount} ${item.unit}
        <br><small>
          ${item.nutrition.energy} kcal | 
          Fat: ${item.nutrition.fat}g | 
          Carbs: ${item.nutrition.carbs}g | 
          Protein: ${item.nutrition.protein}g
        </small>
      </div>`;
    }).join('');
    
    // Add nutrition summary
    const total = calculateMealTotal(meal);
    itemsDiv.innerHTML += `
      <div style="margin-top: 10px; padding: 10px; background: #e8f5e9; border-radius: 4px;">
        <strong>Total:</strong> ${total.energy} kcal | 
        Fat: ${total.fat}g | 
        Saturated Fat: ${total.saturatedFat}g | 
        Carbs: ${total.carbs}g | 
        Sugars: ${total.sugars}g | 
        Protein: ${total.protein}g | 
        Salt: ${total.salt}g
      </div>
    `;
    
    // Add product selector
    const products = getAllProducts();
    if (products.length > 0) {
      itemsDiv.innerHTML += `
        <div style="margin-top: 10px;">
          <select id="mealProductSelect">
            ${products.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
          </select>
          <button class="btn" onclick="addProductToMeal('${mealId}')">Add Product</button>
        </div>
      `;
    }
    
    // Remove existing items display
    const existing = document.getElementById('mealItems');
    if (existing) existing.remove();
    
    itemsDiv.id = 'mealItems';
    document.getElementById('mealList').appendChild(itemsDiv);
    
    updateNutritionSummary();
  }
}

function updateNutritionSummary() {
  const summaryDiv = document.getElementById('nutritionSummary');
  
  if (!currentMealId) {
    summaryDiv.innerHTML = '<p>Select a meal to see nutrition summary.</p>';
    return;
  }
  
  const meal = getMeal(currentMealId);
  if (!meal) {
    summaryDiv.innerHTML = '<p>Meal not found.</p>';
    return;
  }
  
  const total = calculateMealTotal(meal);
  
  summaryDiv.innerHTML = `
    <h3>${meal.name} - ${meal.date}</h3>
    <div class="nutrition-grid">
      <div class="nutrition-item">
        <div class="value">${total.energy}</div>
        <div class="label">kcal</div>
      </div>
      <div class="nutrition-item">
        <div class="value">${total.fat}g</div>
        <div class="label">Fat</div>
      </div>
      <div class="nutrition-item">
        <div class="value">${total.saturatedFat}g</div>
        <div class="label">Sat. Fat</div>
      </div>
      <div class="nutrition-item">
        <div class="value">${total.carbs}g</div>
        <div class="label">Carbs</div>
      </div>
      <div class="nutrition-item">
        <div class="value">${total.sugars}g</div>
        <div class="label">Sugars</div>
      </div>
      <div class="nutrition-item">
        <div class="value">${total.protein}g</div>
        <div class="label">Protein</div>
      </div>
      <div class="nutrition-item">
        <div class="value">${total.salt}g</div>
        <div class="label">Salt</div>
      </div>
    </div>
  `;
}

// Expose functions to global scope for HTML onclick handlers
window.saveConfig = saveConfig;
window.handleFileUpload = handleFileUpload;
window.saveScannedProduct = saveScannedProduct;
window.showAddProductForm = showAddProductForm;
window.hideAddProductForm = hideAddProductForm;
window.addProduct = addProduct;
window.createMeal = createMeal;
window.addProductToMeal = addProductToMeal;
window.deleteProduct = deleteProduct;
window.deleteMeal = deleteMeal;
window.selectMeal = selectMeal;