# Nutrition Tracker

A free, ad-free nutrition tracker that allows users to photograph product nutrition labels, extract nutritional information using AI-powered OCR, store products in a personal database, and create custom meal plans by specifying gram amounts of each product.

## Features

- **Photo Scanning & OCR**: Upload photos of nutrition labels and extract nutritional information using AI
- **Product Database**: Store and manage your food products with detailed nutrition data
- **Meal Planning**: Create meals and add products with custom amounts to calculate total nutrition
- **Custom Tracking**: Track any nutrient with flexible custom nutrient definitions

## Setup

### Prerequisites

- Node.js 24+ (for running tests)
- A modern web browser (for the UI)

### Running the App

Simply open `public/index.html` in a web browser. No build step or server required.

### Running Tests

```bash
npm test
```

## Configuration

### AI Endpoint

To use the OCR feature with a real AI model, configure your AI endpoint in the app settings:

- **AI Endpoint**: URL of your OpenAI-compatible API endpoint (e.g., `https://api.openai.com/v1/chat/completions`)
- **API Key**: Your API key for the endpoint

The app uses an OpenAI-compatible API (like GPT-4 Vision) to extract nutrition data from images. If no endpoint is configured, the app uses mock data for testing purposes.

### Custom Nutrients

You can define custom nutrients to track beyond the standard ones (energy, fat, saturated fat, carbs, sugars, protein, salt).

## How It Works

1. **Scan a Label**: Upload a photo of a nutrition label. The app extracts:
   - Energy (kcal and kJ)
   - Fat, saturated fat
   - Carbohydrates, sugars
   - Protein, salt
   - Serving size information

2. **Save Products**: Save extracted products to your personal database with all nutrition details.

3. **Plan Meals**: Create meals and add products with custom amounts (in grams, milliliters, etc.). The app automatically calculates the nutrition based on the amount relative to the serving size.

4. **View Summary**: See total nutrition for your meals at a glance.

## Not Yet Implemented

- Real AI OCR integration (currently uses mock data when no endpoint is configured)
- Multi-language label support (English labels only in mock mode)
- Nutrient conversion between different units
- Daily/weekly nutrition goals and tracking
- Export/import of product database
- User authentication and cloud sync

## Project Structure

```
├── src/
│   ├── storage.js    # Unified storage abstraction (localStorage/Map)
│   ├── ocr.js        # OCR extraction module
│   ├── products.js   # Product database CRUD
│   ├── meals.js      # Meal planning
│   ├── nutrition.js  # Nutrition calculation
│   └── config.js     # User configuration
├── public/
│   ├── index.html    # Main UI page
│   └── app.js        # Frontend JavaScript
├── tests/            # Test files
└── docs/
    └── SPEC.md       # Product specification
```

## License

Free and open source. No ads, no tracking.