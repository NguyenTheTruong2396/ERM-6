import { AiModel } from './ai.model';
import { StudyPlanResponseDto,
        UserWeaknessDto,
        PronunciationCoachInputDto,
        PronunciationFeedbackDto,
        OllamaChatResponseDto} from './ai.dto';

export class AiService {
  private static readonly OLLAMA_URL = `${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}/api/chat`;
  private static readonly MODEL_NAME = process.env.OLLAMA_MODEL || 'qwen3:4b';
  private static readonly TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 30000);

  static async buildStudyPlanForUser(userId: number): Promise<{
    weaknessesCount: number;
    plan: StudyPlanResponseDto;
  }> {
    const weaknesses = await AiModel.findWeaknessesByUserId(userId);

    if (weaknesses.length === 0) {
      return {
        weaknessesCount: 0,
        plan: {
          summary: 'Bạn đang nắm vững các kiến thức đã học. Hãy tiếp tục luyện tập các bài nâng cao hoặc chuyển sang Unit tiếp theo.',
          weak_areas: [],
          recommended_skills: ['READING', 'LISTENING'],
        },
      };
    }

    const plan = await this.callQwenTutor(weaknesses);
    return {
      weaknessesCount: weaknesses.length,
      plan,
    };
  }

  private static async callQwenTutor(weaknesses: UserWeaknessDto[]): Promise<StudyPlanResponseDto> {
    const systemPrompt = `Bạn là gia sư tiếng Anh lớp 6 (sách Global Success).
Nhiệm vụ của bạn là phân tích dữ liệu điểm yếu của học sinh và đưa ra lời khuyên ngắn gọn, dễ hiểu bằng tiếng Việt.
BẮT BUỘC trả về đúng định dạng JSON, không thêm bất kỳ văn bản giải thích nào bên ngoài JSON.`;

    const userPrompt = `Dữ liệu các đơn vị kiến thức (Knowledge Components) học sinh đang có điểm thành thạo thấp (mastery_score < 0.7):
${JSON.stringify(weaknesses, null, 2)}

Trả về JSON theo đúng cấu trúc sau:
{
  "summary": "Nhận xét tổng quan 1-2 câu về tình hình học tập hiện tại",
  "weak_areas": [
    {
      "unit_id": số nguyên unit_id từ dữ liệu đầu vào,
      "code": "mã code từ dữ liệu đầu vào",
      "category": "tên kỹ năng (category) từ dữ liệu đầu vào",
      "advice": "Mẹo ghi nhớ kiến thức hoặc cách khắc phục lỗi sai trong 1 câu ngắn gọn"
    }
  ],
  "recommended_skills": ["Tối đa 2 kỹ năng (category) cần ưu tiên luyện tập ngay"]
}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const response = await fetch(this.OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.MODEL_NAME,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          format: 'json',
          think: false,
          stream: false,
          options: {
            temperature: 0.2,
            num_ctx: 2048,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

    const data = (await response.json()) as {
        message?: {
            content?: string;
        };
    };
      const rawContent: string = data.message?.content || '{}';
      const cleanJson = rawContent.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

      return JSON.parse(cleanJson) as StudyPlanResponseDto;
    } finally {
      clearTimeout(timeout);
    }
  }

  static async explainPronunciationErrors(
    input: PronunciationCoachInputDto
  ): Promise<PronunciationFeedbackDto> {
    const systemPrompt = `Bạn là giáo viên dạy phát âm tiếng Anh lớp 6 (sách Global Success).
Nhiệm vụ của bạn là chỉ ra lỗi phát âm của học sinh và hướng dẫn cách đặt lưỡi, bật âm cuối bằng tiếng Việt thật ngắn gọn, dễ hiểu cho học sinh cấp 2.
BẮT BUỘC trả về đúng định dạng JSON, không thêm văn bản bên ngoài.`;

    const userPrompt = `Dữ liệu chấm phát âm của học sinh:
- Từ/câu mẫu: "${input.target_text}" (Phiên âm IPA: ${input.phonetic || 'không có'})
- Học sinh thực tế đọc thành: "${input.transcript || '(không nghe rõ)'}"
- Chi tiết từ đọc chưa chuẩn: ${JSON.stringify(input.wrong_words)}

Hãy trả về JSON theo đúng cấu trúc sau:
{
  "feedback": "1 câu nhận xét khích lệ và chỉ rõ lỗi sai chính",
  "tips": [
    "Mẹo sửa phát âm cụ thể cho từ bị sai (tối đa 2 mẹo ngắn gọn)"
  ]
}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const response = await fetch(this.OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.MODEL_NAME,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          format: 'json',
          think: false,
          stream: false,
          options: {
            temperature: 0.2,
            num_ctx: 1024, // Giảm context xuống 1024 vì prompt phát âm rất ngắn, giúp nhẹ VRAM tối đa
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = (await response.json()) as OllamaChatResponseDto;
      const rawContent = data.message?.content || '{}';
      const cleanJson = rawContent.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

      return JSON.parse(cleanJson) as PronunciationFeedbackDto;
    } finally {
      clearTimeout(timeout);
    }
  }

}