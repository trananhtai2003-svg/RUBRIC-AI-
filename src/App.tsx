import React, { useState, useEffect, useMemo } from 'react';
import {
  AssessmentRecord,
  Criterion,
  CurriculumLesson,
  PageId,
  RubricConfig,
  Student,
  TaskPractice,
} from './types/rubric';
import {
  DEMO_ROSTER,
  GENERIC_CRITERIA,
  INITIAL_LESSONS,
  INITIAL_TASKS,
  RUBRICS,
  TIN_HOC_6_LESSONS,
  TIN_HOC_7_LESSONS,
} from './data/initialData';
import { downloadBlob, fmt, rank, scoreLevels } from './utils/rubricLogic';
import { generateRubricForLesson } from './utils/curriculumGenerator';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { WorkflowBar } from './components/WorkflowBar';
import { ResultsView } from './components/ResultsView';
import { RubricView } from './components/RubricView';
import { AssignmentsView } from './components/AssignmentsView';
import { RosterView } from './components/RosterView';
import { SubmissionView } from './components/SubmissionView';
import { WordTaskView } from './components/WordTaskView';
import { EvidenceView } from './components/EvidenceView';
import { GuideView } from './components/GuideView';
import { TeacherCustomExamView } from './components/TeacherCustomExamView';

const STORAGE_KEYS = {
  ROSTER: 'rubricAI_v14_roster',
  ASSESSMENTS: 'rubricAI_v14_assessments',
  LESSONS: 'rubricAI_v14_lessons',
  TASKS: 'rubricAI_v14_tasks',
  CUSTOM_RUBRICS: 'rubricAI_v14_customRubrics',
  DRAFT_LEVELS: 'rubricAI_v14_draftLevels',
  DRAFT_EVIDENCE: 'rubricAI_v14_draftEvidence',
  DRAFT_FEEDBACK: 'rubricAI_v14_draftFeedback',
};

function safeLoad<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSave(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('results');
  const [grade, setGrade] = useState<number>(6);
  const [lesson, setLesson] = useState<number>(2);
  const [classFilter, setClassFilter] = useState<string>('6.1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudentCode, setSelectedStudentCode] = useState<string>('61001');

  // Core Data Stores with localStorage persistence
  const [students, setStudents] = useState<Student[]>(() => {
    const loaded = safeLoad<Student[]>(STORAGE_KEYS.ROSTER, DEMO_ROSTER);
    return Array.isArray(loaded) && loaded.length > 0 ? loaded : DEMO_ROSTER;
  });

  const [lessons, setLessons] = useState<CurriculumLesson[]>(() => {
    let loaded = safeLoad<CurriculumLesson[]>(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);
    let changed = false;

    // Ensure all 23 lessons from Phụ lục 01 Tin học 6 are loaded
    const grade6Count = loaded.filter((l) => Number(l.grade) === 6).length;
    if (grade6Count < 23) {
      const nonGrade6 = loaded.filter((l) => Number(l.grade) !== 6);
      loaded = [...TIN_HOC_6_LESSONS, ...nonGrade6];
      changed = true;
    }

    // Ensure all 20 lessons from Phụ lục 01 Tin học 7 are loaded
    const grade7Count = loaded.filter((l) => Number(l.grade) === 7).length;
    if (grade7Count < 20) {
      const nonGrade7 = loaded.filter((l) => Number(l.grade) !== 7);
      loaded = [...nonGrade7, ...TIN_HOC_7_LESSONS];
      changed = true;
    }

    if (changed) {
      safeSave(STORAGE_KEYS.LESSONS, loaded);
    }
    return loaded;
  });

  const [tasks, setTasks] = useState<TaskPractice[]>(() =>
    safeLoad(STORAGE_KEYS.TASKS, INITIAL_TASKS)
  );

  const [customRubrics, setCustomRubrics] = useState<Record<string, RubricConfig>>(() =>
    safeLoad(STORAGE_KEYS.CUSTOM_RUBRICS, {})
  );

  const [assessmentStore, setAssessmentStore] = useState<Record<string, AssessmentRecord>>(() => {
    const loaded = safeLoad<Record<string, AssessmentRecord>>(STORAGE_KEYS.ASSESSMENTS, {});
    // If brand new, seed a realistic confirmed assessment for 61007
    if (!loaded || Object.keys(loaded).length === 0) {
      const seedKey = '6|2|61007';
      return {
        [seedKey]: {
          key: seedKey,
          grade: 6,
          lesson: 2,
          lessonTitle: 'Bài 12 – Trình bày thông tin ở dạng bảng',
          studentCode: '61007',
          studentName: 'Nguyễn Phú Anh',
          className: '6.1',
          levels: [3, 4, 3, 3],
          score: 8.25,
          rating: 'Khá',
          standardLevel: 'Đạt chuẩn ở Mức 3 (Khá) – Năng lực NLa đạt chuẩn kỹ năng Tin học lớp 6',
          evidence: [
            'Bảng có đầy đủ 4 cột, 5 hàng dữ liệu các ngày trong tuần đúng yêu cầu.',
            'Thao tác định dạng chuẩn, biết căn giữa chữ trong ô và kẻ viền đôi nổi bật.',
            'Căn chỉnh độ rộng cột tương đối đều, tiêu đề bảng rõ ràng.',
            'Đã rà soát chính tả, lưu tệp 61007_Bai12.docx đúng quy cách.',
          ],
          feedback: 'Bài làm tốt, cấu trúc bảng mạch lạc. Cần chú ý màu nền tiêu đề tương phản hơn.',
          teacher: 'Giáo viên bộ môn Tin học',
          confirmedAt: new Date().toISOString(),
          sourceFile: '61007_Bai12.docx',
          status: 'confirmed',
        },
      };
    }
    return loaded;
  });

  const [draftLevels, setDraftLevels] = useState<Record<string, number[]>>(() =>
    safeLoad(STORAGE_KEYS.DRAFT_LEVELS, {})
  );

  const [draftEvidence, setDraftEvidence] = useState<Record<string, string[]>>(() =>
    safeLoad(STORAGE_KEYS.DRAFT_EVIDENCE, {})
  );

  const [draftFeedback, setDraftFeedback] = useState<Record<string, string>>(() =>
    safeLoad(STORAGE_KEYS.DRAFT_FEEDBACK, {})
  );

  // Persistent submission intake files for Step 5 (preserved across page switches)
  const [persistedQueuedFiles, setPersistedQueuedFiles] = useState<File[]>(() => [
    new File(['Nội dung bài làm thực hành của học sinh Lê Vương Trúc An...'], '61001_LêVươngTrúcAn_ThucHanh.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
    new File(['Nội dung bài làm thực hành của học sinh Lưu Gia An...'], '61002_LưuGiaAn_ThucHanh.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
    new File(['Nội dung bài làm thực hành của học sinh Lê Đình Anh...'], '61003_LêĐìnhAnh_ThucHanh.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
    new File(['Nội dung bài làm thực hành của học sinh Lý Quốc Anh...'], '61004_LýQuốcAnh_ThucHanh.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
  ]);

  const handleAddQueuedFiles = (newFiles: File[]) => {
    setPersistedQueuedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveQueuedFile = (index: number) => {
    setPersistedQueuedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearQueuedFiles = () => {
    setPersistedQueuedFiles([]);
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Synchronize roster with server if available (cross-device cloud persistence)
  useEffect(() => {
    fetch('/api/roster')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.students) && data.students.length > 0) {
          setStudents(data.students);
          safeSave(STORAGE_KEYS.ROSTER, data.students);
        }
      })
      .catch(() => {});
  }, []);

  // Persist whenever state changes (both local and server)
  useEffect(() => {
    safeSave(STORAGE_KEYS.ROSTER, students);
    if (students.length > 0) {
      fetch('/api/roster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students }),
      }).catch(() => {});
    }
  }, [students]);

  useEffect(() => {
    safeSave(STORAGE_KEYS.ASSESSMENTS, assessmentStore);
  }, [assessmentStore]);

  useEffect(() => {
    safeSave(STORAGE_KEYS.LESSONS, lessons);
  }, [lessons]);

  useEffect(() => {
    safeSave(STORAGE_KEYS.TASKS, tasks);
  }, [tasks]);

  useEffect(() => {
    safeSave(STORAGE_KEYS.CUSTOM_RUBRICS, customRubrics);
  }, [customRubrics]);

  useEffect(() => {
    safeSave(STORAGE_KEYS.DRAFT_LEVELS, draftLevels);
  }, [draftLevels]);

  useEffect(() => {
    safeSave(STORAGE_KEYS.DRAFT_EVIDENCE, draftEvidence);
  }, [draftEvidence]);

  useEffect(() => {
    safeSave(STORAGE_KEYS.DRAFT_FEEDBACK, draftFeedback);
  }, [draftFeedback]);

  // Get active lessons for current grade
  const gradeLessons = useMemo(() => {
    return lessons.filter((l) => Number(l.grade) === grade);
  }, [lessons, grade]);

  // Active rubric config
  const activeRubric: RubricConfig = useMemo(() => {
    const currentLessonObj = gradeLessons[lesson - 1];
    const lessonCode = currentLessonObj?.code || `Bài ${lesson}`;
    const specificKey = `${grade}-${lessonCode}`;
    const indexKey = `${grade}-${lesson}`;

    if (customRubrics[specificKey]) return customRubrics[specificKey];
    if (customRubrics[indexKey]) return customRubrics[indexKey];

    if (currentLessonObj) {
      return generateRubricForLesson(currentLessonObj);
    }

    return {
      title: `Khối ${grade} – ${lessonCode}`,
      weights: GENERIC_CRITERIA.map((x) => x[1]),
      criteria: GENERIC_CRITERIA,
    };
  }, [grade, lesson, gradeLessons, customRubrics]);

  // Dynamic class list for current grade
  const classList = useMemo(() => {
    const list = Array.from(
      new Set(students.filter((s) => Number(s.grade) === grade).map((s) => s.cls).filter(Boolean))
    );
    return list.length ? list : ['6.1'];
  }, [students, grade]);

  // Selected student object
  const selectedStudent = useMemo(() => {
    return students.find((s) => s.code === selectedStudentCode) || students[0];
  }, [students, selectedStudentCode]);

  // Filtered students for results table
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (Number(s.grade) !== grade) return false;
      if (classFilter !== 'Tất cả' && s.cls !== classFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [students, grade, classFilter, searchQuery]);

  // Confirmed assessments for this grade and lesson
  const confirmedForLesson = useMemo(() => {
    return Object.values(assessmentStore).filter(
      (a) => a.status === 'confirmed' && a.grade === grade && a.lesson === lesson
    );
  }, [assessmentStore, grade, lesson]);

  // Total confirmed count across all
  const totalConfirmedCount = useMemo(() => {
    return Object.values(assessmentStore).filter((a) => a.status === 'confirmed').length;
  }, [assessmentStore]);

  // Handlers
  const handleGradeChange = (newGrade: number) => {
    setGrade(newGrade);
    setLesson(1);
    const firstInGrade = students.find((s) => Number(s.grade) === newGrade);
    if (firstInGrade) {
      setClassFilter(firstInGrade.cls);
      setSelectedStudentCode(firstInGrade.code);
    } else {
      setClassFilter('Tất cả');
    }
  };

  const handleLessonChange = (newLesson: number) => {
    setLesson(newLesson);
  };

  const handleSaveDraftLevel = (
    criterionIndex: number,
    level: number,
    evidence: string,
    feedback: string
  ) => {
    if (!selectedStudent) return;
    const k = `${grade}|${lesson}|${selectedStudent.code}`;

    setDraftLevels((prev) => {
      const existing = prev[k] || [3, 3, 3, 3];
      const next = [...existing];
      next[criterionIndex] = level;
      return { ...prev, [k]: next };
    });

    setDraftEvidence((prev) => {
      const existing = prev[k] || ['', '', '', ''];
      const next = [...existing];
      next[criterionIndex] = evidence.trim();
      return { ...prev, [k]: next };
    });

    if (feedback.trim()) {
      setDraftFeedback((prev) => ({ ...prev, [k]: feedback.trim() }));
    }

    showToast(`Đã lưu mức ${level} cho TC${criterionIndex + 1} vào bản nháp.`);
  };

  const handleSaveDraftBatch = (
    levels: number[],
    evidence: string[],
    feedback: string
  ) => {
    if (!selectedStudent) return;
    const k = `${grade}|${lesson}|${selectedStudent.code}`;

    setDraftLevels((prev) => ({ ...prev, [k]: [...levels] }));
    setDraftEvidence((prev) => ({ ...prev, [k]: [...evidence] }));
    if (feedback.trim()) {
      setDraftFeedback((prev) => ({ ...prev, [k]: feedback.trim() }));
    }
  };

  const handleConfirmAssessment = (
    levels: number[],
    evidence: string[],
    feedback: string,
    standardLevel?: string
  ) => {
    if (!selectedStudent) return;
    const k = `${grade}|${lesson}|${selectedStudent.code}`;

    if (!levels || levels.length !== 4 || levels.some((l) => !l || l < 1 || l > 4)) {
      showToast('Cần có đủ 4 tiêu chí đánh giá từ Mức 1 đến Mức 4.');
      return;
    }

    const calculatedScore = scoreLevels(levels, activeRubric.weights);
    if (calculatedScore === null) {
      showToast('Không thể tính điểm theo trọng số.');
      return;
    }

    const ratingInfo = rank(calculatedScore);
    const avgLvl = Math.round(levels.reduce((a, b) => a + b, 0) / 4);

    const record: AssessmentRecord = {
      key: k,
      grade,
      lesson,
      lessonTitle: activeRubric.title,
      studentCode: selectedStudent.code,
      studentName: selectedStudent.name,
      className: selectedStudent.cls,
      levels: levels.map(Number),
      score: Number(calculatedScore.toFixed(2)),
      rating: ratingInfo.label,
      standardLevel:
        standardLevel || `Đạt chuẩn ở Mức ${avgLvl} (${ratingInfo.label}) – Năng lực Tin học GDPT 2018`,
      evidence: evidence.slice(),
      feedback: feedback.trim() || 'Phiếu đánh giá đã được giáo viên xác nhận.',
      teacher: 'Giáo viên bộ môn Tin học',
      confirmedAt: new Date().toISOString(),
      sourceFile: selectedStudent.file || '',
      status: 'confirmed',
    };

    setAssessmentStore((prev) => ({ ...prev, [k]: record }));
    showToast(`Đã xác nhận & lưu phiếu chấm cho học sinh ${selectedStudent.name}!`);
  };

  const handleRevokeAssessment = () => {
    if (!selectedStudent) return;
    const k = `${grade}|${lesson}|${selectedStudent.code}`;
    if (!assessmentStore[k]) {
      showToast('Học sinh này chưa có phiếu đã xác nhận.');
      return;
    }
    setAssessmentStore((prev) => {
      const next = { ...prev };
      delete next[k];
      return next;
    });
    showToast('Đã hủy phiếu chấm đã xác nhận.');
  };

  const handleAttachFileToStudent = (code: string, fileName: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.code === code ? { ...s, file: fileName } : s))
    );
  };

  const handleDetachFileFromStudent = (code: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.code === code ? { ...s, file: undefined, analysis: undefined } : s))
    );
    showToast(`Đã xóa bài đã ghép của học sinh ${code}.`);
  };

  const handleExportCsv = () => {
    const list = confirmedForLesson;
    if (!list.length) {
      showToast('Chưa có phiếu chấm nào được xác nhận cho bài học này để xuất.');
      return;
    }

    const rows: string[][] = [
      [
        'STT',
        'Mã HS',
        'Họ và tên',
        'Lớp',
        ...activeRubric.criteria.map((c) => c[0]),
        'Tổng điểm /10',
        'Xếp loại',
        'Mức đạt chuẩn năng lực',
        'Thời điểm xác nhận',
        'Tệp bài làm',
      ],
      ...list.map((a, idx) => [
        String(idx + 1),
        a.studentCode,
        a.studentName,
        a.className,
        ...a.levels.map(String),
        fmt(a.score),
        a.rating,
        a.standardLevel || 'Đạt chuẩn',
        new Date(a.confirmedAt).toLocaleString('vi-VN'),
        a.sourceFile || '',
      ]),
    ];

    const csvContent = '\uFEFF' + rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `Bang_Diem_Rubric_Khoi_${grade}_Bai_${lesson}.csv`;
    downloadBlob(blob, fileName);
    showToast(`Đã xuất bảng điểm ${fileName}`);
  };

  const handleMakeWordTask = () => {
    setActivePage('wordpage');
  };

  const handleBackupJson = () => {
    const backupData = {
      version: '14.0',
      exportedAt: new Date().toISOString(),
      grade,
      lesson,
      assessmentStore,
      draftLevels,
      draftEvidence,
      draftFeedback,
      students,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    downloadBlob(blob, `rubric_ai_backup_${grade}_${lesson}_${Date.now()}.json`);
    showToast('Đã tải tệp sao lưu JSON dữ liệu chấm điểm.');
  };

  const handleRestoreJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);

        if (data.assessmentStore) {
          setAssessmentStore((prev) => ({ ...prev, ...data.assessmentStore }));
        }
        if (data.draftLevels) {
          setDraftLevels((prev) => ({ ...prev, ...data.draftLevels }));
        }
        if (data.draftEvidence) {
          setDraftEvidence((prev) => ({ ...prev, ...data.draftEvidence }));
        }
        if (data.draftFeedback) {
          setDraftFeedback((prev) => ({ ...prev, ...data.draftFeedback }));
        }
        showToast('Khôi phục dữ liệu từ JSON thành công!');
      } catch {
        showToast('Tệp JSON không hợp lệ hoặc bị lỗi cấu trúc.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportStudents = (newStudents: Student[]) => {
    setStudents((prev) => {
      if (prev.length === 0) return newStudents;
      // Merge by student code so importing a new class doesn't delete existing classes
      const map = new Map<string, Student>();
      prev.forEach((s) => map.set(s.code, s));
      newStudents.forEach((s) => map.set(s.code, s));
      return Array.from(map.values());
    });
    if (newStudents.length > 0) {
      setSelectedStudentCode(newStudents[0].code);
      setClassFilter(newStudents[0].cls || 'Tất cả');
    }
  };

  const handleAddStudent = (student: Student) => {
    setStudents((prev) => [...prev, student]);
  };

  const handleDeleteStudent = (code: string) => {
    setStudents((prev) => prev.filter((s) => s.code !== code));
    setSelectedStudentCode((curr) => {
      if (curr === code) {
        const remaining = students.filter((s) => s.code !== code);
        return remaining.length > 0 ? remaining[0].code : '';
      }
      return curr;
    });
    showToast(`Đã xóa học sinh có mã ${code}.`);
  };

  const handleDeleteMultipleStudents = (codes: string[]) => {
    if (!codes || codes.length === 0) return;
    const codeSet = new Set(codes);
    setStudents((prev) => prev.filter((s) => !codeSet.has(s.code)));
    setSelectedStudentCode((curr) => {
      if (curr && codeSet.has(curr)) {
        const remaining = students.filter((s) => !codeSet.has(s.code));
        return remaining.length > 0 ? remaining[0].code : '';
      }
      return curr;
    });
    showToast(`Đã xóa thành công ${codes.length} học sinh khỏi danh sách.`);
  };

  const handleRestoreDemo = () => {
    setStudents(DEMO_ROSTER);
    showToast('Đã khôi phục danh sách mẫu 117 học sinh.');
  };

  const currentLessonObj = gradeLessons[lesson - 1];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar Menu */}
        <Sidebar
          activePage={activePage}
          onSelectPage={setActivePage}
          confirmedCount={totalConfirmedCount}
          totalStudents={students.length}
        />

        {/* Right Main Body */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header & Global Filters */}
          <Header
            currentTitle={activeRubric.title}
            grade={grade}
            onGradeChange={handleGradeChange}
            lesson={lesson}
            onLessonChange={handleLessonChange}
            lessonsList={gradeLessons}
            classList={classList}
            classFilter={classFilter}
            onClassFilterChange={setClassFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onExportCsv={handleExportCsv}
            onPrint={() => window.print()}
          />

          <main className="p-3 sm:p-5 flex-1 min-w-0 overflow-y-auto">
            {/* Teacher Workflow Bar */}
            <WorkflowBar
              onNavigate={setActivePage}
              onMakeWordTask={handleMakeWordTask}
              onExportCsv={handleExportCsv}
            />

            {/* Active View Router */}
            {activePage === 'results' && (
              <ResultsView
                students={filteredStudents}
                selectedStudent={selectedStudent}
                onSelectStudent={(s) => setSelectedStudentCode(s.code)}
                criteria={activeRubric.criteria}
                weights={activeRubric.weights}
                rubricTitle={activeRubric.title}
                assessmentStore={assessmentStore}
                draftLevels={draftLevels}
                draftEvidence={draftEvidence}
                draftFeedback={draftFeedback}
                onAttachFile={(f) => {
                  if (selectedStudent) {
                    handleAttachFileToStudent(selectedStudent.code, f.name);
                    showToast(`Đã gắn tệp ${f.name} cho học sinh ${selectedStudent.name}.`);
                  }
                }}
                onSaveDraftLevel={handleSaveDraftLevel}
                onSaveDraftBatch={handleSaveDraftBatch}
                onConfirmAssessment={handleConfirmAssessment}
                onRevokeAssessment={handleRevokeAssessment}
                onBackupJson={handleBackupJson}
                onRestoreJson={handleRestoreJson}
                grade={grade}
                lesson={lesson}
                onShowToast={showToast}
              />
            )}

            {activePage === 'rubricpage' && (
              <RubricView
                rubricTitle={activeRubric.title}
                grade={grade}
                lesson={lesson}
                currentLessonObj={currentLessonObj}
                criteria={activeRubric.criteria}
                selectedStudent={selectedStudent}
                onApplyLevel={(idx, lvl) => {
                  handleSaveDraftLevel(
                    idx,
                    lvl,
                    `Giáo viên chọn Mức ${lvl} theo Rubric`,
                    'Cập nhật từ bảng Rubric chi tiết'
                  );
                }}
                onUpdateCriteria={(newCrit) => {
                  const lessonCode = currentLessonObj?.code || `Bài ${lesson}`;
                  const specificKey = `${grade}-${lessonCode}`;
                  const indexKey = `${grade}-${lesson}`;
                  setCustomRubrics((prev) => ({
                    ...prev,
                    [specificKey]: {
                      title: activeRubric.title,
                      weights: newCrit.map((c) => c[1]),
                      criteria: newCrit,
                    },
                    [indexKey]: {
                      title: activeRubric.title,
                      weights: newCrit.map((c) => c[1]),
                      criteria: newCrit,
                    },
                  }));
                }}
                onNavigateToWordTask={() => {
                  setActivePage('wordpage');
                  showToast('Chuyển sang Bước 4: Tạo đề Word thực hành.');
                }}
                onShowToast={showToast}
              />
            )}

            {activePage === 'assignments' && (
              <AssignmentsView
                lessons={lessons}
                onSelectLesson={(g, idx, lessonObj) => {
                  setGrade(g);
                  setLesson(idx + 1);
                  setActivePage('rubricpage'); // Directly transitions to step 3 as requested!
                  showToast(`Đã chọn bài Khối ${g} – Chuyển sang Bước 3: Tạo / Duyệt Rubric.`);
                }}
                onSaveLesson={(l) => {
                  setLessons((prev) => {
                    const idx = prev.findIndex((x) => x.id === l.id);
                    if (idx >= 0) {
                      const next = [...prev];
                      next[idx] = l;
                      return next;
                    }
                    return [...prev, l];
                  });
                }}
                onDeleteLesson={(id) => {
                  setLessons((prev) => prev.filter((l) => l.id !== id));
                  showToast('Đã xóa bài học.');
                }}
                onResetGrade6={() => {
                  setLessons((prev) => {
                    const nonGrade6 = prev.filter((l) => Number(l.grade) !== 6);
                    const updated = [...TIN_HOC_6_LESSONS, ...nonGrade6];
                    safeSave(STORAGE_KEYS.LESSONS, updated);
                    return updated;
                  });
                  showToast('Đã nạp lại đủ 23 bài & YCCĐ chuẩn Tin học 6 theo Kế hoạch giáo dục môn Tin học (Phụ lục 01)!');
                }}
                onResetGrade7={() => {
                  setLessons((prev) => {
                    const nonGrade7 = prev.filter((l) => Number(l.grade) !== 7);
                    const updated = [...nonGrade7, ...TIN_HOC_7_LESSONS];
                    safeSave(STORAGE_KEYS.LESSONS, updated);
                    return updated;
                  });
                  showToast('Đã nạp lại đủ 20 bài & YCCĐ chuẩn Tin học 7 theo Khung phân phối chương trình (Phụ lục 01)!');
                }}
                onShowToast={showToast}
              />
            )}

            {activePage === 'rosterpage' && (
              <RosterView
                students={students}
                onImportStudents={handleImportStudents}
                onAddStudent={handleAddStudent}
                onDeleteStudent={handleDeleteStudent}
                onDeleteStudents={handleDeleteMultipleStudents}
                onRestoreDemo={handleRestoreDemo}
                onShowToast={showToast}
              />
            )}

            {activePage === 'submissionpage' && (
              <SubmissionView
                students={students}
                grade={grade}
                onGradeChange={handleGradeChange}
                lesson={lesson}
                onLessonChange={handleLessonChange}
                lessonsList={gradeLessons}
                classList={classList}
                selectedStudent={selectedStudent}
                onSelectStudent={(s) => setSelectedStudentCode(s.code)}
                criteria={activeRubric.criteria}
                weights={activeRubric.weights}
                assessmentStore={assessmentStore}
                draftLevels={draftLevels}
                draftEvidence={draftEvidence}
                draftFeedback={draftFeedback}
                onAttachFileToStudent={handleAttachFileToStudent}
                onDetachFileFromStudent={handleDetachFileFromStudent}
                onNavigate={setActivePage}
                onSaveDraftLevel={handleSaveDraftLevel}
                onSaveDraftBatch={handleSaveDraftBatch}
                onConfirmAssessment={handleConfirmAssessment}
                onRevokeAssessment={handleRevokeAssessment}
                onBackupJson={handleBackupJson}
                onRestoreJson={handleRestoreJson}
                onShowToast={showToast}
                queuedFiles={persistedQueuedFiles}
                onAddQueuedFiles={handleAddQueuedFiles}
                onRemoveQueuedFile={handleRemoveQueuedFile}
                onClearQueuedFiles={handleClearQueuedFiles}
              />
            )}

            {activePage === 'wordpage' && (
              <WordTaskView
                tasks={tasks}
                grade={grade}
                currentLessonCode={gradeLessons[lesson - 1]?.code || 'Bài 12'}
                currentLessonTitle={gradeLessons[lesson - 1]?.title || 'Trình bày thông tin ở dạng bảng'}
                currentLessonObj={currentLessonObj}
                criteria={activeRubric.criteria}
                selectedStudent={selectedStudent}
                onSaveTask={(t) => {
                  setTasks((prev) => {
                    const idx = prev.findIndex((x) => x.id === t.id);
                    if (idx >= 0) {
                      const next = [...prev];
                      next[idx] = t;
                      return next;
                    }
                    return [...prev, t];
                  });
                }}
                onDeleteTask={(id) => {
                  setTasks((prev) => prev.filter((t) => t.id !== id));
                  showToast('Đã xóa bài thực hành.');
                }}
                onAttachFileToStudent={handleAttachFileToStudent}
                onNavigateToSubmissions={() => {
                  setActivePage('submissionpage');
                  showToast('Chuyển sang Bước 5: Ghép bài nộp & Bước 6: Chấm / Xác nhận.');
                }}
                onShowToast={showToast}
              />
            )}

            {activePage === 'evidence' && (
              <EvidenceView
                confirmedAssessments={confirmedForLesson}
                criteria={activeRubric.criteria}
                grade={grade}
                lesson={lesson}
                lessonTitle={activeRubric.title}
                onExportCsv={handleExportCsv}
                onPrint={() => window.print()}
              />
            )}

            {activePage === 'customexam' && (
              <TeacherCustomExamView
                students={students}
                classList={classList}
                onShowToast={showToast}
                onAttachFileToStudent={handleAttachFileToStudent}
                onDetachFileFromStudent={handleDetachFileFromStudent}
              />
            )}

            {activePage === 'guide' && <GuideView />}
          </main>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 bg-[#102b50] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs sm:text-sm font-medium border border-blue-400/30 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
