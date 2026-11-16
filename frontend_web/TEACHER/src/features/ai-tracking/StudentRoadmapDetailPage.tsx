import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Target,
  BookOpen,
  Calendar,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  Lock,
  BookMarked,
  RotateCcw,
  ClipboardCheck,
  Info,
  ChevronLeft,
  ChevronRight,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SkillMastery {
  skill: string;
  percentage: number;
}

interface TextbookSection {
  id: string;
  sectionName: string;
  focusContent: string;
  status: 'COMPLETED' | 'NEED_REVIEW' | 'IN_PROGRESS' | 'NOT_STARTED';
  accuracy?: number;
}

interface SelfStudyRecommendation {
  id: string;
  unitNumber: number;
  sectionRef: string;
  topic: string;
  skill: string;
  priority: 'HIGH' | 'MEDIUM';
  status: 'REVIEWED' | 'LEARNING' | 'SUGGESTED';
  aiDiagnosis: string;
  selfStudyGuide: string;
}

interface UnitDetailData {
  unit: number;
  title: string;
  reviewGroup: number; // 1: Unit 1-3, 2: Unit 4-6, 3: Unit 7-9, 4: Unit 10-12
  status: 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED';
  masteryScore: number;
  sections: TextbookSection[];
}

interface ReviewCheckpoint {
  reviewNumber: number;
  title: string;
  unitRange: string;
  status: 'COMPLETED' | 'UNLOCKED' | 'LOCKED';
  score?: number;
  completedDate?: string;
  recommendations: SelfStudyRecommendation[];
}

interface FinalCourseAssessment {
  status: 'COMPLETED' | 'LOCKED';
  score?: number;
  completedDate?: string;
  overallComment?: string;
  strengths: { title: string; detail: string }[];
  weaknesses: { title: string; detail: string }[];
  masterRoadmap: SelfStudyRecommendation[];
}

interface StudentRoadmapProfile {
  studentId: string;
  studentCode: string;
  studentName: string;
  className: string;
  completedUnits: number;
  totalUnits: number;
  masteryPercentage: number;
  lastActive: string;
  skillBreakdown: SkillMastery[];
  units: UnitDetailData[];
  reviews: ReviewCheckpoint[];
  finalAssessment: FinalCourseAssessment;
}

const GRADE_6_UNITS_META: { unit: number; title: string; reviewGroup: number }[] = [
  { unit: 1, title: 'My New School', reviewGroup: 1 },
  { unit: 2, title: 'My House', reviewGroup: 1 },
  { unit: 3, title: 'My Friends', reviewGroup: 1 },
  { unit: 4, title: 'My Neighbourhood', reviewGroup: 2 },
  { unit: 5, title: 'Natural Wonders of Viet Nam', reviewGroup: 2 },
  { unit: 6, title: 'Our Tet Holiday', reviewGroup: 2 },
  { unit: 7, title: 'Television', reviewGroup: 3 },
  { unit: 8, title: 'Sports and Games', reviewGroup: 3 },
  { unit: 9, title: 'Cities of the World', reviewGroup: 3 },
  { unit: 10, title: 'Our Houses in the Future', reviewGroup: 4 },
  { unit: 11, title: 'Our Greener World', reviewGroup: 4 },
  { unit: 12, title: 'Robots', reviewGroup: 4 },
];

function buildFull12Units(customUnits: UnitDetailData[]): UnitDetailData[] {
  return GRADE_6_UNITS_META.map((meta) => {
    const found = customUnits.find((u) => u.unit === meta.unit);
    if (found) return found;
    return {
      unit: meta.unit,
      title: meta.title,
      reviewGroup: meta.reviewGroup,
      status: 'LOCKED',
      masteryScore: 0,
      sections: [],
    };
  });
}

function buildFull4Reviews(customReviews: ReviewCheckpoint[]): ReviewCheckpoint[] {
  const ranges: Record<number, string> = {
    1: 'Unit 1 – 3',
    2: 'Unit 4 – 6',
    3: 'Unit 7 – 9',
    4: 'Unit 10 – 12',
  };
  return [1, 2, 3, 4].map((num) => {
    const found = customReviews.find((r) => r.reviewNumber === num);
    if (found) return found;
    return {
      reviewNumber: num,
      title: `Review ${num} (${ranges[num]})`,
      unitRange: ranges[num],
      status: 'LOCKED',
      recommendations: [],
    };
  });
}

const mockDetailDatabase: Record<string, StudentRoadmapProfile> = {
  // Trường hợp A: Học sinh đã xong 3 Unit đầu & Review 1 (chưa xong hết 12 Unit)
  'hs-5': {
    studentId: 'hs-5',
    studentCode: 'HS-6005',
    studentName: 'Hoàng Quốc Bảo',
    className: 'Lớp 6A2',
    completedUnits: 3,
    totalUnits: 12,
    masteryPercentage: 62,
    lastActive: 'Hôm nay, 09:30',
    skillBreakdown: [
      { skill: 'Ngữ pháp (Grammar)', percentage: 56 },
      { skill: 'Phát âm (Pronunciation)', percentage: 50 },
      { skill: 'Từ vựng (Vocabulary)', percentage: 72 },
      { skill: 'Kỹ năng Nghe (Listening)', percentage: 68 },
    ],
    units: buildFull12Units([
      {
        unit: 1,
        title: 'My New School',
        reviewGroup: 1,
        status: 'COMPLETED',
        masteryScore: 78,
        sections: [
          { id: 'u1-s1', sectionName: 'Getting Started', focusContent: 'Đồ dùng học tập & hoạt động ở trường', status: 'COMPLETED', accuracy: 90 },
          { id: 'u1-s2', sectionName: 'A Closer Look 1', focusContent: 'Cụm động từ play, do, have, study', status: 'COMPLETED', accuracy: 75 },
          { id: 'u1-s3', sectionName: 'A Closer Look 2', focusContent: 'Thì hiện tại đơn & Trạng từ tần suất', status: 'COMPLETED', accuracy: 72 },
          { id: 'u1-s4', sectionName: 'Looking Back', focusContent: 'Tổng hợp kiến thức Unit 1', status: 'COMPLETED', accuracy: 75 },
        ],
      },
      {
        unit: 2,
        title: 'My House',
        reviewGroup: 1,
        status: 'COMPLETED',
        masteryScore: 60,
        sections: [
          { id: 'u2-s1', sectionName: 'Getting Started', focusContent: 'Từ vựng các phòng trong nhà', status: 'COMPLETED', accuracy: 80 },
          { id: 'u2-s2', sectionName: 'A Closer Look 1', focusContent: 'Đồ dùng gia đình & phát âm đuôi /s/, /z/', status: 'NEED_REVIEW', accuracy: 48 },
          { id: 'u2-s3', sectionName: 'A Closer Look 2', focusContent: 'Sở hữu cách & Giới từ chỉ nơi chốn', status: 'COMPLETED', accuracy: 65 },
          { id: 'u2-s4', sectionName: 'Looking Back', focusContent: 'Tổng hợp kiến thức Unit 2', status: 'COMPLETED', accuracy: 60 },
        ],
      },
      {
        unit: 3,
        title: 'My Friends',
        reviewGroup: 1,
        status: 'COMPLETED',
        masteryScore: 54,
        sections: [
          { id: 'u3-s1', sectionName: 'Getting Started', focusContent: 'Hội thoại & từ vựng miêu tả ngoại hình', status: 'COMPLETED', accuracy: 82 },
          { id: 'u3-s2', sectionName: 'A Closer Look 1', focusContent: 'Tính từ tính cách & phát âm /b/ - /p/', status: 'NEED_REVIEW', accuracy: 45 },
          { id: 'u3-s3', sectionName: 'A Closer Look 2', focusContent: 'Thì hiện tại tiếp diễn (Present Continuous)', status: 'NEED_REVIEW', accuracy: 50 },
          { id: 'u3-s4', sectionName: 'Looking Back', focusContent: 'Tổng hợp kiến thức Unit 3', status: 'COMPLETED', accuracy: 55 },
        ],
      },
    ]),
    reviews: buildFull4Reviews([
      {
        reviewNumber: 1,
        title: 'Review 1 (Unit 1 – 3)',
        unitRange: 'Unit 1 – 3',
        status: 'COMPLETED',
        score: 6.2,
        completedDate: 'Hôm qua, 20:15',
        recommendations: [
          {
            id: 'rec-r1-1',
            unitNumber: 3,
            sectionRef: 'Unit 3 • A Closer Look 1 (Trang 28)',
            topic: 'Phân biệt âm bật hơi /p/ và âm hữu thanh /b/',
            skill: 'Phát âm',
            priority: 'HIGH',
            status: 'LEARNING',
            aiDiagnosis: 'Trong bài Review 1, học sinh nhầm lẫn ở các từ picnic, patient, biscuit.',
            selfStudyGuide: 'Mở lại phần Pronunciation (Bài 4 & 5) trong sách Unit 3 để nghe mẫu và luyện đọc lại.',
          },
          {
            id: 'rec-r1-2',
            unitNumber: 3,
            sectionRef: 'Unit 3 • A Closer Look 2 (Trang 29)',
            topic: 'Thì Hiện tại tiếp diễn (Present Continuous)',
            skill: 'Ngữ pháp',
            priority: 'HIGH',
            status: 'SUGGESTED',
            aiDiagnosis: 'Hay thiếu động từ to-be (am/is/are) trước V-ing khi chia động từ theo ngữ cảnh.',
            selfStudyGuide: 'Xem lại khung Remember! trang 29 sách giáo khoa Unit 3.',
          },
          {
            id: 'rec-r1-3',
            unitNumber: 2,
            sectionRef: 'Unit 2 • A Closer Look 1 (Trang 18)',
            topic: 'Quy tắc phát âm đuôi -s / -es (/s/ và /z/)',
            skill: 'Phát âm',
            priority: 'MEDIUM',
            status: 'SUGGESTED',
            aiDiagnosis: 'Sai 2/4 câu phân loại âm cuối danh từ số nhiều trong bài Review 1.',
            selfStudyGuide: 'Học lại bảng phân nhóm âm cuối /s/ và /z/ trong sách Unit 2.',
          },
        ],
      },
    ]),
    finalAssessment: {
      status: 'LOCKED',
      strengths: [],
      weaknesses: [],
      masterRoadmap: [],
    },
  },

  // Trường hợp B: Học sinh ĐÃ HOÀN THÀNH HẾT 12 UNIT & LÀM BÀI TEST LỚN TỔNG HỢP
  'hs-1': {
    studentId: 'hs-1',
    studentCode: 'HS-6001',
    studentName: 'Nguyễn Linh Đan',
    className: 'Lớp 6A1',
    completedUnits: 12,
    totalUnits: 12,
    masteryPercentage: 84,
    lastActive: 'Hôm nay, 10:05',
    skillBreakdown: [
      { skill: 'Ngữ pháp (Grammar)', percentage: 82 },
      { skill: 'Phát âm (Pronunciation)', percentage: 76 },
      { skill: 'Từ vựng (Vocabulary)', percentage: 92 },
      { skill: 'Kỹ năng Nghe (Listening)', percentage: 86 },
    ],
    units: GRADE_6_UNITS_META.map((meta) => ({
      unit: meta.unit,
      title: meta.title,
      reviewGroup: meta.reviewGroup,
      status: 'COMPLETED',
      masteryScore: meta.unit === 8 || meta.unit === 10 ? 72 : 88,
      sections: [
        { id: `u${meta.unit}-s1`, sectionName: 'Getting Started', focusContent: `Từ vựng & hội thoại chủ đề ${meta.title}`, status: 'COMPLETED', accuracy: 92 },
        { id: `u${meta.unit}-s2`, sectionName: 'A Closer Look 1', focusContent: 'Từ vựng mở rộng & Ngữ âm trọng tâm', status: meta.unit === 10 ? 'NEED_REVIEW' : 'COMPLETED', accuracy: meta.unit === 10 ? 64 : 85 },
        { id: `u${meta.unit}-s3`, sectionName: 'A Closer Look 2', focusContent: 'Cấu trúc ngữ pháp chính của bài', status: meta.unit === 8 ? 'NEED_REVIEW' : 'COMPLETED', accuracy: meta.unit === 8 ? 66 : 86 },
        { id: `u${meta.unit}-s4`, sectionName: 'Looking Back', focusContent: `Tổng hợp kiến thức Unit ${meta.unit}`, status: 'COMPLETED', accuracy: 88 },
      ],
    })),
    reviews: [
      { reviewNumber: 1, title: 'Review 1 (Unit 1 – 3)', unitRange: 'Unit 1 – 3', status: 'COMPLETED', score: 8.8, completedDate: 'Tháng trước', recommendations: [] },
      { reviewNumber: 2, title: 'Review 2 (Unit 4 – 6)', unitRange: 'Unit 4 – 6', status: 'COMPLETED', score: 8.5, completedDate: '3 tuần trước', recommendations: [] },
      { reviewNumber: 3, title: 'Review 3 (Unit 7 – 9)', unitRange: 'Unit 7 – 9', status: 'COMPLETED', score: 8.0, completedDate: '2 tuần trước', recommendations: [] },
      { reviewNumber: 4, title: 'Review 4 (Unit 10 – 12)', unitRange: 'Unit 10 – 12', status: 'COMPLETED', score: 7.8, completedDate: '3 ngày trước', recommendations: [] },
    ],
    finalAssessment: {
      status: 'COMPLETED',
      score: 8.3,
      completedDate: 'Hôm qua, 19:40',
      overallComment:
        'Học sinh đã hoàn tất toàn bộ 12 Unit chương trình Tiếng Anh 6 với nền tảng từ vựng và đọc hiểu rất vững. Cần ôn tập trọng tâm lại 3 chuyên đề ngữ pháp – ngữ âm ở Học kỳ 2 trước khi chuyển tiếp lên lớp 7.',
      strengths: [
        {
          title: 'Vốn từ vựng theo chủ đề (Đạt 92%)',
          detail: 'Nắm chắc từ vựng xuyên suốt 12 Unit, đặc biệt tốt ở nhóm chủ đề Trường học (Unit 1), Kỳ quan thiên nhiên (Unit 5) và Thành phố (Unit 9).',
        },
        {
          title: 'Các thì cơ bản & So sánh tính từ (Unit 1 – 6)',
          detail: 'Sử dụng thành thạo thì Hiện tại đơn, Hiện tại tiếp diễn, So sánh hơn – So sánh nhất và động từ khuyết thiếu should/shouldn’t.',
        },
        {
          title: 'Kỹ năng Nghe – Đọc hiểu hội thoại (Đạt 86%)',
          detail: 'Tốc độ xử lý bài nghe điền từ và đọc hiểu đoạn văn ngắn đạt độ chính xác cao và ổn định.',
        },
      ],
      weaknesses: [
        {
          title: 'Phân biệt thì Quá khứ đơn và Hiện tại hoàn thành (Unit 8 & Unit 9)',
          detail: 'Còn nhầm lẫn dấu hiệu thời gian xác định (yesterday, ago) với trải nghiệm chưa rõ thời điểm (ever, never).',
        },
        {
          title: 'Câu điều kiện loại 1 & Động từ khuyết thiếu tương lai (Unit 10 – 12)',
          detail: 'Hay chia nhầm thì ở mệnh đề If (dùng will sau If) và nhầm sắc thái giữa will và might.',
        },
        {
          title: 'Trọng âm từ có 2 âm tiết (Unit 10)',
          detail: 'Tỷ lệ nhận diện đúng trọng âm danh từ/động từ 2 âm tiết trong bài Test tổng hợp mới đạt 64%.',
        },
      ],
      masterRoadmap: [
        {
          id: 'final-rec-1',
          unitNumber: 8,
          sectionRef: 'Unit 8 • A Closer Look 2 (Trang 19)',
          topic: 'Thì Quá khứ đơn (Past Simple) & Động từ bất quy tắc',
          skill: 'Ngữ pháp',
          priority: 'HIGH',
          status: 'SUGGESTED',
          aiDiagnosis: 'Sai 3/5 câu chia động từ bất quy tắc trong phần Ngữ pháp của Bài Test tổng hợp 12 Unit.',
          selfStudyGuide: 'Mở lại bảng động từ bất quy tắc thông dụng và khung Remember! trong sách Unit 8 để hệ thống lại.',
        },
        {
          id: 'final-rec-2',
          unitNumber: 11,
          sectionRef: 'Unit 11 • A Closer Look 2 (Trang 51)',
          topic: 'Câu điều kiện loại 1 (First Conditional)',
          skill: 'Ngữ pháp',
          priority: 'HIGH',
          status: 'SUGGESTED',
          aiDiagnosis: 'Nhầm cấu trúc mệnh đề điều kiện (If + S + V_s/es, S + will + V_inf).',
          selfStudyGuide: 'Xem lại phần lý thuyết và tự làm lại Bài tập 3, 4 trang 52 sách giáo khoa Unit 11.',
        },
        {
          id: 'final-rec-3',
          unitNumber: 10,
          sectionRef: 'Unit 10 • A Closer Look 1 (Trang 40)',
          topic: 'Trọng âm từ có hai âm tiết (Two-syllable words)',
          skill: 'Phát âm',
          priority: 'MEDIUM',
          status: 'SUGGESTED',
          aiDiagnosis: 'Đánh dấu nhầm trọng âm ở các từ như robot, palace, wireless, appliance.',
          selfStudyGuide: 'Nghe lại phần Pronunciation trang 40 sách Unit 10 và đọc to theo mẫu từng cặp từ.',
        },
      ],
    },
  },
};

export const StudentRoadmapDetailPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();

  const profile: StudentRoadmapProfile =
    (studentId && mockDetailDatabase[studentId]) || mockDetailDatabase['hs-1'];

  // Trang cụm 3 Unit ở cột trái (1: U1-3, 2: U4-6, 3: U7-9, 4: U10-12)
  const [groupPage, setGroupPage] = useState<number>(1);

  // Tab đang xem ở cột phải: 'final' (Tổng kết 12 Unit), 'review-1'..'review-4', hoặc 'unit-1'..'unit-12'
  const initialSelection =
    profile.finalAssessment.status === 'COMPLETED'
      ? 'final'
      : profile.reviews.find((r) => r.status === 'COMPLETED' && r.recommendations.length > 0)
        ? 'review-1'
        : `unit-${profile.units.find((u) => u.status === 'IN_PROGRESS')?.unit || 1}`;

  const [selectedTab, setSelectedTab] = useState<string>(initialSelection);

  const handleChangeGroupPage = (newPage: number) => {
    if (newPage < 1 || newPage > 4) return;
    setGroupPage(newPage);
    const firstUnitOfGroup = (newPage - 1) * 3 + 1;
    setSelectedTab(`unit-${firstUnitOfGroup}`);
  };

  const isFinalSelected = selectedTab === 'final';
  const isReviewSelected = selectedTab.startsWith('review-');
  const selectedReviewNum = isReviewSelected ? Number(selectedTab.split('-')[1]) : null;
  const selectedUnitNum =
    !isReviewSelected && !isFinalSelected ? Number(selectedTab.split('-')[1]) : null;

  const activeUnit =
    profile.units.find((u) => u.unit === selectedUnitNum) || profile.units[0];
  const activeReview =
    profile.reviews.find(
      (r) =>
        r.reviewNumber ===
        (isReviewSelected ? selectedReviewNum : activeUnit.reviewGroup)
    ) || profile.reviews[0];

  const currentGroupUnits = profile.units
    .filter((u) => u.reviewGroup === groupPage)
    .sort((a, b) => a.unit - b.unit);

  const currentGroupReview = profile.reviews.find(
    (r) => r.reviewNumber === groupPage
  );

  const words = profile.studentName.trim().split(' ');
  const initials =
    words.length >= 2
      ? (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase()
      : profile.studentName.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-8 font-sans pb-10 select-none">

      {/* Nút quay lại & Thẻ tổng quan học sinh */}
      <div className="space-y-4">
        <Link
          to="/teacher/ai-tracking"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
          <span>Quay lại danh sách lộ trình</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-700 font-black text-base flex items-center justify-center border border-sky-200/70 flex-shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {profile.studentName}
                </h1>
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                  {profile.studentCode}
                </span>
                <span className="text-xs font-extrabold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-100">
                  {profile.className}
                </span>
              </div>
              <div className="flex items-center gap-4 flex-wrap text-xs font-medium text-slate-400 mt-1.5">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Hoạt động gần nhất: {profile.lastActive}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="bg-slate-50 border border-slate-200/80 px-5 py-3 rounded-2xl text-left sm:text-right">
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Tiến độ tự học
              </div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {profile.completedUnits}{' '}
                <span className="text-sm font-bold text-slate-400">/ {profile.totalUnits} Unit</span>
              </div>
            </div>

            <div className="bg-sky-50/80 border border-sky-100 px-5 py-3 rounded-2xl text-left sm:text-right">
              <div className="text-[11px] font-extrabold text-sky-600 uppercase tracking-wider">
                Độ thành thạo
              </div>
              <div className="text-2xl font-black text-sky-700 mt-0.5">
                {profile.masteryPercentage}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bố cục 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Cột Trái (4 cols) */}
        <div className="lg:col-span-4 space-y-6">

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4"
          >
            {/* Header thẻ */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-600" />
                <h2 className="text-sm font-black text-slate-900">
                  Tiến độ tự học & Mốc Review
                </h2>
              </div>
              <span className="text-xs font-extrabold text-sky-600">
                {Math.round((profile.completedUnits / profile.totalUnits) * 100)}%
              </span>
            </div>

            {/* Thanh điều hướng chuyển cụm 3 Unit (4 trang) */}
            <div className="flex items-center justify-between gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/70">
              <button
                type="button"
                onClick={() => handleChangeGroupPage(groupPage - 1)}
                disabled={groupPage === 1}
                className="w-7 h-7 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-sky-600 hover:border-sky-300 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              <div className="flex items-center gap-1 flex-1 justify-center">
                {[1, 2, 3, 4].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleChangeGroupPage(p)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${groupPage === p
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'text-slate-500 hover:bg-white hover:text-slate-900'
                      }`}
                  >
                    {p === 1 ? 'U1–3' : p === 2 ? 'U4–6' : p === 3 ? 'U7–9' : 'U10–12'}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleChangeGroupPage(groupPage + 1)}
                disabled={groupPage === 4}
                className="w-7 h-7 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-sky-600 hover:border-sky-300 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Danh sách 3 Unit của trang hiện tại + Mốc Review tương ứng */}
            <div className="space-y-2.5">
              {currentGroupUnits.map((u) => {
                const isSelected = selectedTab === `unit-${u.unit}`;
                return (
                  <button
                    key={u.unit}
                    type="button"
                    onClick={() => setSelectedTab(`unit-${u.unit}`)}
                    className={`w-full text-left flex items-center justify-between p-3.5 rounded-2xl border text-xs transition-all cursor-pointer ${isSelected
                        ? 'bg-sky-50 border-sky-400 text-slate-900 font-extrabold ring-2 ring-sky-500/15'
                        : u.status === 'LOCKED'
                          ? 'bg-slate-50/40 border-slate-100 text-slate-400 font-medium hover:border-slate-200'
                          : 'bg-white border-slate-200/70 text-slate-700 font-semibold hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${u.status === 'COMPLETED'
                            ? 'bg-emerald-500'
                            : u.status === 'IN_PROGRESS'
                              ? 'bg-sky-500'
                              : 'bg-slate-300'
                          }`}
                      />
                      <span className="truncate">
                        Unit {u.unit}: {u.title}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md flex-shrink-0 ${u.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : u.status === 'IN_PROGRESS'
                            ? 'bg-sky-100 text-sky-700'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                    >
                      {u.status === 'COMPLETED'
                        ? 'Xong'
                        : u.status === 'IN_PROGRESS'
                          ? 'Đang học'
                          : 'Chưa mở'}
                    </span>
                  </button>
                );
              })}

              {/* Mốc Review 3 Unit */}
              {currentGroupReview && (
                <button
                  type="button"
                  onClick={() => setSelectedTab(`review-${currentGroupReview.reviewNumber}`)}
                  className={`w-full text-left flex items-center justify-between p-3.5 rounded-2xl border text-xs transition-all cursor-pointer ${selectedTab === `review-${currentGroupReview.reviewNumber}`
                      ? 'bg-amber-50/80 border-amber-400 text-slate-900 font-extrabold ring-2 ring-amber-500/15'
                      : currentGroupReview.status === 'COMPLETED'
                        ? 'bg-amber-50/30 border-amber-200/80 text-slate-800 font-bold hover:bg-amber-50/60'
                        : 'bg-slate-50/40 border-dashed border-slate-200 text-slate-400 font-medium hover:border-slate-300'
                    }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <ClipboardCheck
                      className={`w-4 h-4 flex-shrink-0 ${currentGroupReview.status === 'COMPLETED'
                          ? 'text-amber-600'
                          : 'text-slate-400'
                        }`}
                    />
                    <span className="truncate">
                      Review {currentGroupReview.reviewNumber} (Tạo lộ trình)
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md flex-shrink-0 ${currentGroupReview.status === 'COMPLETED'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-400'
                      }`}
                  >
                    {currentGroupReview.status === 'COMPLETED'
                      ? `${currentGroupReview.score}/10đ`
                      : 'Chưa làm'}
                  </span>
                </button>
              )}

              {/* Mốc Tổng kết Toàn khóa (Sau khi xong hết 12 Unit) */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedTab('final')}
                  className={`w-full text-left flex items-center justify-between p-3.5 rounded-2xl border text-xs transition-all cursor-pointer ${isFinalSelected
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-extrabold ring-2 ring-indigo-500/15'
                      : profile.finalAssessment.status === 'COMPLETED'
                        ? 'bg-indigo-50/40 border-indigo-200 text-indigo-900 font-bold hover:bg-indigo-50/70'
                        : 'bg-slate-50/50 border-dashed border-slate-200 text-slate-400 font-medium hover:border-slate-300'
                    }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <Award
                      className={`w-4 h-4 flex-shrink-0 ${profile.finalAssessment.status === 'COMPLETED'
                          ? 'text-indigo-600'
                          : 'text-slate-400'
                        }`}
                    />
                    <span className="truncate">Tổng kết 12 Unit & Lộ trình</span>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md flex-shrink-0 ${profile.finalAssessment.status === 'COMPLETED'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-100 text-slate-400'
                      }`}
                  >
                    {profile.finalAssessment.status === 'COMPLETED'
                      ? `${profile.finalAssessment.score}/10đ`
                      : 'Chưa mở'}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Năng lực 4 kỹ năng */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Target className="w-4 h-4 text-sky-600" />
              <h2 className="text-sm font-black text-slate-900">
                Năng lực tổng quát theo kỹ năng
              </h2>
            </div>

            <div className="space-y-4">
              {profile.skillBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">{item.skill}</span>
                    <span className="font-black text-slate-900">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.7, delay: idx * 0.1 }}
                      className={`h-full rounded-full ${item.percentage >= 75
                          ? 'bg-emerald-500'
                          : item.percentage >= 60
                            ? 'bg-sky-500'
                            : 'bg-rose-500'
                        }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Cột Phải (8 cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* TRƯỜNG HỢP 1: XEM BÁO CÁO & LỘ TRÌNH TỔNG KẾT TOÀN BỘ 12 UNIT */}
          {isFinalSelected ? (
            <motion.div
              key="final-assessment"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {profile.finalAssessment.status !== 'COMPLETED' ? (
                <div className="bg-white border border-slate-200/90 rounded-3xl p-12 shadow-xs text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto">
                    <Award className="w-6 h-6" />
                  </div>
                  <h2 className="text-base font-black text-slate-900">
                    Chưa hoàn thành Bài Test Tổng hợp 12 Unit
                  </h2>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Sau khi học sinh hoàn tất toàn bộ 12 Unit và thực hiện Bài Test lớn cuối khóa, hệ thống AI sẽ tổng hợp đánh giá toàn diện (điểm mạnh, điểm còn yếu và lộ trình ôn tập trọn bộ).
                  </p>
                </div>
              ) : (
                <>
                  {/* Thẻ Đánh giá Tổng quan: Ổn chỗ nào & Chưa ổn chỗ nào */}
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-base font-black text-slate-900">
                          Đánh giá tổng kết toàn bộ chương trình 12 Unit
                        </h2>
                      </div>
                      <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                        Điểm Test tổng hợp: {profile.finalAssessment.score}/10 ({profile.finalAssessment.completedDate})
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 leading-relaxed font-medium">
                      {profile.finalAssessment.overallComment}
                    </p>

                    {/* 2 Cột: Đã vững (Ổn) vs Cần cải thiện (Chưa ổn) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Cột Ổn */}
                      <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-black text-emerald-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Kiến thức đã vững (Điểm mạnh)</span>
                        </div>
                        <div className="space-y-2.5">
                          {profile.finalAssessment.strengths.map((st, i) => (
                            <div key={i} className="bg-white p-3 rounded-xl border border-emerald-100 space-y-1">
                              <div className="text-xs font-extrabold text-slate-900">{st.title}</div>
                              <p className="text-[11px] text-slate-600 leading-relaxed">{st.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cột Chưa ổn */}
                      <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-black text-amber-800">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>Phần chưa ổn (Cần củng cố)</span>
                        </div>
                        <div className="space-y-2.5">
                          {profile.finalAssessment.weaknesses.map((wk, i) => (
                            <div key={i} className="bg-white p-3 rounded-xl border border-amber-100 space-y-1">
                              <div className="text-xs font-extrabold text-slate-900">{wk.title}</div>
                              <p className="text-[11px] text-slate-600 leading-relaxed">{wk.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thẻ Lộ trình ôn tập hoàn chỉnh sau 12 Unit */}
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        <h2 className="text-sm font-black text-slate-900">
                          Lộ trình AI đề xuất ôn tập hoàn chỉnh (Toàn khóa 12 Unit)
                        </h2>
                      </div>
                      <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                        {profile.finalAssessment.masterRoadmap.length} chuyên đề trọng tâm
                      </span>
                    </div>

                    <div className="space-y-4">
                      {profile.finalAssessment.masterRoadmap.map((rec, index) => (
                        <div
                          key={rec.id}
                          className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/40 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-extrabold text-[11px] flex items-center justify-center flex-shrink-0">
                                {index + 1}
                              </span>
                              <span className="text-xs font-extrabold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-200/60">
                                {rec.sectionRef}
                              </span>
                              <span className="text-xs font-bold text-slate-500">
                                • Kỹ năng {rec.skill}
                              </span>
                            </div>

                            {rec.priority === 'HIGH' ? (
                              <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200/60 w-fit">
                                Ưu tiên ôn trước
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/60 w-fit">
                                Củng cố thêm
                              </span>
                            )}
                          </div>

                          <div className="text-sm font-black text-slate-900">{rec.topic}</div>

                          <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200/70 text-xs leading-relaxed">
                            <div className="text-slate-600">
                              <strong className="text-slate-800">Kết quả bài Test tổng hợp:</strong> {rec.aiDiagnosis}
                            </div>
                            <div className="flex items-start gap-2 text-sky-800 font-semibold pt-1.5 border-t border-slate-100">
                              <Sparkles className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                              <span>Hướng dẫn tự ôn trong sách: {rec.selfStudyGuide}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <>
              {/* TRƯỜNG HỢP 2: XEM CHI TIẾT TỪNG UNIT */}
              {!isReviewSelected && (
                <>
                  {activeUnit.status === 'LOCKED' ? (
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-12 shadow-xs text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Lock className="w-6 h-6" />
                      </div>
                      <h2 className="text-base font-black text-slate-900">
                        Unit {activeUnit.unit}: {activeUnit.title} chưa được mở
                      </h2>
                      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                        Học sinh cần hoàn thành các Unit trước đó để mở khóa nội dung này.
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      key={`unit-sections-${activeUnit.unit}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2">
                          <BookMarked className="w-4 h-4 text-sky-600" />
                          <h2 className="text-sm font-black text-slate-900">
                            Tiến độ học trong sách — Unit {activeUnit.unit}: {activeUnit.title}
                          </h2>
                        </div>
                        <span className="text-xs font-extrabold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
                          Độ nắm vững Unit {activeUnit.unit}:{' '}
                          <strong className="text-sky-700">{activeUnit.masteryScore}%</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {activeUnit.sections.map((sec) => (
                          <div
                            key={sec.id}
                            className={`p-4 rounded-2xl border space-y-2 ${sec.status === 'NEED_REVIEW'
                                ? 'bg-amber-50/40 border-amber-200'
                                : sec.status === 'IN_PROGRESS'
                                  ? 'bg-sky-50/40 border-sky-200'
                                  : 'bg-slate-50/60 border-slate-200/70'
                              }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-black text-slate-900">
                                {sec.sectionName}
                              </span>

                              {sec.status === 'COMPLETED' && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                                  <CheckCircle2 className="w-3 h-3" /> Đạt ({sec.accuracy}%)
                                </span>
                              )}
                              {sec.status === 'NEED_REVIEW' && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200">
                                  <RotateCcw className="w-3 h-3" /> Cần xem lại ({sec.accuracy}%)
                                </span>
                              )}
                              {sec.status === 'IN_PROGRESS' && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                                  <Clock className="w-3 h-3" /> Đang học ({sec.accuracy}%)
                                </span>
                              )}
                              {sec.status === 'NOT_STARTED' && (
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                  Chưa học tới
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-600 font-medium leading-relaxed">
                              {sec.focusContent}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </>
              )}

              {/* TRƯỜNG HỢP 3: LỘ TRÌNH SAU MỖI CỤM REVIEW 3 UNIT */}
              <motion.div
                key={`review-roadmap-${activeReview?.reviewNumber || 1}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-600" />
                    <h2 className="text-sm font-black text-slate-900">
                      Lộ trình AI tự ôn tập sau {activeReview?.title || 'Review 1'}
                    </h2>
                  </div>

                  {activeReview?.status === 'COMPLETED' ? (
                    <span className="px-3 py-1 rounded-xl text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200/70">
                      Điểm Review {activeReview.reviewNumber}: {activeReview.score}/10 ({activeReview.completedDate})
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-xl text-[11px] font-extrabold bg-slate-100 text-slate-500">
                      Chưa tới bài Review {activeReview?.reviewNumber || 1}
                    </span>
                  )}
                </div>

                {activeReview?.status !== 'COMPLETED' ? (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex items-start gap-3.5">
                    <Info className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs leading-relaxed">
                      <div className="font-black text-slate-900">
                        Chưa tạo lộ trình ôn tập cho {activeReview?.unitRange || 'Unit 1 – 3'}
                      </div>
                      <p className="text-slate-500">
                        Học sinh cần hoàn thành đủ 3 Unit (<strong>{activeReview?.unitRange || 'Unit 1 – 3'}</strong>) và làm bài <strong>Review {activeReview?.reviewNumber || 1}</strong> để AI phân tích lỗ hổng và đưa ra lộ trình ôn lại trong sách.
                      </p>
                    </div>
                  </div>
                ) : activeReview.recommendations.length === 0 ? (
                  <div className="py-10 text-center space-y-1.5">
                    <div className="text-sm font-bold text-emerald-600">
                      Học sinh hoàn thành xuất sắc {activeReview.title} ({activeReview.score}/10 điểm)
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      Không phát hiện lỗ hổng kiến thức trong cụm {activeReview.unitRange}.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeReview.recommendations.map((rec, index) => (
                      <div
                        key={rec.id}
                        className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/40 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-extrabold text-[11px] flex items-center justify-center flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-xs font-extrabold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-200/60">
                              {rec.sectionRef}
                            </span>
                            <span className="text-xs font-bold text-slate-500">
                              • Kỹ năng {rec.skill}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {rec.priority === 'HIGH' && (
                              <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200/60">
                                Ưu tiên ôn lại
                              </span>
                            )}
                            {rec.status === 'LEARNING' && (
                              <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200/60">
                                Học sinh đang xem lại
                              </span>
                            )}
                            {rec.status === 'SUGGESTED' && (
                              <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/60">
                                Đề xuất tự ôn
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-sm font-black text-slate-900">
                          {rec.topic}
                        </div>

                        <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200/70 text-xs leading-relaxed">
                          <div className="text-slate-600">
                            <strong className="text-slate-800">Phân tích từ bài Review {activeReview.reviewNumber}:</strong> {rec.aiDiagnosis}
                          </div>
                          <div className="flex items-start gap-2 text-sky-800 font-semibold pt-1.5 border-t border-slate-100">
                            <Sparkles className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                            <span>Hướng dẫn tự ôn trong sách: {rec.selfStudyGuide}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};