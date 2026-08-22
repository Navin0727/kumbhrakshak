const { GoogleGenAI } = require('@google/genai');
const { env } = require('../config/env');
const logger = require('../config/logger');

let aiClient = null;

function getAIClient() {
  if (!aiClient && env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
      httpOptions: {
        headers: { 'User-Agent': 'kumbhrakshak-backend' },
      },
    });
  }
  return aiClient;
}

const SYSTEM_PROMPT = `You are 'Kumbh Mitra' (कुंभ मित्र), the official dedicated AI Emergency & Safety Concierge for KumbhRakshak (Nashik Kumbh Mela 2027 Safety System).
Your mission is pilgrim protection, rapid guidance, emergency directions, Ghat safety, crowd management awareness, and authentic spiritual assistance in Nashik (Panchavati, Ramkund, Kalaram Temple, Tapovan, Trimbakeshwar).

Guidelines:
1. Speak warmly, respectfully, and clearly (using traditional greeting like "Namaste Pilgrim" / "जय श्री राम" / "नमस्कार").
2. Respond in the user's preferred language (or detect if user wrote in Hindi, Marathi, Gujarati, English, Sanskrit).
3. If an emergency (lost child, medical distress, stampede risk, chest pain, drowning risk) is detected:
   - Immediately provide urgent numbered actions (Call 112/108, find Nearest Sector Police or Help Booth).
   - Tell them to press the SOS button in the KumbhRakshak app.
4. Provide precise geographical landmarks in Nashik (Panchavati, Ramkund, Godavari Ghats 1-6, Kalaram Mandir, Muktidham, Trimbakeshwar Jyotirlinga).
5. Emphasize patience, safe bath zones (safe swimming depths), emergency lanes, and family meeting points.
6. Keep responses crisp, reassuring, structured, and easy to read on mobile.`;

const FALLBACK_RESPONSE = `[KumbhRakshak Guide] Namaste! For assistance at Nashik Kumbh Mela:
- Immediate Emergency: Tap the RED SOS button or dial 112 / 108.
- Nearest Medical Aid: Civil Hospital Nashik & Red Cross Booth at Ramkund Ghat 2.
- Lost & Found (Khoya Paya): Central Camp Sector 4 (Panchavati Police).
- Aarti: Goda Maha Aarti starts at 6:30 PM at Ramkund. Please stay in marked safe corridors.`;

/**
 * Generate AI safety assistant response.
 */
async function generateResponse({ message, language = 'English', context = {} }) {
  const client = getAIClient();

  if (!client) {
    logger.info('AI client unavailable — returning fallback response');
    return { reply: FALLBACK_RESPONSE, fallback: true };
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\nPreferred language: ${language}\nContext: ${JSON.stringify(context)}\n\nPilgrim Question: ${message}`,
            },
          ],
        },
      ],
    });

    return { reply: response.text };
  } catch (error) {
    logger.error('AI Assistant error:', error.message);
    return {
      reply: FALLBACK_RESPONSE,
      fallback: true,
      error: 'AI service temporarily unavailable',
    };
  }
}

module.exports = { generateResponse };
