let currentLang = 'en';
let translations = {}

// Load translations
async function loadTranslations(lang) {
    try {
        const response = await fetch(`lang/${lang.toUpperCase()}.json`);
        const data = await response.json();
        translations[lang] = data;
        return data;
    } catch (error) {
        console.error(`Error loading translations for ${lang}:`, error);
        return {};
    }
}

// Apply translations to the page
function applyTranslations(lang) {
    const elements = document.querySelectorAll('data-key');
    const langData = translations[lang];

    if (!langData) {
        console.warn(`No translations found for language: ${lang}`);
        return;
    }

    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (langData[key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = langData[key];
            } else {
                element.textContent = langData[key];
            }
        }
    });

    // Update placeholders
    const placeholderElements = document.querySelectorAll('[data-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-placeholder');
        if (langData[key]) {
            element.placeholder = langData[key];
        }
    });
}

// Change language
async function changeLanguage(lang) {
    if (lang === currentLang) return;

    // Load translations if not already loaded
    if (!translations[lang]) {
        await loadTranslations(lang);
    }

    currentLang = lang;
    document.documentElement.setAttribute('data-lang', lang);

    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-lang') === lang) {
            button.classList.add('active');
        }
    });

    // Apply translations
    applyTranslations(lang);

    //Save language preference
    localStorage.setItem('preferredLanguage', lang);
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', async () => {
    //Load both languages
    await Promise.all([
        loadTranslations('en'),
        loadTranslations('fr')
    ]);

    // Check for saved language preference
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    await changeLanguage(savedLang);
});