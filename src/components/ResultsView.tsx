import React, { useState } from 'react';
import {
  FileSpreadsheet,
  UserCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Award,
  Upload,
} from 'lucide-react';
import { AssessmentRecord, Criterion, Student } from '../types/rubric';
import { fmt, scoreLevels, rank } from '../utils/rubricLogic';
import { AssessmentEditor } from './AssessmentEditor';

interface ResultsViewProps {
  students: Student[];
  selectedStudent: Student | undefined;
  onSelectStudent: (student: Student) => void;
  criteria: Criterion[];
  weights: number[];
  rubricTitle: string;
  assessmentStore: Record<string, AssessmentRecord>;
  draftLevels: Record<string, number[]>;
  draftEvidence: Record<string, string[]>;
  draftFeedback: Record<string, string>;
  onAttachFile: (file: File) => void;
  onSaveDraftLevel: (criterionIndex: number, level: number, evidence: string, feedback: string) => void;
  onSaveDraftBatch?: (levels: number[], evidence: string[], feedback: string) => void;
  onConfirmAssessment: (levels: number[], evidence: string[], feedback: string, standardLevel?: string) => void;
  onRevokeAssessment: () => void;
  onBackupJson: () => void;
  onRestoreJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  grade: number;
  lesson: number;
  onShowToast?: (msg: string) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  students,
  selectedStudent,
  onSelectStudent,
  criteria,
  weights,
  rubricTitle,
  assessmentStore,
  draftLevels,
  draftEvidence,
  draftFeedback,
  onAttachFile,
  onSaveDraftLevel,
  onSaveDraftBatch,
  onConfirmAssessment,
  onRevokeAssessment,
  onBackupJson,
  onRestoreJson,
  grade,
  lesson,
  onShowToast,
}) => {
  // Filter for student roster in Panel 2: 'confirmed' | 'matched' | 'all' | 'unmatched'
  const [filterMode, setFilterMode] = useState<'all' | 'matched' | 'confirmed' | 'unmatched'>('confirmed');

  const currentKey = selectedStudent ? `${grade}|${lesson}|${selectedStudent.code}` : '';
  const currentAssessment = selectedStudent ? assessmentStore[currentKey] || null : null;
  const currentDraft = selectedStudent ? draftLevels[currentKey] || null : null;

  // Stats from confirmed assessments in current student list
  const confirmedList = students
    .map((s) => assessmentStore[`${grade}|${lesson}|${s.code}`])
    .filter((a): a is AssessmentRecord => Boolean(a && a.status === 'confirmed'));

  const matchedStudents = students.filter((s) => Boolean(s.file || s.analysis));
  const unmatchedStudents = students.filter((s) => !s.file && !s.analysis);

  // Filter students based on selected filter tab
  const displayedStudents = students.filter((s) => {
    if (filterMode === 'confirmed') {
      const a = assessmentStore[`${grade}|${lesson}|${s.code}`];
      return Boolean(a && a.status === 'confirmed');
    }
    if (filterMode === 'matched') return Boolean(s.file || s.analysis);
    if (filterMode === 'unmatched') return !s.file && !s.analysis;
    return true;
  });

  const confirmedScores = confirmedList.map((a) => a.score);
  const maxScore = confirmedScores.length ? Math.max(...confirmedScores) : null;
  const minScore = confirmedScores.length ? Math.min(...confirmedScores) : null;
  const avgScore = confirmedScores.length
    ? confirmedScores.reduce((a, b) => a + b, 0) / confirmedScores.length
    : null;

  const counts = { Tốt: 0, Khá: 0, Đạt: 0, 'Chưa đạt': 0 };
  confirmedList.forEach((a) => {
    if (a.rating in counts) counts[a.rating as keyof typeof counts]++;
  });

  // Calculate score for display for selected student
  const displayLevels = currentAssessment
    ? currentAssessment.levels
    : currentDraft || [3, 3, 3, 3];
  const displayScore = currentAssessment
    ? currentAssessment.score
    : scoreLevels(displayLevels, weights);
  const displayRank = currentAssessment
    ? { label: currentAssessment.rating, badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-800' }
    : rank(displayScore);

  return (
    <div className="space-y-4">
      {/* 3-column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Panel 1: Rubric Summary */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="bg-rose-50 dark:bg-rose-950/40 border-b border-rose-100 dark:border-rose-900/50 px-3.5 py-2.5 flex items-center justify-between">
            <h3 className="font-bold text-rose-900 dark:text-rose-200 text-xs sm:text-sm flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-rose-600" />
              Rubric đánh giá sản phẩm
            </h3>
            <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400">
              {weights.reduce((a, b) => a + b, 0)}%
            </span>
          </div>
          <div className="p-2 sm:p-3 overflow-x-auto flex-1 text-xs">
            <table className="w-full border-collapse text-left text-[11px]">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <th className="border border-slate-200 dark:border-slate-700 p-1.5 font-bold">Tiêu chí</th>
                  <th className="border border-slate-200 dark:border-slate-700 p-1.5 font-bold text-center w-12">TL%</th>
                  <th className="border border-slate-200 dark:border-slate-700 p-1.5 font-bold text-center w-12">M1</th>
                  <th className="border border-slate-200 dark:border-slate-700 p-1.5 font-bold text-center w-12">M2</th>
                  <th className="border border-slate-200 dark:border-slate-700 p-1.5 font-bold text-center w-12">M3</th>
                  <th className="border border-slate-200 dark:border-slate-700 p-1.5 font-bold text-center w-12">M4</th>
                </tr>
              </thead>
              <tbody>
                {criteria.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="border border-slate-200 dark:border-slate-700 p-1.5 font-medium">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">TC{i + 1}</span>
                      <span className="text-[10px] text-slate-500 block leading-tight">{c[0]}</span>
                    </td>
                    <td className="border border-slate-200 dark:border-slate-700 p-1.5 font-bold text-center text-blue-600">
                      {c[1]}%
                    </td>
                    <td className="border border-slate-200 dark:border-slate-700 p-1 text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
                      {c[2][0]}
                    </td>
                    <td className="border border-slate-200 dark:border-slate-700 p-1 text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
                      {c[2][1]}
                    </td>
                    <td className="border border-slate-200 dark:border-slate-700 p-1 text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
                      {c[2][2]}
                    </td>
                    <td className="border border-slate-200 dark:border-slate-700 p-1 text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
                      {c[2][3]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2.5 p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg text-[11px] text-amber-800 dark:text-amber-300">
              Rubric công khai trước khi học sinh thực hành. Thang 4 mức: 1–Chưa đạt, 2–Đạt một phần, 3–Đạt yêu cầu, 4–Vượt yêu cầu.
            </div>
          </div>
        </div>

        {/* Panel 2: Student Score Table & Filter for Matched Students */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="bg-blue-50 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/50 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-blue-900 dark:text-blue-200 text-xs sm:text-sm flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" />
                Kết quả chấm điểm
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Xem kết quả điểm 4 tiêu chí và nhận xét chi tiết của từng học sinh.
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
              {confirmedList.length} học sinh đã chấm điểm
            </span>
          </div>

          {/* Quick Filter Tabs for Submissions */}
          <div className="px-3 pt-2 pb-1.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-1.5 text-xs">
            <button
              onClick={() => setFilterMode('confirmed')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterMode === 'confirmed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>★ Đã chấm điểm ({confirmedList.length})</span>
            </button>
            <button
              onClick={() => setFilterMode('matched')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterMode === 'matched'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Đã ghép bài ({matchedStudents.length})</span>
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              Tất cả học sinh ({students.length})
            </button>
            <button
              onClick={() => setFilterMode('unmatched')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                filterMode === 'unmatched'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              Chưa nộp ({unmatchedStudents.length})
            </button>
          </div>

          <div className="p-2 sm:p-3 overflow-y-auto max-h-[380px] flex-1 text-xs">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <th className="border border-slate-200 dark:border-slate-700 p-1.5 text-center w-8">STT</th>
                  <th className="border border-slate-200 dark:border-slate-700 p-1.5 font-bold">Họ và tên</th>
                  <th className="border border-slate-200 dark:border-slate-700 p-1.5 text-center w-8">T1</th>
                  <th className="border border-slate-200 dark:border-slate-700 p-1.5 text-center w-8">T2</th>
                  <th className="border border-slate-200 dark:border-slate-700 p-1.5 text-center w-8">T3</th>
                  <th className="border border-slate-200 dark:border-slate-700 p-1.5 text-center w-8">T4</th>
                  <th className="border border-slate-200 dark:border-slate-700 p-1.5 text-center w-14 font-bold">Tổng/10</th>
                  <th className="border border-slate-200 dark:border-slate-700 p-1.5 text-center w-16">Xếp loại</th>
                </tr>
              </thead>
              <tbody>
                {displayedStudents.map((s, index) => {
                  const key = `${grade}|${lesson}|${s.code}`;
                  const confirmed = assessmentStore[key];
                  const draft = draftLevels[key];
                  const isSelected = selectedStudent?.code === s.code;

                  const sLevels = confirmed ? confirmed.levels : draft || null;
                  const sScore = confirmed ? confirmed.score : sLevels ? scoreLevels(sLevels, weights) : null;
                  const sRank = confirmed ? { label: confirmed.rating } : rank(sScore);

                  return (
                    <tr
                      key={s.code}
                      onClick={() => onSelectStudent(s)}
                      className={`cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 ${
                        isSelected
                          ? 'bg-blue-100/70 dark:bg-blue-950/60 font-semibold text-blue-950 dark:text-blue-100'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <td className="p-1.5 text-center text-slate-500 font-mono text-[11px]">{index + 1}</td>
                      <td className="p-1.5">
                        <div className="font-bold text-xs truncate max-w-[130px] sm:max-w-[160px]">
                          {s.code} – {s.name}
                        </div>
                        <div className="text-[10px] space-y-0.5">
                          {confirmed ? (
                            <>
                              <span className="text-emerald-700 dark:text-emerald-300 font-bold block">
                                ✓ Đã xác nhận · {confirmed.standardLevel || 'Đạt chuẩn'}
                              </span>
                              {confirmed.feedback && (
                                <p className="text-[10.5px] text-slate-700 dark:text-slate-300 italic line-clamp-2 mt-0.5 bg-amber-50/70 dark:bg-amber-950/40 p-1 rounded border border-amber-200/50 dark:border-amber-900/40">
                                  <strong>Nhận xét:</strong> {confirmed.feedback}
                                </p>
                              )}
                            </>
                          ) : s.file ? (
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium block">
                              📄 {s.file} (Đã ghép)
                            </span>
                          ) : (
                            <span className="text-slate-400 block">Chưa nộp / Chưa ghép</span>
                          )}
                        </div>
                      </td>
                      <td className="p-1.5 text-center font-mono text-[11px]">{sLevels ? sLevels[0] : '—'}</td>
                      <td className="p-1.5 text-center font-mono text-[11px]">{sLevels ? sLevels[1] : '—'}</td>
                      <td className="p-1.5 text-center font-mono text-[11px]">{sLevels ? sLevels[2] : '—'}</td>
                      <td className="p-1.5 text-center font-mono text-[11px]">{sLevels ? sLevels[3] : '—'}</td>
                      <td className="p-1.5 text-center font-bold font-mono text-blue-700 dark:text-blue-300">
                        {fmt(sScore)}
                      </td>
                      <td className="p-1.5 text-center">
                        {sScore !== null ? (
                          <span
                            className={`inline-block text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              sRank.label === 'Tốt'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : sRank.label === 'Khá'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : sRank.label === 'Đạt'
                                ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            }`}
                          >
                            {sRank.label}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {displayedStudents.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-slate-400 italic">
                      Không tìm thấy học sinh nào theo bộ lọc đang chọn.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Quick Statistics Strip */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="block text-sm sm:text-base font-extrabold text-blue-700 dark:text-blue-300 font-mono">
                  {fmt(maxScore)}
                </span>
                <span className="text-[10px] text-slate-500 block">Cao nhất</span>
              </div>
              <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="block text-sm sm:text-base font-extrabold text-blue-700 dark:text-blue-300 font-mono">
                  {fmt(minScore)}
                </span>
                <span className="text-[10px] text-slate-500 block">Thấp nhất</span>
              </div>
              <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="block text-sm sm:text-base font-extrabold text-blue-700 dark:text-blue-300 font-mono">
                  {fmt(avgScore)}
                </span>
                <span className="text-[10px] text-slate-500 block">Trung bình</span>
              </div>
              <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 font-mono leading-tight">
                  {counts.Tốt}/{counts.Khá}/{counts.Đạt}
                </span>
                <span className="text-[10px] text-slate-500 block">Tốt/Khá/Đạt</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-center">
              {confirmedList.length} phiếu đã xác nhận / {students.length} học sinh ({matchedStudents.length} đã ghép bài)
            </p>
          </div>
        </div>

        {/* Panel 3: Detailed Feedback for Selected Student */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/50 px-3.5 py-2.5 flex items-center justify-between">
            <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm truncate">
              Nhận xét chi tiết ({selectedStudent?.code || 'Chưa chọn'})
            </h3>
            {currentAssessment && (
              <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">
                Đã duyệt
              </span>
            )}
          </div>

          <div className="p-3 overflow-y-auto max-h-[480px] flex-1 space-y-3 text-xs">
            {/* File box */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-1">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Tệp bài làm đính kèm:</span>
              </div>
              <p className="text-[11px] font-mono text-slate-700 dark:text-slate-300 break-all bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">
                {selectedStudent?.file || `${grade}_${selectedStudent?.name?.replace(/\s+/g, '')}_Bai${lesson}.docx`}
              </p>
              <div className="mt-2">
                <label className="text-[10px] text-slate-500 block mb-1">
                  Chọn tệp bài làm thực tế (.docx, .doc):
                </label>
                <input
                  type="file"
                  accept=".docx,.doc"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onAttachFile(f);
                  }}
                  className="text-[11px] text-slate-600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
            </div>

            {/* Overall Feedback */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-lg p-2.5">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-xs mb-1">
                ✓ Nhận xét tổng quan & Đạt chuẩn năng lực
              </h4>
              {currentAssessment?.standardLevel && (
                <div className="mb-1.5 p-1.5 bg-white/80 dark:bg-slate-800/80 rounded border border-emerald-300 dark:border-emerald-700 text-[11px] font-semibold text-emerald-900 dark:text-emerald-200">
                  ★ Mức đạt chuẩn: {currentAssessment.standardLevel}
                </div>
              )}
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentAssessment
                  ? currentAssessment.feedback
                  : displayScore && displayScore >= 8.5
                  ? 'Bài làm đáp ứng rất tốt các yêu cầu bài học; bảng cân đối, nội dung rõ ràng và đúng quy ước nộp bài.'
                  : displayScore && displayScore >= 7.0
                  ? 'Bài làm cơ bản đạt yêu cầu; nên xem lại các tiêu chí còn dưới mức 3 để hoàn thiện bố cục và định dạng.'
                  : displayScore && displayScore >= 5.0
                  ? 'Bài làm đạt một phần yêu cầu; cần đối chiếu lại Rubric và sửa chữa các lỗi cấu trúc bảng trước khi nộp.'
                  : 'Bài làm cần được hướng dẫn và bổ sung thêm các thao tác theo từng tiêu chí.'}
              </p>
            </div>

            {/* Criteria breakdown */}
            <div className="space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                Đánh giá theo 4 tiêu chí:
              </span>
              {criteria.map((c, i) => {
                const lvl = displayLevels[i] || 3;
                const evid = currentAssessment?.evidence?.[i] || draftEvidence[currentKey]?.[i] || '';

                return (
                  <div
                    key={i}
                    className="border-b border-slate-100 dark:border-slate-800 pb-2 text-[11px]"
                  >
                    <div className="flex items-center justify-between font-bold mb-0.5">
                      <span className="text-slate-800 dark:text-slate-200 truncate pr-2">
                        {i + 1}. {c[0]}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-mono text-[10px] shrink-0">
                        Mức {lvl}/4 ({c[1]}%)
                      </span>
                    </div>
                    <p className="text-slate-500 text-[10px] leading-relaxed">
                      {c[2][lvl - 1]}
                    </p>
                    {evid && (
                      <p className="text-emerald-700 dark:text-emerald-400 text-[10px] mt-1 bg-emerald-50/50 dark:bg-emerald-950/20 p-1 rounded">
                        <strong>Minh chứng:</strong> {evid}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Total score footer */}
            <div className="p-2.5 bg-emerald-100/70 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-lg text-center font-bold text-emerald-900 dark:text-emerald-200 text-xs">
              {currentAssessment ? (
                <span>
                  ĐIỂM ĐÃ XÁC NHẬN: {fmt(currentAssessment.score)} / 10 · {currentAssessment.rating}
                </span>
              ) : (
                <span>
                  ĐIỂM DỰ KIẾN: {fmt(displayScore)} / 10 · {displayRank.label}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Official Teacher Assessment Editor for Active Student (All 4 Criteria in Full View) */}
      <AssessmentEditor
        student={selectedStudent}
        criteria={criteria}
        weights={weights}
        assessment={currentAssessment}
        draftLevels={currentDraft}
        draftEvidence={draftEvidence[currentKey] || []}
        draftFeedback={draftFeedback[currentKey] || ''}
        grade={grade}
        lessonTitle={rubricTitle}
        onSaveDraftLevel={onSaveDraftLevel}
        onSaveDraftBatch={onSaveDraftBatch}
        onConfirmAssessment={onConfirmAssessment}
        onRevokeAssessment={onRevokeAssessment}
        onBackupJson={onBackupJson}
        onRestoreJson={onRestoreJson}
        onShowToast={onShowToast}
      />
    </div>
  );
};
