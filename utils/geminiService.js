const { getGeminiModel } = require('./geminiClient');
const { GEMINI_MODEL } = require('../config/constants');

/**
 * Ask Gemini with a simple prompt; uses model from env.
 * @param {string} prompt - The text prompt to send to Gemini.
 * @returns {Promise<string>} Gemini-generated text.
 */
async function askGemini(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('askGemini requires a string prompt');
  }
  const model = getGeminiModel(GEMINI_MODEL);
  const result = await model.generateContent(prompt);
  const text = result?.response?.text?.() || result?.response?.text || '';
  return text;
}

module.exports = { askGemini };