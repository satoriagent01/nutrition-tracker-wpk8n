# Nutrition Tracker

A free, ad-free nutrition tracker that lets you photograph product nutrition labels and track your dietary intake with custom meal planning.

## Features

- **Photo Scanning**: Take photos of nutrition labels to automatically extract nutritional information using AI OCR
- **Product Database**: Store and manage your favorite products with their nutritional data
- **Meal Planning**: Create custom meals by adding products with specific amounts
- **Nutrition Calculation**: Automatically calculate total nutrition based on the amounts you add to meals
- **Custom Tracking**: Track any nutrients you care about - calories, sodium, saturated fats, or anything else
- **Privacy-First**: All data stored locally in your browser. No accounts, no tracking, no ads.

## How to Use

### Running the App

Simply open `public/index.html` in a web browser. No server required for basic functionality.

For a better experience, serve the files with any static file server:

```bash
npx serve public
```

Then open `http://localhost:3000` in your browser.

### Configuring the AI Endpoint

To use the photo scanning feature, you need to configure an AI endpoint:

1. Go to the "Config" tab in the app
2. Enter your AI endpoint URL (OpenAI-compatible API)
3. Enter your API key
4. Click "Save Config"

The app uses an OpenAI-compatible endpoint. You can use:
- OpenAI's GPT-4o API
- Any compatible service like Ollama, LM Studio, or other OpenAI-compatible endpoints

### Taking Photos

1. Go to the "Products" tab
2. Click "Take Photo" to capture or upload a nutrition label
3. The AI will attempt to extract nutritional information
4. Review and edit the extracted data if needed
5. Click "Save Product" to add it to your database

### Creating Meals

1. Go to the "Meals" tab
2. Enter a meal name and date
3. Click "Create Meal"
4. Add products from your database with specific amounts
5. View the total nutrition for your meal

## Data Model

- **Product**: name, brand, serving size, nutritional values (energy, fat, saturated fat, carbs, sugars, protein, salt)
- **Meal**: name, date, list of items (product reference, amount, unit)
- **Nutrition Data**: energy (kcal/kJ), fat, saturated fat, carbs, sugars, protein, salt

## Testing

Run the test suite with:

```bash
npm test
```

The tests cover:
- OCR extraction of nutrition data
- Product database operations (save, get, getAll)
- Meal planning (create, add products, get, getAll)
- Nutrition calculation (per-product and meal totals)
- User configuration (save and get config)

## What's Not Done Yet

- **Offline AI**: The OCR feature requires an internet connection and a configured AI endpoint. No local OCR is implemented yet.
- **Barcode Scanning**: No barcode scanning support for quick product lookup.
- **Cloud Sync**: All data is stored locally. No cloud sync or backup functionality.
- **Nutritional Goals**: No ability to set daily nutritional targets or track progress.
- **Recipe Support**: No recipe creation or management features.
- **Multi-language**: The OCR works best with English labels. Other languages may not be fully supported.
- **Mobile App**: This is a web app. No native mobile app support.

## License

This project is free and open source. No ads, no tracking, no paywalls.