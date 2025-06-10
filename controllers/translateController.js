// controllers/translateController.js
const { Translate } = require('@google-cloud/translate').v2;
const multer = require('multer');

// Multer setup for image uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
    fileFilter: function (req, file, cb) {
        // Accept images only
        if (!file.mimetype.startsWith('image/')) {
            req.fileValidationError = 'Only image files are allowed!';
            return cb(null, false);
        }
        cb(null, true);
    }
});
// Note: 'upload' is defined here but needs to be used in routes.
// This might be passed or routes might define their own if this controller is used by multiple route files.

// API 키를 환경 변수에서 가져와서 클라이언트 초기화
// GOOGLE_API_KEY 환경 변수가 .env 파일에 설정되어 있어야 합니다.
const translate = new Translate({ key: process.env.GOOGLE_API_KEY });

async function translateText(req, res) {
    let { text, targetLanguage, sourceLanguage } = req.body; // Use let for targetLanguage

    if (!text) {
        return res.status(400).json({ error: 'Text is required for translation.' });
    }
    if (!targetLanguage) {
        // 기본 목표 언어를 영어로 설정 (프론트엔드에서 언어 선택 기능 구현 전까지)
        // return res.status(400).json({ error: 'Target language is required.' });
        targetLanguage = 'en'; // Assign to the destructured variable
    }

    try {
        // 옵션 객체 생성
        let options = {
            to: targetLanguage, // 수정된 targetLanguage 사용
        };
        if (sourceLanguage) {
            options.from = sourceLanguage;
        } else {
            // 소스 언어가 제공되지 않으면 자동 감지 (또는 기본 'ko'로 설정)
            options.from = 'ko'; // 한국어 기본 출발 언어로 설정
        }

        // 텍스트 번역
        const [translation] = await translate.translate(text, options);

        res.status(200).json({ translatedText: translation });

    } catch (error) {
        console.error('ERROR translating text:', error);
        // Google API 오류 객체 구조에 따라 더 구체적인 오류 메시지를 반환할 수 있습니다.
        if (error.code === 400 && error.errors && error.errors[0] && error.errors[0].reason === 'invalid') {
            // API 키가 유효하지 않거나 활성화되지 않은 경우 등의 오류
             return res.status(401).json({
                 error: 'Translation API request failed. Check API key and ensure the API is enabled.',
                 details: error.message
             });
        }
        if (error.message && error.message.includes('invalid API key')) {
             return res.status(401).json({ error: 'Invalid API Key. Please check your GOOGLE_API_KEY in the .env file.' });
        }
        res.status(500).json({ error: 'Failed to translate text.', details: error.message });
    }
}

module.exports = {
    translateText,
    translateImage, // Added translateImage
    upload, // Exporting upload to be used in routes
};

// Placeholder for Vision API client (to be initialized if GOOGLE_API_KEY or ADC is set)
// const { ImageAnnotatorClient } = require('@google-cloud/vision').v1;
// const visionClient = new ImageAnnotatorClient({ key: process.env.GOOGLE_API_KEY }); // Or use ADC

async function translateImage(req, res) {
    // Multer file validation error
    if (req.fileValidationError) {
        return res.status(400).json({ error: req.fileValidationError });
    }
    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({ error: 'Image file is required.' });
    }

    // Placeholder for OCR and Translation logic
    console.log('Received image:', req.file.originalname, 'Size:', req.file.size);
    console.log('Target language for image text:', req.body.targetLanguage); // Assuming targetLanguage is sent in body

    // TODO:
    // 1. Extract text from req.file.buffer using Vision API.
    // 2. Translate extracted text using the existing translate instance or a similar method.
    // 3. Return translated text.

    res.status(501).json({
        message: 'Image translation not fully implemented yet.',
        fileName: req.file.originalname,
        targetLang: req.body.targetLanguage || 'en' // Default to 'en' if not provided
    });
}
