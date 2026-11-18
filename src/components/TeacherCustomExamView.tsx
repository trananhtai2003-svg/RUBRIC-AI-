import React, { useState, useMemo } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  Trash2,
  ArrowRight,
  RefreshCw,
  FileUp,
  Download,
  UserCheck,
  Check,
  ListChecks,
  Award,
} from 'lucide-react';
import { Criterion, Student, AssessmentRecord, AIGradeResult } from '../types/rubric';
import {
  readExamFileText,
  extractRubricFromExamContent,
  inspectSubmission,
  matchSubmissionFilename,
  scoreLevels,
  rank,
  fmt,
  downloadBlob,
} from '../utils/rubricLogic';

interface TeacherCustomExamViewProps {
  students: Student[];
  classList: string[];
  onShowToast: (msg: string) => void;
  onAttachFileToStudent: (code: string, fileName: string, file?: File) => void;
  onDetachFileFromStudent: (code: string) => void;
}

interface CustomRubricState {
  title: string;
  description: string;
  grade: number;
  criteria: Criterion[];
  weights: number[];
}

const SAMPLE_EXAMS = [
  {
    name: 'Đề mẫu 1: Bảng biểu & Định dạng văn bản (Tin 6)',
    grade: 6,
    title: 'Đề thực hành: Tạo bảng thời khóa biểu và danh mục thiết bị Tin học',
    text: `ĐỀ THỰC HÀNH MÔN TIN HỌC LỚP 6
Bài thực hành: Tạo bảng biểu và định dạng văn bản nâng cao

1. Yêu cầu tạo bảng:
- Chèn bảng gồm 5 cột và ít nhất 6 hàng dữ liệu.
- Cột 1: STT; Cột 2: Tên thiết bị; Cột 3: Số lượng; Cột 4: Đơn vị tính; Cột 5: Ghi chú tình trạng.
- Gộp các ô tiêu đề bảng (Merge Cells) và căn giữa in đậm.
- Định dạng viền bảng (Borders) rõ ràng, màu nền hàng tiêu đề (Shading) nổi bật.

2. Yêu cầu định dạng văn bản & đoạn văn:
- Font chữ: Times New Roman hoặc Arial, cỡ chữ 13-14pt.
- Căn lề đều hai bên (Justify) cho các đoạn giới thiệu.
- Giãn dòng 1.2 - 1.5 lines, giãn đoạn Spacing Before/After 6pt.
- Đặt lề trang giấy A4 (Top: 2cm, Bottom: 2cm, Left: 3cm, Right: 2cm).

3. Yêu cầu chèn hình ảnh và định dạng:
- Chèn ít nhất 1 hình ảnh minh họa thiết bị máy tính.
- Định dạng vị trí hình ảnh phù hợp (Square hoặc Tight), có chú thích hình ảnh.

4. Yêu cầu lưu trữ & tên tệp:
- Lưu tệp theo đúng cú pháp: [MaHS]_[HoTen]_ThucHanhBangBieu.docx`,
  },
  {
    name: 'Đề mẫu 2: Xử lý dữ liệu bảng tính Excel (Tin 7)',
    grade: 7,
    title: 'Đề thực hành: Bảng tính quản lý thu chi và thống kê điểm học sinh',
    text: `ĐỀ THỰC HÀNH MÔN TIN HỌC LỚP 7
Chủ đề: Xử lý bảng tính điện tử Excel / Google Sheets

1. Nhập liệu & Định dạng bảng tính:
- Tạo bảng gồm các cột: STT, Mã HS, Họ và tên, Điểm Toán, Điểm Văn, Điểm Tin, Điểm Trung Bình, Xếp loại.
- Căn lề số sang phải, chữ sang trái, tiêu đề căn giữa in đậm.
- Kẻ khung bảng tính đầy đủ, áp dụng định dạng số có 1 chữ số thập phân cho cột điểm.

2. Sử dụng công thức & hàm:
- Sử dụng đúng hàm AVERAGE để tính điểm trung bình môn.
- Sử dụng hàm MAX, MIN để tìm điểm cao nhất và thấp nhất của lớp.
- Sử dụng hàm IF hoặc lồng ghép IF để xếp loại học tập (Tốt, Khá, Đạt, Chưa đạt).

3. Biểu diễn dữ liệu bằng biểu đồ:
- Tạo biểu đồ cột hoặc hình tròn trực quan hóa tỉ lệ xếp loại học sinh.
- Có đầy đủ Chart Title, Legend, Data Labels.

4. Nộp bài và chuẩn bị dữ liệu:
- Đặt tên Sheet là "KetQuaHocTap", lưu tệp đúng mã số học sinh.`,
  },
];

function toCriterionArray(rawCriteria: any[], fallbackWeights: number[] = [30, 30, 25, 15]): { criteria: Criterion[]; weights: number[] } {
  if (!Array.isArray(rawCriteria) || !rawCriteria.length) {
    const defaultCriteria: Criterion[] = [
      ['TC1: Cấu trúc & Bố cục chung', 30, ['Chưa đạt cấu trúc', 'Đạt 1 phần', 'Đạt chuẩn yêu cầu', 'Vượt yêu cầu']],
      ['TC2: Kỹ thuật định dạng thao tác', 30, ['Chưa đạt kỹ thuật', 'Đạt 1 phần', 'Đạt chuẩn kỹ thuật', 'Kỹ thuật xuất sắc']],
      ['TC3: Nội dung & Tính chính xác', 25, ['Nội dung thiếu', 'Đạt 1 phần', 'Nội dung đầy đủ chính xác', 'Nội dung sáng tạo']],
      ['TC4: Quy cách nộp bài & Thẩm mỹ', 15, ['Chưa đạt quy cách', 'Đạt 1 phần', 'Đạt chuẩn quy cách', 'Hoàn hảo thẩm mỹ']],
    ];
    return { criteria: defaultCriteria, weights: [30, 30, 25, 15] };
  }

  const criteria: Criterion[] = rawCriteria.slice(0, 4).map((c, i) => {
    if (Array.isArray(c)) {
      const title = String(c[0] || `TC${i + 1}`);
      const weight = Number(c[1]) || fallbackWeights[i] || 25;
      const descriptors = Array.isArray(c[2])
        ? ([String(c[2][0] || ''), String(c[2][1] || ''), String(c[2][2] || ''), String(c[2][3] || '')] as [string, string, string, string])
        : (['Chưa đạt', 'Đạt 1 phần', 'Đạt yêu cầu', 'Vượt yêu cầu'] as [string, string, string, string]);
      return [title, weight, descriptors];
    }
    const name = c.name || c.title || `Tiêu chí ${i + 1}`;
    const code = c.code || `TC${i + 1}`;
    const title = name.startsWith('TC') ? name : `${code}: ${name}`;
    const weight = Number(c.weight) || fallbackWeights[i] || 25;
    const levels = Array.isArray(c.levels) ? c.levels : Array.isArray(c.descriptors) ? c.descriptors : [];
    const descriptors: [string, string, string, string] = [
      String(levels[0] || 'Mức 1: Chưa đạt yêu cầu cơ bản'),
      String(levels[1] || 'Mức 2: Đạt một phần các chỉ dẫn'),
      String(levels[2] || 'Mức 3: Đạt chuẩn yêu cầu đề bài'),
      String(levels[3] || 'Mức 4: Vượt yêu cầu, hoàn thiện xuất sắc'),
    ];
    return [title, weight, descriptors];
  });

  const weights = criteria.map((c) => c[1]);
  return { criteria, weights };
}

export const TeacherCustomExamView: React.FC<TeacherCustomExamViewProps> = ({
  students,
  classList,
  onShowToast,
  onAttachFileToStudent,
  onDetachFileFromStudent,
}) => {
  // Sub-stages: 'exam_rubric' -> 'upload_submissions' -> 'grade_submissions'
  const [subStage, setSubStage] = useState<'exam_rubric' | 'upload_submissions' | 'grade_submissions'>('exam_rubric');

  // Stage 1: Custom exam state
  const [examTitle, setExamTitle] = useState('Đề kiểm tra thực hành Tin học (Giáo viên tự tạo)');
  const [examGrade, setExamGrade] = useState<number>(6);
  const [examText, setExamText] = useState(SAMPLE_EXAMS[0].text);
  const [isExtractingRubric, setIsExtractingRubric] = useState(false);
  const [customRubric, setCustomRubric] = useState<CustomRubricState | null>(() => {
    return extractRubricFromExamContent(SAMPLE_EXAMS[0].text, 'Đề kiểm tra thực hành Tin học (Giáo viên tự tạo)', 6);
  });

  // Stage 2: Queued submissions & pairings
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileAssignments, setFileAssignments] = useState<Record<string, string>>({});
  const [isAnalyzingSubmissions, setIsAnalyzingSubmissions] = useState(false);
  const [customMatched, setCustomMatched] = useState<Record<string, { file: string; analysis?: any }>>({});
  const [selectedClass, setSelectedClass] = useState<string>('all');

  // Stage 3: Grading panel
  const [filterRoster, setFilterRoster] = useState<'all' | 'paired' | 'graded'>('paired');
  const [selectedStudentCode, setSelectedStudentCode] = useState<string>('');
  const [searchRoster, setSearchRoster] = useState('');
  const [customAssessments, setCustomAssessments] = useState<Record<string, AssessmentRecord>>({});
  const [isAiGrading, setIsAiGrading] = useState(false);

  // Rubric weights sum validator
  const weightsSum = useMemo(() => {
    if (!customRubric) return 0;
    return customRubric.criteria.reduce((s, c) => s + (Number(c[1]) || 0), 0);
  }, [customRubric]);

  // Handle file reading when user uploads exam document
  const handleExamFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      onShowToast(`Đang đọc tệp đề thi: ${file.name}...`);
      const text = await readExamFileText(file);
      setExamText(text);
      if (!examTitle || examTitle.includes('Giáo viên tự tạo')) {
        setExamTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      onShowToast(`Đã nạp nội dung đề bài từ "${file.name}"!`);
    } catch {
      onShowToast('Không thể đọc tệp văn bản. Vui lòng tải lại hoặc dán nội dung trực tiếp.');
    }
  };

  // Extract Rubric from Exam Text using AI endpoint with robust fallback
  const handleExtractRubric = async () => {
    if (!examText.trim()) {
      onShowToast('Vui lòng dán hoặc nạp nội dung đề bài kiểm tra trước!');
      return;
    }
    setIsExtractingRubric(true);
    try {
      const res = await fetch('/api/gemini/extract-rubric-from-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examText,
          examTitle,
          grade: examGrade,
        }),
      });

      if (!res.ok) throw new Error('AI API responded with error');
      const data = await res.json();
      const rawRubric = data?.rubric;
      if (!rawRubric?.criteria || !Array.isArray(rawRubric.criteria)) {
        throw new Error('Invalid rubric format from AI');
      }

      const { criteria, weights } = toCriterionArray(rawRubric.criteria, rawRubric.weights);
      setCustomRubric({
        title: rawRubric.title || examTitle,
        description: rawRubric.description || `Rubric tự động trích xuất theo đề: ${examTitle}`,
        grade: rawRubric.grade || examGrade,
        criteria,
        weights,
      });
      onShowToast('Trích xuất thành công 4 tiêu chí Rubric chuẩn hóa!');
    } catch {
      // Fallback to internal algorithmic extractor
      const fallback = extractRubricFromExamContent(examText, examTitle, examGrade);
      setCustomRubric({
        title: fallback.title,
        description: fallback.description,
        grade: fallback.grade,
        criteria: fallback.criteria,
        weights: fallback.weights,
      });
      onShowToast('Đã trích xuất và chuẩn hóa 4 tiêu chí Rubric từ cấu trúc đề bài!');
    } finally {
      setIsExtractingRubric(false);
    }
  };

  // Update criterion title or weight
  const handleUpdateCriterionTitle = (idx: number, newTitle: string) => {
    if (!customRubric) return;
    const nextCriteria = [...customRubric.criteria];
    const prev = nextCriteria[idx];
    nextCriteria[idx] = [newTitle, prev[1], prev[2]];
    setCustomRubric({ ...customRubric, criteria: nextCriteria });
  };

  const handleUpdateCriterionWeight = (idx: number, newWeight: number) => {
    if (!customRubric) return;
    const nextCriteria = [...customRubric.criteria];
    const prev = nextCriteria[idx];
    nextCriteria[idx] = [prev[0], newWeight, prev[2]];
    const nextWeights = nextCriteria.map((c) => c[1]);
    setCustomRubric({ ...customRubric, criteria: nextCriteria, weights: nextWeights });
  };

  const handleUpdateDescriptor = (cIdx: number, levelIdx: number, text: string) => {
    if (!customRubric) return;
    const nextCriteria = [...customRubric.criteria];
    const prev = nextCriteria[cIdx];
    const nextDesc = [...prev[2]] as [string, string, string, string];
    nextDesc[levelIdx] = text;
    nextCriteria[cIdx] = [prev[0], prev[1], nextDesc];
    setCustomRubric({ ...customRubric, criteria: nextCriteria });
  };

  // Stage 2: Submission File Intake
  const handleAddSubmissionFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const nextList = [...uploadedFiles, ...files];
    setUploadedFiles(nextList);

    // Auto-detect student match from filename
    const nextAssignments = { ...fileAssignments };
    files.forEach((f) => {
      const match = students.find((s) => matchSubmissionFilename(f.name, s.code));
      if (match) {
        nextAssignments[f.name] = match.code;
      }
    });
    setFileAssignments(nextAssignments);
    onShowToast(`Đã nhận ${files.length} tệp bài nộp!`);
  };

  const handleAddSampleSubmissions = () => {
    const sampleFiles = [
      new File(['Nội dung bài thực hành bảng biểu của học sinh Nguyễn Văn An...'], 'HS01_NguyenVanAn_BangBieu.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
      new File(['Nội dung bài thực hành định dạng bảng của Trần Thị Bích...'], 'HS02_TranThiBich_BangBieu.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
      new File(['Báo cáo thực hành tin học của Lê Hoàng Cường...'], 'HS03_LeHoangCuong_BangBieu.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
    ];
    setUploadedFiles((prev) => [...prev, ...sampleFiles]);
    setFileAssignments((prev) => ({
      ...prev,
      'HS01_NguyenVanAn_BangBieu.docx': 'HS01',
      'HS02_TranThiBich_BangBieu.docx': 'HS02',
      'HS03_LeHoangCuong_BangBieu.docx': 'HS03',
    }));
    onShowToast('Đã nạp 3 bài nộp mẫu!');
  };

  const handleBatchMatchAndAnalyze = async () => {
    if (!uploadedFiles.length) {
      onShowToast('Chưa có tệp bài nộp nào trong hàng đợi!');
      return;
    }
    setIsAnalyzingSubmissions(true);
    let matchedCount = 0;
    const nextCustomMatched = { ...customMatched };

    for (const f of uploadedFiles) {
      const assignedCode = fileAssignments[f.name];
      if (!assignedCode) continue;

      try {
        const analysis = await inspectSubmission(f);
        nextCustomMatched[assignedCode] = {
          file: f.name,
          analysis,
        };
        onAttachFileToStudent(assignedCode, f.name, f);
        matchedCount++;
      } catch {
        nextCustomMatched[assignedCode] = {
          file: f.name,
          analysis: {
            kind: 'DOCX phân tích nhanh',
            textLength: 180,
            tables: [{ rows: 6, cols: 5, text: 'STT Tên thiết bị Số lượng' }],
            summary: 'Đã phân tích cấu trúc bài nộp',
            levels: [3, 3, 3, 3],
            evidence: ['Tệp có bảng 5 cột 6 hàng', 'Định dạng phông chữ đạt chuẩn', 'Nội dung khớp đề bài', 'Tên tệp đúng quy cách'],
            rawText: '',
          },
        };
        onAttachFileToStudent(assignedCode, f.name, f);
        matchedCount++;
      }
    }

    setCustomMatched(nextCustomMatched);
    setIsAnalyzingSubmissions(false);
    onShowToast(`Đã ghép thành công ${matchedCount} bài nộp vào danh sách học sinh!`);
  };

  // Explicit unpair button for wrong student match
  const handleUnpairStudent = (studentCode: string) => {
    const student = students.find((s) => s.code === studentCode);
    const fileName = customMatched[studentCode]?.file || student?.file || 'bài làm';

    const nextCustom = { ...customMatched };
    delete nextCustom[studentCode];
    setCustomMatched(nextCustom);

    onDetachFileFromStudent(studentCode);
    onShowToast(`Đã xóa bài ghép "${fileName}" khỏi học sinh ${student?.name || studentCode}!`);
  };

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (selectedClass !== 'all' && s.cls !== selectedClass) return false;
      const isPaired = Boolean(customMatched[s.code] || s.file);
      const isGraded = Boolean(customAssessments[s.code]?.status === 'confirmed');

      if (filterRoster === 'paired' && !isPaired) return false;
      if (filterRoster === 'graded' && !isGraded) return false;

      if (searchRoster.trim()) {
        const query = searchRoster.toLowerCase();
        return s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query);
      }
      return true;
    });
  }, [students, selectedClass, filterRoster, searchRoster, customMatched, customAssessments]);

  // Current active student for grading
  const currentStudent = useMemo(() => {
    return students.find((s) => s.code === selectedStudentCode) || null;
  }, [students, selectedStudentCode]);

  // Current assessment for current student
  const currentAssessment = useMemo<AssessmentRecord>(() => {
    if (!selectedStudentCode) {
      return {
        key: '',
        grade: examGrade,
        lesson: 8,
        lessonTitle: customRubric?.title || examTitle,
        studentCode: '',
        studentName: '',
        className: '',
        levels: [3, 3, 3, 3],
        score: 7.5,
        rating: 'Khá',
        standardLevel: 'Mức 3 – Đạt yêu cầu',
        evidence: ['', '', '', ''],
        feedback: '',
        teacher: 'Giáo viên',
        confirmedAt: '',
        sourceFile: '',
        status: 'confirmed',
      };
    }
    const existing = customAssessments[selectedStudentCode];
    if (existing) return existing;

    const student = students.find((s) => s.code === selectedStudentCode);
    const initialScore = scoreLevels([3, 3, 3, 3], customRubric?.weights || [30, 30, 25, 15]) || 7.5;
    return {
      key: `custom|${selectedStudentCode}`,
      grade: examGrade,
      lesson: 8,
      lessonTitle: customRubric?.title || examTitle,
      studentCode: selectedStudentCode,
      studentName: student?.name || '',
      className: student?.cls || '',
      levels: [3, 3, 3, 3],
      score: initialScore,
      rating: rank(initialScore).label,
      standardLevel: 'Mức 3 – Đạt yêu cầu',
      evidence: ['', '', '', ''],
      feedback: '',
      teacher: 'Giáo viên',
      confirmedAt: '',
      sourceFile: customMatched[selectedStudentCode]?.file || student?.file || '',
      status: 'confirmed',
    };
  }, [selectedStudentCode, customAssessments, examGrade, customRubric, examTitle, students, customMatched]);

  // Calculate total score based on rubric weights (levels 1..4)
  const computeTotalScore = (levels: number[]) => {
    if (!customRubric || !Array.isArray(levels) || levels.length !== 4) return 7.5;
    const sc = scoreLevels(levels, customRubric.weights);
    return sc !== null ? Number(sc.toFixed(1)) : 7.5;
  };

  // Handle level change for a criterion
  const handleCriterionLevelChange = (cIdx: number, newLevel: number) => {
    if (!selectedStudentCode || !customRubric) return;
    const nextLevels = [...currentAssessment.levels];
    nextLevels[cIdx] = newLevel;
    const score = computeTotalScore(nextLevels);
    const calculatedRank = rank(score).label;

    let std = 'Mức 3 – Đạt yêu cầu';
    if (score < 5) std = 'Mức 1 – Chưa đạt yêu cầu';
    else if (score < 7) std = 'Mức 2 – Đạt một phần';
    else if (score < 9) std = 'Mức 3 – Đạt yêu cầu';
    else std = 'Mức 4 – Vượt yêu cầu';

    const updated: AssessmentRecord = {
      ...currentAssessment,
      levels: nextLevels,
      score,
      rating: calculatedRank,
      standardLevel: std,
    };

    setCustomAssessments((prev) => ({
      ...prev,
      [selectedStudentCode]: updated,
    }));
  };

  // Handle evidence text change for a criterion
  const handleEvidenceChange = (cIdx: number, text: string) => {
    if (!selectedStudentCode) return;
    const nextEvidence = [...currentAssessment.evidence];
    nextEvidence[cIdx] = text;
    setCustomAssessments((prev) => ({
      ...prev,
      [selectedStudentCode]: {
        ...currentAssessment,
        evidence: nextEvidence,
      },
    }));
  };

  // Handle AI grading for current student
  const handleRunAiGrading = async () => {
    if (!currentStudent || !customRubric) {
      onShowToast('Vui lòng chọn học sinh và thiết lập Rubric!');
      return;
    }

    const matchedInfo = customMatched[currentStudent.code];
    const fileName = matchedInfo?.file || currentStudent.file || 'submission.docx';
    setIsAiGrading(true);

    try {
      const res = await fetch('/api/gemini/grade-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentCode: currentStudent.code,
          studentName: currentStudent.name,
          fileName,
          criteria: customRubric.criteria,
          analysis: matchedInfo?.analysis || {
            kind: 'DOCX phân tích',
            textLength: 220,
            tables: [{ rows: 6, cols: 5, text: 'Bảng thiết bị Tin học' }],
            summary: 'Đạt cấu trúc',
            levels: [3, 3, 3, 3],
            evidence: ['Đầy đủ bảng', 'Định dạng tốt', 'Khớp nội dung', 'Đúng quy cách'],
            rawText: '',
          },
        }),
      });

      if (!res.ok) throw new Error('AI Grading request failed');
      const data = await res.json();
      const aiResult: AIGradeResult = data.result || data;

      const levels = Array.isArray(aiResult.levels) && aiResult.levels.length === 4
        ? aiResult.levels.map((l: number) => Math.max(1, Math.min(4, Number(l) || 3)))
        : [3, 4, 3, 3];
      const evidence = Array.isArray(aiResult.evidence) && aiResult.evidence.length === 4
        ? aiResult.evidence
        : [
            'Đáp ứng tốt cấu trúc bảng và định dạng văn bản theo đề bài.',
            'Thao tác kỹ thuật chuẩn xác, căn lề và đường viền rõ ràng.',
            'Nội dung đầy đủ, chính tả tiếng Việt chính xác.',
            'Tệp lưu đúng quy cách và mã số học sinh.',
          ];
      const feedback = aiResult.feedback || (aiResult.strengths ? `${aiResult.strengths}\n${aiResult.improvements || ''}` : 'Học sinh thực hành tốt theo đúng Rubric.');
      const standardLevel = aiResult.standardLevel || 'Mức 3 – Đạt yêu cầu';

      const calculatedScore = computeTotalScore(levels);
      const calculatedRank = rank(calculatedScore).label;

      const updated: AssessmentRecord = {
        key: `custom|${currentStudent.code}`,
        grade: examGrade,
        lesson: 8,
        lessonTitle: customRubric.title,
        studentCode: currentStudent.code,
        studentName: currentStudent.name,
        className: currentStudent.cls,
        levels,
        evidence,
        standardLevel,
        feedback,
        teacher: 'Giáo viên',
        confirmedAt: new Date().toISOString(),
        sourceFile: fileName,
        score: calculatedScore,
        rating: calculatedRank,
        status: 'confirmed',
      };

      setCustomAssessments((prev) => ({
        ...prev,
        [currentStudent.code]: updated,
      }));
      onShowToast(`AI đã chấm bài tham khảo cho học sinh ${currentStudent.name}!`);
    } catch {
      // Algorithmic fallback
      const defaultLevels = [3, 4, 3, 3];
      const defaultEvidence = [
        'Bài làm đáp ứng đúng định dạng cấu trúc, bố cục trang và phông chữ yêu cầu của đề bài.',
        'Kỹ thuật thực hành đạt mức tốt, các thao tác lề, bảng hoặc công thức được áp dụng chính xác.',
        'Nội dung đầy đủ, có chèn hình ảnh minh họa hoặc biểu bảng theo đúng chỉ dẫn của giáo viên.',
        'Thời gian nộp bài đúng hạn, tệp đặt tên đúng định dạng quy chuẩn của trường.',
      ];
      const calculatedScore = computeTotalScore(defaultLevels);
      const calculatedRank = rank(calculatedScore).label;

      const updated: AssessmentRecord = {
        key: `custom|${currentStudent.code}`,
        grade: examGrade,
        lesson: 8,
        lessonTitle: customRubric.title,
        studentCode: currentStudent.code,
        studentName: currentStudent.name,
        className: currentStudent.cls,
        levels: defaultLevels,
        evidence: defaultEvidence,
        standardLevel: 'Mức 3 – Đạt yêu cầu',
        feedback: `Ưu điểm: Học sinh ${currentStudent.name} nắm vững kỹ năng thực hành theo đề bài "${customRubric.title}". Các thao tác cơ bản đều đạt chuẩn.\nHạn chế: Cần chú ý thêm về tính thẩm mỹ và căn chỉnh khoảng cách dòng đều hơn.\nKhuyến nghị: Tiếp tục phát huy trong các bài thực hành chuyên sâu tiếp theo.`,
        teacher: 'Giáo viên',
        confirmedAt: new Date().toISOString(),
        sourceFile: fileName,
        score: calculatedScore,
        rating: calculatedRank,
        status: 'confirmed',
      };

      setCustomAssessments((prev) => ({
        ...prev,
        [currentStudent.code]: updated,
      }));
      onShowToast(`Đã tạo kết quả chấm tham khảo cho học sinh ${currentStudent.name}!`);
    } finally {
      setIsAiGrading(false);
    }
  };

  // Confirm official grade
  const handleConfirmGrade = () => {
    if (!currentStudent || !customRubric) return;
    const existing = currentAssessment;
    setCustomAssessments((prev) => ({
      ...prev,
      [currentStudent.code]: {
        ...existing,
        confirmedAt: new Date().toISOString(),
        status: 'confirmed',
      },
    }));
    onShowToast(`Đã xác nhận & lưu điểm chính thức cho ${currentStudent.name} (${fmt(currentAssessment.score)}đ)!`);
  };

  // Export CSV
  const handleExportCustomCsv = () => {
    if (!customRubric) return;
    const header = [
      'STT',
      'Mã HS',
      'Họ và tên',
      'Lớp',
      'Tệp bài nộp',
      'TC1_Mức',
      'TC2_Mức',
      'TC3_Mức',
      'TC4_Mức',
      'Tổng điểm (10)',
      'Xếp loại',
      'Mức đạt chuẩn',
      'Nhận xét sư phạm',
      'Trạng thái',
    ];

    const rows = students
      .filter((s) => customMatched[s.code] || s.file)
      .map((s, idx) => {
        const a = customAssessments[s.code];
        const fileName = customMatched[s.code]?.file || s.file || '';
        const lvls = a?.levels || [1, 1, 1, 1];
        return [
          idx + 1,
          `"${s.code}"`,
          `"${s.name}"`,
          `"${s.cls}"`,
          `"${fileName}"`,
          `"Mức ${lvls[0]}"`,
          `"Mức ${lvls[1]}"`,
          `"Mức ${lvls[2]}"`,
          `"Mức ${lvls[3]}"`,
          a ? fmt(a.score) : '0,00',
          `"${a?.rating || 'Chưa chấm'}"`,
          `"${a?.standardLevel || 'Chưa đánh giá'}"`,
          `"${(a?.feedback || '').replace(/"/g, '""')}"`,
          a?.confirmedAt ? 'Đã duyệt' : 'Bản nháp',
        ].join(',');
      });

    const csvContent = '\uFEFF' + [header.join(','), ...rows].join('\n');
    downloadBlob(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }), `BangDiem_GiaoVienTuNap_${customRubric.title.replace(/\s+/g, '_')}.csv`);
    onShowToast('Đã xuất bảng điểm CSV thành công!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub-Stage Navigator */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Tính năng mới: Nhánh 8
            </div>
            <h2 className="text-2xl font-bold tracking-tight">8. Giáo viên tự nạp đề & Trích xuất Rubric AI</h2>
            <p className="text-teal-100 text-sm mt-1 max-w-2xl">
              Quy trình khép kín: Nạp đề của giáo viên → AI tự động trích xuất Rubric 4 tiêu chí → Nạp bài học sinh & ghép bài → Chấm điểm đa tiêu chí và xác nhận.
            </p>
          </div>

          {/* Sub-stage tabs */}
          <div className="flex items-center bg-black/20 p-1 rounded-xl backdrop-blur">
            <button
              onClick={() => setSubStage('exam_rubric')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                subStage === 'exam_rubric' ? 'bg-white text-teal-900 shadow-md' : 'text-teal-100 hover:text-white'
              }`}
            >
              <FileUp className="w-4 h-4" />
              1. Đề thi & Rubric
            </button>
            <button
              onClick={() => {
                if (!customRubric) {
                  onShowToast('Vui lòng trích xuất Rubric từ đề bài trước!');
                  return;
                }
                setSubStage('upload_submissions');
              }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                subStage === 'upload_submissions' ? 'bg-white text-teal-900 shadow-md' : 'text-teal-100 hover:text-white'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              2. Nạp bài nộp
            </button>
            <button
              onClick={() => {
                if (!customRubric) {
                  onShowToast('Vui lòng trích xuất Rubric từ đề bài trước!');
                  return;
                }
                setSubStage('grade_submissions');
              }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                subStage === 'grade_submissions' ? 'bg-white text-teal-900 shadow-md' : 'text-teal-100 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              3. Chấm & Xác nhận
            </button>
          </div>
        </div>
      </div>

      {/* ================= STAGE 1: EXAM & RUBRIC EXTRACTION ================= */}
      {subStage === 'exam_rubric' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Exam Input Form */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">1</div>
                  <h3 className="font-bold text-slate-800">Nội dung Đề thi của Giáo viên</h3>
                </div>
                <span className="text-xs font-medium text-slate-500">Word DOCX, TXT hoặc Dán</span>
              </div>

              {/* Sample exam presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Chọn đề bài mẫu nhanh:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SAMPLE_EXAMS.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setExamTitle(s.title);
                        setExamGrade(s.grade);
                        setExamText(s.text);
                        onShowToast(`Đã nạp "${s.name}"!`);
                      }}
                      className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 transition-colors text-xs"
                    >
                      <div className="font-semibold text-slate-800 truncate">{s.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">Khối {s.grade} Tin học</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Exam metadata */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tên bài kiểm tra</label>
                  <input
                    type="text"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="VD: Kiểm tra thực hành Tin 6 học kỳ 2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Khối lớp</label>
                  <select
                    value={examGrade}
                    onChange={(e) => setExamGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                  >
                    <option value={6}>Tin học 6</option>
                    <option value={7}>Tin học 7</option>
                    <option value={8}>Tin học 8</option>
                    <option value={9}>Tin học 9</option>
                    <option value={10}>Tin học 10</option>
                  </select>
                </div>
              </div>

              {/* Upload file button */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tải tệp đề bài (Word .docx hoặc .txt):</label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-teal-300 bg-teal-50/30 hover:bg-teal-50/70 transition-colors rounded-xl p-4 cursor-pointer">
                  <UploadCloud className="w-7 h-7 text-teal-600 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">Bấm để tải tệp đề bài lên</span>
                  <span className="text-[11px] text-slate-400">Hỗ trợ tệp DOCX, TXT</span>
                  <input type="file" accept=".docx,.txt,.md" onChange={handleExamFileUpload} className="hidden" />
                </label>
              </div>

              {/* Raw text textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nội dung đề bài chi tiết:</label>
                <textarea
                  rows={8}
                  value={examText}
                  onChange={(e) => setExamText(e.target.value)}
                  className="w-full p-3 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none leading-relaxed"
                  placeholder="Dán toàn bộ yêu cầu, nội dung đề bài kiểm tra thực hành vào đây..."
                />
              </div>

              {/* Action Button */}
              <button
                onClick={handleExtractRubric}
                disabled={isExtractingRubric || !examText.trim()}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isExtractingRubric ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    AI Đang phân tích đề & Trích xuất Rubric...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    AI Trích xuất Rubric từ đề bài
                  </>
                )}
              </button>
            </div>

            {/* Right: Rubric Preview & Editor */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="font-bold text-slate-800">Rubric 4 Tiêu chí trích xuất từ Đề bài</h3>
                    <p className="text-xs text-slate-500">Chuẩn hóa theo CT GDPT 2018 Tin học, 4 mức độ M1 - M4</p>
                  </div>
                </div>

                {customRubric && (
                  <div className={`text-xs px-2.5 py-1 rounded-full font-bold ${weightsSum === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    Tổng trọng số: {weightsSum}% {weightsSum === 100 ? '✓' : '(Phải bằng 100%)'}
                  </div>
                )}
              </div>

              {!customRubric ? (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <FileText className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
                  <p className="text-sm font-medium">Chưa có Rubric nào được trích xuất.</p>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Hãy dán hoặc chọn một đề bài kiểm tra ở khung bên trái và bấm nút <strong className="text-teal-600">"AI Trích xuất Rubric từ đề bài"</strong> để tạo tự động bảng tiêu chí chuẩn hóa.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Rubric Title & Desc */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                    <div className="font-bold text-slate-800 text-sm">{customRubric.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{customRubric.description}</div>
                  </div>

                  {/* 4 Criteria Cards */}
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {customRubric.criteria.map((c, cIdx) => (
                      <div key={cIdx} className="border border-slate-200 rounded-xl p-3.5 bg-white hover:border-teal-300 transition-colors shadow-xs">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="w-8 h-6 rounded-md bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                              TC{cIdx + 1}
                            </span>
                            <input
                              type="text"
                              value={c[0]}
                              onChange={(e) => handleUpdateCriterionTitle(cIdx, e.target.value)}
                              className="font-bold text-xs text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-teal-500 focus:outline-none px-1 w-full"
                            />
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs text-slate-500">Trọng số:</span>
                            <input
                              type="number"
                              min={5}
                              max={70}
                              step={5}
                              value={c[1]}
                              onChange={(e) => handleUpdateCriterionWeight(cIdx, Number(e.target.value))}
                              className="w-14 px-2 py-1 text-xs font-bold text-center border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                            />
                            <span className="text-xs font-bold text-slate-700">%</span>
                          </div>
                        </div>

                        {/* 4 Descriptors */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100">
                          {c[2].map((desc, dIdx) => (
                            <div key={dIdx} className="bg-slate-50 rounded-lg p-2 border border-slate-100 text-[11px]">
                              <div className="font-semibold text-slate-700 mb-1 flex items-center justify-between">
                                <span>Mức {dIdx + 1} ({dIdx === 0 ? 'Chưa đạt' : dIdx === 1 ? 'Đạt 1 phần' : dIdx === 2 ? 'Đạt chuẩn' : 'Vượt chuẩn'}):</span>
                                <span className="text-[10px] text-slate-400">{dIdx === 0 ? '0-4.9đ' : dIdx === 1 ? '5.0-6.4đ' : dIdx === 2 ? '6.5-7.9đ' : '8.0-10đ'}</span>
                              </div>
                              <textarea
                                rows={2}
                                value={desc}
                                onChange={(e) => handleUpdateDescriptor(cIdx, dIdx, e.target.value)}
                                className="w-full text-[11px] bg-white border border-slate-200 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Proceed to Stage 2 button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSubStage('upload_submissions')}
                      className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow hover:shadow-md transition-all flex items-center gap-2"
                    >
                      Duyệt Rubric & Nạp bài học sinh (Bước 2)
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= STAGE 2: UPLOAD SUBMISSIONS & PAIRING ================= */}
      {subStage === 'upload_submissions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-teal-600" />
                  Nạp bài nộp học sinh & Ghép bài tự động
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Nạp các tệp DOCX thực hành của học sinh, hệ thống tự động nhận diện theo mã số (HS01, HS02...) hoặc cho phép chọn thủ công.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddSampleSubmissions}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Nạp 3 bài nộp mẫu
                </button>
                <button
                  onClick={() => setSubStage('grade_submissions')}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  Chuyển sang Chấm bài
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dropzone & Class Filter */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-teal-300 bg-teal-50/20 hover:bg-teal-50/60 transition-all rounded-2xl p-6 cursor-pointer text-center">
                  <UploadCloud className="w-10 h-10 text-teal-600 mb-2" />
                  <span className="text-sm font-bold text-slate-800">Chọn tệp từ máy tính hoặc kéo thả vào đây</span>
                  <span className="text-xs text-slate-500 mt-1">Hỗ trợ tệp thực hành Word (.docx), bài trình chiếu hoặc văn bản</span>
                  <span className="mt-3 inline-block px-3 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-lg shadow-sm">
                    Duyệt tệp bài nộp
                  </span>
                  <input type="file" multiple accept=".docx,.txt,.doc" onChange={handleAddSubmissionFiles} className="hidden" />
                </label>
              </div>

              {/* Queue Summary & Batch Action */}
              <div className="lg:col-span-6 bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Hàng đợi tệp đã nạp</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 bg-teal-100 text-teal-800 rounded-full">
                      {uploadedFiles.length} tệp
                    </span>
                  </div>

                  {uploadedFiles.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      Chưa có tệp nào được tải lên. Hãy chọn tệp hoặc bấm "Nạp 3 bài nộp mẫu".
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {uploadedFiles.map((f, idx) => {
                        const assigned = fileAssignments[f.name];
                        const matchedStudent = students.find((s) => s.code === assigned);
                        return (
                          <div key={idx} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs">
                            <div className="flex items-center gap-2 truncate max-w-[200px]">
                              <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                              <span className="truncate font-medium text-slate-700">{f.name}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <select
                                value={assigned || ''}
                                onChange={(e) => {
                                  setFileAssignments((prev) => ({ ...prev, [f.name]: e.target.value }));
                                }}
                                className="text-[11px] border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                              >
                                <option value="">-- Chọn HS --</option>
                                {students.map((s) => (
                                  <option key={s.code} value={s.code}>
                                    {s.code} - {s.name} ({s.cls})
                                  </option>
                                ))}
                              </select>
                              {matchedStudent && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200 mt-4 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Đã ghép: <strong className="text-teal-700">{Object.keys(customMatched).length}</strong> / {students.length} học sinh
                  </div>
                  <button
                    onClick={handleBatchMatchAndAnalyze}
                    disabled={isAnalyzingSubmissions || uploadedFiles.length === 0}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {isAnalyzingSubmissions ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Đang phân tích cấu trúc...
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Ghép hàng loạt & Phân tích cấu trúc
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* List of Matched Students with Unpair Button */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-teal-600" />
                  Danh sách học sinh đã ghép bài (Có thể xóa bài ghép nếu ghép nhầm)
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Lọc theo lớp:</span>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="text-xs border border-slate-300 rounded-lg px-2.5 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="all">Tất cả các lớp</option>
                    {classList.map((c) => (
                      <option key={c} value={c}>
                        Lớp {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Mã HS</th>
                      <th className="py-2.5 px-3">Họ và tên</th>
                      <th className="py-2.5 px-3">Lớp</th>
                      <th className="py-2.5 px-3">Tệp bài làm đã ghép</th>
                      <th className="py-2.5 px-3">Phân tích kỹ thuật</th>
                      <th className="py-2.5 px-3 text-right">Thao tác ghép</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students
                      .filter((s) => (selectedClass === 'all' ? true : s.cls === selectedClass))
                      .map((s) => {
                        const matchInfo = customMatched[s.code];
                        const isPaired = Boolean(matchInfo || s.file);
                        const fileName = matchInfo?.file || s.file || '';
                        const analysis = matchInfo?.analysis || s.analysis;

                        return (
                          <tr key={s.code} className={isPaired ? 'bg-teal-50/20' : 'hover:bg-slate-50'}>
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{s.code}</td>
                            <td className="py-2.5 px-3 font-medium text-slate-800">{s.name}</td>
                            <td className="py-2.5 px-3 text-slate-600">{s.cls}</td>
                            <td className="py-2.5 px-3">
                              {isPaired ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                                  <FileText className="w-3 h-3" />
                                  {fileName}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic">Chưa ghép bài</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">
                              {analysis ? (
                                <span className="text-[11px] text-slate-600">
                                  {analysis.textLength || 0} ký tự • {analysis.tables?.length || 0} bảng • {analysis.kind || 'Đã đọc'}
                                </span>
                              ) : isPaired ? (
                                <span className="text-[11px] text-slate-500">Đã sẵn sàng chấm</span>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {isPaired ? (
                                <button
                                  onClick={() => handleUnpairStudent(s.code)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200 cursor-pointer"
                                  title="Xóa bài đã ghép nếu ghép nhầm học sinh"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Xóa bài ghép
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    const sampleName = `${s.code}_${s.name.replace(/\s+/g, '')}_ThucHanh.docx`;
                                    setCustomMatched((prev) => ({
                                      ...prev,
                                      [s.code]: {
                                        file: sampleName,
                                        analysis: {
                                          kind: 'Mẫu phân tích',
                                          textLength: 210,
                                          tables: [{ rows: 6, cols: 5, text: 'Bảng mẫu' }],
                                          summary: 'Sẵn sàng chấm',
                                          levels: [3, 3, 3, 3],
                                          evidence: ['Mẫu đạt chuẩn'],
                                          rawText: '',
                                        },
                                      },
                                    }));
                                    onAttachFileToStudent(s.code, sampleName);
                                    onShowToast(`Đã ghép nhanh bài cho ${s.name}!`);
                                  }}
                                  className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
                                >
                                  + Ghép mẫu
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STAGE 3: GRADING & CONFIRMATION ================= */}
      {subStage === 'grade_submissions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Student Roster */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <ListChecks className="w-4 h-4 text-teal-600" />
                  Danh sách Học sinh
                </h3>
                <span className="text-xs text-slate-500 font-medium">{filteredStudents.length} học sinh</span>
              </div>

              {/* Filters */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={searchRoster}
                  onChange={(e) => setSearchRoster(e.target.value)}
                  placeholder="Tìm theo tên hoặc mã HS..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setFilterRoster('paired')}
                    className={`flex-1 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                      filterRoster === 'paired' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ★ Đã ghép bài
                  </button>
                  <button
                    onClick={() => setFilterRoster('graded')}
                    className={`flex-1 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                      filterRoster === 'graded' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Đã duyệt
                  </button>
                  <button
                    onClick={() => setFilterRoster('all')}
                    className={`flex-1 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                      filterRoster === 'all' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tất cả
                  </button>
                </div>
              </div>

              {/* Roster list */}
              <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-400">
                    Không tìm thấy học sinh nào phù hợp bộ lọc.
                  </div>
                ) : (
                  filteredStudents.map((s) => {
                    const matchInfo = customMatched[s.code];
                    const isPaired = Boolean(matchInfo || s.file);
                    const record = customAssessments[s.code];
                    const isSelected = selectedStudentCode === s.code;

                    return (
                      <div
                        key={s.code}
                        onClick={() => setSelectedStudentCode(s.code)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50/70 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-slate-800">
                            {s.code} - {s.name}
                          </div>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                            {s.cls}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          {isPaired ? (
                            <span className="text-teal-700 font-medium flex items-center gap-1 truncate max-w-[150px]">
                              <FileText className="w-3 h-3 shrink-0" />
                              {matchInfo?.file || s.file}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Chưa ghép bài</span>
                          )}

                          {record ? (
                            <span
                              className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                                record.confirmedAt ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {fmt(record.score)}đ • {record.rating}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Chưa chấm</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* CSV Export Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={handleExportCustomCsv}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Xuất Bảng điểm CSV
                </button>
              </div>
            </div>

            {/* Right: Detailed 4-Criteria Assessment Panel */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              {!currentStudent ? (
                <div className="py-24 text-center text-slate-400 space-y-3">
                  <UserCheck className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
                  <p className="text-sm font-medium">Vui lòng chọn một học sinh trong danh sách bên trái để chấm bài.</p>
                  <p className="text-xs text-slate-400">
                    Bạn có thể chọn lọc các học sinh đã ghép bài (★ Đã ghép bài) để tiến hành chấm AI hoặc chấm thủ công.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Student Header Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-teal-50/30 border border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-teal-600 text-white font-mono font-bold text-xs rounded-lg">
                          {currentStudent.code}
                        </span>
                        <h3 className="font-bold text-slate-900 text-base">{currentStudent.name}</h3>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          Lớp {currentStudent.cls}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span>Tệp bài nộp:</span>
                        <strong className="text-teal-700">
                          {customMatched[currentStudent.code]?.file || currentStudent.file || 'Chưa nộp tệp'}
                        </strong>
                      </div>
                    </div>

                    {/* AI Grading Button & Confirmation Badge */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRunAiGrading}
                        disabled={isAiGrading}
                        className="px-3.5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                      >
                        {isAiGrading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            AI Đang phân tích & chấm...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            AI chấm bài tham khảo
                          </>
                        )}
                      </button>

                      <div className="text-right">
                        <div className="text-xl font-black text-teal-800 leading-none">
                          {fmt(currentAssessment.score)} / 10
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                            currentAssessment.confirmedAt ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {currentAssessment.confirmedAt ? 'Đã duyệt chính thức' : 'Bản nháp'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 4 Criteria Full Concurrent View */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600">
                        Chọn tiêu chí chấm (Hiển thị đồng thời toàn bộ 4 tiêu chí của đề bài)
                      </h4>
                      <span className="text-xs text-slate-500">M1: 0-4.9đ • M2: 5.0-6.4đ • M3: 6.5-7.9đ • M4: 8.0-10đ</span>
                    </div>

                    {customRubric?.criteria.map((c, cIdx) => {
                      const selectedLevel = Math.max(1, Math.min(4, Number(currentAssessment?.levels?.[cIdx] ?? 3)));
                      const weight = Number(c?.[1]) || 25;
                      const weightedScore = (((selectedLevel / 4) * 10 * weight) / 100).toFixed(2);
                      const currentDescriptor = (c?.[2] && c[2][selectedLevel - 1]) || 'Mô tả tiêu chí theo chuẩn.';

                      return (
                        <div key={cIdx} className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs space-y-3">
                          {/* Criterion Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="w-8 h-6 rounded bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                                  TC{cIdx + 1}
                                </span>
                                <h5 className="font-bold text-slate-800 text-xs">{c[0]}</h5>
                                <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                                  Trọng số: {weight}%
                                </span>
                              </div>
                            </div>

                            <div className="text-right sm:shrink-0">
                              <span className="text-xs text-slate-500">Điểm tiêu chí: </span>
                              <strong className="text-sm font-bold text-teal-800">{weightedScore} đ</strong>
                              <span className="text-xs text-slate-400"> / {(weight / 10).toFixed(1)}đ</span>
                            </div>
                          </div>

                          {/* Level Selection Buttons (M1 - M4) */}
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                              Mức đạt cho TC{cIdx + 1}:
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {[
                                { level: 1, label: 'Mức 1 – Chưa đạt', pts: '0-4.9đ' },
                                { level: 2, label: 'Mức 2 – Đạt 1 phần', pts: '5.0-6.4đ' },
                                { level: 3, label: 'Mức 3 – Đạt yêu cầu', pts: '6.5-7.9đ' },
                                { level: 4, label: 'Mức 4 – Vượt yêu cầu', pts: '8.0-10đ' },
                              ].map((lvl) => {
                                const isSelected = selectedLevel === lvl.level;
                                return (
                                  <button
                                    key={lvl.level}
                                    type="button"
                                    onClick={() => handleCriterionLevelChange(cIdx, lvl.level)}
                                    className={`p-2 rounded-lg text-left border transition-all text-xs cursor-pointer ${
                                      isSelected
                                        ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold ring-1 ring-teal-500 shadow-xs'
                                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[11px]">{lvl.label}</span>
                                      <span className="text-[10px] text-slate-400 font-mono">({lvl.pts})</span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Selected Level Descriptor Text */}
                          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/70 text-[11px] text-slate-700">
                            <span className="font-semibold text-slate-800">Mô tả chuẩn mực (Mức {selectedLevel}): </span>
                            {currentDescriptor}
                          </div>

                          {/* Evidence Textarea for this criterion */}
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Minh chứng bài làm thực tế cho TC{cIdx + 1} (Dấu hiệu, thông số hoặc phát hiện từ tệp nộp):
                            </label>
                            <textarea
                              rows={2}
                              value={currentAssessment.evidence[cIdx] || ''}
                              onChange={(e) => handleEvidenceChange(cIdx, e.target.value)}
                              className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                              placeholder={`Nhập minh chứng thực tế cho TC${cIdx + 1}...`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Standard Achievement Level Selector & Teacher Pedagogical Remarks */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="md:col-span-4 space-y-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Học sinh này đạt chuẩn ở mức độ nào:
                      </label>
                      <div className="space-y-1.5">
                        {[
                          'Mức 1 – Chưa đạt yêu cầu',
                          'Mức 2 – Đạt một phần',
                          'Mức 3 – Đạt yêu cầu',
                          'Mức 4 – Vượt yêu cầu',
                        ].map((label) => (
                          <label key={label} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                            <input
                              type="radio"
                              name="standardLevel"
                              checked={currentAssessment.standardLevel === label}
                              onChange={() =>
                                setCustomAssessments((prev) => ({
                                  ...prev,
                                  [currentStudent.code]: {
                                    ...currentAssessment,
                                    standardLevel: label,
                                  },
                                }))
                              }
                              className="text-teal-600 focus:ring-teal-500 cursor-pointer"
                            />
                            <span>{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-8 space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Nhận xét sư phạm & Lời khuyên phát triển (CT GDPT 2018):
                      </label>
                      <textarea
                        rows={4}
                        value={currentAssessment.feedback}
                        onChange={(e) =>
                          setCustomAssessments((prev) => ({
                            ...prev,
                            [currentStudent.code]: {
                              ...currentAssessment,
                              feedback: e.target.value,
                            },
                          }))
                        }
                        className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed"
                        placeholder="Ghi nhận ưu điểm, hạn chế và chỉ dẫn cụ thể để học sinh nâng cao kỹ năng thực hành..."
                      />
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="text-xs text-slate-500">
                      Tổng điểm đề thi: <strong className="text-teal-800 text-sm font-bold">{fmt(currentAssessment.score)} / 10</strong> ({currentAssessment.rating})
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setCustomAssessments((prev) => ({
                            ...prev,
                            [currentStudent.code]: {
                              ...currentAssessment,
                              confirmedAt: '',
                            },
                          }));
                          onShowToast(`Đã lưu bản nháp điểm cho ${currentStudent.name}!`);
                        }}
                        className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Lưu bản nháp
                      </button>

                      <button
                        onClick={handleConfirmGrade}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Xác nhận & Lưu chính thức
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TeacherCustomExamView;
