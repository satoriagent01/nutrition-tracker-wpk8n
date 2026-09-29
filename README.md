# Nutrition Tracker

A web application for tracking nutrition from food labels. Scan nutrition labels with your camera, manage products, plan meals, and get detailed nutrition summaries.

## Features

- **📸 Photo Upload**: Upload photos of nutrition labels to extract data using AI OCR
- **📦 Product Database**: Save and manage food products with detailed nutrition information
- **🍽️ Meal Planner**: Create meals and add products with custom serving sizes
- **📊 Nutrition Summary**: Get total nutrition breakdown for any meal
- **⚙️ Configurable AI**: Set your own OpenAI-compatible endpoint for OCR

## Setup

### Prerequisites

- Node.js 24+
- A modern web browser

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

This starts a local development server. Open `http://localhost:3000` in your browser.

### Configuring the AI Endpoint

1. Open the application in your browser
2. Scroll to the Configuration section
3. Enter your OpenAI-compatible API endpoint URL (e.g., `https://api.openai.com/v1/chat/completions`)
4. Enter your API key
5. Click "Save Configuration"

The application uses this endpoint to process nutrition label images through AI OCR.

## Testing

```bash
npm test
```

The test suite covers:
- Storage abstraction (browser and Node.js compatibility)
- Product CRUD operations
- Meal creation and management
- Nutrition calculation and scaling
- OCR extraction (mocked)
- Configuration management

## Project Structure

```
├── src/
│   ├── storage.js    # Unified storage abstraction (localStorage / in-memory)
│   ├── config.js     # User configuration management
│   ├── products.js   # Product database operations
│   ├── meals.js      # Meal planning operations
│   ├── nutrition.js  # Nutrition calculation utilities
│   └── ocr.js        # AI-powered nutrition label extraction
├── public/
│   ├── index.html    # Main UI page
│   └── app.js        # Frontend application logic
├── tests/            # Test suite
├── package.json
└── README.md
```

## Data Storage

- **Browser**: Uses `localStorage` for persistence
- **Node.js**: Uses an in-memory store (data is lost on restart)

## Not Yet Implemented

- [ ] Real AI OCR integration (currently uses mock data)
- [ ] Drag and drop image upload (UI only, no backend processing)
- [ ] Meal history and trends
- [ ] Daily/weekly nutrition goals
- [ ] Export nutrition data
- [ ] Mobile-responsive design improvements
- [ ] Server-side persistence (currently client-side only)

## License

MIT