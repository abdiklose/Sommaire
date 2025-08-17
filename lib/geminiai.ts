import { SUMMARY_SYSTEM_PROMPT } from '@/utils/prompts';
import { GoogleGenerativeAI, type Part } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateSummaryFromGemini = async (pdfText: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro-002',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    });

    // Crée un objet GenerateContentRequest
    const prompt = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: SUMMARY_SYSTEM_PROMPT },
            {
              text: `Transformez ce document en un résumé attrayant et facile à lire, agrémenté d'émojis pertinents dans leur contexte et d'une mise en forme Markdown appropriée:\n\n${pdfText}`,
            },
          ] as Part[],
        },
      ],
    };

    const result = await model.generateContent(prompt);
    const response = await result.response;

    if (!response.text()) {
      throw new Error('Empty response from Gemini API');
    }

    return response.text();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Gemini API Error:', error.message);
      throw error;
    } else {
      console.error('Gemini API Error:', error);
      throw new Error('Unknown error from Gemini API');
    }
  }
};
