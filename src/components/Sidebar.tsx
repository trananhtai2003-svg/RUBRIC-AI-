import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  BookOpen,
  Users,
  UploadCloud,
  FileText,
  Award,
  HelpCircle,
  FileUp,
} from 'lucide-react';
import { PageId } from '../types/rubric';

interface SidebarProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  confirmedCount: number;
  totalStudents: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  confirmedCount,
  totalStudents,
}) => {
  const navItems: Array<{ id: PageId; label: string; icon: React.ReactNode; badge?: string }> = [
    {
      id: 'results',
      label: 'Kết quả chấm điểm',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
      badge: confirmedCount > 0 ? `${confirmedCount}` : undefined,
    },
    {
      id: 'rubricpage',
      label: 'Rubric đánh giá',
      icon: <FileSpreadsheet className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'assignments',
      label: 'Khối & nội dung bài',
      icon: <BookOpen className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'rosterpage',
      label: 'Danh sách học sinh',
      icon: <Users className="w-4 h-4 shrink-0" />,
      badge: `${totalStudents}`,
    },
    {
      id: 'submissionpage',
      label: 'Ghép bài nộp',
      icon: <UploadCloud className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'wordpage',
      label: 'Tệp bài làm & Đề Word',
      icon: <FileText className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'customexam',
      label: '8. Giáo viên tự nạp',
      icon: <FileUp className="w-4 h-4 shrink-0 text-amber-300" />,
      badge: 'Mới',
    },
    {
      id: 'evidence',
      label: 'Minh chứng SKKN',
      icon: <Award className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'guide',
      label: 'Hướng dẫn sử dụng',
      icon: <HelpCircle className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <aside className="w-full md:w-56 bg-[#0e223d] text-slate-200 flex flex-col shrink-0 border-r border-[#1e3a5f] shadow-sm">
      <div className="p-4 border-b border-white/10 hidden md:block">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow">
            R
          </div>
          <div>
            <span className="font-bold text-white text-base tracking-tight block">RUBRIC AI</span>
            <span className="text-[11px] text-slate-400 block -mt-0.5">Thiếu sinh quân Miền Nam</span>
          </div>
        </div>
      </div>

      <nav className="p-2.5 flex-1 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-y-auto" aria-label="Menu chức năng">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap text-left ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-[#1a3860] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono tabular-nums ${
                    isActive ? 'bg-blue-800 text-white' : 'bg-[#1a3860] text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 hidden md:block">
        <div className="text-[11px] text-slate-400 leading-tight">
          <p className="font-semibold text-slate-300">Phiên bản V14</p>
          <p className="mt-0.5">Soạn đề & xem trước trên trang</p>
          <p className="mt-1 text-slate-500">Chấm điểm có minh chứng</p>
        </div>
      </div>
    </aside>
  );
};
