import React from 'react';
import { Download, Printer, Search } from 'lucide-react';
import { CurriculumLesson } from '../types/rubric';

interface HeaderProps {
  currentTitle: string;
  grade: number;
  onGradeChange: (g: number) => void;
  lesson: number;
  onLessonChange: (l: number) => void;
  lessonsList: CurriculumLesson[];
  classFilter: string;
  onClassFilterChange: (cls: string) => void;
  classList: string[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onExportCsv: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTitle,
  grade,
  onGradeChange,
  lesson,
  onLessonChange,
  lessonsList,
  classFilter,
  onClassFilterChange,
  classList,
  searchQuery,
  onSearchChange,
  onExportCsv,
  onPrint,
}) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 sm:p-4">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {currentTitle}
          </h1>
          <span className="inline-flex items-center text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 px-2.5 py-0.5 rounded-md shrink-0">
            RUBRIC AI V14 · ĐỌC BÀI & CHẤM CÓ MINH CHỨNG
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Grade selector */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
            <label htmlFor="headerGradeSelect" className="hidden sm:inline">Khối:</label>
            <select
              id="headerGradeSelect"
              value={grade}
              onChange={(e) => onGradeChange(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[6, 7, 8, 9, 10, 11, 12].map((g) => (
                <option key={g} value={g}>
                  Khối {g}
                </option>
              ))}
            </select>
          </div>

          {/* Lesson selector */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
            <label htmlFor="headerLessonSelect" className="hidden sm:inline">Bài:</label>
            <select
              id="headerLessonSelect"
              value={lesson}
              onChange={(e) => onLessonChange(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[170px] sm:max-w-[220px] truncate"
            >
              {lessonsList.map((l, index) => (
                <option key={l.id || index} value={index + 1}>
                  {l.code} – {l.title}
                </option>
              ))}
            </select>
          </div>

          {/* Class selector */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
            <label htmlFor="headerClassSelect" className="hidden sm:inline">Lớp:</label>
            <select
              id="headerClassSelect"
              value={classFilter}
              onChange={(e) => onClassFilterChange(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {classList.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
              <option value="Tất cả">Tất cả</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm học sinh..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg pl-8 pr-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 w-28 sm:w-36 md:w-44"
            />
          </div>

          {/* Export CSV */}
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            title="Xuất bảng điểm CSV chính thức"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Xuất CSV</span>
          </button>

          {/* Print / PDF */}
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            title="In hoặc lưu phiếu kết quả ra PDF"
          >
            <Printer className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">In / PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
