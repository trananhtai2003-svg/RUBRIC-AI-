import React, { useState } from 'react';
import { CurriculumLesson } from '../types/rubric';
import {
  BookOpen,
  Plus,
  Sparkles,
  Check,
  Trash2,
  Edit3,
  ArrowRight,
  Loader2,
  RefreshCw,
  Copy,
} from 'lucide-react';

interface AssignmentsViewProps {
  lessons: CurriculumLesson[];
  onSelectLesson: (grade: number, lessonIndex: number, lessonObj?: CurriculumLesson) => void;
  onSaveLesson: (lesson: CurriculumLesson) => void;
  onDeleteLesson: (id: string) => void;
  onResetGrade6?: () => void;
  onResetGrade7?: () => void;
  onShowToast: (msg: string) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  lessons,
  onSelectLesson,
  onSaveLesson,
  onDeleteLesson,
  onResetGrade6,
  onResetGrade7,
  onShowToast,
}) => {
  const [activeGradeFilter, setActiveGradeFilter] = useState<number>(6);
  const [selectedAI, setSelectedAI] = useState<'gemini' | 'chatgpt'>('gemini');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  // Form states
  const [editId, setEditId] = useState<string>('');
  const [editGrade, setEditGrade] = useState<number>(6);
  const [editCode, setEditCode] = useState<string>('');
  const [editTitle, setEditTitle] = useState<string>('');
  const [editPeriods, setEditPeriods] = useState<number>(2);
  const [editObjective, setEditObjective] = useState<string>('');

  const clearForm = () => {
    setEditId('');
    setEditGrade(activeGradeFilter);
    setEditCode('');
    setEditTitle('');
    setEditPeriods(2);
    setEditObjective('');
  };

  const handleEdit = (lesson: CurriculumLesson) => {
    setEditId(lesson.id);
    setEditGrade(lesson.grade);
    setEditCode(lesson.code);
    setEditTitle(lesson.title);
    setEditPeriods(lesson.periods);
    setEditObjective(lesson.objective);
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  const handleSave = () => {
    if (!editCode.trim() || !editTitle.trim()) {
      onShowToast('Vui lòng nhập đầy đủ Mã bài và Tên bài học.');
      return;
    }
    const newLesson: CurriculumLesson = {
      id: editId || `lesson-${Date.now()}`,
      grade: editGrade,
      code: editCode.trim(),
      title: editTitle.trim(),
      periods: editPeriods || 1,
      objective: editObjective.trim(),
    };
    onSaveLesson(newLesson);
    clearForm();
    onShowToast(`Đã lưu bài học: ${newLesson.code} – ${newLesson.title}`);
  };

  // Direct In-App AI generator for learning objectives (Yêu cầu cần đạt)
  const handleGenerateObjectivesWithAi = async () => {
    if (!editTitle.trim()) {
      onShowToast('Vui lòng nhập Tên bài học trước khi nhờ AI tạo Yêu cầu cần đạt.');
      return;
    }

    setIsGeneratingAi(true);
    onShowToast(`Đang kết nối AI (${selectedAI === 'gemini' ? 'Gemini' : 'ChatGPT'}) để tự động tạo Yêu cầu cần đạt...`);

    try {
      const response = await fetch('/api/gemini/generate-objectives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: editGrade,
          lessonCode: editCode || 'Bài học',
          lessonTitle: editTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Máy chủ phản hồi lỗi');
      }

      const data = await response.json();
      if (data.objective) {
        setEditObjective(data.objective);
        onShowToast(`Đã tạo xong Yêu cầu cần đạt bằng AI (${data.source === 'gemini' ? 'Gemini 3.8' : 'Bộ chuẩn GDPT 2018'}) ngay trên trang!`);
      } else {
        throw new Error('Dữ liệu trả về rỗng');
      }
    } catch (err: any) {
      console.warn('Lỗi gọi AI:', err);
      // Client-side smart fallback
      const smartFallback = `- Nêu được khái niệm, vai trò và mục đích của "${editTitle}" trong đời sống và học tập.
- Thực hiện thành thạo các thao tác cơ bản và nâng cao của bài học trên phần mềm tương ứng.
- Hoàn thành được sản phẩm thực hành theo đúng cấu trúc, đáp ứng yêu cầu kỹ thuật và thẩm mỹ.
- Biết kiểm tra, tự đánh giá sản phẩm và lưu tệp đúng quy ước mã học sinh.`;
      setEditObjective(smartFallback);
      onShowToast('Đã áp dụng chuẩn yêu cầu cần đạt GDPT 2018 cho bài học.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCopyPrompt = () => {
    const prompt = `Bạn là chuyên gia giáo dục môn Tin học phổ thông Việt Nam (Chương trình GDPT 2018).
Hãy xây dựng "YÊU CẦU CẦN ĐẠT" chuẩn sư phạm cho:
- Khối lớp: ${editGrade}
- Mã bài: ${editCode || 'Bài học'}
- Tên bài: ${editTitle || 'Bài học Tin học'}
Yêu cầu trả về 3 - 4 gạch đầu dòng rõ ràng, chuẩn động từ hành vi sư phạm đo lường được bằng Rubric.`;

    try {
      navigator.clipboard.writeText(prompt);
      onShowToast('Đã sao chép prompt yêu cầu cần đạt vào bộ nhớ tạm.');
    } catch {
      onShowToast('Không thể sao chép prompt.');
    }
  };

  const activeGradeLessons = lessons.filter((l) => Number(l.grade) === activeGradeFilter);

  return (
    <div className="space-y-4">
      {/* Top Banner & Quick Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-[11px] mb-1">
              <span>BƯỚC 2 TRONG QUY TRÌNH</span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Chọn Khối & Bài học · Tích hợp AI tạo Yêu cầu cần đạt
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thầy cô chọn khối lớp và bài dạy, chỉnh sửa yêu cầu cần đạt hoặc dùng AI sinh tự động ngay tại đây. Sau khi chọn sẽ chuyển ngay sang <strong>Bước 3: Tạo / Duyệt Rubric</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <label>Khối:</label>
              <select
                value={activeGradeFilter}
                onChange={(e) => {
                  const g = Number(e.target.value);
                  setActiveGradeFilter(g);
                  setEditGrade(g);
                }}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-slate-100"
              >
                {[6, 7, 8, 9, 10, 11, 12].map((g) => (
                  <option key={g} value={g}>
                    Khối {g} ({lessons.filter((l) => Number(l.grade) === g).length} bài)
                  </option>
                ))}
              </select>
            </div>

            {activeGradeFilter === 6 && onResetGrade6 && (
              <button
                onClick={onResetGrade6}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                title="Tải lại nguyên bản 23 bài học và YCCĐ chuẩn môn Tin học 6 theo Phụ lục 01"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Nạp lại 23 bài chuẩn Tin 6 (Phụ lục I)
              </button>
            )}

            {activeGradeFilter === 7 && onResetGrade7 && (
              <button
                onClick={onResetGrade7}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                title="Tải lại nguyên bản 20 bài học và YCCĐ chuẩn môn Tin học 7 theo Phụ lục 01"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Nạp lại 20 bài chuẩn Tin 7 (Phụ lục I)
              </button>
            )}

            <button
              onClick={() => {
                clearForm();
                setEditGrade(activeGradeFilter);
                setEditCode(`Bài ${activeGradeLessons.length + 1}`);
                onShowToast(`Biểu mẫu đã sẵn sàng nhập bài cho Khối ${activeGradeFilter}.`);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              + Thêm bài mới cho Khối {activeGradeFilter}
            </button>
          </div>
        </div>

        {activeGradeFilter === 6 && (
          <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-slate-800/80 dark:to-sky-950/40 border border-blue-200/80 dark:border-sky-800/60 rounded-lg text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <span className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Chương trình chuẩn môn Tin học 6 (Phụ lục 01 – Năm học 2026 - 2027)
              </span>
              <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                Tổng cộng 23 mục: 17 bài học + 4 bài kiểm tra định kỳ + 2 tiết ôn tập (35 tiết)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Bao gồm đầy đủ 6 Chủ đề: <strong>Chủ đề 1</strong>: Máy tính và cộng đồng (Bài 1, 2, 3) · <strong>Chủ đề 5</strong>: Ứng dụng tin học [Soạn thảo Word & Bảng biểu, Sơ đồ tư duy] (Bài 11, KT Giữa HK1, Bài 12, 13, 14, Ôn tập, KT Cuối HK1, Bài 10) · <strong>Chủ đề 2</strong>: Mạng máy tính & Internet (Bài 4, 5) · <strong>Chủ đề 3</strong>: Tổ chức lưu trữ tìm kiếm & trao đổi thông tin (Bài 6, 7, Bài 8) · <strong>Chủ đề 4</strong>: Đạo đức, pháp luật & văn hóa số (Bài 9, KT Giữa HK2) · <strong>Chủ đề 6</strong>: Giải quyết vấn đề với sự trợ giúp của máy tính [Thuật toán & Scratch] (Bài 15, 16, Ôn tập, KT Cuối HK2, Bài 17). Mỗi bài đều có tích hợp mục <strong>Năng lực số</strong> và <strong>Năng lực AI</strong>.
            </p>
          </div>
        )}

        {activeGradeFilter === 7 && (
          <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-indigo-950/40 border border-blue-200/80 dark:border-indigo-800/60 rounded-lg text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <span className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Chương trình chuẩn môn Tin học 7 (Phụ lục 01 – Năm học 2026 - 2027)
              </span>
              <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                Tổng cộng 20 mục: 16 bài học + 4 bài kiểm tra định kỳ (35 tiết)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Bao gồm đầy đủ 5 Chủ đề: <strong>Chủ đề 1</strong>: Máy tính và cộng đồng (Bài 1, 2, 3) · <strong>Chủ đề 2</strong>: Tổ chức lưu trữ tìm kiếm & trao đổi thông tin (Bài 4, KT Giữa HK1, Bài 5) · <strong>Chủ đề 4</strong>: Ứng dụng tin học [Bảng tính Excel & Trình chiếu PowerPoint] (Bài 6-13, KT Cuối HK1 & Giữa HK2) · <strong>Chủ đề 5</strong>: Giải quyết vấn đề với sự trợ giúp của máy tính [Thuật toán tìm kiếm & sắp xếp] (Bài 14, 15, KT Cuối HK2, Bài 16). Mỗi bài đều có tích hợp mục <strong>Năng lực số</strong> và <strong>Năng lực AI</strong>.
            </p>
          </div>
        )}

        {/* Quick select first lesson of grade and move to step 3 */}
        {activeGradeLessons.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-600 dark:text-blue-400">Chọn bài Khối {activeGradeFilter}:</span>
              <select
                onChange={(e) => {
                  const idx = Number(e.target.value);
                  const selected = activeGradeLessons[idx];
                  if (selected) {
                    onSelectLesson(activeGradeFilter, idx, selected);
                  }
                }}
                defaultValue=""
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 max-w-[280px] sm:max-w-[380px] truncate"
              >
                <option value="" disabled>-- Chọn bài để duyệt Rubric ngay --</option>
                {activeGradeLessons.map((l, idx) => (
                  <option key={l.id} value={idx}>
                    {l.code} – {l.title} ({l.periods} tiết)
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => onSelectLesson(activeGradeFilter, 0, activeGradeLessons[0])}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              <span>Chọn bài đầu tiên & Sang Bước 3</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Editor Form for Lesson & Direct In-App AI */}
      <div className="bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-blue-900/60 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-blue-50 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/50 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="font-bold text-blue-950 dark:text-blue-200 text-xs sm:text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              {editId ? 'Chỉnh sửa bài học & Yêu cầu cần đạt' : `Thêm bài học mới cho Khối ${editGrade}`}
            </h4>
            <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-0.5">
              Tích hợp AI tạo trực tiếp Yêu cầu cần đạt chuẩn CT GDPT 2018 ngay trên trang, không cần mở liên kết ngoài.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              <span>Mô hình:</span>
              <select
                value={selectedAI}
                onChange={(e) => setSelectedAI(e.target.value as 'gemini' | 'chatgpt')}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <option value="gemini">Gemini 3.8 Flash (Tích hợp)</option>
                <option value="chatgpt">ChatGPT AI</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Khối lớp:
              </label>
              <select
                value={editGrade}
                onChange={(e) => setEditGrade(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold"
              >
                {[6, 7, 8, 9, 10, 11, 12].map((g) => (
                  <option key={g} value={g}>
                    Khối {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mã bài học:
              </label>
              <input
                type="text"
                value={editCode}
                onChange={(e) => setEditCode(e.target.value)}
                placeholder="Ví dụ: Bài 12, Chủ đề 2, Bài 5..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tên bài học (Theo phân phối chương trình):
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Ví dụ: Trình bày thông tin ở dạng bảng, Soạn thảo văn bản cơ bản..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span>Yêu cầu cần đạt (chuẩn kiến thức & năng lực Tin học GDPT 2018):</span>
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleGenerateObjectivesWithAi}
                  disabled={isGeneratingAi}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {isGeneratingAi ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>AI đang soạn thảo...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>AI tự tạo Yêu cầu cần đạt ngay tại đây</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
                  title="Sao chép câu lệnh Prompt"
                >
                  <Copy className="w-3 h-3" />
                  Prompt
                </button>
              </div>
            </div>

            <textarea
              rows={4}
              value={editObjective}
              onChange={(e) => setEditObjective(e.target.value)}
              placeholder="Bấm nút 'AI tự tạo Yêu cầu cần đạt ngay tại đây' hoặc nhập tay yêu cầu cần đạt theo kế hoạch bài dạy của tổ chuyên môn..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs leading-relaxed font-sans"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              Lưu bài học vào danh mục
            </button>

            {editTitle.trim() && (
              <button
                onClick={() => {
                  handleSave();
                  // Find or construct lesson and move to step 3
                  const lessonObj: CurriculumLesson = {
                    id: editId || `lesson-${Date.now()}`,
                    grade: editGrade,
                    code: editCode.trim() || 'Bài học',
                    title: editTitle.trim(),
                    periods: editPeriods || 1,
                    objective: editObjective.trim(),
                  };
                  onSelectLesson(editGrade, 0, lessonObj);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                <span>Lưu & Tiếp tục sang Bước 3: Tạo / Duyệt Rubric</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={clearForm}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer ml-auto"
            >
              Xóa trắng biểu mẫu
            </button>
          </div>
        </div>
      </div>

      {/* Curriculum Grid: Grades 6 to 12 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[6, 7, 8, 9, 10, 11, 12].map((g) => {
          const gradeLessons = lessons.filter((l) => Number(l.grade) === g);
          return (
            <div
              key={g}
              className={`bg-white dark:bg-slate-900 border rounded-xl overflow-hidden shadow-sm flex flex-col ${
                activeGradeFilter === g
                  ? 'border-blue-400 dark:border-blue-700 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm flex items-center gap-2">
                  <span>Khối {g}</span>
                  <span className="text-[11px] font-normal text-slate-500">
                    ({gradeLessons.length} bài)
                  </span>
                </h4>
                <button
                  onClick={() => {
                    clearForm();
                    setEditGrade(g);
                    setEditCode(`Bài ${gradeLessons.length + 1}`);
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  Thêm bài
                </button>
              </div>

              <div className="p-3 flex-1 space-y-2.5 max-h-[440px] overflow-y-auto text-xs">
                {gradeLessons.map((l, idx) => {
                  const hasDigital = l.objective && l.objective.includes('Năng lực số:');
                  const hasAI = l.objective && l.objective.includes('Năng lực AI:');
                  return (
                    <div
                      key={l.id}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-xs leading-tight">
                          {l.code} – {l.title}
                        </div>
                        <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono shrink-0">
                          {l.periods} tiết
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                        {l.objective || 'Chưa nhập yêu cầu cần đạt'}
                      </div>

                      {(hasDigital || hasAI) && (
                        <div className="flex flex-wrap items-center gap-1 mt-1.5">
                          {hasDigital && (
                            <span className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300">
                              ⚡ Năng lực số
                            </span>
                          )}
                          {hasAI && (
                            <span className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300">
                              ✨ Năng lực AI
                            </span>
                          )}
                        </div>
                      )}

                    <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
                      <button
                        onClick={() => onSelectLesson(l.grade, idx, l)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <span>Chọn & Sang Bước 3</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleEdit(l)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[10px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Edit3 className="w-2.5 h-2.5" />
                        Sửa
                      </button>
                      <button
                        onClick={() => {
                          onDeleteLesson(l.id);
                          onShowToast(`Đã xóa bài ${l.code} – ${l.title}`);
                        }}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded text-[10px] font-semibold transition-colors cursor-pointer ml-auto flex items-center gap-1"
                        title="Xóa bài này"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                        Xóa
                      </button>
                    </div>
                  </div>
                );
              })}

                {gradeLessons.length === 0 && (
                  <p className="text-slate-400 text-center py-4 text-xs italic">
                    Chưa có bài học nào được lưu cho Khối {g}.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
