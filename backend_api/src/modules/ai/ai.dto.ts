export interface GetStudyPlanParamsDto {
  userId: number;
}

export interface UserWeaknessDto {
  kc_id: number;
  unit_id: number;
  code: string;
  name: string;
  category: string;
  description: string | null;
  mastery_score: number;
  attempts_count: number;
}

export interface WeakAreaAdviceDto {
  unit_id: number;
  code: string;
  category: string;
  advice: string;
}

export interface StudyPlanResponseDto {
  summary: string;
  weak_areas: WeakAreaAdviceDto[];
  recommended_skills: string[];
}

export interface PronunciationCoachInputDto {
  target_text: string;
  phonetic: string | null;
  transcript: string;
  wrong_words: {
    expected_word: string;
    spoken_word: string | null;
    status: string;
  }[];
}

export interface PronunciationFeedbackDto {
  feedback: string;
  tips: string[];
}

export interface OllamaChatResponseDto {
  model: string;
  created_at: string;
  message?: {
    role: string;
    content?: string;
  };
  done: boolean;
}