import { SpeechAIModel } from './speech_ai.model';
import { PronunciationResultDto, WhisperResponseDto, WordEvaluationDto } from './speech_ai.dto';
import { AiService } from '../ai/ai.service';

export class SpeechAIService {
  private static readonly WHISPER_URL = process.env.WHISPER_BASE_URL || 'http://localhost:8001/transcribe';

  static async evaluateVocabPronunciation(
    vocabId: number,
    audioBuffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<PronunciationResultDto> {
    const vocab = await SpeechAIModel.getVocabById(vocabId);
    if (!vocab) {
      throw new Error(`Không tìm thấy từ vựng có id = ${vocabId}`);
    }

    // 1. Gửi audio sang Python Faster-Whisper chấm điểm
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(audioBuffer)], { type: mimeType });
    formData.append('file', blob, fileName);
    formData.append('target_text', vocab.word);

    const response = await fetch(this.WHISPER_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Whisper Service error: ${response.status}`);
    }

    const whisperData = (await response.json()) as WhisperResponseDto;
    const scoreResult = this.calculateScore(vocab.word, vocab.phonetic, whisperData);

    // 2. Lọc ra các từ đọc chưa chuẩn để gửi sang Qwen 3 phân tích
    const wrongWords = scoreResult.word_details.filter((w) => w.status !== 'CORRECT');

    if (wrongWords.length === 0 && scoreResult.overall_score >= 85) {
      return {
        ...scoreResult,
        ai_coach: {
          feedback: 'Phát âm rất chuẩn xác! Bạn đã đọc rõ ràng từng âm tiết.',
          tips: [],
        },
      };
    }

    // 3. Gọi Qwen 3 sinh hướng dẫn sửa lỗi (có fallback nếu Ollama bận)
    try {
      const aiCoach = await AiService.explainPronunciationErrors({
        target_text: vocab.word,
        phonetic: vocab.phonetic,
        transcript: scoreResult.transcript,
        wrong_words: wrongWords,
      });

      return {
        ...scoreResult,
        ai_coach: aiCoach,
      };
    } catch (error) {
      console.error('[PronunciationService - Qwen Fallback]:', error);
      return {
        ...scoreResult,
        ai_coach: {
          feedback: 'Bạn hãy nghe lại giọng đọc mẫu và chú ý các từ được đánh dấu đỏ bên trên nhé.',
          tips: [],
        },
      };
    }
  }

  private static calculateScore(
    targetText: string,
    phonetic: string | null,
    whisperData: WhisperResponseDto
  ): Omit<PronunciationResultDto, 'ai_coach'> {
    const expectedWords = targetText
      .toLowerCase()
      .replace(/[.,!?]/g, '')
      .split(/\s+/)
      .filter(Boolean);

    const spokenWords = whisperData.words;
    const wordDetails: WordEvaluationDto[] = [];
    let totalScore = 0;

    expectedWords.forEach((expected, index) => {
      const matched = spokenWords[index];

      if (!matched) {
        wordDetails.push({
          expected_word: expected,
          spoken_word: null,
          confidence: 0,
          status: 'MISSING',
        });
        return;
      }

      const isExactWord = matched.word === expected;
      const wordScore = isExactWord ? Math.round(matched.probability * 100) : 0;
      totalScore += wordScore;

      wordDetails.push({
        expected_word: expected,
        spoken_word: matched.word,
        confidence: matched.probability,
        status: isExactWord && matched.probability >= 0.65 ? 'CORRECT' : 'MISPRONOUNCED',
      });
    });

    const overallScore = expectedWords.length > 0 ? Math.round(totalScore / expectedWords.length) : 0;

    return {
      target_text: targetText,
      phonetic,
      transcript: whisperData.transcript,
      overall_score: overallScore,
      word_details: wordDetails,
    };
  }
}