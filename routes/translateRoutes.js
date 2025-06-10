// routes/translateRoutes.js
const express = require('express');
const router = express.Router();
// Update require to get translateImage and upload middleware
const { translateText, translateImage, upload } = require('../controllers/translateController');

// POST /api/translate/text
router.post('/text', translateText);

// POST /api/translate/image
// Uses 'upload.single('imageFile')' middleware from translateController
// 'imageFile' must match the name attribute of the file input in the frontend form.
router.post('/image', upload.single('imageFile'), translateImage);

module.exports = router;
