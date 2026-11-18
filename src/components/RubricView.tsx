import React, { useState } from 'react';
import { Criterion, CurriculumLesson, Student } from '../types/rubric';
import {
  FileSpreadsheet,
  Check,
  Sparkles,
  ArrowRight,
  Loader2,
  BookOpen,
  Edit2,
  Save,
  RotateCcw,
} from 'lucide-react';
import { generateRubricForLesson } from '../utils/curriculumGenerator';

interface RubricViewProps {
  rubricTitle: string;
  grade: number;
  lesson: number;
  currentLessonObj?: CurriculumLesson;
  criteria: Criterion[];
  selectedStudent: Student | undefined;
  onApplyLevel: (criterionIndex: number, level: number) => void;
  onUpdateCriteria?: (newCriteria: Criterion[]) => void;
  onNavigateToWordTask: () => void;
  onShowToast: (msg: string) => void;
}

export const RubricView: React.FC<RubricViewProps> = ({
  rubricTitle,
  grade,
  lesson,
  currentLessonObj,
  criteria,
  selectedStudent,
  onApplyLevel,
  onUpdateCriteria,
  onNavigateToWordTask,
  onShowToast,
}) => {
  const [selectedCriterion, setSelectedCriterion] = useState<number>(0);
  const [selectedLevel, setSelectedLevel] = useState<number>(3);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [isEditingMatrix, setIsEditingMatrix] = useState<boolean>(false);
  const [editableCriteria, setEditableCriteria] = useState<Criterion[]>(criteria);

  // Sync if criteria change from outside
  React.useEffect(() => {
    setEditableCriteria(criteria);
  }, [criteria]);

  const handleApply = () => {
    onApplyLevel(selectedCriterion, selectedLevel);
    onShowToast(`Đã cập nhật mức ${selectedLevel} cho tiêu chí TC${selectedCriterion + 1}.`);
  };

  const handleResetToStandardRubric = () => {
    if (currentLessonObj) {
      const tailored = generateRubricForLesson(currentLessonObj);
      setEditableCriteria(tailored.criteria);
      if (onUpdateCriteria) {
        onUpdateCriteria(tailored.criteria);
      }
      onShowToast(`Đã nạp Rubric chuẩn bám sát YCCĐ của ${currentLessonObj.code}: ${currentLessonObj.title}!`);
    }
  };

  const handleGenerateRubricAi = async () => {
    setIsGeneratingAi(true);
    onShowToast(`AI đang phân tích Yêu cầu cần đạt của ${currentLessonObj?.code || `Bài ${lesson}`} để tạo ma trận Rubric 4 tiêu chí chuẩn...`);

    try {
      const response = await fetch('/api/gemini/generate-rubric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          lessonCode: currentLessonObj?.code || `Bài ${lesson}`,
          lessonTitle: currentLessonObj?.title || rubricTitle,
          objective: currentLessonObj?.objective || 'Đạt các yêu cầu cần đạt theo chuẩn GDPT 2018.',
        }),
      });

      if (!response.ok) throw new Error('Máy chủ phản hồi lỗi');

      const data = await response.json();
      if (data.criteria && Array.isArray(data.criteria) && data.criteria.length >= 4) {
        setEditableCriteria(data.criteria);
        if (onUpdateCriteria) {
          onUpdateCriteria(data.criteria);
        }
        onShowToast(`Đã tạo xong Rubric 4 tiêu chí chuẩn bám sát YCCĐ (${data.source === 'gemini' ? 'Gemini 3.8 Flash' : 'Chuẩn GDPT 2018'})!`);
        return;
      }
      throw new Error('Dữ liệu tiêu chí không hợp lệ');
    } catch (err: any) {
      console.warn('Lỗi tạo Rubric AI:', err);
      if (currentLessonObj) {
        const tailored = generateRubricForLesson(currentLessonObj);
        setEditableCriteria(tailored.criteria);
        if (onUpdateCriteria) {
          onUpdateCriteria(tailored.criteria);
        }
        onShowToast(`Đã tạo Rubric chuẩn bám sát YCCĐ của ${currentLessonObj.code}: ${currentLessonObj.title}!`);
      } else {
        onShowToast('Đã áp dụng mẫu Rubric chuẩn sư phạm cho bài học này.');
      }
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSaveEditedCriteria = () => {
    if (onUpdateCriteria) {
      onUpdateCriteria(editableCriteria);
    }
    setIsEditingMatrix(false);
    onShowToast('Đã lưu các sửa đổi ma trận Rubric.');
  };

  const totalWeight = editableCriteria.reduce((sum, c) => sum + (Number(c[1]) || 0), 0);

  return (
    <div className="space-y-4">
      {/* Step Header & Pedagogical Context */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-[11px] mb-1">
              <span>BƯỚC 3 TRONG QUY TRÌNH</span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-rose-600" />
              Tạo & Duyệt Rubric theo bài học và Yêu cầu cần đạt
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Đang áp dụng cho: <strong className="text-slate-800 dark:text-slate-200">Khối {grade} – {currentLessonObj?.code || `Bài ${lesson}`}: {currentLessonObj?.title || rubricTitle}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleResetToStandardRubric}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title="Khôi phục Rubric chuẩn bám sát Yêu cầu cần đạt của bài học này"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>Nạp Rubric chuẩn YCCĐ</span>
            </button>

            <button
              onClick={handleGenerateRubricAi}
              disabled={isGeneratingAi}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              {isGeneratingAi ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>AI đang sinh Rubric...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>AI tự động tạo Rubric từ YCCĐ</span>
                </>
              )}
            </button>

            <button
              onClick={onNavigateToWordTask}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              <span>Chuyển sang Bước 4: Tạo đề Word</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Display Current Lesson Objectives */}
        {currentLessonObj?.objective && (
          <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg p-3 text-xs">
            <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              Yêu cầu cần đạt đã chọn ở Bước 2:
            </div>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed pl-5">
              {currentLessonObj.objective}
            </p>
          </div>
        )}
      </div>

      {/* Detailed Rubric Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-rose-50 dark:bg-rose-950/40 border-b border-rose-100 dark:border-rose-900/50 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-rose-900 dark:text-rose-200 text-xs sm:text-sm flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-rose-600" />
              Bảng ma trận Rubric chi tiết (4 tiêu chí x 4 mức độ đạt chuẩn)
            </h3>
            <p className="text-[11px] text-rose-700 dark:text-rose-400 mt-0.5">
              Mỗi tiêu chí được đo lường chính xác từ Mức 1 (Chưa đạt) đến Mức 4 (Vượt yêu cầu)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingMatrix(!isEditingMatrix)}
              className="text-xs font-semibold px-2.5 py-1 bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-md hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              {isEditingMatrix ? 'Hủy sửa trực tiếp' : 'Chỉnh sửa mô tả'}
            </button>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md text-white ${
                totalWeight === 100 ? 'bg-rose-600' : 'bg-amber-600'
              }`}
            >
              Tổng trọng số: {totalWeight}%
            </span>
          </div>
        </div>

        <div className="p-4 overflow-x-auto text-xs">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <th className="border border-slate-200 dark:border-slate-700 p-2.5 font-bold w-12 text-center">STT</th>
                <th className="border border-slate-200 dark:border-slate-700 p-2.5 font-bold w-48">Tiêu chí đánh giá</th>
                <th className="border border-slate-200 dark:border-slate-700 p-2.5 font-bold w-20 text-center">Trọng số</th>
                <th className="border border-slate-200 dark:border-slate-700 p-2.5 font-bold bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-300">
                  Mức 1<br /><span className="font-normal text-[10px]">Chưa đạt</span>
                </th>
                <th className="border border-slate-200 dark:border-slate-700 p-2.5 font-bold bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300">
                  Mức 2<br /><span className="font-normal text-[10px]">Đạt một phần</span>
                </th>
                <th className="border border-slate-200 dark:border-slate-700 p-2.5 font-bold bg-sky-50/50 dark:bg-sky-950/20 text-sky-900 dark:text-sky-300">
                  Mức 3<br /><span className="font-normal text-[10px]">Đạt yêu cầu</span>
                </th>
                <th className="border border-slate-200 dark:border-slate-700 p-2.5 font-bold bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300">
                  Mức 4<br /><span className="font-normal text-[10px]">Vượt yêu cầu</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {editableCriteria.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="border border-slate-200 dark:border-slate-700 p-2.5 text-center font-bold text-slate-500 font-mono">
                    {i + 1}
                  </td>
                  <td className="border border-slate-200 dark:border-slate-700 p-2.5 font-bold text-slate-900 dark:text-slate-100">
                    {isEditingMatrix ? (
                      <input
                        type="text"
                        value={c[0]}
                        onChange={(e) => {
                          const updated = [...editableCriteria];
                          updated[i] = [e.target.value, updated[i][1], updated[i][2]];
                          setEditableCriteria(updated);
                        }}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 rounded p-1 text-xs"
                      />
                    ) : (
                      c[0]
                    )}
                  </td>
                  <td className="border border-slate-200 dark:border-slate-700 p-2.5 text-center font-extrabold text-blue-600 dark:text-blue-400 font-mono text-sm">
                    {isEditingMatrix ? (
                      <input
                        type="number"
                        value={c[1]}
                        onChange={(e) => {
                          const updated = [...editableCriteria];
                          updated[i] = [updated[i][0], Number(e.target.value), updated[i][2]];
                          setEditableCriteria(updated);
                        }}
                        className="w-14 text-center bg-slate-50 dark:bg-slate-800 border border-slate-300 rounded p-1 text-xs font-bold"
                      />
                    ) : (
                      `${c[1]}%`
                    )}
                  </td>
                  {[0, 1, 2, 3].map((lvlIdx) => (
                    <td
                      key={lvlIdx}
                      className="border border-slate-200 dark:border-slate-700 p-2.5 leading-relaxed text-slate-700 dark:text-slate-300 text-[11px]"
                    >
                      {isEditingMatrix ? (
                        <textarea
                          rows={3}
                          value={c[2][lvlIdx]}
                          onChange={(e) => {
                            const updated = [...editableCriteria];
                            const newLevels = [...updated[i][2]] as [string, string, string, string];
                            newLevels[lvlIdx] = e.target.value;
                            updated[i] = [updated[i][0], updated[i][1], newLevels];
                            setEditableCriteria(updated);
                          }}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 rounded p-1 text-[11px]"
                        />
                      ) : (
                        c[2][lvlIdx]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {isEditingMatrix && (
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                onClick={handleSaveEditedCriteria}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                Lưu toàn bộ thay đổi ma trận Rubric
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar: Jump directly to Step 4 Word Task */}
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div>
          <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm">
            Đã hoàn tất duyệt Rubric cho bài học này?
          </h4>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
            Chuyển ngay sang <strong>Bước 4: Tạo đề Word</strong> để hệ thống tự động soạn bài thực hành bám sát 4 tiêu chí trên, có dữ liệu cụ thể để học sinh làm bài.
          </p>
        </div>

        <button
          onClick={onNavigateToWordTask}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer hover:shadow-lg"
        >
          <span>Tiếp tục sang Bước 4: Tạo đề Word thực hành</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Level Adjustment Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-600" />
          Điều chỉnh mức đạt nhanh cho học sinh đang chọn ({selectedStudent ? `${selectedStudent.code} – ${selectedStudent.name}` : 'Chưa chọn'})
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Tiêu chí:</label>
            <select
              value={selectedCriterion}
              onChange={(e) => setSelectedCriterion(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-medium text-slate-800 dark:text-slate-100"
            >
              {editableCriteria.map((c, i) => (
                <option key={i} value={i}>
                  TC{i + 1}: {c[0]} ({c[1]}%)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Mức đạt:</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-slate-100"
            >
              <option value={1}>Mức 1 – Chưa đạt</option>
              <option value={2}>Mức 2 – Đạt một phần</option>
              <option value={3}>Mức 3 – Đạt yêu cầu</option>
              <option value={4}>Mức 4 – Vượt yêu cầu</option>
            </select>
          </div>

          <button
            onClick={handleApply}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            Cập nhật điểm học sinh đang chọn
          </button>
        </div>
      </div>
    </div>
  );
};
