import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { PageId } from '../types/rubric';

interface WorkflowBarProps {
  onNavigate: (page: PageId) => void;
  onMakeWordTask: () => void;
  onExportCsv: () => void;
}

export const WorkflowBar: React.FC<WorkflowBarProps> = ({
  onNavigate,
  onMakeWordTask,
  onExportCsv,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 shadow-sm mb-4">
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xs sm:text-sm font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5 tracking-tight uppercase">
          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
          Quy trình làm việc của giáo viên
        </h2>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
          7 bước thực hành chuẩn sư phạm
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => onNavigate('rosterpage')}
          className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          1. Danh sách HS
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        <button
          onClick={() => onNavigate('assignments')}
          className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>2. Chọn khối/bài</span>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-100 dark:bg-blue-950 px-1 rounded">AI YCCĐ</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        <button
          onClick={() => onNavigate('rubricpage')}
          className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          3. Tạo / duyệt Rubric
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        <button
          onClick={onMakeWordTask}
          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>4. Tạo đề Word</span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-1 rounded">Xem trước</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        <button
          onClick={() => onNavigate('submissionpage')}
          className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          5. Nạp bài nộp
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        <button
          onClick={() => onNavigate('results')}
          className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>6. Chấm / xác nhận</span>
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 dark:bg-indigo-950 px-1 rounded">AI Chấm</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        <button
          onClick={() => onNavigate('evidence')}
          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-sm"
          title="Xem kết quả chấm điểm & Hồ sơ minh chứng"
        >
          7. Xuất kết quả
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        <button
          onClick={() => onNavigate('customexam')}
          className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
        >
          <span>8. Giáo viên tự nạp</span>
          <span className="text-[10px] font-bold text-white bg-indigo-600 px-1 rounded">Mới</span>
        </button>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
        <strong>Lưu ý:</strong> Phần mềm phân tích tự động cấu trúc bảng, văn bản và dòng dữ liệu trong tệp để đưa ra mức đề xuất.
        Các tiêu chí định dạng trực quan và nhận định sư phạm bắt buộc phải được <strong>giáo viên kiểm tra và xác nhận</strong> vào phiếu chấm chính thức.
      </p>
    </div>
  );
};
