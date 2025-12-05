import React, { useState, useEffect } from 'react';
import { FaTimes, FaGlobe, FaLanguage } from 'react-icons/fa';

const LanguageSuggestion = () => {
  const [show, setShow] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [languageName, setLanguageName] = useState('');

  // Language code to name mapping - expanded for common languages
  const languageNames = {
    'fr': 'Français (French)',
    'es': 'Español (Spanish)',
    'pt': 'Português (Portuguese)',
    'ar': 'العربية (Arabic)',
    'zh': '中文 (Chinese)',
    'de': 'Deutsch (German)',
    'sw': 'Kiswahili (Swahili)',
    'ny': 'Chichewa',
    'bem': 'Bemba',
    'zu': 'isiZulu',
    'af': 'Afrikaans',
    'xh': 'isiXhosa',
    'hi': 'हिन्दी (Hindi)',
    'ja': '日本語 (Japanese)',
    'ko': '한국어 (Korean)',
    'ru': 'Русский (Russian)',
    'it': 'Italiano (Italian)',
    'nl': 'Nederlands (Dutch)',
    'pl': 'Polski (Polish)',
    'tr': 'Türkçe (Turkish)',
    'vi': 'Tiếng Việt (Vietnamese)',
    'th': 'ไทย (Thai)',
    'id': 'Bahasa Indonesia',
    'ms': 'Bahasa Melayu (Malay)',
    'tl': 'Filipino',
    'he': 'עברית (Hebrew)',
    'uk': 'Українська (Ukrainian)',
    'cs': 'Čeština (Czech)',
    'sv': 'Svenska (Swedish)',
    'da': 'Dansk (Danish)',
    'no': 'Norsk (Norwegian)',
    'fi': 'Suomi (Finnish)',
    'ro': 'Română (Romanian)',
    'hu': 'Magyar (Hungarian)',
    'el': 'Ελληνικά (Greek)',
    'bg': 'Български (Bulgarian)',
    'hr': 'Hrvatski (Croatian)',
    'sk': 'Slovenčina (Slovak)',
    'sl': 'Slovenščina (Slovenian)',
    'sr': 'Српски (Serbian)',
    'mk': 'Македонски (Macedonian)',
    'sq': 'Shqip (Albanian)',
    'et': 'Eesti (Estonian)',
    'lv': 'Latviešu (Latvian)',
    'lt': 'Lietuvių (Lithuanian)',
    'mt': 'Malti (Maltese)',
    'ga': 'Gaeilge (Irish)',
    'cy': 'Cymraeg (Welsh)',
    'is': 'Íslenska (Icelandic)',
    'fa': 'فارسی (Persian)',
    'ur': 'اردو (Urdu)',
    'bn': 'বাংলা (Bengali)',
    'ta': 'தமிழ் (Tamil)',
    'te': 'తెలుగు (Telugu)',
    'ml': 'മലയാളം (Malayalam)',
    'kn': 'ಕನ್ನಡ (Kannada)',
    'gu': 'ગુજરાતી (Gujarati)',
    'pa': 'ਪੰਜਾਬੀ (Punjabi)',
    'mr': 'मराठी (Marathi)',
    'ne': 'नेपाली (Nepali)',
    'si': 'සිංහල (Sinhala)',
    'my': 'မြန်မာ (Burmese)',
    'km': 'ខ្មែរ (Khmer)',
    'lo': 'ລາວ (Lao)',
    'ka': 'ქართული (Georgian)',
    'am': 'አማርኛ (Amharic)',
    'sw': 'Kiswahili',
    'ha': 'Hausa',
    'yo': 'Yorùbá',
    'ig': 'Igbo',
    'sn': 'chiShona',
    'st': 'Sesotho',
    'tn': 'Setswana',
    've': 'Tshivenḓa',
    'ts': 'Xitsonga',
    'ss': 'siSwati',
    'nr': 'isiNdebele',
    'nso': 'Sesotho sa Leboa',
  };

  useEffect(() => {
    // Check if user has dismissed this before
    const dontAskAgain = localStorage.getItem('googleTranslateSuggestionDismissed');
    if (dontAskAgain === 'true') return;

    // Check if Google Translate is already active
    const currentLang = document.documentElement.lang || 'en';
    const cookieLang = document.cookie.match(/googtrans=([^;]+)/);
    if (cookieLang && cookieLang[1] !== '/en/en') {
      // User has already translated, don't show suggestion
      return;
    }

    // Get browser language
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0].toLowerCase();

    // Check if browser language is different from English
    // Google Translate supports all languages, so we check any non-English language
    if (langCode && langCode !== 'en') {
      setDetectedLanguage(langCode);
      setLanguageName(languageNames[langCode] || langCode.toUpperCase());
      
      // Show after a short delay for better UX
      setTimeout(() => {
        setShow(true);
      }, 2000);
    }
  }, []);

  const handleYes = () => {
    // Trigger Google Translate
    const triggerTranslate = () => {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        // Find the option for the detected language
        const options = select.options;
        for (let i = 0; i < options.length; i++) {
          const optionValue = options[i].value;
          // Google Translate uses format like "/en/fr" for English to French
          if (optionValue.includes(detectedLanguage) && !optionValue.includes('/en/en')) {
            select.value = optionValue;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            break;
          }
        }
      } else {
        // If select not found, wait a bit and try again
        setTimeout(triggerTranslate, 500);
      }
    };

    // Wait for Google Translate to be ready
    if (window.google && window.google.translate) {
      triggerTranslate();
    } else {
      // Wait for Google Translate to load
      const checkGoogle = setInterval(() => {
        if (window.google && window.google.translate) {
          clearInterval(checkGoogle);
          triggerTranslate();
        }
      }, 100);
      
      // Stop checking after 5 seconds
      setTimeout(() => clearInterval(checkGoogle), 5000);
    }
    
    setShow(false);
    // Don't save dismissal, let them see it again if they come back
  };

  const handleNo = () => {
    setShow(false);
  };

  const handleDontAskAgain = () => {
    localStorage.setItem('googleTranslateSuggestionDismissed', 'true');
    setShow(false);
  };

  if (!show || !detectedLanguage) return null;

  return (
    <div
      className="position-fixed bottom-0 start-0 end-0 p-3"
      style={{
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
      }}
    >
      <div
        className="container mx-auto bg-white rounded shadow-lg p-4"
        style={{ maxWidth: '600px' }}
      >
        <div className="d-flex align-items-start gap-3">
          <div className="flex-shrink-0">
            <FaLanguage style={{ fontSize: '28px', color: '#0d6efd' }} />
          </div>
          <div className="flex-grow-1">
            <h5 className="mb-2 d-flex align-items-center gap-2">
              <FaGlobe style={{ fontSize: '18px', color: '#0d6efd' }} />
              Translate this page?
            </h5>
            <p className="mb-3">
              We detected you're using <strong>{languageName}</strong>. Would you like to translate this page to {languageName}?
            </p>
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleYes}
              >
                Yes, translate to {languageName}
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleNo}
              >
                No, keep English
              </button>
              <button
                className="btn btn-link btn-sm text-muted text-decoration-none ms-auto"
                onClick={handleDontAskAgain}
                style={{ fontSize: '0.875rem' }}
              >
                Don't ask again
              </button>
            </div>
          </div>
          <button
            className="btn btn-link text-muted p-0"
            onClick={handleNo}
            aria-label="Close"
            style={{ fontSize: '18px' }}
          >
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSuggestion;

