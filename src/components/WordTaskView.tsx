import React, { useState, useEffect } from 'react';
import { Criterion, CurriculumLesson, Student, TaskPractice } from '../types/rubric';
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Plus,
  Save,
  Trash2,
  Edit3,
  Loader2,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';
import { generateExamDocxBlob, generateDocxBlob, downloadBlob } from '../utils/rubricLogic';
import { generateConcreteTaskForLesson } from '../utils/curriculumGenerator';

interface WordTaskViewProps {
  tasks: TaskPractice[];
  grade: number;
  currentLessonCode: string;
  currentLessonTitle: string;
  currentLessonObj?: CurriculumLesson;
  criteria: Criterion[];
  selectedStudent: Student | undefined;
  onSaveTask: (task: TaskPractice) => void;
  onDeleteTask: (id: string) => void;
  onAttachFileToStudent: (code: string, fileName: string, file: File) => void;
  onNavigateToSubmissions?: () => void;
  onShowToast: (msg: string) => void;
}

export const WordTaskView: React.FC<WordTaskViewProps> = ({
  tasks,
  grade,
  currentLessonCode,
  currentLessonTitle,
  currentLessonObj,
  criteria,
  selectedStudent,
  onSaveTask,
  onDeleteTask,
  onAttachFileToStudent,
  onNavigateToSubmissions,
  onShowToast,
}) => {
  const [taskGrade, setTaskGrade] = useState<number>(grade);
  const [taskCode, setTaskCode] = useState<string>(currentLessonCode || 'Bài 1');
  const [taskTitle, setTaskTitle] = useState<string>(currentLessonTitle || 'Thông tin và dữ liệu');
  const [taskContent, setTaskContent] = useState<string>('');
  const [taskNotes, setTaskNotes] = useState<string>('');
  const [taskId, setTaskId] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [selectedAI, setSelectedAI] = useState<'gemini' | 'chatgpt'>('gemini');

  // Generate concrete task based on active lesson and criteria
  const getConcreteTask = (g: number, code: string, title: string) => {
    if (currentLessonObj) {
      return generateConcreteTaskForLesson(currentLessonObj, criteria);
    }
    const fallbackLesson: CurriculumLesson = {
      id: `lesson-${code}`,
      grade: g,
      code,
      title,
      objective: 'Thực hành thao tác theo chuẩn GDPT 2018.',
      periods: 2,
    };
    return generateConcreteTaskForLesson(fallbackLesson, criteria);
  };

  // Re-generate or sync when switching lessons
  useEffect(() => {
    setTaskGrade(grade);
    setTaskCode(currentLessonCode || 'Bài 1');
    setTaskTitle(currentLessonTitle || 'Thông tin và dữ liệu');
    
    // Automatically generate concrete task strictly matching the selected lesson
    const generated = getConcreteTask(grade, currentLessonCode || 'Bài 1', currentLessonTitle || 'Thông tin và dữ liệu');
    setTaskContent(generated);
  }, [grade, currentLessonCode, currentLessonTitle, currentLessonObj]);

  // Direct In-App AI generator for Concrete Word Task based on YCCĐ
  const handleGenerateWordTaskAi = async () => {
    setIsGeneratingAi(true);
    onShowToast(`Đang kết nối AI (${selectedAI === 'gemini' ? 'Gemini 3.8 Flash' : 'ChatGPT'}) để soạn đề thực hành chi tiết theo YCCĐ của ${taskCode}...`);

    try {
      const response = await fetch('/api/gemini/generate-word-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: taskGrade,
          lessonCode: taskCode,
          lessonTitle: `${taskCode}: ${taskTitle}`,
          objective: currentLessonObj?.objective || 'Thực hành thao tác chuyên môn theo chuẩn Rubric GDPT 2018.',
          criteria,
        }),
      });

      if (!response.ok) throw new Error('Máy chủ phản hồi lỗi');

      const data = await response.json();
      if (data.taskContent && data.taskContent.length > 50) {
        setTaskContent(data.taskContent);
        onShowToast(`Đã tạo xong đề thực hành chi tiết theo YCCĐ bằng AI (${data.source === 'gemini' ? 'Gemini 3.8 Flash' : 'Chuẩn GDPT 2018'})!`);
        return;
      }
      throw new Error('Nội dung đề không hợp lệ');
    } catch (err: any) {
      console.warn('Lỗi gọi AI tạo đề:', err);
      const concrete = getConcreteTask(taskGrade, taskCode, taskTitle);
      setTaskContent(concrete);
      onShowToast(`Đã nạp đề thực hành chuẩn sư phạm bám sát YCCĐ của ${taskCode}: ${taskTitle}!`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleResetToStandardTask = () => {
    const concrete = getConcreteTask(taskGrade, taskCode, taskTitle);
    setTaskContent(concrete);
    onShowToast(`Đã khôi phục đề kiểm tra thực hành chuẩn theo YCCĐ của ${taskCode}!`);
  };

  const handleSave = () => {
    const task: TaskPractice = {
      id: taskId || `task-${Date.now()}`,
      grade: taskGrade,
      code: taskCode,
      title: taskTitle,
      content: taskContent,
      notes: taskNotes,
      ai: selectedAI,
      updated: new Date().toISOString(),
    };
    onSaveTask(task);
    setTaskId(task.id);
    onShowToast(`Đã lưu đề thực hành: ${task.code} – ${task.title}`);
  };

  const handleDownloadDoc = () => {
    if (!taskContent.trim()) {
      onShowToast('Chưa có nội dung đề bài để xuất.');
      return;
    }
    const blob = generateExamDocxBlob(taskContent, criteria, {
      grade: taskGrade,
      lessonCode: taskCode,
      lessonTitle: taskTitle,
      objective: currentLessonObj?.objective || '',
      schoolName: 'TRƯỜNG THIẾU SINH QUÂN MIỀN NAM',
      unitName: 'TỔ BỘ MÔN TIN HỌC',
      schoolYear: '2026 – 2027',
      examLabel: 'ĐỀ THỰC HÀNH CHÍNH THỨC',
      timeMinutes: 45,
    });
    const fileName = `De_Thuc_Hanh_Khoi_${taskGrade}_${taskCode.replace(/\s+/g, '_')}.doc`;
    downloadBlob(blob, fileName);
    onShowToast(`Đã tải về tệp Word (.doc): ${fileName}`);
  };

  const handleCopyTask = () => {
    try {
      navigator.clipboard.writeText(taskContent);
      onShowToast('Đã sao chép nội dung đề bài vào bộ nhớ tạm.');
    } catch {
      onShowToast('Không thể sao chép.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & AI Integration */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] mb-1">
              <span>BƯỚC 4 TRONG QUY TRÌNH</span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              Tạo đề Word thực hành chi tiết theo Rubric · Xem trước trực tiếp trên trang
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Đề bài có đoạn văn bản, dữ liệu bảng biểu và yêu cầu định dạng rõ ràng, cụ thể để học sinh thao tác làm bài thực tế, không nói chung chung.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-semibold">
              <label>AI hỗ trợ:</label>
              <select
                value={selectedAI}
                onChange={(e) => setSelectedAI(e.target.value as 'gemini' | 'chatgpt')}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold"
              >
                <option value="gemini">Gemini 3.8 Flash (Tích hợp)</option>
                <option value="chatgpt">ChatGPT</option>
              </select>
            </div>

            <button
              onClick={handleGenerateWordTaskAi}
              disabled={isGeneratingAi}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              {isGeneratingAi ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>AI đang soạn đề chi tiết...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>AI tạo đề thực hành theo Rubric</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadDoc}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Xuất tệp Word (.doc)
            </button>

            {onNavigateToSubmissions && (
              <button
                onClick={onNavigateToSubmissions}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                <span>Sang Bước 5: Ghép bài nộp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Display Current Lesson & Rubric link */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Bài đang gắn Rubric:</span>
            <span className="bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded font-bold">
              Khối {grade} – {taskCode}: {taskTitle}
            </span>
            <span className="text-slate-500 text-[11px]">({criteria.length} tiêu chí Rubric áp dụng)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyTask}
              className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              Sao chép đề
            </button>
            <button
              onClick={handleResetToStandardTask}
              className="text-xs font-semibold px-2.5 py-1 bg-white dark:bg-slate-700 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded hover:bg-emerald-50 transition-colors flex items-center gap-1 cursor-pointer"
              title="Khôi phục đề bài thực hành chuẩn chi tiết bám sát YCCĐ của bài học này"
            >
              <RotateCcw className="w-3 h-3 text-emerald-600" />
              Nạp đề chuẩn theo YCCĐ
            </button>
          </div>
        </div>

        {/* Display Current Lesson Objectives */}
        {currentLessonObj?.objective && (
          <div className="mt-2.5 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg p-3 text-xs">
            <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              Yêu cầu cần đạt đang căn cứ để ra đề:
            </div>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed pl-5">
              {currentLessonObj.objective}
            </p>
          </div>
        )}
      </div>

      {/* Main 2-Column Layout: Left = Editor Form, Right = Live Word Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Form & Content Editor */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              Soạn thảo đề kiểm tra trực tiếp
            </h4>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
              >
                <Save className="w-3 h-3" />
                Lưu vào thư viện
              </button>
            </div>
          </div>

          <div className="p-4 space-y-3 text-xs flex-1 flex flex-col">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Khối:
                </label>
                <select
                  value={taskGrade}
                  onChange={(e) => setTaskGrade(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-bold"
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
                  Mã bài:
                </label>
                <input
                  type="text"
                  value={taskCode}
                  onChange={(e) => setTaskCode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tên bài / Chủ đề:
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nội dung chi tiết của đề (Gõ trực tiếp hoặc chỉnh sửa bên dưới):
              </label>
              <textarea
                value={taskContent}
                onChange={(e) => setTaskContent(e.target.value)}
                placeholder="Nhập nội dung đề bài cụ thể, có văn bản mẫu và dữ liệu bảng để học sinh thao tác..."
                rows={18}
                className="w-full flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-xs leading-relaxed font-mono focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Word Document Preview */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Xem truoc de theo dinh dang trang in Microsoft Word
            </h4>
            <span className="text-[11px] text-slate-500">Kho A4 · Cap nhat truc tiep</span>
          </div>
          <div className="p-4 bg-slate-100/70 dark:bg-slate-950 flex-1 overflow-y-auto max-h-[700px]">
            <div className="bg-white text-slate-900 shadow-md border border-slate-300 rounded p-6 sm:p-8 font-serif text-[12px] leading-relaxed max-w-2xl mx-auto">
              {/* Header 2 cot */}
              <div className="flex justify-between items-start border-b-2 border-slate-800 pb-3 mb-3 text-[10.5px] font-sans">
                <div className="text-center w-1/2">
                  <div className="uppercase text-[10px]">BO QUOC PHONG</div>
                  <div className="font-bold uppercase text-[10px]">TO BO MON TIN HOC</div>
                  <div className="font-bold uppercase text-[11px] leading-tight">TRUONG THIEU SINH QUAN MIEN NAM</div>
                  <div className="border-b-2 border-slate-700 w-3/5 mx-auto mt-1"></div>
                </div>
                <div className="text-center w-1/2">
                  <div className="font-bold text-[11px]">DE THUC HANH CHINH THUC</div>
                  <div className="text-[10.5px]">Mon: Tin hoc - Khoi {taskGrade}</div>
                  <div className="text-[10.5px]">Thoi gian: 45 phut</div>
                  <div className="text-[10.5px]">Nam hoc: 2026 - 2027</div>
                </div>
              </div>
              {/* Title */}
              <div className="text-center py-2 font-sans mb-2">
                <div className="text-[13px] font-extrabold uppercase tracking-wide text-slate-900">BÀI KIỂM TRA THỰC HÀNH TIN HỌC</div>
                <div className="text-[11px] italic text-slate-700 mt-1">{taskCode} - {taskTitle}</div>
              </div>
              {/* Student info */}
              <div className="font-sans text-[10.5px] mb-2 space-y-1">
                <div className="flex gap-4">
                  <span className="flex-1"><b>Họ và tên:</b> ......................................................</span>
                  <span><b>Lớp:</b> .................</span>
                  <span><b>Máy số:</b> .................</span>
                </div>
                <div className="flex gap-4">
                  <span><b>Mã học sinh:</b> ......................................................</span>
                  <span><b>Ngày thi:</b> ......./......./............</span>
                </div>
              </div>
              {/* YCCD */}
              {currentLessonObj?.objective && (
                <div className="border border-amber-400 bg-amber-50 rounded p-2 mb-3 font-sans text-[10.5px]">
                  <div className="font-bold text-amber-800 mb-1">YEU CAU CAN DAT (YCCD):</div>
                  <div className="text-amber-900 whitespace-pre-line leading-snug">{currentLessonObj.objective}</div>
                </div>
              )}
              {/* Practice */}
              <div className="border-b border-slate-500 font-bold font-sans text-[11px] mt-3 mb-2 pb-1 uppercase">Phan thuc hanh tren may tinh (10 diem)</div>
              <div className="whitespace-pre-line text-[10.5px] leading-relaxed font-sans text-slate-800">
                {taskContent || 'Chua co noi dung de bai.'}
              </div>
              {/* Rubric */}
              {criteria.length > 0 && (
                <>
                  <div className="border-b border-slate-500 font-bold font-sans text-[11px] mt-4 mb-2 pb-1 uppercase">Bang Rubric doi chieu - Hoc sinh tu danh gia</div>
                  <table className="w-full border-collapse text-[9.5px] font-sans">
                    <thead>
                      <tr>
                        <th className="border border-slate-400 p-1 bg-blue-100 text-center w-6">STT</th>
                        <th className="border border-slate-400 p-1 bg-blue-100">Tieu chi</th>
                        <th className="border border-slate-400 p-1 bg-blue-100 text-center w-10">Trong so</th>
                        <th className="border border-slate-400 p-1 text-center" style={{background:'#FFF9C4'}}>Muc 1</th>
                        <th className="border border-slate-400 p-1 text-center" style={{background:'#C8E6C9'}}>Muc 2</th>
                        <th className="border border-slate-400 p-1 text-center" style={{background:'#81C784'}}>Muc 3</th>
                        <th className="border border-slate-400 p-1 text-center text-white" style={{background:'#388E3C'}}>Muc 4</th>
                      </tr>
                    </thead>
                    <tbody>
                      {criteria.map((x, i) => (
                        <tr key={i}>
                          <td className="border border-slate-400 p-1 text-center">{i + 1}</td>
                          <td className="border border-slate-400 p-1 font-bold">{String(x[0])}</td>
                          <td className="border border-slate-400 p-1 text-center">{String(x[1])}%</td>
                          {(Array.isArray(x[2]) ? x[2] : ['','','','']).map((lv: unknown, li: number) => (
                            <td key={li} className="border border-slate-400 p-1" style={{background: ['#FFF9C4','#C8E6C9','#81C784','#388E3C'][li], color: li === 3 ? '#fff' : '#111'}}>{String(lv)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              {/* Signature */}
              <div className="flex justify-between mt-6 font-sans text-[10.5px] text-center">
                <div className="w-1/2">
                  <div className="font-bold">HỌC SINH</div>
                  <div className="italic">(Ky va ghi ro ho ten)</div>
                  <div className="mt-10">......................................</div>
                </div>
                <div className="w-1/2">
                  <div className="italic">Ngay ...... thang ...... nam {new Date().getFullYear()}</div>
                  <div className="font-bold">GIAO VIEN RA DE / CHAM DIEM</div>
                  <div className="italic">(Ky va ghi ro ho ten)</div>
                  <div className="mt-6">......................................</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
