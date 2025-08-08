// server/services/aiService.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Extracts structured data and generates a summary from bill text in a specified language.
 * @param {string} billText - The raw text from the bill.
 * @param {string} language - The target language for the summary (e.g., "English", "Hindi").
 * @returns {Promise<object>} - A promise that resolves to an object like { summary, structuredData }.
 */
const getBillSummary = async (billText, language = 'English') => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    You are an expert utility bill data extractor. Analyze the following bill text and return a JSON object.
    The JSON object must have two keys: "structuredData" and "summary".
    - "structuredData" should be an object containing: totalCost (number), unitsUsed (string, e.g., "389 KWH"), and dueDate (string, in YYYY-MM-DD format).
    - "summary" should be a concise summary of the bill, written in the following language: ${language}.

    If a value is not found, set it to null.

    Bill Text:
    """
    ${billText}
    """

    JSON Output:
  `;

  try {
    console.log(`Sending text to Google Gemini for summarization in ${language}...`);
    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Clean the response to ensure valid JSON
    const jsonString = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonString);

    console.log('Google Gemini data received.');
    return data;
  } catch (error) {
    console.error('Error calling or parsing Google Gemini API response:', error);
    throw new Error('Failed to process data from Google Gemini.');
  }
};

module.exports = { getBillSummary };
