# Nutrition Tracker

A free, ad-free nutrition tracker that allows users to photograph product nutrition labels, extract nutritional information using AI-powered OCR, store products in a personal database, and create custom meal plans by specifying gram amounts of each product.

## Features

- **Photo Scanning & OCR**: Upload photos of nutrition labels and extract nutritional information using AI
- **Product Database**: Store extracted products with their nutritional information
- **Meal Planning**: Create meals and add products with custom gram amounts
- **Nutrition Calculation**: Automatically calculate total nutrition based on amounts
- **Custom Tracking**: Track any nutrient with custom nutrient definitions

## Setup

### Prerequisites

- Node.js 24+
- A modern web browser

### Installation

```bash
npm install
```

## Running the App

### Development Server

```bash
npm start
```

This starts a local development server. Open your browser and navigate to the displayed URL.

### Direct File Access

You can also open `public/index.html` directly in your browser.

## Configuration

### AI Endpoint

The app uses an OpenAI-compatible endpoint for OCR extraction. Configure it in the app settings:

- **AI Endpoint**: URL of your OCR API endpoint (e.g., `https://api.openai.com/v1/chat/completions`)
- **AI API Key**: Your API key for the OCR service
- **Default Unit**: Default unit for amounts (grams, ml, pieces)
- **Custom Nutrients**: Additional nutrients to track (e.g., sodium, fiber, cholesterol)

### Storage

The app uses localStorage in the browser for persistence. In Node.js tests, an in-memory store is used.

## Testing

### Run Tests

```bash
npm test
```

The test suite covers:

- **OCR**: Nutrition label extraction
- **Products**: Product database operations (save, get, getAll)
- **Meals**: Meal planning operations (create, add product, get, getAll)
- **Nutrition**: Nutrition calculation (per-amount and meal totals)
- **Config**: User configuration management

### Test Structure

Tests are located in the `tests/` directory and use Node.js built-in test runner with ES modules.

## Architecture

### Source Files

- `src/ocr.js` - AI-powered OCR extraction for nutrition labels
- `src/products.js` - Product database management
- `src/meals.js` - Meal planning management
- `src/nutrition.js` - Nutrition calculation utilities
- `src/config.js` - User configuration management
- `src/storage.js` - Storage abstraction layer (localStorage for browser, in-memory for Node.js)

### Public Files

- `public/index.html` - Main UI page
- `public/app.js` - Frontend JavaScript

## API Reference

### OCR Module

```javascript
import { extractNutrition } from './src/ocr.js';

const nutritionData = await extractNutrition(imageData);
```

### Products Module

```javascript
import { saveProduct, getProduct, getAllProducts } from './src/products.js';

const id = await saveProduct(product);
const product = await getProduct(id);
const allProducts = await getAllProducts();
```

### Meals Module

```javascript
import { createMeal, addProductToMeal, getMeal, getAllMeals } from './src/meals.js';

const mealId = await createMeal(name, date);
await addProductToMeal(mealId, productId, amount, unit);
const meal = await getMeal(mealId);
const allMeals = await getAllMeals();
```

### Nutrition Module

```javascript
import { calculateNutrition, calculateMealTotal } from './src/nutrition.js';

const nutrition = await calculateNutrition(product, amount, unit);
const total = await calculateMealTotal(meal);
```

### Config Module

```javascript
import { saveConfig, getConfig } from './src/config.js';

await saveConfig(config);
const config = await getConfig();
```

## Not Yet Implemented

- Real AI OCR integration (currently uses mock data)
- User authentication
- Cloud sync
- Export/import data
- Advanced filtering and search
- Nutritional goal tracking
- Barcode scanning

## License

This project is free and ad-free. No license restrictions apply.