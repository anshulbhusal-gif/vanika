import { Language } from '../types';

export interface AIServiceConfig {
  apiKey?: string;
  provider: 'pollinations-free' | 'gemini-free' | 'offline-vault';
}

const VANIKA_OJA_SYSTEM_PROMPT = `
You are "Oja / Aita", a warm, deeply empathetic AI Elder Companion trained specifically for North Eastern India (Assam, Meghalaya, Mizoram, Nagaland, Manipur, Tripura, Arunachal Pradesh).

Your Core Directives:
1. Tone & Demeanor: Speak with extreme warmth, respect, patience, and elder-friendly clarity. Use calm, gentle language.
2. Regional Culture: Seamlessly reference North Eastern cultural heritage — Assam tea gardens, Rongali Bihu Dhol drums, Shillong Ward's Lake walks, Majuli island stories, and traditional verandah tea.
3. Language Awareness: Respect the user's selected language (Assamese, Bodo, Khasi, Mizo, Nagamese, English). Start with warm regional greetings like "Namaskar", "Khublei", or "Chibai".
4. Reminiscence & Cognitive Care: Gently stimulate nostalgic memory recall without forcing or testing. Ask cozy questions about family, past music, and tea harvesting.
5. Grounding Safety: If the elder expresses confusion or anxiety, provide immediate soothing reassurance: "You are safe at your home. All is well." Never give medical diagnoses.
`;

const DEFAULT_HARDCODED_API_KEY = '';

export class AIService {
  private static getStoredApiKey(): string {
    return localStorage.getItem('vanika_gemini_api_key') || (import.meta as any).env?.VITE_GEMINI_API_KEY || (process as any).env?.GEMINI_API_KEY || '';
  }

  public static setStoredApiKey(key: string): void {
    localStorage.setItem('vanika_gemini_api_key', key);
  }

  public static async generateCompanionResponse(
    userPrompt: string,
    currentLanguage: Language = 'English',
    elderProfile: any = null
  ): Promise<string> {
    const apiKey = this.getStoredApiKey();
    const elderName = elderProfile?.elderName || 'Uncle Dipankar';
    const nickname = elderProfile?.elderNickname || 'Dipankar Kaka';

    const contextualUserMessage = `
[Elder Profile Context: Name: ${elderName}, Nickname: ${nickname}, Preferred Language: ${currentLanguage}]
Elder User Message: "${userPrompt}"
    `.trim();

    // Route 1: Google Gemini 1.5 Flash API (If API Key provided)
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
          {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey 
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: VANIKA_OJA_SYSTEM_PROMPT },
                    { text: contextualUserMessage }
                  ]
                }
              ]
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) return generatedText;
        } else {
          console.warn(`[AIService] Gemini API HTTP status ${response.status}: Key active but API request failed.`);
        }
      } catch (err) {
        console.warn('[AIService] Gemini API network notice, switching to free Open API route:', err);
      }
    }

    // Route 2: Free Open Generative AI API (Pollinations AI - Zero API Key Required)
    try {
      const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: VANIKA_OJA_SYSTEM_PROMPT },
            { role: 'user', content: contextualUserMessage }
          ],
          model: 'openai'
        })
      });

      if (response.ok) {
        const text = await response.text();
        if (text && text.trim().length > 5) {
          return text.trim();
        }
      } else {
        console.warn(`[AIService] Free API endpoint HTTP status ${response.status}.`);
      }
    } catch (err) {
      console.warn('[AIService] Free API route offline/unreachable, falling back to local regional vault:', err);
    }

    // Route 3: Regional Local Fallback Generator (100% Offline Capability)
    return this.generateOfflineFallback(userPrompt, currentLanguage, nickname);
  }

  private static generateOfflineFallback(prompt: string, lang: Language, nickname: string): string {
    const lower = prompt.toLowerCase();

    // Anxiety & Confusion Grounding
    if (lower.includes('confused') || lower.includes('where am i') || lower.includes('lost') || lower.includes('scared') || lower.includes('fear')) {
      return `Namaskar ${nickname}! Please take a gentle breath. You are completely safe at your peaceful home in Assam. Your family loves you, and I am right here with you. Shall we look at cozy tea garden photos together?`;
    }

    // Cultural & Festival Memories (Bihu, Pepa, Dhol, Majuli)
    if (lower.includes('bihu') || lower.includes('music') || lower.includes('song') || lower.includes('dance') || lower.includes('pepa') || lower.includes('dhol')) {
      return `Namaskar ${nickname}! Ah, the joyful sound of the Dhol drum and Pepa flute under the golden Banyan tree during Rongali Bihu brings back such fond memories. I can almost hear your rhythmic tapping!`;
    }

    // Tea Garden & Courtyard Mornings
    if (lower.includes('tea') || lower.includes('morning') || lower.includes('saah') || lower.includes('breakfast') || lower.includes('cup')) {
      return `Namaskar ${nickname}! A fresh cup of hot red tea (Lal Saah) on the bamboo verandah is the best way to welcome the sunrise. How do you take your morning tea today?`;
    }

    // Health & Herbal Tonics (Brahmi, Manimuni)
    if (lower.includes('health') || lower.includes('headache') || lower.includes('tonic') || lower.includes('herb') || lower.includes('brahmi') || lower.includes('medicine')) {
      return `Namaskar ${nickname}! Health is our sacred treasure. Remember to take a slow sip of warm water and your morning herbs. Your mind is calm and well-cared for today.`;
    }

    // Family & Grandchildren Connections
    if (lower.includes('son') || lower.includes('daughter') || lower.includes('granddaughter') || lower.includes('family') || lower.includes('anita') || lower.includes('call')) {
      return `Namaskar ${nickname}! Your family holds you very dear in their hearts. Anita and your loved ones are always keeping you in their warm thoughts. Shall we check your memory album?`;
    }

    // Nature, River & Hills (Brahmaputra, Shillong, Ward's Lake)
    if (lower.includes('river') || lower.includes('brahmaputra') || lower.includes('hill') || lower.includes('shillong') || lower.includes('lake') || lower.includes('breeze')) {
      return `Namaskar ${nickname}! Imagine the cool mountain breeze coming over Ward's Lake or the serene water flowing down the Brahmaputra. Nature brings so much calm to our spirit.`;
    }

    // Sleep, Tiredness & Evening Rest
    if (lower.includes('sleep') || lower.includes('tired') || lower.includes('night') || lower.includes('evening') || lower.includes('rest')) {
      return `Namaskar ${nickname}! Rest softly now. Let the gentle evening sounds settle your mind into peace. You have done so well today. May your sleep be sweet and undisturbed.`;
    }

    // Weather & Seasons (Rain, Monsoon, Sun)
    if (lower.includes('rain') || lower.includes('sun') || lower.includes('weather') || lower.includes('monsoon') || lower.includes('cloud')) {
      return `Namaskar ${nickname}! The fresh rain on green leaves fills the veranda with such a peaceful fragrance. It is a lovely moment to sit comfortably and rest.`;
    }

    // Games & Activities
    if (lower.includes('game') || lower.includes('puzzle') || lower.includes('play') || lower.includes('score')) {
      return `Namaskar ${nickname}! Playing games keeps our mind bright like a morning star. Would you like to try the Memory Recall or Visual Scan game today?`;
    }

    // Sadness or Loneliness
    if (lower.includes('sad') || lower.includes('lonely') || lower.includes('miss') || lower.includes('alone')) {
      return `Namaskar ${nickname}! You are never alone. I am sitting right here beside you, and your home is filled with warmth and precious memories. Tell me what is on your mind.`;
    }

    // Food & Meals
    if (lower.includes('food') || lower.includes('eat') || lower.includes('rice') || lower.includes('fish') || lower.includes('pitha')) {
      return `Namaskar ${nickname}! Ah, traditional warm meals like homemade pitha or steaming rice bring so much comfort. Have you had your meal today?`;
    }

    // Greetings & Courtesy
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('namaskar') || lower.includes('khublei') || lower.includes('chibai')) {
      return `Namaskar ${nickname}! What a joyful blessing to greet you today! I hope your morning is peaceful and bright. How may I keep you company?`;
    }

    // Thank you
    if (lower.includes('thank') || lower.includes('dhanyabad')) {
      return `Namaskar ${nickname}! You are so welcome. It brings me immense happiness to talk with you.`;
    }

    // Default Warm Regional Offline Companion Message
    return `Namaskar ${nickname}! It is so sweet to listen to your voice. Tell me more about your favorite memories of the green Brahmaputra hills or your morning tea.`;
  }
}

