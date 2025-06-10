// Require necessary modules
const express = require('express');
const cors = require('cors');
const dotenv =require('dotenv');
const translateRoutes = require('./routes/translateRoutes'); // Added for translation routes

// Load environment variables
dotenv.config();

// IMPORTANT: Google Cloud Translation API setup needed.
// 1. Ensure you have a Google Cloud Project.
// 2. Enable the Cloud Translation API in your project: https://console.cloud.google.com/flows/enableapi?apiid=translate.googleapis.com
// 3. Set up authentication:
//    - Create a service account and download its key JSON file. Then set the GOOGLE_APPLICATION_CREDENTIALS environment variable to the path of this file in your .env file.
//    OR
//    - Use Application Default Credentials (ADC) if running in a Google Cloud environment.
//    OR
//    - For simple use cases (less secure, not recommended for production), you might use an API key directly via GOOGLE_API_KEY in your .env file.
// 4. Refer to the official setup guide for detailed instructions: https://cloud.google.com/translate/docs/setup
// Make sure the necessary environment variables (e.g., GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_API_KEY) are configured in your .env file.
// Specifically, for the translateController.js to work, ensure GOOGLE_API_KEY is set in your .env file.

// IMPORTANT: Google Cloud Vision API setup needed for image translation.
// 1. Ensure you have a Google Cloud Project and billing is enabled.
// 2. Enable the Cloud Vision API in your project: https://console.cloud.google.com/flows/enableapi?apiid=vision.googleapis.com
// 3. Ensure your credentials (API Key or Service Account via GOOGLE_APPLICATION_CREDENTIALS in .env)
//    have the necessary permissions for the Vision API.
// 4. Refer to the official setup guide for detailed instructions: https://cloud.google.com/vision/docs/setup

// Create Express application
const app = express();

// Define port
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// API Routes
app.use('/api/translate', translateRoutes); // All translation routes are prefixed with /api/translate

// Basic Routes
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
