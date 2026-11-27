import dbPool from '../../config/database';
import { UserWeaknessDto } from './ai.dto';

export class AiModel {
  static async findWeaknessesByUserId(userId: number, limit = 5): Promise<UserWeaknessDto[]> {
    const query = `
      SELECT 
        kc.id AS kc_id,
        kc.unit_id,
        kc.code,
        kc.name,
        kc.category,
        kc.description,
        ukm.mastery_score,
        ukm.attempts_count
      FROM ai_management.user_kc_mastery ukm
      JOIN ai_management.knowledge_components kc ON ukm.kc_id = kc.id
      WHERE ukm.user_id = $1
        AND ukm.mastery_score < 0.7
      ORDER BY ukm.mastery_score ASC, ukm.attempts_count DESC
      LIMIT $2;
    `;

    const { rows } = await dbPool.query<UserWeaknessDto>(query, [userId, limit]);
    return rows;
  }
}