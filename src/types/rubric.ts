export type Criterion = [
  title: string,
  weight: number,
  descriptors: [string, string, string, string]
];

export interface RubricConfig {
  title: string;
  weights: number[];
  criteria: Criterion[];
}

export interface Student {
  code: string;
  name: string;
  grade: number;
  cls: string;
  levels?: number[] | null;
  file?: string;
  demo?: boolean;
  submissionLesson?: string;
  submissionGrade?: number;
  submissionClass?: string;
  analysis?: AnalysisResult;
}

export interface AIGradeResult {
  standardLevel: string; // "Học sinh này đạt chuẩn ở mức độ nào"
  levels: number[];
  evidence: string[];
  strengths?: string;
  improvements?: string;
  feedback: string;
  source?: 'gemini' | 'default';
}

export interface AssessmentRecord {
  key: string;
  grade: number;
  lesson: number;
  lessonTitle: string;
  studentCode: string;
  studentName: string;
  className: string;
  levels: number[];
  score: number;
  rating: string;
  standardLevel?: string;
  evidence: string[];
  feedback: string;
  teacher: string;
  confirmedAt: string;
  sourceFile: string;
  status: 'confirmed';
}

export interface CurriculumLesson {
  id: string;
  grade: number;
  code: string;
  title: string;
  periods: number;
  objective: string;
  seed?: boolean;
}

export interface TaskPractice {
  id: string;
  grade: number;
  code: string;
  title: string;
  content: string;
  notes: string;
  ai: 'chatgpt' | 'gemini';
  updated: string;
}

export interface AnalysisResult {
  kind: string;
  textLength: number;
  tables: Array<{ rows: number; cols: number; text: string }>;
  summary: string;
  levels: number[] | null;
  evidence: string[];
  rawText: string;
  at?: string;
}

export type PageId =
  | 'results'
  | 'rubricpage'
  | 'assignments'
  | 'rosterpage'
  | 'submissionpage'
  | 'wordpage'
  | 'evidence'
  | 'customexam'
  | 'guide';
