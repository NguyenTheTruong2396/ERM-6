export interface TeacherProfile {
  id: string;
  code: string;
  name: string;
  email: string;
  subject: string;
  phone: string;
  assignedClasses: string[];
}

export interface ClassSummary {
  id: string;
  code: string;
  name: string;
  academicYear: string;
  studentCount: number;
  averageScore: number;
  submissionRate: number; // percentage
  gradeDistribution: {
    excellent: number; // Giỏi (8.0 - 10)
    good: number;      // Khá (6.5 - 7.9)
    average: number;   // Trung bình (5.0 - 6.4)
    weak: number;      // Yếu (< 5.0)
  };
}

export interface TeacherStudent {
  id: string;
  code: string;
  name: string;
  email: string;
  classId: string;
  className: string;
  parentName: string;
  parentPhone: string;
  avgScore: number;
  completedTests: number;
  totalTests: number;
  learningStatus: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'WEAK';
  completedUnits: number;
  totalUnits: number;
}

export interface StudentSubmission {
  id: string;
  examCode: string;
  examTitle: string;
  unit: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  durationMinutes: number;
  submittedAt: string;
  evaluatedSkill: string;
  weakPoint?: string;
  details: {
    no: number;
    question: string;
    studentAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    kcTag: string;
  }[];
}

export interface KnowledgeGapItem {
  id: string;
  kcCode: string;
  kcName: string;
  category: 'Grammar' | 'Vocabulary' | 'Pronunciation' | 'Listening';
  unit: number;
  affectedStudentCount: number;
  totalStudents: number;
  failRate: number; // percentage
  recommendation: string;
}

export interface PersonalizedRoadmapItem {
  studentId: string;
  studentCode: string;
  studentName: string;
  className: string;
  masteryPercentage: number;
  weakTopicCount: number;
  suggestedPlaylist: {
    unit: number;
    topic: string;
    skill: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'IN_PROGRESS' | 'COMPLETED' | 'PENDING';
  }[];
}

