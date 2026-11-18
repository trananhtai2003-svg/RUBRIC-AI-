import React, { useState } from 'react';
import { AssessmentRecord, Criterion, CurriculumLesson, Student, PageId } from '../types/rubric';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  Eye,
  FileCode,
  Trash2,
  ArrowRight,
  RefreshCw,
  UserCheck,
} from 'lucide-react';
import { inspectSubmission, matchSubmissionFilename, scoreLevels, fmt } from '../utils/rubricLogic';
import { AssessmentEditor } from './AssessmentEditor';

interface SubmissionViewProps {
  students: Student[];
  grade: number;
  onGradeChange: (g: number) => void;
  lesson: number;
  onLessonChange: (l: number) => void;
  lessonsList: CurriculumLesson[];
  classList: string[];
  selectedStudent: Student | undefined;
  onSelectStudent: (s: Student) => void;
  criteria: Criterion[];
  weights: number[];
  assessmentStore: Record<string, AssessmentRecord>;
  draftLevels: Record<string, number[]>;
  draftEvidence: Record<string, string[]>;
  draftFeedback: Record<string, string>;
  onAttachFileToStudent: (studentCode: string, fileName: string, file?: File) => void;
  onDetachFileFromStudent: (studentCode: string) => void;
  onNavigate: (page: PageId) => void;
  onSaveDraftLevel: (criterionIndex: number, level: number, evidence: string, feedback: string) => void;
  onSaveDraftBatch?: (levels: number[], evidence: string[], feedback: string) => void;
  onConfirmAssessment: (levels: number[], evidence: string[], feedback: string) => void;
  onRevokeAssessment: () => void;
  onBackupJson: () => void;
  onRestoreJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShowToast: (msg: string) => void;
  queuedFiles?: File[];
  onAddQueuedFiles?: (files: File[]) => void;
  onRemoveQueuedFile?: (index: number) => void;
  onClearQueuedFiles?: () => void;
}

export const SubmissionView: React.FC<SubmissionViewProps> = ({
  students,
  grade,
  onGradeChange,
  lesson,
  onLessonChange,
  lessonsList,
  classList,
  selectedStudent,
  onSelectStudent,
  criteria,
  weights,
  assessmentStore,
  draftLevels,
  draftEvidence,
  draftFeedback,
  onAttachFileToStudent,
  onDetachFileFromStudent,
  onNavigate,
  onSaveDraftLevel,
  onSaveDraftBatch,
  onConfirmAssessment,
  onRevokeAssessment,
  onBackupJson,
  onRestoreJson,
  onShowToast,
  queuedFiles: propQueuedFiles,
  onAddQueuedFiles,
  onRemoveQueuedFile: propRemoveQueuedFile,
  onClearQueuedFiles: propClearQueuedFiles,
}) => {
  const [targetClass, setTargetClass] = useState<string>(classList[0] || '6.1');
  const [localQueuedFiles, setLocalQueuedFiles] = useState<File[]>([]);
  const queuedFiles = propQueuedFiles !== undefined ? propQueuedFiles : localQueuedFiles;
  const [manualAssigned, setManualAssigned] = useState<Record<number, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const currentLessonTitle = lessonsList[lesson - 1]?.title || `Bài ${lesson}`;

  // Students who currently have an attached file in current grade/class
  const matchedStudents = students.filter(
    (s) =>
      Number(s.grade) === grade &&
      (targetClass === 'Tất cả' || s.cls === targetClass) &&
      Boolean(s.file)
  );

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || !files.length) return;
    const allowed = /\.(docx?|xlsx?|pptx|pdf|py|txt|csv)$/i;
    const fileList = Array.from(files);
    const valid = fileList.filter((f) => allowed.test(f.name));
    const invalidCount = fileList.length - valid.length;

    if (invalidCount > 0) {
      onShowToast(`Bỏ qua ${invalidCount} tệp không thuộc định dạng được hỗ trợ.`);
    }

    if (!valid.length) return;

    if (onAddQueuedFiles) {
      onAddQueuedFiles(valid);
    } else {
      setLocalQueuedFiles((prev) => [...prev, ...valid]);
    }
    onShowToast(`Đã nhận thêm ${valid.length} tệp vào danh sách nạp đối chứng (danh sách được giữ nguyên).`);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const handleRemoveQueuedFile = (index: number) => {
    if (propRemoveQueuedFile) {
      propRemoveQueuedFile(index);
    } else {
      setLocalQueuedFiles((prev) => prev.filter((_, i) => i !== index));
    }
    setManualAssigned((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
    onShowToast('Đã xóa tệp khỏi danh sách nạp đối chứng.');
  };

  const handleClearAllQueuedFiles = () => {
    if (propClearQueuedFiles) {
      propClearQueuedFiles();
    } else {
      setLocalQueuedFiles([]);
    }
    setManualAssigned({});
    onShowToast('Đã xóa toàn bộ tệp trong danh sách nạp đối chứng.');
  };

  const handleLoadSampleSubmissions = () => {
    const samples = [
      new File(['Bài làm thực hành của Lê Vương Trúc An'], '61001_LêVươngTrúcAn_ThucHanh.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
      new File(['Bài làm thực hành của Lưu Gia An'], '61002_LưuGiaAn_ThucHanh.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
      new File(['Bài làm thực hành của Lê Đình Anh'], '61003_LêĐìnhAnh_ThucHanh.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
      new File(['Bài làm thực hành của Lý Quốc Anh'], '61004_LýQuốcAnh_ThucHanh.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
    ];
    if (onAddQueuedFiles) {
      onAddQueuedFiles(samples);
    } else {
      setLocalQueuedFiles((prev) => [...prev, ...samples]);
    }
    onShowToast('Đã nạp 4 bài nộp mẫu đối chứng vào danh sách!');
  };

  const handleAttachSingle = (fileIndex: number, code: string) => {
    const file = queuedFiles[fileIndex];
    if (!file || !code) return;

    onAttachFileToStudent(code, file.name, file);
    onShowToast(`Đã ghép tệp ${file.name} cho học sinh mã ${code}.`);
  };

  const handleDetachStudentFile = (code: string, studentName: string) => {
    onDetachFileFromStudent(code);
    onShowToast(`Đã xóa bài ghép của học sinh ${code} – ${studentName}.`);
  };

  const handleAnalyzeAll = async () => {
    if (!queuedFiles.length && !matchedStudents.length) {
      onShowToast('Trước hết hãy chọn hoặc kéo thả các tệp bài nộp của học sinh.');
      return;
    }

    setIsAnalyzing(true);
    let successCount = 0;

    const classPool = students.filter(
      (s) => Number(s.grade) === grade && (targetClass === 'Tất cả' || s.cls === targetClass)
    );

    for (let i = 0; i < queuedFiles.length; i++) {
      const file = queuedFiles[i];
      const manualCode = manualAssigned[i];

      let targetStudent = classPool.find((s) => s.code === manualCode);
      if (!targetStudent) {
        targetStudent = classPool.find((s) => matchSubmissionFilename(file.name, s.code));
      }
      if (!targetStudent) {
        targetStudent = students.find((s) => s.file === file.name);
      }

      if (!targetStudent) continue;

      onAttachFileToStudent(targetStudent.code, file.name, file);

      try {
        const result = await inspectSubmission(file);
        if (result.levels) {
          successCount++;
          for (let cIdx = 0; cIdx < result.levels.length; cIdx++) {
            onSaveDraftLevel(
              cIdx,
              result.levels[cIdx],
              result.evidence[cIdx] || '',
              `Đề xuất quy tắc theo cấu trúc bài: ${result.summary}`
            );
          }
          targetStudent.analysis = result;
        }
      } catch (err: unknown) {
        console.error('Lỗi phân tích:', err);
      }
    }

    setIsAnalyzing(false);
    onShowToast(
      `Đã phân tích xong ${successCount} bài nộp. Thầy cô có thể chuyển sang Bước 6 để rà soát & xác nhận!`
    );
  };

  const currentKey = selectedStudent ? `${grade}|${lesson}|${selectedStudent.code}` : '';
  const currentAssessment = selectedStudent ? assessmentStore[currentKey] || null : null;
  const currentDraft = selectedStudent ? draftLevels[currentKey] || null : null;

  return (
    <div className="space-y-4">
      {/* Top Filter Bar & Fast Transition to Step 6 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-blue-600" />
              Bước 5: Ghép bài nộp với học sinh, lớp và Rubric
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hỗ trợ kéo thả nhiều tệp DOCX, XLSX, PPTX, PDF, Python, CSV, TXT. Nhận diện tự động mã học sinh trong tên tệp.
            </p>
          </div>

          {/* Quick Transition Button to Step 6 */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('results')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Chuyển sang Bước 6: Chấm / xác nhận AI Chấm"
            >
              <span>Chuyển sang Bước 6: Chấm / xác nhận AI Chấm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Grade, Class, Lesson selectors */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <label>Khối:</label>
            <select
              value={grade}
              onChange={(e) => onGradeChange(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs font-bold"
            >
              {[6, 7, 8, 9, 10, 11, 12].map((g) => (
                <option key={g} value={g}>
                  Khối {g}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <label>Lớp:</label>
            <select
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs font-bold"
            >
              {classList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="Tất cả">Tất cả</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <label>Bài học:</label>
            <select
              value={lesson}
              onChange={(e) => onLessonChange(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs font-bold max-w-[220px] truncate"
            >
              {lessonsList.map((l, i) => (
                <option key={l.id || i} value={i + 1}>
                  {l.code} – {l.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors mt-3 ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
          }`}
        >
          <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
            KÉO THẢ TỆP BÀI LÀM CỦA HỌC SINH VÀO ĐÂY
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Hoặc chọn tệp từ máy tính:
          </p>
          <label className="mt-2.5 inline-block px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm">
            Chọn tệp bài nộp (.docx, .doc, .py, .txt, ...)
            <input
              type="file"
              multiple
              accept=".docx,.doc,.xlsx,.xls,.pptx,.pdf,.py,.txt,.csv"
              onChange={(e) => handleFilesSelected(e.target.files)}
              className="hidden"
            />
          </label>
          <p className="text-[11px] text-slate-400 mt-2">
            Quy ước đặt tên tệp chuẩn: <strong>MAHS_Bai12.docx</strong> (Ví dụ: <strong>61001_Bai12.docx</strong>) để phần mềm tự khớp 100%.
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Queued Files, Matching Table, and Matched Students List */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card 1: Queued Submissions & Matching Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-3 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                  Danh sách tệp bài nộp đối chứng ({queuedFiles.length} tệp được giữ nguyên)
                </span>
                <span className="text-[10px] text-slate-500">
                  Tệp luôn được lưu giữ để đối chứng, cho phép thêm mới hoặc xóa từng tệp bất kỳ lúc nào.
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <label className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer shadow-2xs">
                  <span>+ Thêm tệp</span>
                  <input
                    type="file"
                    multiple
                    accept=".docx,.doc,.xlsx,.xls,.pptx,.pdf,.py,.txt,.csv"
                    onChange={(e) => handleFilesSelected(e.target.files)}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleLoadSampleSubmissions}
                  className="px-2 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors"
                  title="Nạp lại các tệp mẫu đối chứng"
                >
                  Nạp mẫu
                </button>

                {queuedFiles.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllQueuedFiles}
                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors"
                    title="Xóa toàn bộ tệp trong danh sách đối chứng"
                  >
                    Xóa tất cả tệp
                  </button>
                )}

                <button
                  onClick={handleAnalyzeAll}
                  disabled={isAnalyzing || !queuedFiles.length}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors shadow-2xs ${
                    isAnalyzing || !queuedFiles.length
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                  }`}
                  title="Tự động ghép và phân tích cấu trúc bài"
                >
                  <Sparkles className="w-3 h-3" />
                  {isAnalyzing ? 'Đang phân tích...' : 'Phân tích tự động'}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[320px]">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    <th className="p-2 font-bold">Tệp nộp</th>
                    <th className="p-2 font-bold">Học sinh khớp</th>
                    <th className="p-2 text-center w-16">Lớp</th>
                    <th className="p-2 text-center w-24">Kết quả ghép</th>
                    <th className="p-2 text-center w-36">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {queuedFiles.map((file, i) => {
                    const classPool = students.filter(
                      (s) => Number(s.grade) === grade && (targetClass === 'Tất cả' || s.cls === targetClass)
                    );
                    const matched = classPool.find((s) => matchSubmissionFilename(file.name, s.code));
                    const manualCode = manualAssigned[i];
                    const selected = manualCode
                      ? classPool.find((s) => s.code === manualCode)
                      : matched;

                    return (
                      <tr
                        key={i}
                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      >
                        <td className="p-2">
                          <div className="font-bold text-slate-900 dark:text-slate-100 font-mono text-[11px] truncate max-w-[170px]">
                            {file.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {Math.round(file.size / 1024)} KB · {file.name.split('.').pop()?.toUpperCase()}
                          </div>
                        </td>
                        <td className="p-2">
                          {selected ? (
                            <span className="font-bold text-blue-700 dark:text-blue-300">
                              {selected.code} – {selected.name}
                            </span>
                          ) : (
                            <select
                              value={manualCode || ''}
                              onChange={(e) =>
                                setManualAssigned((prev) => ({ ...prev, [i]: e.target.value }))
                              }
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-1 text-[11px]"
                            >
                              <option value="">-- Chọn học sinh thủ công --</option>
                              {classPool.map((s) => (
                                <option key={s.code} value={s.code}>
                                  {s.code} – {s.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className="p-2 text-center text-slate-600 dark:text-slate-400 font-mono">
                          {selected?.cls || targetClass}
                        </td>
                        <td className="p-2 text-center">
                          <span
                            className={`inline-block text-[10px] px-2 py-0.5 rounded font-bold ${
                              matched
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : selected
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {matched ? 'Khớp mã' : selected ? 'Đã gán' : 'Cần gán'}
                          </span>
                        </td>
                        <td className="p-2 text-center space-x-1 whitespace-nowrap">
                          {selected ? (
                            <button
                              onClick={() => {
                                handleAttachSingle(i, selected.code);
                                onSelectStudent(selected);
                                onNavigate('results');
                                onShowToast(`Chuyển sang Bước 6 để GV chấm bài cho học sinh ${selected.code} – ${selected.name}`);
                              }}
                              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-bold cursor-pointer inline-flex items-center gap-0.5 shadow-2xs"
                              title="Gán tệp và chuyển sang Bước 6 để GV chấm bài ngay"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              GV Chấm bài
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                const code = manualCode;
                                if (code) {
                                  handleAttachSingle(i, code);
                                  const s = students.find((st) => st.code === code);
                                  if (s) onSelectStudent(s);
                                } else {
                                  onShowToast('Vui lòng chọn học sinh trước khi gán.');
                                }
                              }}
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded text-[10px] font-bold cursor-pointer"
                              title="Gán tệp này cho học sinh đã chọn"
                            >
                              Gán
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveQueuedFile(i)}
                            className="px-1.5 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded text-[10px] font-bold cursor-pointer"
                            title="Xóa tệp khỏi danh sách đối chứng"
                          >
                            <Trash2 className="w-3 h-3 inline" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {queuedFiles.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-slate-400 italic">
                        Chưa có tệp nộp nào trong danh sách đối chứng. Hãy bấm nút <strong>&ldquo;+ Thêm tệp&rdquo;</strong> hoặc <strong>&ldquo;Nạp mẫu&rdquo;</strong> ở trên.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 2: DANH SÁCH HỌC SINH ĐÃ GHÉP BÀI & NÚT GV CHẤM BÀI / XÓA BÀI ĐÃ GHÉP NẾU GHÉP NHẦM */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/50 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-blue-900 dark:text-blue-200">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Danh sách học sinh đã ghép bài ({matchedStudents.length} học sinh)</span>
              </div>
              <span className="text-[11px] text-blue-700 dark:text-blue-300">
                Thầy cô bấm &ldquo;GV Chấm bài&rdquo; để sang Bước 6, hoặc xóa ghép nếu ghép nhầm
              </span>
            </div>

            <div className="overflow-x-auto max-h-[300px]">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    <th className="p-2 text-center w-10">STT</th>
                    <th className="p-2 font-bold">Mã HS & Họ tên</th>
                    <th className="p-2 text-center w-16">Lớp</th>
                    <th className="p-2 font-bold">Tệp bài đã ghép</th>
                    <th className="p-2 text-center w-40">Thao tác chấm & ghép</th>
                  </tr>
                </thead>
                <tbody>
                  {matchedStudents.map((st, idx) => (
                    <tr
                      key={st.code}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >
                      <td className="p-2 text-center font-mono text-[11px] text-slate-400">{idx + 1}</td>
                      <td className="p-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {st.code} – {st.name}
                        </span>
                      </td>
                      <td className="p-2 text-center font-mono text-slate-600 dark:text-slate-400">{st.cls}</td>
                      <td className="p-2">
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          <FileText className="w-3 h-3 text-blue-600" />
                          {st.file}
                        </span>
                      </td>
                      <td className="p-2 text-center space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            onSelectStudent(st);
                            onNavigate('results');
                            onShowToast(`Chuyển sang Bước 6: Sẵn sàng chấm bài cho học sinh ${st.code} – ${st.name}`);
                          }}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] font-bold cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                          title="Chuyển sang Bước 6 để GV chấm bài cho học sinh này"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>GV Chấm bài</span>
                        </button>
                        <button
                          onClick={() => handleDetachStudentFile(st.code, st.name)}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded text-[10px] font-bold cursor-pointer inline-flex items-center gap-1 border border-rose-200 dark:border-rose-900/50"
                          title="Xóa bài đã ghép nếu ghép nhầm học sinh"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Xóa bài ghép</span>
                        </button>
                      </td>
                    </tr>
                  ))}

                  {matchedStudents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-slate-400 italic">
                        Chưa có học sinh nào được ghép bài trong lớp này. Hãy gán tệp từ danh sách phía trên.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Transition Banner */}
            {matchedStudents.length > 0 && (
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 border-t border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                  Đã ghép thành công {matchedStudents.length} bài nộp của học sinh.
                </span>
                <button
                  onClick={() => onNavigate('results')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <span>Chuyển sang Bước 6 để chấm & xác nhận</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Card 3: Analysis Results Display */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/50 px-3.5 py-2.5 flex items-center justify-between">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-emerald-600" />
                Kết quả trích xuất & phân tích định dạng bài làm
              </h4>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-300">
                Chấm điểm có minh chứng
              </span>
            </div>

            <div className="p-3 space-y-3 max-h-[350px] overflow-y-auto text-xs">
              {students
                .filter((s) => Boolean(s.analysis))
                .map((s) => {
                  const a = s.analysis!;
                  const score = a.levels ? scoreLevels(a.levels, weights) : null;
                  return (
                    <div
                      key={s.code}
                      className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-800/40"
                    >
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {s.code} – {s.name} ({s.file})
                        </span>
                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded">
                          {a.kind}
                        </span>
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 leading-snug">
                        <strong>Tóm tắt:</strong> {a.summary}
                      </p>

                      {a.levels && (
                        <div className="mt-2 p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">
                            <span>Đề xuất mức theo 4 tiêu chí:</span>
                            <span>Điểm tham khảo: {fmt(score)} / 10</span>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                            {a.levels.map((lvl, lIdx) => (
                              <div
                                key={lIdx}
                                className="bg-slate-50 dark:bg-slate-800 p-1 rounded font-mono font-bold text-slate-700 dark:text-slate-300"
                              >
                                TC{lIdx + 1}: {lvl}/4
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                        <button
                          onClick={() => {
                            onSelectStudent(s);
                            onNavigate('results');
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Mở phiếu Bước 6 để rà soát & xác nhận
                        </button>
                      </div>
                    </div>
                  );
                })}

              {!students.some((s) => Boolean(s.analysis)) && (
                <p className="text-center py-6 text-slate-400 italic">
                  Chưa có kết quả phân tích. Bấm nút &ldquo;Phân tích & chấm các bài đã gán&rdquo; phía trên sau khi nạp tệp.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Embedded Assessment Editor Side-by-Side! */}
        <div className="lg:col-span-5 sticky top-4">
          <AssessmentEditor
            student={selectedStudent}
            criteria={criteria}
            weights={weights}
            assessment={currentAssessment}
            draftLevels={currentDraft}
            draftEvidence={draftEvidence[currentKey] || []}
            draftFeedback={draftFeedback[currentKey] || ''}
            grade={grade}
            lessonTitle={currentLessonTitle}
            onSaveDraftLevel={onSaveDraftLevel}
            onSaveDraftBatch={onSaveDraftBatch}
            onConfirmAssessment={onConfirmAssessment}
            onRevokeAssessment={onRevokeAssessment}
            onBackupJson={onBackupJson}
            onRestoreJson={onRestoreJson}
            onShowToast={onShowToast}
          />
        </div>
      </div>
    </div>
  );
};
