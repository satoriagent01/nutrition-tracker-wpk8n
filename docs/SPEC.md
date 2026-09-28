# Nutrition Tracker - Product Specification

## Product Overview

A free, ad-free nutrition tracker that allows users to photograph product nutrition labels, extract nutritional information using AI-powered OCR, store products in a personal database, and create custom meal plans by specifying gram amounts of each product. The app focuses on general dietary tracking without being tied to specific goals like weight loss or heart health.

## Features

### 1. Photo Scanning & OCR
- Users can upload photos of product nutrition labels
- AI-powered OCR extracts nutritional information from the image
- Supports multi-language labels (German, French, Dutch, Italian, Spanish, English, etc.)
- Extracts: energy (kJ/kcal), fat, saturated fat, carbohydrates, sugars, protein, salt, serving size, and other nutrients

### 2. Product Database
- Stores extracted products with their nutritional information
- Each product has a unique identifier
- Products retain their original serving size information
- Users can view their saved products

### 3. Meal Planning
- Users create meals and add products to them
- Specify gram amounts for each product in a meal
- Calculate total nutrition based on gram amounts
- Support for multiple meals per day

### 4. Custom Tracking
- Track any nutrient: calories, sodium, saturated fats, etc.
- Custom nutrient definitions
- Flexible tracking based on user needs

## Acceptance Criteria

### AC-1: Photo Upload
- Users can upload a photo of a nutrition label
- The app accepts common image formats (JPEG, PNG)
- The photo is processed for OCR extraction

### AC-2: OCR Extraction
- The app extracts nutritional information from the uploaded photo
- Extracted data includes: energy, fat, saturated fat, carbohydrates, sugars, protein, salt
- The extraction works for multi-language labels (German, Dutch, French, Italian, etc.)
- Example from Image 1 (chocolate bar):
  - Energy: 2292 kJ / 549 kcal per 100g, 688 kJ / 165 kcal per 30g serving
  - Fat: 33g per 100g, 10g per 30g serving
  - Saturated Fat: 13g per 100g, 3.9g per 30g serving
  - Carbohydrates: 55g per 100g, 16g per 30g serving
  - Sugars: 45g per 100g, 14g per 30g serving
  - Protein: 6.8g per 100g, 2.0g per 30g serving
  - Salt: 0.18g per 100g, 0.05g per 30g serving

### AC-3: Product Storage
- Extracted products are stored in the user's database
- Products include all extracted nutritional information
- Products retain serving size information (e.g., 30g = 1 Melto from Image 1)

### AC-4: Meal Creation
- Users can create meals and add products to them
- Users specify gram amounts for each product
- Example: Adding 50g of the chocolate bar from Image 1 to a meal

### AC-5: Nutrition Calculation
- The app calculates total nutrition based on gram amounts
- Example: 50g of chocolate bar (Image 1) = 1146 kJ / 274.5 kcal, 16.5g fat, 6.5g saturated fat, 27.5g carbs, 22.5g sugars, 3.4g protein, 0.09g salt

### AC-6: Custom Tracking
- Users can track any nutrient they choose
- The app supports tracking calories, sodium, saturated fats, and custom nutrients
- No predefined categories - users define what they want to track

### AC-7: Free and Ad-Free
- The app is completely free to use
- No advertisements or sponsored content
- No paywalls for features

### AC-8: Privacy-Focused
- User data is stored locally
- No personal information is shared with third parties
- The AI OCR endpoint is configurable by the user

## Examples from Shared Images

### Image 1: Chocolate Bar (Multi-language label)
- **Product**: Dr. Schär AG chocolate bar (gluten-free)
- **Language**: German, French, Dutch, Italian
- **Nutrition Table**:
  - Per 100g: 2292 kJ / 549 kcal, 33g fat, 13g saturated fat, 55g carbs, 45g sugars, 6.8g protein, 0.18g salt
  - Per 30g serving: 688 kJ / 165 kcal, 10g fat, 3.9g saturated fat, 16g carbs, 14g sugars, 2.0g protein, 0.05g salt
- **Serving Size**: 30g = 1 Melto
- **Total Weight**: 90g (3x)

### Image 2: Juice Bottle (Dutch label)
- **Product**: Versgeperst appel-sinaasappel- en mangosap (Fresh pressed apple-orange-mango juice)
- **Language**: Dutch
- **Nutrition Table**:
  - Per 100ml: 199 kJ / 47 kcal, 0g fat, 0g saturated fat, 11g carbs, 10g sugars, 0.7g protein, 0g salt
  - Per 200ml glass: 399 kJ / 94 kcal, 0g fat, 0g saturated fat, 22g carbs, 20g sugars, 1.4g protein, 0g salt
- **Serving Size**: 200ml (5 portions per 1L)
- **Ingredients**: 45% apple, 35% orange, 20% mango

### Image 3: Olive Oil Spray (Dutch label)
- **Product**: Extra olijfolie van de eerste persing (Extra virgin olive oil spray)
- **Language**: Dutch
- **Nutrition Table**:
  - Per 100ml: 3404 kJ / 828 kcal, 92g fat, 14g saturated fat, 0g carbs, 0g sugars, 0g protein, 0g salt
- **Serving Size**: 200ml bottle, 335 sprays
- **Vitamin E**: 150% of daily reference intake per 100ml

## Technical Requirements

### Stack
- **Runtime**: Node 24 with ES modules
- **Testing**: Node's built-in test runner (`node --test`)
- **Build Step**: None - static files served directly
- **UI**: Static web page in `public/` directory
- **AI/OCR**: OpenAI-compatible endpoint (configurable by user)
- **Data Storage**: Local storage (IndexedDB or localStorage for browser)

### AI Integration
- User configures their own OpenAI-compatible endpoint (URL and API key)
- The AI module handles OCR extraction from images
- Tests never call the actual AI endpoint - they use mock data
- The AI endpoint is configurable through the UI

### Data Model

#### Product
```javascript
{
  id: string, // unique identifier
  name: string, // product name
  servingSize: number, // serving size in grams or ml
  servingUnit: string, // 'g' or 'ml'
  nutritionPer100g: {
    energyKj: number,
    energyKcal: number,
    fat: number,
    saturatedFat: number,
    carbohydrates: number,
    sugars: number,
    protein: number,
    salt: number,
    [customNutrients: string]: number
  },
  imageUrl?: string, // optional reference to original image
  createdAt: string // ISO date string
}
```

#### Meal
```javascript
{
  id: string, // unique identifier
  name: string, // meal name (e.g., "Breakfast", "Lunch")
  date: string, // ISO date string
  items: MealItem[],
  createdAt: string, // ISO date string
  updatedAt: string // ISO date string
}
```

#### MealItem
```javascript
{
  productId: string, // reference to Product
  productName: string, // cached product name for display
  amount: number, // amount in grams or ml
  unit: string, // 'g' or 'ml'
  nutrition: {
    energyKj: number,
    energyKcal: number,
    fat: number,
    saturatedFat: number,
    carbohydrates: number,
    sugars: number,
    protein: number,
    salt: number,
    [customNutrients: string]: number
  }
}
```

#### User Configuration
```javascript
{
  aiEndpoint: string, // OpenAI-compatible endpoint URL
  apiKey: string, // API key for the AI endpoint
  customNutrients: string[], // list of custom nutrient names
  createdAt: string, // ISO date string
  updatedAt: string // ISO date string
}
```

## Modules

### src/ocr.js
- **Function**: `extractNutrition(imageData: string) => Promise<NutritionData>`
  - Parameters: `imageData` - base64 encoded image string
  - Returns: Promise resolving to nutrition data object with energy, fat, saturated fat, carbohydrates, sugars, protein, salt, and serving size
  - Example: Extracts from Image 1: `{ energyKj: 2292, energyKcal: 549, fat: 33, saturatedFat: 13, carbohydrates: 55, sugars: 45, protein: 6.8, salt: 0.18, servingSize: 30, servingUnit: 'g' }`

### src/products.js
- **Function**: `saveProduct(product: Product) => string`
  - Parameters: `product` - Product object
  - Returns: Product ID string
  - Example: Saves the chocolate bar from Image 1 and returns `"prod_001"`

- **Function**: `getProduct(id: string) => Product | null`
  - Parameters: `id` - Product ID
  - Returns: Product object or null if not found
  - Example: `getProduct("prod_001")` returns the saved chocolate bar product

- **Function**: `getAllProducts() => Product[]`
  - Parameters: None
  - Returns: Array of all saved products
  - Example: Returns array of all saved products

### src/meals.js
- **Function**: `createMeal(name: string, date: string) => string`
  - Parameters: `name` - meal name, `date` - ISO date string
  - Returns: Meal ID string
  - Example: `createMeal("Lunch", "2024-01-15")` returns `"meal_001"`

- **Function**: `addProductToMeal(mealId: string, productId: string, amount: number, unit: string) => MealItem`
  - Parameters: `mealId` - meal ID, `productId` - product ID, `amount` - amount in grams/ml, `unit` - 'g' or 'ml'
  - Returns: Created MealItem object
  - Example: `addProductToMeal("meal_001", "prod_001", 50, "g")` creates a meal item with 50g of the chocolate bar

- **Function**: `getMeal(id: string) => Meal | null`
  - Parameters: `id` - Meal ID
  - Returns: Meal object or null if not found
  - Example: `getMeal("meal_001")` returns the meal with all its items

- **Function**: `getAllMeals() => Meal[]`
  - Parameters: None
  - Returns: Array of all meals
  - Example: Returns array of all saved meals

### src/nutrition.js
- **Function**: `calculateNutrition(product: Product, amount: number, unit: string) => NutritionData`
  - Parameters: `product` - Product object, `amount` - amount in grams/ml, `unit` - 'g' or 'ml'
  - Returns: Nutrition data object for the specified amount
  - Example: `calculateNutrition(chocolateBarProduct, 50, "g")` returns `{ energyKj: 1146, energyKcal: 274.5, fat: 16.5, saturatedFat: 6.5, carbohydrates: 27.5, sugars: 22.5, protein: 3.4, salt: 0.09 }`

- **Function**: `calculateMealTotal(meal: Meal) => NutritionData`
  - Parameters: `meal` - Meal object
  - Returns: Total nutrition data for the meal
  - Example: `calculateMealTotal(lunchMeal)` returns the sum of all nutrition values in the meal

### src/config.js
- **Function**: `saveConfig(config: UserConfiguration) => void`
  - Parameters: `config` - User configuration object
  - Returns: void
  - Example: `saveConfig({ aiEndpoint: "https://api.openai.com/v1", apiKey: "sk-...", customNutrients: ["sodium", "fiber"] })`

- **Function**: `getConfig() => UserConfiguration`
  - Parameters: None
  - Returns: User configuration object
  - Example: `getConfig()` returns the saved configuration

## Non-Functional Requirements

- **Free and Ad-Free**: The app is completely free to use with no advertisements
- **Privacy-Focused**: User data is stored locally, no personal information is shared with third parties
- **User-Controlled AI**: Users configure their own AI endpoint, giving them control over their data
- **Simple UI**: The interface is clean and focused on the core functionality
- **Multi-Language Support**: The OCR handles labels in multiple languages
- **No Build Step**: The app runs directly from static files