import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import OpenAI from "openai";
import Bottleneck from "bottleneck";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Limiteur pour environ 20 requêtes par minute
const limiter = new Bottleneck({
  minTime: 3000, // 1 requête toutes les 3 secondes
});

export async function generateSummaryFromOpenAI(pdfText: string) {
  try {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: SUMMARY_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Transformez ce document en un résumé attrayant et facile à lire, agrémenté d'émojis pertinents dans leur contexte et d'une mise en forme Markdown appropriée:\n\n${pdfText}`,
      },
    ];

    const completion = await limitedCompletion(messages);

    return completion.choices[0].message?.content ?? "";
  } catch (error: unknown) {
    if (isOpenAIError(error) && error.status === 429) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    throw error;
  }
}

// Type guard pour vérifier que c'est bien une erreur OpenAI
function isOpenAIError(error: unknown): error is { status?: number } {
  return typeof error === "object" && error !== null && "status" in error;
}

export const limitedCompletion = limiter.wrap(
  async (messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) => {
    return await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_completion_tokens: 1500,
    });
  },
);
