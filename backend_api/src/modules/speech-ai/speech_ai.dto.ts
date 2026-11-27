import { PronunciationFeedbackDto } from "../ai/ai.dto";

export interface WordEvaluationDto {
  expected_word: string;
  spoken_word: string | null;
  confidence: number;
  status: 'CORRECT' | 'MISPRONOUNCED' | 'MISSING';
}

export interface PronunciationResultDto {
  target_text: string;
  phonetic: string | null;
  transcript: string;
  overall_score: number;
  word_details: WordEvaluationDto[];
  ai_coach: PronunciationFeedbackDto; // Lời khuyên tiếng Việt từ Qwen 3
}

export interface WhisperResponseDto {
  transcript: string;
  words: {
    word: string;
    probability: number;
    start: number;
    end: number;
  }[];
}

