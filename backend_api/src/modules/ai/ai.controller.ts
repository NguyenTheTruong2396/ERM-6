import { Request, Response } from 'express';
import { AiService } from './ai.service';

export class AiController {
  static async getStudyPlan(req: Request, res: Response): Promise<void> {
    const userId = Number(req.params.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(400).json({
        success: false,
        message: 'userId không hợp lệ.',
      });
      return;
    }

    try {
      const result = await AiService.buildStudyPlanForUser(userId);

      res.status(200).json({
        success: true,
        user_id: userId,
        raw_weaknesses_count: result.weaknessesCount,
        data: result.plan,
      });
    } catch (error: any) {
      console.error('[AiTutorController.getStudyPlan]:', error);

      const isTimeout = error.name === 'AbortError';
      res.status(isTimeout ? 504 : 500).json({
        success: false,
        message: isTimeout
          ? 'Mô hình AI phản hồi quá thời gian quy định.'
          : 'Lỗi hệ thống khi phân tích lộ trình học tập.',
        error: error.message,
      });
    }
  }
}