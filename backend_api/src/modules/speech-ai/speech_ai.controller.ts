// src/modules/pronunciation/pronunciation.controller.ts
import { Request, Response } from 'express';
import { SpeechAIService } from './speech_ai.service';

export class SpeechAIController {
  static async evaluate(req: Request, res: Response): Promise<void> {
    const vocabId = Number(req.body.vocabId);
    const file = req.file;

    if (!file) {
      res.status(400).json({ success: false, message: 'Vui lòng gửi kèm file ghi âm (field: audio).' });
      return;
    }
    if (!Number.isInteger(vocabId) || vocabId <= 0) {
      res.status(400).json({ success: false, message: 'vocabId không hợp lệ.' });
      return;
    }

    try {
      const result = await SpeechAIService.evaluateVocabPronunciation(
        vocabId,
        file.buffer,
        file.originalname,
        file.mimetype
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('[PronunciationController.evaluate]:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi chấm điểm phát âm.',
        error: error.message,
      });
    }
  }
}