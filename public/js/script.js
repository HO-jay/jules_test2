// jshint esversion: 6

document.addEventListener('DOMContentLoaded', () => {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            const activeContent = document.getElementById(tabId + '-content');
            if (activeContent) activeContent.classList.add('active');
        });
    });

    // Language Selection Logic
    const sourceLanguageSelect = document.getElementById('source-language-select');
    const targetLanguageSelect = document.getElementById('target-language-select');
    const swapLanguagesButton = document.getElementById('swap-languages-button');
    const detectLanguageButton = document.getElementById('detect-language-button');

    let currentSourceLanguage = sourceLanguageSelect ? sourceLanguageSelect.value : 'ko';
    let currentTargetLanguage = targetLanguageSelect ? targetLanguageSelect.value : 'en';

    if (sourceLanguageSelect) {
        sourceLanguageSelect.addEventListener('change', (event) => {
            currentSourceLanguage = event.target.value;
            console.log('Source language set to:', currentSourceLanguage);
        });
    }

    if (targetLanguageSelect) {
        targetLanguageSelect.addEventListener('change', (event) => {
            currentTargetLanguage = event.target.value;
            console.log('Target language set to:', currentTargetLanguage);
        });
    }

    if (swapLanguagesButton && sourceLanguageSelect && targetLanguageSelect) {
        swapLanguagesButton.addEventListener('click', () => {
            const tempSourceValue = sourceLanguageSelect.value;
            if (targetLanguageSelect.value === 'detect') {
                alert("'언어 감지' 상태에서는 언어를 직접 전환할 수 없습니다. 먼저 목표 언어를 선택해주세요.");
                return;
            }
            sourceLanguageSelect.value = targetLanguageSelect.value;
            targetLanguageSelect.value = tempSourceValue;
            currentSourceLanguage = sourceLanguageSelect.value;
            currentTargetLanguage = targetLanguageSelect.value;
            console.log('Languages swapped. New source:', currentSourceLanguage, 'New target:', currentTargetLanguage);
        });
    }

    if (detectLanguageButton) {
       detectLanguageButton.addEventListener('click', () => {
           alert('언어 감지 기능은 아직 구현되지 않았습니다.');
       });
    }

    // Textarea and char counter logic
    const textArea = document.getElementById('text-to-translate');
    const charCountDisplay = document.getElementById('char-count');
    const MAX_CHARS = 5000;

    if (textArea && charCountDisplay) {
        textArea.addEventListener('input', () => {
            const currentLength = textArea.value.length;
            charCountDisplay.textContent = `${currentLength} / ${MAX_CHARS}`;
            if (currentLength > MAX_CHARS) charCountDisplay.style.color = 'red';
            else charCountDisplay.style.color = '#555';
        });
    }

    // Text translation frontend to backend connection
    const translateTextButton = document.getElementById('translate-text-button');
    const translatedTextArea = document.getElementById('translated-text-area');

    if (translateTextButton && textArea && translatedTextArea) {
        translateTextButton.addEventListener('click', async () => {
            const textToTranslateValue = textArea.value;
            if (!textToTranslateValue.trim()) {
                translatedTextArea.value = '';
                return;
            }
            translatedTextArea.value = '번역 중...';
            try {
                const requestBody = {
                    text: textToTranslateValue,
                    targetLanguage: currentTargetLanguage,
                };
                if (currentSourceLanguage && currentSourceLanguage !== 'detect') {
                    requestBody.sourceLanguage = currentSourceLanguage;
                }
                const response = await fetch('/api/translate/text', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: '번역 중 오류가 발생했습니다 (응답 파싱 실패)' }));
                    let errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
                    if (errorData.details) errorMessage += ` (Details: ${errorData.details})`;
                    throw new Error(errorMessage);
                }
                const data = await response.json();
                if (data.translatedText) {
                    translatedTextArea.value = data.translatedText;
                } else if (data.error) {
                    translatedTextArea.value = `오류: ${data.error}`;
                    if (data.details) translatedTextArea.value += ` (${data.details})`;
                } else {
                    translatedTextArea.value = '번역 결과를 받지 못했습니다.';
                }
            } catch (error) {
                console.error('Translation fetch error:', error);
                translatedTextArea.value = `번역 요청 실패: ${error.message}`;
            }
        });
    }

    // Image tab functionality
    const imageFileInput = document.getElementById('image-file-input');
    const imagePreviewTag = document.getElementById('image-preview-tag');
    const imagePreviewPlaceholder = document.getElementById('image-preview-placeholder');
    const translateImageButton = document.getElementById('translate-image-button');

    if (imageFileInput && imagePreviewTag && imagePreviewPlaceholder && translateImageButton) {
        imageFileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreviewTag.src = e.target.result;
                    imagePreviewTag.style.display = 'block';
                    if (imagePreviewPlaceholder) imagePreviewPlaceholder.style.display = 'none';
                    translateImageButton.disabled = false;
                };
                reader.readAsDataURL(file);
            } else {
                imagePreviewTag.src = '#';
                imagePreviewTag.style.display = 'none';
                if (imagePreviewPlaceholder) imagePreviewPlaceholder.style.display = 'block';
                translateImageButton.disabled = true;
            }
        });
        translateImageButton.addEventListener('click', () => {
            if (imageFileInput.files && imageFileInput.files[0]) {
                console.log('이미지 번역 요청:', imageFileInput.files[0].name);
                alert('이미지 번역 기능은 아직 구현되지 않았습니다. 백엔드 연동이 필요합니다.');
            } else {
                alert('번역할 이미지를 먼저 선택해주세요.');
            }
        });
    }

    // Document tab functionality
    const documentFileInput = document.getElementById('document-file-input');
    const documentNamePlaceholder = document.getElementById('document-name-placeholder');
    const translateDocumentButton = document.getElementById('translate-document-button');

    if (documentFileInput && documentNamePlaceholder && translateDocumentButton) {
        documentFileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                documentNamePlaceholder.textContent = `선택된 파일: ${file.name}`;
                documentNamePlaceholder.style.color = '#333';
                translateDocumentButton.disabled = false;
            } else {
                documentNamePlaceholder.textContent = '선택된 파일 없음';
                documentNamePlaceholder.style.color = '#888';
                translateDocumentButton.disabled = true;
            }
        });
        translateDocumentButton.addEventListener('click', () => {
            if (documentFileInput.files && documentFileInput.files[0]) {
                console.log('문서 번역 요청:', documentFileInput.files[0].name);
                alert('문서 번역 기능은 아직 구현되지 않았습니다. 백엔드 연동이 필요합니다.');
            } else {
                alert('번역할 문서를 먼저 선택해주세요.');
            }
        });
    }

    // Bottom Footer Icons - Added for this subtask (Optional JS)
    const historyButton = document.getElementById('history-button');
    const savedButton = document.getElementById('saved-button');
    const feedbackLink = document.getElementById('feedback-link');

    if (historyButton) {
        historyButton.addEventListener('click', () => alert('기록 기능은 아직 구현되지 않았습니다.'));
    }
    if (savedButton) {
        savedButton.addEventListener('click', () => alert('저장된 번역 기능은 아직 구현되지 않았습니다.'));
    }
    if (feedbackLink) {
        feedbackLink.addEventListener('click', (e) => {
            e.preventDefault(); // 기본 링크 동작 방지
            alert('의견 보내기 기능은 아직 구현되지 않았습니다.');
        });
    }
});
