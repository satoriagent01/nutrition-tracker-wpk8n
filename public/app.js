/**
 * Frontend JavaScript for the Nutrition Tracker app.
 * Handles UI interactions, photo upload, product/meal management.
 */

import { extractNutrition } from '../src/ocr.js';
import { saveProduct, getProduct, getAllProducts, deleteProduct } from '../src/products.js';
import { createMeal, addProductToMeal, getMeal, getAllMeals, deleteMeal } from '../src/meals.js';
import { calculateNutrition, calculateMealTotal } from '../src/nutrition.js';
import { saveConfig, getConfig } from '../src/config.js';

// State
let currentPhotoData = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadConfig();
  loadProducts();
  loadMeals();
  document.getElementById('mealDate').valueAsDate = new Date();
});

// Tab switching
function showTab(tabName) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  
  event.target.classList.add('active');
  document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Photo upload handling
async function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const previewImg = document.getElementById('previewImg');
    previewImg.src = e.target.result;
    document.getElementById('photoPreview').classList.remove('hidden');

    try {
      // Convert to base64
      const base64Data = e.target.result.split(',')[1];
      currentPhotoData = base64Data;
      
      // Try to extract nutrition data using AI
      const result = await extractNutrition(base64Data);
      
      // Fill in the form with extracted data
      if (result.energy) {
        document.getElementById('energyKcal').value = result.energy.kcal || '';
        document.getElementById('energyKj').value = result.energy.kj || '';
      }
      if (result.fat !== undefined) document.getElementById('fat').value = result.fat;
      if (result.saturatedFat !== undefined) document.getElementById('saturatedFat').value = result.saturatedFat;
      if (result.carbs !== undefined) document.getElementById('carbs').value = result.carbs;
      if (result.sugars !== undefined) document.getElementById('sugars').value = result.sugars;
      if (result.protein !== undefined) document.getElementById('protein').value = result.protein;
      if (result.salt !== undefined) document.getElementById('salt').value = result.salt;
      if (result.servingSize) {
        document.getElementById('servingAmount').value = result.servingSize.amount || '';
        document.getElementById('servingUnit').value = result.servingSize.unit || 'g';
      }
    } catch (error) {
      console.error('Failed to extract nutrition data:', error);
      alert('Could not extract nutrition data. Please fill in manually.');
    }
  };
  reader.readAsDataURL(file);
}

// Product management
async function saveProduct() {
  const product = {
    name: document.getElementById('productName').value,
    brand: document.getElementById('productBrand').value,
    servingSize: {
      amount: parseFloat(document.getElementById('servingAmount').value) || 100,
      unit: document.getElementById('servingUnit').value || 'g'
    },
    energy: {
      kcal: parseFloat(document.getElementById('energyKcal').value) || 0,
      kj: parseFloat(document.getElementById('energyKj').value) || 0
    },
    fat: parseFloat(document.getElementById('fat').value) || 0,
    saturatedFat: parseFloat(document.getElementById('saturatedFat').value) || 0,
    carbs: parseFloat(document.getElementById('carbs').value) || 0,
    sugars: parseFloat(document.getElementById('sugars').value) || 0,
    protein: parseFloat(document.getElementById('protein').value) || 0,
    salt: parseFloat(document.getElementById('salt').value) || 0,
    per100g: {
      energy: {
        kcal: parseFloat(document.getElementById('energyKcal').value) || 0,
        kj: parseFloat(document.getElementById('energyKj').value) || 0
      },
      fat: parseFloat(document.getElementById('fat').value) || 0,
      saturatedFat: parseFloat(document.getElementById('saturatedFat').value) || 0,
      carbs: parseFloat(document.getElementById('carbs').value) || 0,
      sugars: parseFloat(document.getElementById('sugars').value) || 0,
      protein: parseFloat(document.getElementById('protein').value) || 0,
      salt: parseFloat(document.getElementById('salt').value) || 0
    }
  };

  const id = await saveProduct(product);
  alert(`Product saved with ID: ${id}`);
  loadProducts();
  clearProductForm();
}

function clearProductForm() {
  document.getElementById('productName').value = '';
  document.getElementById('productBrand').value = '';
  document.getElementById('servingAmount').value = '';
  document.getElementById('servingUnit').value = '';
  document.getElementById('energyKcal').value = '';
  document.getElementById('energyKj').value = '';
  document.getElementById('fat').value = '';
  document.getElementById('saturatedFat').value = '';
  document.getElementById('carbs').value = '';
  document.getElementById('sugars').value = '';
  document.getElementById('protein').value = '';
  document.getElementById('salt').value = '';
  document.getElementById('photoPreview').classList.add('hidden');
  currentPhotoData = null;
}

async function loadProducts() {
  const products = getAllProducts();
  const list = document.getElementById('productList');
  list.innerHTML = '';

  products.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product-item';
    div.innerHTML = `
      <strong>${product.name}</strong> (${product.brand})
      <br>Serving: ${product.servingSize.amount}${product.servingSize.unit}
      <br>Energy: ${product.energy.kcal} kcal
      <button class="btn btn-danger" onclick="deleteProduct('${product.id}')" style="margin-left: 10px;">Delete</button>
    `;
    list.appendChild(div);
  });
}

// Meal management
async function createMeal() {
  const name = document.getElementById('mealName').value;
  const date = document.getElementById('mealDate').value;
  
  if (!name) {
    alert('Please enter a meal name');
    return;
  }

  const id = await createMeal(name, date);
  alert(`Meal created with ID: ${id}`);
  loadMeals();
  document.getElementById('mealName').value = '';
}

async function addProductToMeal(mealId, productId, amount, unit) {
  try {
    const item = await addProductToMeal(mealId, productId, amount, unit);
    loadMeals();
  } catch (error) {
    alert('Error adding product to meal: ' + error.message);
  }
}

async function loadMeals() {
  const meals = getAllMeals();
  const container = document.getElementById('mealsList');
  container.innerHTML = '';

  for (const meal of meals) {
    const mealDiv = document.createElement('div');
    mealDiv.className = 'section';
    mealDiv.innerHTML = `
      <h3>${meal.name} (${meal.date})</h3>
      <div class="add-product-form">
        <h4>Add Product</h4>
        <select id="productSelect-${meal.id}">
          <option value="">Select a product...</option>
        </select>
        <div class="form-row">
          <input type="number" id="amount-${meal.id}" placeholder="Amount">
          <input type="text" id="unit-${meal.id}" placeholder="Unit (g/ml)" value="g">
        </div>
        <button class="btn" onclick="addProductToMeal('${meal.id}', 
          document.getElementById('productSelect-${meal.id}').value,
          document.getElementById('amount-${meal.id}').value,
          document.getElementById('unit-${meal-id}').value)">Add to Meal</button>
      </div>
      <div id="meal-items-${meal.id}"></div>
      <div id="meal-summary-${meal.id}"></div>
      <button class="btn btn-danger" onclick="deleteMeal('${meal.id}')" style="margin-top: 10px;">Delete Meal</button>
    `;
    container.appendChild(mealDiv);

    // Populate product select
    const products = getAllProducts();
    const select = document.getElementById(`productSelect-${meal.id}`);
    products.forEach(product => {
      const option = document.createElement('option');
      option.value = product.name;
      option.textContent = product.name;
      select.appendChild(option);
    });

    // Update meal items and summary
    updateMealDisplay(meal);
  }
}

async function updateMealDisplay(meal) {
  const products = getAllProducts();
  const itemsDiv = document.getElementById(`meal-items-${meal.id}`);
  const summaryDiv = document.getElementById(`meal-summary-${meal.id}`);
  
  if (!itemsDiv || !summaryDiv) return;

  itemsDiv.innerHTML = '';
  meal.items.forEach(item => {
    const product = products.find(p => p.name === item.productId);
    const nutrition = product ? calculateNutrition(product, item.amount, item.unit) : null;
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'product-item';
    itemDiv.innerHTML = `
      <strong>${item.productId}</strong> - ${item.amount}${item.unit}
      ${nutrition ? `<br>Energy: ${nutrition.energy.kcal} kcal` : ''}
    `;
    itemsDiv.appendChild(itemDiv);
  });

  // Calculate and display meal total
  const total = calculateMealTotal(meal, products);
  summaryDiv.innerHTML = `
    <div class="meal-summary">
      <h4>Meal Total</h4>
      <div class="nutrition-grid">
        <div class="nutrition-item">
          <div class="nutrition-value">${Math.round(total.energy.kcal)}</div>
          <div class="nutrition-label">kcal</div>
        </div>
        <div class="nutrition-item">
          <div class="nutrition-value">${total.fat.toFixed(1)}</div>
          <div class="nutrition-label">Fat (g)</div>
        </div>
        <div class="nutrition-item">
          <div class="nutrition-value">${total.saturatedFat.toFixed(1)}</div>
          <div class="nutrition-label">Sat. Fat (g)</div>
        </div>
        <div class="nutrition-item">
          <div class="nutrition-value">${total.carbs.toFixed(1)}</div>
          <div class="nutrition-label">Carbs (g)</div>
        </div>
        <div class="nutrition-item">
          <div class="nutrition-value">${total.sugars.toFixed(1)}</div>
          <div class="nutrition-label">Sugars (g)</div>
        </div>
        <div class="nutrition-item">
          <div class="nutrition-value">${total.protein.toFixed(1)}</div>
          <div class="nutrition-label">Protein (g)</div>
        </div>
        <div class="nutrition-item">
          <div class="nutrition-value">${total.salt.toFixed(2)}</div>
          <div class="nutrition-label">Salt (g)</div>
        </div>
      </div>
    </div>
  `;
}

// Config management
function loadConfig() {
  const config = getConfig();
  document.getElementById('aiEndpoint').value = config.aiEndpoint || '';
  document.getElementById('aiApiKey').value = config.aiApiKey || '';
  document.getElementById('defaultUnit').value = config.defaultUnit || 'g';
  document.getElementById('customNutrients').value = (config.customNutrients || []).join(', ');
}

async function saveConfig() {
  const config = {
    aiEndpoint: document.getElementById('aiEndpoint').value,
    aiApiKey: document.getElementById('aiApiKey').value,
    defaultUnit: document.getElementById('defaultUnit').value,
    customNutrients: document.getElementById('customNutrients').value.split(',').map(s => s.trim()).filter(s => s)
  };

  await saveConfig(config);
  alert('Configuration saved!');
}

// Make functions available globally for onclick handlers
window.showTab = showTab;
window.handlePhotoUpload = handlePhotoUpload;
window.saveProduct = saveProduct;
window.createMeal = createMeal;
window.addProductToMeal = addProductToMeal;
window.saveConfig = saveConfig;