/**
 * Frontend JavaScript for Nutrition Tracker
 * Handles UI interactions, photo upload, product management, meal planning, and nutrition display.
 */

// State management
let currentMealId = null;

// Tab navigation
function showTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove active class from all tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected tab
  document.getElementById(`${tabName}-tab`).classList.add('active');
  
  // Add active class to clicked tab
  event.target.classList.add('active');
  
  // Refresh data for the selected tab
  if (tabName === 'products') {
    loadProducts();
  } else if (tabName === 'meals') {
    loadMeals();
  } else if (tabName === 'summary') {
    loadSummary();
  }
}

// Modal management
function showAddProductModal() {
  document.getElementById('addProductModal').classList.remove('hidden');
}

function showCreateMealModal() {
  document.getElementById('createMealModal').classList.remove('hidden');
  // Set default date to today
  document.getElementById('mealDate').value = new Date().toISOString().split('T')[0];
}

function showAddProductToMealModal(mealId) {
  currentMealId = mealId;
  document.getElementById('currentMealId').value = mealId;
  document.getElementById('addProductToMealModal').classList.remove('hidden');
  
  // Populate product dropdown
  const select = document.getElementById('mealProductSelect');
  select.innerHTML = '<option value="">Select a product</option>';
  
  // Get products from localStorage
  const products = JSON.parse(localStorage.getItem('nutrition_tracker_products') || '[]');
  products.forEach(product => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = `${product.name} (${product.brand})`;
    select.appendChild(option);
  });
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

// Image upload handling
async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Show loading
  document.getElementById('scanLoading').classList.remove('hidden');
  document.getElementById('scanResult').classList.add('hidden');
  document.getElementById('scanError').classList.add('hidden');
  
  try {
    // Convert file to base64
    const base64 = await readFileAsBase64(file);
    
    // In a real app, this would call the OCR API
    // For now, we'll simulate with mock data
    const nutritionData = await simulateOCR(base64);
    
    // Show result
    displayScanResult(nutritionData);
  } catch (error) {
    showError('Failed to scan image: ' + error.message);
  } finally {
    document.getElementById('scanLoading').classList.add('hidden');
  }
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function simulateOCR(base64Data) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock nutrition data based on image hash
  let hash = 0;
  for (let i = 0; i < base64Data.length; i++) {
    hash = ((hash << 5) - hash) + base64Data.charCodeAt(i);
    hash = hash & hash;
  }
  
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

function displayScanResult(nutritionData) {
  const resultDiv = document.getElementById('scanResult');
  resultDiv.classList.remove('hidden');
  resultDiv.innerHTML = `
    <div class="success">
      <h3>Scan Complete!</h3>
      <p>Energy: ${nutritionData.energy.kcal} kcal / ${nutritionData.energy.kj} kJ</p>
      <p>Serving Size: ${nutritionData.servingSize.amount} ${nutritionData.servingSize.unit}</p>
      <button class="btn btn-secondary" onclick="saveScannedProduct()" style="margin-top: 10px;">Save Product</button>
    </div>
  `;
  
  // Store the scanned data for saving
  window.scannedProduct = nutritionData;
}

function showError(message) {
  const errorDiv = document.getElementById('scanError');
  errorDiv.classList.remove('hidden');
  errorDiv.textContent = message;
}

// Product management
async function handleAddProduct(event) {
  event.preventDefault();
  
  const product = {
    name: document.getElementById('productName').value,
    brand: document.getElementById('productBrand').value,
    servingSize: {
      amount: parseInt(document.getElementById('servingAmount').value),
      unit: document.getElementById('servingUnit').value
    },
    energy: {
      kcal: parseInt(document.getElementById('energyKcal').value),
      kj: parseInt(document.getElementById('energyKj').value)
    },
    fat: parseFloat(document.getElementById('fat').value),
    saturatedFat: parseFloat(document.getElementById('saturatedFat').value),
    carbs: parseFloat(document.getElementById('carbs').value),
    sugars: parseFloat(document.getElementById('sugars').value),
    protein: parseFloat(document.getElementById('protein').value),
    salt: parseFloat(document.getElementById('salt').value),
    per100g: {
      energy: {
        kcal: parseInt(document.getElementById('energyKcal').value),
        kj: parseInt(document.getElementById('energyKj').value)
      },
      fat: parseFloat(document.getElementById('fat').value),
      saturatedFat: parseFloat(document.getElementById('saturatedFat').value),
      carbs: parseFloat(document.getElementById('carbs').value),
      sugars: parseFloat(document.getElementById('sugars').value),
      protein: parseFloat(document.getElementById('protein').value),
      salt: parseFloat(document.getElementById('salt').value)
    }
  };
  
  // Save product to localStorage
  const products = JSON.parse(localStorage.getItem('nutrition_tracker_products') || '[]');
  product.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  products.push(product);
  localStorage.setItem('nutrition_tracker_products', JSON.stringify(products));
  
  closeModal('addProductModal');
  event.target.reset();
  loadProducts();
}

function saveScannedProduct() {
  if (!window.scannedProduct) return;
  
  const product = {
    name: 'Scanned Product',
    brand: '',
    servingSize: window.scannedProduct.servingSize,
    energy: window.scannedProduct.energy,
    fat: window.scannedProduct.fat,
    saturatedFat: window.scannedProduct.saturatedFat,
    carbs: window.scannedProduct.carbs,
    sugars: window.scannedProduct.sugars,
    protein: window.scannedProduct.protein,
    salt: window.scannedProduct.salt,
    per100g: window.scannedProduct.per100g
  };
  
  // Save product to localStorage
  const products = JSON.parse(localStorage.getItem('nutrition_tracker_products') || '[]');
  product.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  products.push(product);
  localStorage.setItem('nutrition_tracker_products', JSON.stringify(products));
  
  window.scannedProduct = null;
  document.getElementById('scanResult').classList.add('hidden');
  loadProducts();
}

function loadProducts() {
  const products = JSON.parse(localStorage.getItem('nutrition_tracker_products') || '[]');
  const productList = document.getElementById('productList');
  
  if (products.length === 0) {
    productList.innerHTML = `
      <li class="product-item">
        <div class="product-info">
          <div class="product-name">No products yet</div>
          <div class="product-brand">Scan a label or add manually</div>
        </div>
      </li>
    `;
    return;
  }
  
  productList.innerHTML = products.map(product => `
    <li class="product-item">
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-brand">${product.brand || 'No brand'} • ${product.servingSize.amount}${product.servingSize.unit}</div>
        <div class="product-brand">${product.energy.kcal} kcal per serving</div>
      </div>
      <div class="actions">
        <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
      </div>
    </li>
  `).join('');
}

function deleteProduct(productId) {
  let products = JSON.parse(localStorage.getItem('nutrition_tracker_products') || '[]');
  products = products.filter(p => p.id !== productId);
  localStorage.setItem('nutrition_tracker_products', JSON.stringify(products));
  loadProducts();
}

// Meal management
async function handleCreateMeal(event) {
  event.preventDefault();
  
  const meal = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
    name: document.getElementById('mealName').value,
    date: document.getElementById('mealDate').value,
    items: []
  };
  
  // Save meal to localStorage
  const meals = JSON.parse(localStorage.getItem('nutrition_tracker_meals') || '[]');
  meals.push(meal);
  localStorage.setItem('nutrition_tracker_meals', JSON.stringify(meals));
  
  closeModal('createMealModal');
  event.target.reset();
  loadMeals();
}

function loadMeals() {
  const meals = JSON.parse(localStorage.getItem('nutrition_tracker_meals') || '[]');
  const mealList = document.getElementById('mealList');
  
  if (meals.length === 0) {
    mealList.innerHTML = '<p style="color: #666; text-align: center;">No meals created yet</p>';
    return;
  }
  
  mealList.innerHTML = meals.map(meal => `
    <div class="meal-item">
      <div class="meal-info">
        <div class="meal-name">${meal.name}</div>
        <div class="meal-date">${meal.date}</div>
        <div class="meal-date">${meal.items.length} items</div>
      </div>
      <div class="actions">
        <button class="btn btn-secondary" onclick="showAddProductToMealModal('${meal.id}')">Add Product</button>
        <button class="btn btn-danger" onclick="deleteMeal('${meal.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

async function handleAddProductToMeal(event) {
  event.preventDefault();
  
  const mealId = document.getElementById('currentMealId').value;
  const productId = document.getElementById('mealProductSelect').value;
  const amount = parseFloat(document.getElementById('mealAmount').value);
  const unit = document.getElementById('mealUnit').value;
  
  if (!mealId || !productId) {
    alert('Please select a meal and product');
    return;
  }
  
  // Get product details
  const products = JSON.parse(localStorage.getItem('nutrition_tracker_products') || '[]');
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    alert('Product not found');
    return;
  }
  
  // Calculate nutrition for the amount
  const ratio = amount / (product.servingSize?.amount || 100);
  const nutrition = {
    energy: {
      kcal: product.energy.kcal * ratio,
      kj: product.energy.kj * ratio
    },
    fat: product.fat * ratio,
    saturatedFat: product.saturatedFat * ratio,
    carbs: product.carbs * ratio,
    sugars: product.sugars * ratio,
    protein: product.protein * ratio,
    salt: product.salt * ratio
  };
  
  // Add to meal
  const meals = JSON.parse(localStorage.getItem('nutrition_tracker_meals') || '[]');
  const mealIndex = meals.findIndex(m => m.id === mealId);
  
  if (mealIndex === -1) {
    alert('Meal not found');
    return;
  }
  
  meals[mealIndex].items.push({
    productId,
    amount,
    unit,
    nutrition,
    productName: product.name
  });
  
  localStorage.setItem('nutrition_tracker_meals', JSON.stringify(meals));
  
  closeModal('addProductToMealModal');
  loadMeals();
  loadSummary();
}

function deleteMeal(mealId) {
  let meals = JSON.parse(localStorage.getItem('nutrition_tracker_meals') || '[]');
  meals = meals.filter(m => m.id !== mealId);
  localStorage.setItem('nutrition_tracker_meals', JSON.stringify(meals));
  loadMeals();
  loadSummary();
}

// Nutrition summary
function loadSummary() {
  const meals = JSON.parse(localStorage.getItem('nutrition_tracker_meals') || '[]');
  
  let totalKcal = 0;
  let totalFat = 0;
  let totalSaturatedFat = 0;
  let totalCarbs = 0;
  let totalSugars = 0;
  let totalProtein = 0;
  let totalSalt = 0;
  
  meals.forEach(meal => {
    meal.items.forEach(item => {
      if (item.nutrition) {
        totalKcal += item.nutrition.energy.kcal || 0;
        totalFat += item.nutrition.fat || 0;
        totalSaturatedFat += item.nutrition.saturatedFat || 0;
        totalCarbs += item.nutrition.carbs || 0;
        totalSugars += item.nutrition.sugars || 0;
        totalProtein += item.nutrition.protein || 0;
        totalSalt += item.nutrition.salt || 0;
      }
    });
  });
  
  // Update summary display
  const summaryDiv = document.getElementById('nutritionSummary');
  summaryDiv.innerHTML = `
    <div class="nutrition-card">
      <div class="value">${Math.round(totalKcal)}</div>
      <div class="label">kcal</div>
    </div>
    <div class="nutrition-card">
      <div class="value">${totalFat.toFixed(1)}g</div>
      <div class="label">Fat</div>
    </div>
    <div class="nutrition-card">
      <div class="value">${totalSaturatedFat.toFixed(1)}g</div>
      <div class="label">Saturated Fat</div>
    </div>
    <div class="nutrition-card">
      <div class="value">${totalCarbs.toFixed(1)}g</div>
      <div class="label">Carbs</div>
    </div>
    <div class="nutrition-card">
      <div class="value">${totalSugars.toFixed(1)}g</div>
      <div class="label">Sugars</div>
    </div>
    <div class="nutrition-card">
      <div class="value">${totalProtein.toFixed(1)}g</div>
      <div class="label">Protein</div>
    </div>
    <div class="nutrition-card">
      <div class="value">${totalSalt.toFixed(2)}g</div>
      <div class="label">Salt</div>
    </div>
  `;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadMeals();
  loadSummary();
});