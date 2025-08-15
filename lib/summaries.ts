import { getDbConnection } from "./db";

// Type principal pour un résumé PDF
export type Summary = {
  id: string;
  user_id: string;
  title: string;
  original_file_url: string;
  summary_text: string;
  status: string;
  file_name: string;
  created_at: string;
  updated_at: string;
  word_count?: number;
};

// Récupère tous les résumés d'un utilisateur
export async function getSummaries(userId: string): Promise<Summary[]> {
  const sql = await getDbConnection();

  const rawRows: unknown[] = await sql`
    SELECT id, user_id, title, original_file_url, summary_text, status, file_name, created_at, updated_at
    FROM pdf_summaries
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;

  // Conversion explicite vers Summary
  const summaries: Summary[] = rawRows.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: String(r.id),
      user_id: String(r.user_id),
      title: String(r.title),
      original_file_url: String(r.original_file_url),
      summary_text: String(r.summary_text),
      status: String(r.status),
      file_name: String(r.file_name),
      created_at: String(r.created_at),
      updated_at: String(r.updated_at),
    };
  });

  return summaries;
}

// Récupère un résumé spécifique par ID
export async function getSummaryById(id: string): Promise<Summary | null> {
  try {
    const sql = await getDbConnection();

    const [row] = await sql`
      SELECT id, user_id, title, original_file_url, summary_text, status, file_name, created_at, updated_at,
        LENGTH(summary_text) - LENGTH(REPLACE(summary_text, ' ', '')) + 1 AS word_count
      FROM pdf_summaries
      WHERE id = ${id}
    `;

    if (!row) return null;

    const r = row as Record<string, unknown>;
    const summary: Summary = {
      id: String(r.id),
      user_id: String(r.user_id),
      title: String(r.title),
      original_file_url: String(r.original_file_url),
      summary_text: String(r.summary_text),
      status: String(r.status),
      file_name: String(r.file_name),
      created_at: String(r.created_at),
      updated_at: String(r.updated_at),
      word_count: r.word_count ? Number(r.word_count) : undefined,
    };

    return summary;
  } catch (err: unknown) {
    if (err instanceof Error)
      console.error("Error fetching summary by id:", err.message);
    else console.error("Error fetching summary by id:", err);
    return null;
  }
}

// Récupère le nombre d'uploads d'un utilisateur
export async function getUserUploadCount(userId: string): Promise<number> {
  const sql = await getDbConnection();

  try {
    const [result] = await sql`
      SELECT COUNT(*) AS count
      FROM pdf_summaries
      WHERE user_id = ${userId}
    `;

    const r = result as Record<string, unknown>;
    return r?.count ? Number(r.count) : 0;
  } catch (err: unknown) {
    if (err instanceof Error)
      console.error("Error fetching user upload count:", err.message);
    else console.error("Error fetching user upload count:", err);
    return 0;
  }
}
