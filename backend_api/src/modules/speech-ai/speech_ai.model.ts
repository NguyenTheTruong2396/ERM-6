import dbPool from "../../config/database";

export class SpeechAIModel {
  static async getVocabById(vocabId: number): Promise<{ word: string; phonetic: string | null } | null> {
    const query = `
      SELECT word, phonetic
      FROM sgk_management.vocab
      WHERE id = $1;
    `;
    const { rows } = await dbPool.query(query, [vocabId]);
    return rows[0] || null;
  }
}