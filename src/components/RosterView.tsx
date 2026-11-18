import React, { useState, useId } from 'react';
import { Student } from '../types/rubric';
import {
  Users,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Search,
  CheckCircle,
  AlertTriangle,
  X,
  CheckSquare,
  Square,
  Filter,
} from 'lucide-react';
import { parseCSV, downloadBlob } from '../utils/rubricLogic';

interface RosterViewProps {
  students: Student[];
  onImportStudents: (newStudents: Student[]) => void;
  onAddStudent: (student: Student) => void;
  onDeleteStudent: (code: string) => void;
  onDeleteStudents?: (codes: string[]) => void;
  onRestoreDemo: () => void;
  onShowToast: (msg: string) => void;
}

interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  confirmColor?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
}

export const RosterView: React.FC<RosterViewProps> = ({
  students,
  onImportStudents,
  onAddStudent,
  onDeleteStudent,
  onDeleteStudents,
  onRestoreDemo,
  onShowToast,
}) => {
  const [filterClass, setFilterClass] = useState<string>('Tất cả');
  const [filterGrade, setFilterGrade] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected students for batch actions
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());

  // In-app confirmation dialog (replaces window.confirm which is blocked in iframes)
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Xác nhận',
    confirmColor: 'danger',
    onConfirm: () => {},
  });

  // Form states for manual student add
  const [newCode, setNewCode] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newGrade, setNewGrade] = useState<number>(6);
  const [newClass, setNewClass] = useState<string>('6.1');

  const classes = Array.from(new Set(students.map((s) => s.cls).filter(Boolean))).sort();

  const handleDownloadTemplate = () => {
    const csvContent = '\ufeffMaHS,HoTen,Khoi,Lop\r\n61001,Lê Vương Trúc An,6,6.1\r\n61002,Lưu Gia An,6,6.1\r\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, 'Mau_danh_sach_hoc_sinh_RubricAI.csv');
    onShowToast('Đã tải mẫu danh sách học sinh CSV.');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      if (!parsed.length) {
        throw new Error('Không tìm thấy bản ghi học sinh hợp lệ trong tệp CSV.');
      }
      onImportStudents(parsed);
      setSelectedCodes(new Set());
      onShowToast(`Đã nạp thành công ${parsed.length} học sinh từ tệp CSV.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      onShowToast(`Lỗi nạp CSV: ${msg}`);
    }
  };

  const handleAddStudent = () => {
    if (!newCode.trim() || !newName.trim() || !newClass.trim()) {
      onShowToast('Vui lòng nhập đầy đủ Mã học sinh, Họ tên và Lớp.');
      return;
    }
    if (students.some((s) => s.code.toLowerCase() === newCode.trim().toLowerCase())) {
      onShowToast(`Mã học sinh "${newCode.trim()}" đã tồn tại.`);
      return;
    }
    const student: Student = {
      code: newCode.trim(),
      name: newName.trim(),
      grade: newGrade,
      cls: newClass.trim(),
      levels: null,
      file: '',
      demo: false,
    };
    onAddStudent(student);
    setNewCode('');
    setNewName('');
    onShowToast(`Đã thêm học sinh: ${student.code} – ${student.name}`);
  };

  const filtered = students.filter((s) => {
    if (filterGrade !== 0 && Number(s.grade) !== filterGrade) return false;
    if (filterClass !== 'Tất cả' && s.cls !== filterClass) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredCodes = filtered.map((s) => s.code);
  const isAllFilteredSelected = filteredCodes.length > 0 && filteredCodes.every((c) => selectedCodes.has(c));
  const isSomeFilteredSelected = filteredCodes.some((c) => selectedCodes.has(c)) && !isAllFilteredSelected;

  // Toggle selection for all currently filtered students
  const handleToggleSelectFiltered = () => {
    setSelectedCodes((prev) => {
      const next = new Set(prev);
      if (isAllFilteredSelected) {
        filteredCodes.forEach((c) => next.delete(c));
      } else {
        filteredCodes.forEach((c) => next.add(c));
      }
      return next;
    });
  };

  // Toggle single student checkbox
  const handleToggleStudent = (code: string) => {
    setSelectedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  // Select all students across whole dataset
  const handleSelectAllTotal = () => {
    setSelectedCodes(new Set(students.map((s) => s.code)));
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedCodes(new Set());
  };

  // Delete single student via in-app confirmation modal
  const handlePromptDeleteSingle = (student: Student) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xóa học sinh này?',
      message: `Bạn có chắc chắn muốn xóa học sinh sau khỏi danh sách?\n\n• Mã HS: ${student.code}\n• Họ và tên: ${student.name}\n• Lớp: ${student.cls} (Khối ${student.grade})\n\nSau khi xóa, học sinh sẽ không còn xuất hiện trong danh sách và các phiếu chấm.`,
      confirmText: 'Xóa học sinh',
      confirmColor: 'danger',
      onConfirm: () => {
        onDeleteStudent(student.code);
        setSelectedCodes((prev) => {
          const next = new Set(prev);
          next.delete(student.code);
          return next;
        });
      },
    });
  };

  // Delete multiple selected students via in-app confirmation modal
  const handlePromptDeleteSelected = () => {
    if (selectedCodes.size === 0) {
      onShowToast('Chưa chọn học sinh nào để xóa. Vui lòng tích chọn học sinh.');
      return;
    }
    const count = selectedCodes.size;
    setConfirmModal({
      isOpen: true,
      title: `Xác nhận xóa ${count} học sinh đã chọn?`,
      message: `Bạn đang chọn xóa ${count} học sinh khỏi danh sách.\n\nHành động này sẽ xóa vĩnh viễn ${count} học sinh được chọn ra khỏi cơ sở dữ liệu học sinh của trường. Thao tác không thể khôi phục tự động.\n\nBạn có chắc chắn muốn tiếp tục không?`,
      confirmText: `Xóa ${count} học sinh`,
      confirmColor: 'danger',
      onConfirm: () => {
        const codes = Array.from(selectedCodes);
        if (onDeleteStudents) {
          onDeleteStudents(codes);
        } else {
          codes.forEach((c) => onDeleteStudent(c));
          onShowToast(`Đã xóa ${count} học sinh thành công.`);
        }
        setSelectedCodes(new Set());
      },
    });
  };

  // Delete all students currently filtered
  const handlePromptDeleteFiltered = () => {
    if (filtered.length === 0) return;
    const count = filtered.length;
    setConfirmModal({
      isOpen: true,
      title: `Xóa toàn bộ ${count} học sinh đang lọc?`,
      message: `Bạn có chắc chắn muốn xóa ${count} học sinh đang hiển thị trong bộ lọc (Lớp: ${filterClass}, Khối: ${filterGrade || 'Tất cả'})?\n\nThao tác này sẽ gỡ toàn bộ các học sinh này khỏi hệ thống.`,
      confirmText: `Xóa ${count} học sinh`,
      confirmColor: 'danger',
      onConfirm: () => {
        const codes = filtered.map((s) => s.code);
        if (onDeleteStudents) {
          onDeleteStudents(codes);
        } else {
          codes.forEach((c) => onDeleteStudent(c));
          onShowToast(`Đã xóa ${count} học sinh.`);
        }
        setSelectedCodes((prev) => {
          const next = new Set(prev);
          codes.forEach((c) => next.delete(c));
          return next;
        });
      },
    });
  };

  // Restore demo roster via in-app confirmation modal
  const handlePromptRestoreDemo = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Khôi phục danh sách mẫu 6.1 – 6.3?',
      message: 'Thao tác này sẽ đặt lại danh sách học sinh về mẫu ban đầu gồm 117 học sinh thuộc các lớp 6.1, 6.2, 6.3.\n\nCác học sinh mới thêm hoặc đã xóa trước đó sẽ được khôi phục về trạng thái mẫu ban đầu.',
      confirmText: 'Khôi phục danh sách mẫu',
      confirmColor: 'warning',
      onConfirm: () => {
        onRestoreDemo();
        setSelectedCodes(new Set());
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Management Tools */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              Nạp và quản lý danh sách học sinh
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hỗ trợ thêm, sửa, xóa từng học sinh hoặc xóa nhiều học sinh cùng lúc, nạp tệp CSV và quản lý theo lớp/khối.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Tải mẫu CSV
            </button>

            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm">
              <Upload className="w-3.5 h-3.5" />
              Nạp danh sách CSV
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={handlePromptRestoreDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-amber-200 dark:border-amber-900/50"
              title="Đặt lại danh sách mẫu 117 học sinh lớp 6.1 – 6.3"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Khôi phục DS mẫu 6.1–6.3
            </button>
          </div>
        </div>

        {/* Manual Add Student Form */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block mb-2">
            Thêm học sinh thủ công vào danh sách:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-0.5">Mã HS:</label>
              <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="VD: 61041"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-0.5">Họ và tên:</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="VD: Nguyễn Hoàng An"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-0.5">Khối:</label>
              <select
                value={newGrade}
                onChange={(e) => {
                  const g = Number(e.target.value);
                  setNewGrade(g);
                  setNewClass(`${g}.1`);
                }}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs font-semibold"
              >
                {[6, 7, 8, 9, 10, 11, 12].map((g) => (
                  <option key={g} value={g}>
                    Khối {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-0.5">Lớp:</label>
              <input
                type="text"
                value={newClass}
                onChange={(e) => setNewClass(e.target.value)}
                placeholder="VD: 6.1"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs"
              />
            </div>
          </div>
          <button
            onClick={handleAddStudent}
            className="mt-2.5 flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm học sinh
          </button>
        </div>
      </div>

      {/* Batch Selection Action Bar (Appears when 1 or more students are checked) */}
      {selectedCodes.size > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-sm animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-blue-900 dark:text-blue-100 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Đã chọn <strong className="text-blue-700 dark:text-blue-300 font-extrabold text-sm">{selectedCodes.size}</strong> / {students.length} học sinh
            </span>
            <span className="text-blue-300 dark:text-blue-700">|</span>
            {selectedCodes.size < students.length && (
              <button
                onClick={handleSelectAllTotal}
                className="text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100 underline font-semibold cursor-pointer"
              >
                Chọn tất cả {students.length} HS toàn trường
              </button>
            )}
            <button
              onClick={handleClearSelection}
              className="px-2 py-0.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded text-[11px] font-medium transition-colors cursor-pointer"
            >
              Bỏ chọn
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePromptDeleteSelected}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa {selectedCodes.size} học sinh đã chọn
            </button>
          </div>
        </div>
      )}

      {/* Student List Table & Filter Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
              Tổng số: <span className="text-blue-600 dark:text-blue-400">{students.length}</span> học sinh
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">
              Đang hiển thị {filtered.length} học sinh
            </span>

            {/* Quick bulk action for filtered view */}
            {filtered.length > 0 && (
              <button
                onClick={handlePromptDeleteFiltered}
                className="ml-2 text-[11px] font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                title={`Xóa tất cả ${filtered.length} học sinh đang hiển thị trong bộ lọc`}
              >
                <Trash2 className="w-3 h-3 inline" />
                Xóa {filtered.length} HS đang lọc
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Grade */}
            <div className="flex items-center gap-1 text-xs">
              <label className="font-semibold text-slate-600 dark:text-slate-400">Khối:</label>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(Number(e.target.value))}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs font-semibold"
              >
                <option value={0}>Tất cả khối</option>
                {[6, 7, 8, 9, 10, 11, 12].map((g) => (
                  <option key={g} value={g}>
                    Khối {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Class */}
            <div className="flex items-center gap-1 text-xs">
              <label className="font-semibold text-slate-600 dark:text-slate-400">Lớp:</label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs font-semibold"
              >
                <option value="Tất cả">Tất cả lớp</option>
                {classes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm mã hoặc tên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-8 pr-2.5 py-1.5 text-xs w-44"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto max-h-[520px]">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 z-10 select-none shadow-xs">
              <tr className="text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                {/* Master Checkbox */}
                <th className="p-2.5 text-center w-10">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isAllFilteredSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeFilteredSelected;
                      }}
                      onChange={handleToggleSelectFiltered}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      title={isAllFilteredSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả trong danh sách lọc'}
                    />
                  </div>
                </th>
                <th className="p-2 text-center w-12 font-bold">STT</th>
                <th className="p-2 font-bold w-28">Mã HS</th>
                <th className="p-2 font-bold">Họ và tên</th>
                <th className="p-2 text-center w-20">Khối</th>
                <th className="p-2 text-center w-20">Lớp</th>
                <th className="p-2 text-center w-32">Nguồn dữ liệu</th>
                <th className="p-2 text-center w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx) => {
                const isSelected = selectedCodes.has(s.code);
                return (
                  <tr
                    key={s.code}
                    className={`border-b border-slate-100 dark:border-slate-800 transition-colors ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100/60 dark:hover:bg-blue-900/40'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Row Checkbox */}
                    <td className="p-2.5 text-center">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleStudent(s.code)}
                          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>
                    </td>
                    <td className="p-2 text-center text-slate-500 font-mono text-[11px]">{idx + 1}</td>
                    <td className="p-2 font-mono font-bold text-blue-700 dark:text-blue-300">{s.code}</td>
                    <td className="p-2 font-medium text-slate-900 dark:text-slate-100">
                      <span
                        onClick={() => handleToggleStudent(s.code)}
                        className="cursor-pointer hover:text-blue-600 transition-colors"
                      >
                        {s.name}
                      </span>
                    </td>
                    <td className="p-2 text-center font-mono">Khối {s.grade}</td>
                    <td className="p-2 text-center font-bold text-slate-700 dark:text-slate-300">{s.cls}</td>
                    <td className="p-2 text-center">
                      <span
                        className={`inline-block text-[10px] px-2 py-0.5 rounded font-medium ${
                          s.demo
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                        }`}
                      >
                        {s.demo ? 'Dữ liệu mẫu' : 'Danh sách chính thức'}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handlePromptDeleteSingle(s)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition-colors cursor-pointer"
                        title={`Xóa học sinh ${s.code} – ${s.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400 italic">
                    Không tìm thấy học sinh nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <span>
            {selectedCodes.size > 0
              ? `Đang chọn ${selectedCodes.size} học sinh.`
              : 'Tích vào ô chọn đầu dòng để chọn và xóa nhiều học sinh cùng lúc.'}
          </span>
          {selectedCodes.size > 0 && (
            <button
              onClick={handlePromptDeleteSelected}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa {selectedCodes.size} học sinh đã chọn
            </button>
          )}
        </div>
      </div>

      {/* In-App Confirmation Modal Dialog (No window.confirm!) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  confirmModal.confirmColor === 'danger'
                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                    : confirmModal.confirmColor === 'warning'
                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                    : 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                }`}
              >
                {confirmModal.confirmColor === 'danger' ? (
                  <Trash2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  {confirmModal.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed whitespace-pre-line">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                }}
                className={`px-4 py-2 text-xs font-bold text-white rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 ${
                  confirmModal.confirmColor === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : confirmModal.confirmColor === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {confirmModal.confirmText || 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
