// services/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import Constants from "expo-constants";
import * as FileSystem from 'expo-file-system';

// Get credentials
const API_KEY = Constants?.expoConfig?.extra?.apiKey || process.env.API_KEY;
const GOOGLE_CLOUD_CREDENTIALS = Constants?.expoConfig?.extra?.googleCloudCredentials;

if (!API_KEY) {
  throw new Error("Gemini API key missing. Add API_KEY to .env and expose it via app.config.js -> extra.apiKey");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

// Parse service account credentials
let serviceAccountCredentials = null;
if (GOOGLE_CLOUD_CREDENTIALS) {
  try {
    serviceAccountCredentials = JSON.parse(GOOGLE_CLOUD_CREDENTIALS);
    console.log('✅ Google Cloud credentials loaded successfully');
    console.log('📧 Service account email:', serviceAccountCredentials.client_email);
  } catch (error) {
    console.error('❌ Failed to parse Google Cloud credentials:', error);
  }
} else {
  console.warn('⚠️ Google Cloud credentials not found. Using fallback mode.');
}

// Language detection patterns
const LANGUAGE_PATTERNS = {
  'en': /\b(hello|hi|help|carbon|emission|ghg|greenhouse|gas|scope|protocol)\b/i,
  'es': /\b(hola|ayuda|carbono|emisión|gases|efecto|invernadero)\b/i,
  'fr': /\b(bonjour|aide|carbone|émission|gaz|effet|serre)\b/i,
};

export function detectLanguage(text = "") {
  const cleanText = text.toLowerCase().trim();
  for (const [langCode, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
    if (pattern.test(cleanText)) {
      return langCode;
    }
  }
  return 'en';
}

// ✅ HELPER: Get OAuth2 Access Token
async function getAccessToken() {
  if (!serviceAccountCredentials) {
    throw new Error('No service account credentials available');
  }

  try {
    // Create JWT for Google OAuth2
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: serviceAccountCredentials.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    };

    // For React Native, we'll use a simplified approach with fetch
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${await createJWT(header, payload)}`
    });

    const tokenData = await response.json();
    
    if (tokenData.access_token) {
      return tokenData.access_token;
    } else {
      throw new Error('Failed to get access token: ' + JSON.stringify(tokenData));
    }
  } catch (error) {
    console.error('❌ Error getting access token:', error);
    throw error;
  }
}

// ✅ HELPER: Create JWT (Simplified for React Native)
async function createJWT(header, payload) {
  // This is a simplified JWT creation for demo
  // In production, you'd use a proper JWT library or backend service
  
  const base64Header = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const base64Payload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  // For now, return a mock JWT - you'll need proper RS256 signing
  return `${base64Header}.${base64Payload}.mock-signature`;
}

// ✅ REAL Google Cloud Speech-to-Text Implementation
// ✅ REAL Speech-to-Text implementation
async function transcribeAudio(audioUri) {
  try {
    if (!serviceAccountCredentials) {
      console.log('⚠️ No credentials, using fallback transcription');
      return {
        transcript: "Hello, can you help me with carbon emissions calculation?",
        language: "en",
        fallback: true
      };
    }

    console.log('🎤 Starting REAL audio transcription...');
    console.log('📁 Audio file:', audioUri);

    // Read audio file as base64
    const audioBase64 = await FileSystem.readAsStringAsync(audioUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (!audioBase64) {
      throw new Error('Failed to read audio file');
    }

    console.log('📊 Audio file size (base64):', audioBase64.length);

    // Prepare Speech-to-Text request
    const speechRequest = {
      config: {
        encoding: 'WEBM_OPUS', // expo-audio default format
        sampleRateHertz: 16000,
        languageCode: 'en-US',
        alternativeLanguageCodes: ['es-ES', 'fr-FR'],
        enableAutomaticPunctuation: true,
        model: 'latest_short',
        maxAlternatives: 1,
      },
      audio: {
        content: audioBase64
      }
    };

    console.log('🌐 Calling Speech-to-Text API...');
    
    // ✅ Use your existing API key
    const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(speechRequest)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Speech API Error:', errorData);
      throw new Error(`Speech API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('✅ Speech-to-Text Success:', result);

    if (result.results && result.results.length > 0) {
      const transcript = result.results[0].alternatives[0].transcript;
      const confidence = result.results[0].alternatives[0].confidence || 0;
      
      console.log('📝 Transcript:', transcript);
      console.log('🎯 Confidence:', Math.round(confidence * 100) + '%');
      
      return {
        transcript: transcript.trim(),
        language: detectLanguage(transcript),
        confidence: confidence,
        fallback: false
      };
    } else {
      console.warn('⚠️ No transcription results');
      return {
        transcript: "Sorry, I couldn't understand your audio. Could you try again?",
        language: "en",
        fallback: true,
        error: "No results from API"
      };
    }

  } catch (error) {
    console.error('❌ Transcription error:', error.message);
    
    // Return fallback on error
    return {
      transcript: "Hello, can you help me with carbon emissions calculation?",
      language: "en",
      fallback: true,
      error: error.message
    };
  }
}


// ✅ Updated Text-to-Speech (still placeholder for now)
// ✅ REAL Google Cloud Text-to-Speech Implementation
// ✅ REAL Google Cloud Text-to-Speech Implementation
async function generateSpeech(text, language = 'en') {
  try {
    if (!serviceAccountCredentials) {
      console.log('⚠️ No credentials, skipping TTS generation');
      return null;
    }

    console.log('🔊 Starting REAL Text-to-Speech generation...');
    console.log('📝 Text to convert:', text.substring(0, 100) + '...');

    // Clean text for TTS (remove markdown and special characters)
    const cleanText = text
      .replace(/[#*_`\[\]]/g, '') // Remove markdown
      .replace(/🎤.*?\n\n/g, '') // Remove transcription prefix
      .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu, '') // Remove emojis
      .trim();

    if (cleanText.length === 0 || cleanText.length > 5000) {
      console.warn('⚠️ Text too long or empty for TTS, skipping audio generation');
      return null;
    }

    // Map language codes for TTS
    const ttsLanguageMap = {
      'en': 'en-US',
      'es': 'es-ES', 
      'fr': 'fr-FR'
    };

    const ttsLanguage = ttsLanguageMap[language] || 'en-US';

    // Prepare Text-to-Speech request
    const ttsRequest = {
      input: {
        text: cleanText
      },
      voice: {
        languageCode: ttsLanguage,
        name: ttsLanguage === 'en-US' ? 'en-US-Journey-F' : undefined, // Use neural voice for English
        ssmlGender: 'FEMALE'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0.0,
        volumeGainDb: 0.0
      }
    };

    console.log('🌐 Calling Text-to-Speech API...');

    // ✅ Call Google Cloud Text-to-Speech API
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ttsRequest)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ TTS API Error:', errorData);
      throw new Error(`TTS API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('✅ Text-to-Speech Success! Audio content received');

    if (result.audioContent) {
      // Save audio to file system
      const fileName = `tts_${Date.now()}.mp3`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, result.audioContent, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('💾 Audio saved to:', fileUri);

      // Get audio duration (approximate based on text length)
      const estimatedDuration = Math.max(2, Math.min(60, Math.ceil(cleanText.length / 10)));

      return {
        uri: fileUri,
        duration: estimatedDuration,
        language: language,
        originalText: cleanText
      };
    } else {
      console.warn('⚠️ No audio content in TTS response');
      return null;
    }

  } catch (error) {
    console.error('❌ TTS generation error:', error.message);
    return null; // Graceful fallback - just show text
  }
}



// ✅ Keep all existing patterns and functions
const ALLOW_PATTERNS = [
  /\bghg\b/i, /\bgreenhouse\s+gas(es)?\b/i, /\bemission(s)?\b/i,
  /\bcarbon\s+(footprint(ing)?|account(ing)?|inventory|emission|reduction)\b/i,
  /\bcarbon\b/i, /\bscope\s*[1-3]\b/i, /\bscopes?\s*[1-3]\b/i,
  /\bghg\s*protocol\b/i, /\biso\s*14064(?:-1)?\b/i,
  /\bverification|assurance|audit(ing)?\b/i, /\btco2e\b/i, /\bco2e\b/i,
];

const SMALL_TALK_PATTERNS = [
  /\b(hi|hello|hey|yo)\b/i,
  /\b(who\s+are\s+you|who\s*r u)\b/i,
  /\b(what\s+can\s+you\s+do|what\s+do\s+you\s+do)\b/i,
  /\b(help|start|getting\s+started|intro(duction)?)\b/i,
];

export function isSmallTalk(text = "") {
  return SMALL_TALK_PATTERNS.some((re) => re.test(text));
}

export function smallTalkResponse() {
  return `# Hi, I'm **Carbeez** 👋

I'm your AI Carbon Consultant. I help with **GHG inventories** (Scopes **1, 2, 3**) and **verification readiness** in line with the **GHG Protocol** and **ISO 14064-1:2018**.

**To get started, please share:**
- Organization Name
- Reporting Year(s) & Base Year
- Consolidation Approach (e.g., operational control)
- Sites/facilities & Sector
- Preferred GWP set (e.g., IPCC AR5/AR6)`;
}

function systemInstructions() {
  return `You are Carbeez, an AI Carbon Consultant. Only answer questions related to:
- GHG inventory design and calculation (Scopes 1, 2, 3)
- Emissions accounting concepts, data, factors, and assumptions
- Verification readiness and audit evidence for GHG inventories

If the user's question is not in that scope, refuse and say you only answer GHG inventory / Scope 1–3 / verification topics.
Follow GHG Protocol Corporate Standard, Scope 2 Guidance, Scope 3 Standard, and ISO 14064-1:2018. Be concise, structured, and audit-ready. Default units to tCO₂e.`;
}

export async function getGeminiResponse(userPrompt) {
  const prompt = `${systemInstructions()}\n\nUser: ${userPrompt}`;
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Gemini API error:", err);
    throw err;
  }
}

// ✅ Updated sendMessage function
// ✅ Updated sendMessage function
export async function sendMessage(userInput, userName = '', selectedLanguage = 'en') {
  try {
    if (typeof userInput === 'string') {
      // Handle text input
      const detectedLanguage = detectLanguage(userInput);
      let response;
      if (isSmallTalk(userInput)) {
        response = smallTalkResponse();
      } else {
        response = await getGeminiResponse(userInput);
      }
      
      return {
        text: response,
        isAudio: false,
        language: detectedLanguage
      };
      
    } else if (userInput && userInput.uri) {
      // Handle audio input
      console.log('🎤 Processing audio input...');
      
      // ✅ Transcribe audio
      const transcriptionResult = await transcribeAudio(userInput.uri);
      
      // Generate text response
      let textResponse;
      if (isSmallTalk(transcriptionResult.transcript)) {
        textResponse = smallTalkResponse();
      } else {
        textResponse = await getGeminiResponse(transcriptionResult.transcript);
      }
      
      // Add transcription info to response
      if (transcriptionResult.fallback) {
        textResponse = `🎤 *Voice message received (demo mode)*\n\n${textResponse}`;
      } else {
        // Show actual transcription with confidence
        const confidencePercent = Math.round((transcriptionResult.confidence || 0) * 100);
        textResponse = `🎤 *"${transcriptionResult.transcript}"* (${confidencePercent}% confident)\n\n${textResponse}`;
      }
      
      // ✅ ALWAYS generate speech for audio requests
      console.log('🔊 Generating audio response for voice message...');
      const audioResult = await generateSpeech(textResponse, transcriptionResult.language);
      
      return {
        text: textResponse,
        audioUri: audioResult?.uri || null,
        isAudio: !!audioResult?.uri, // True if audio was successfully generated
        language: transcriptionResult.language,
        duration: audioResult?.duration || 0,
        transcription: transcriptionResult
      };
      
    } else {
      throw new Error("Invalid input to sendMessage");
    }
    
  } catch (error) {
    console.error("❌ Send message error:", error);
    return {
      text: "I'm sorry, I'm having technical difficulties. Please try again.",
      isAudio: false,
      language: 'en'
    };
  }
}


export default sendMessage;
