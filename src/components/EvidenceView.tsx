import React from 'react';
import { Award, CheckCircle2, Download, Printer, FileText, Check } from 'lucide-react';
import { AssessmentRecord, Criterion } from '../types/rubric';
import { fmt } from '../utils/rubricLogic';

interface EvidenceViewProps {
  confirmedAssessments: AssessmentRecord[];
  criteria: Criterion[];
  grade: number;
  lesson: number;
  lessonTitle: string;
  onExportCsv: () => void;
  onPrint: () => void;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({
  confirmedAssessments,
  criteria,
  grade,
  lesson,
  lessonTitle,
  onExportCsv,
  onPrint,
}) => {
  return (
    <div className="space-y-4">
      {/* Evidence Overview Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/50 px-4 py-3 flex items-center justify-between">
          <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm sm:text-base flex items-center gap-1.5">
            <Award className="w-5 h-5 text-emerald-600" />
            Hồ sơ minh chứng phục vụ báo cáo Sáng kiến kinh nghiệm (SKKN)
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrint}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              In minh chứng
            </button>
            <button
              onClick={onExportCsv}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Xuất CSV
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3.5 text-xs">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Hệ thống RUBRIC AI thu thập và lưu trữ đầy đủ 5 thành tố minh chứng chuẩn sư phạm phục vụ nghiệm thu SKKN đổi mới phương pháp kiểm tra đánh giá theo định hướng phát triển năng lực:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                title: '1. Rubric công khai trước giờ học',
                desc: 'Bảng tiêu chí, trọng số và 4 mức độ biểu hiện giúp học sinh chủ động định hướng sản phẩm.',
              },
              {
                title: '2. Tệp sản phẩm học sinh',
                desc: 'Văn bản Word (.docx), bảng tính hoặc mã nguồn thực tế được ghép tự động theo mã học sinh.',
              },
              {
                title: '3. Phiếu chấm theo tiêu chí & mức đạt',
                desc: 'Phân tích định dạng chi tiết, tự động phát hiện số hàng/cột, bảng biểu và độ dài nội dung.',
              },
              {
                title: '4. Minh chứng cụ thể & Nhận xét của GV',
                desc: 'Giáo viên bắt buộc ghi nhận lỗi, vị trí dữ liệu và xác nhận vào hồ sơ điểm chính thức.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg text-xs text-amber-800 dark:text-amber-300">
            <strong>Ghi chú chuyên môn:</strong> Tên học sinh và các phiếu mẫu trong hệ thống là dữ liệu mô phỏng thử nghiệm. Khi đưa vào hồ sơ báo cáo chính thức, thầy cô chỉ sử dụng các phiếu chấm đã được xác minh trên sản phẩm thực tế của học sinh.
          </div>
        </div>
      </div>

      {/* Confirmed Assessments Table for SKKN Report */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
              Kết quả chấm điểm & Hồ sơ minh chứng học sinh – Khối {grade} ({lessonTitle})
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Hiển thị danh sách các học sinh đã được chấm điểm, chuẩn năng lực và nhận xét sư phạm chi tiết.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            {confirmedAssessments.length} học sinh đã chấm điểm
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <th className="p-2 border border-slate-200 dark:border-slate-700 text-center w-10">STT</th>
                <th className="p-2 border border-slate-200 dark:border-slate-700 w-24">Mã HS</th>
                <th className="p-2 border border-slate-200 dark:border-slate-700 w-44">Họ và tên</th>
                <th className="p-2 border border-slate-200 dark:border-slate-700 text-center w-14">Lớp</th>
                <th className="p-2 border border-slate-200 dark:border-slate-700 text-center w-28">Mức 4 TC</th>
                <th className="p-2 border border-slate-200 dark:border-slate-700 text-center w-16 font-bold">Điểm</th>
                <th className="p-2 border border-slate-200 dark:border-slate-700 text-center w-20">Xếp loại</th>
                <th className="p-2 border border-slate-200 dark:border-slate-700 w-36">Chuẩn năng lực</th>
                <th className="p-2 border border-slate-200 dark:border-slate-700 min-w-[280px]">Nhận xét chi tiết của học sinh & Minh chứng</th>
                <th className="p-2 border border-slate-200 dark:border-slate-700 w-36">Tệp bài làm</th>
              </tr>
            </thead>
            <tbody>
              {confirmedAssessments.map((a, idx) => (
                <tr
                  key={a.key}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="p-2 text-center font-mono text-[11px] text-slate-500">{idx + 1}</td>
                  <td className="p-2 font-mono font-bold text-blue-700 dark:text-blue-300">{a.studentCode}</td>
                  <td className="p-2 font-bold text-slate-900 dark:text-slate-100">{a.studentName}</td>
                  <td className="p-2 text-center font-mono">{a.className}</td>
                  <td className="p-2 text-center font-mono text-[11px]">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {a.levels.map((lvl, lIdx) => (
                        <span key={lIdx} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold">
                          T{lIdx + 1}:M{lvl}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-2 text-center font-bold font-mono text-blue-700 dark:text-blue-300 text-sm">
                    {fmt(a.score)}
                  </td>
                  <td className="p-2 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {a.rating}
                    </span>
                  </td>
                  <td className="p-2">
                    <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded block">
                      {a.standardLevel || 'Đạt yêu cầu chuẩn GDPT 2018'}
                    </span>
                  </td>
                  <td className="p-2 text-xs">
                    <div className="space-y-1">
                      <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed bg-amber-50/50 dark:bg-amber-950/20 p-1.5 rounded border border-amber-200/50 dark:border-amber-900/30">
                        <strong>Lời nhận xét:</strong> {a.feedback || 'Học sinh hoàn thành bài thực hành đạt yêu cầu theo đúng Rubric.'}
                      </p>
                      {a.evidence && a.evidence.filter(Boolean).length > 0 && (
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-1 rounded">
                          <strong>Minh chứng:</strong> {a.evidence.filter(Boolean).join(' • ')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-2 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    <span className="truncate max-w-[140px] block" title={a.sourceFile}>
                      {a.sourceFile || 'Chưa gắn tệp'}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(a.confirmedAt).toLocaleDateString('vi-VN')}
                    </span>
                  </td>
                </tr>
              ))}

              {confirmedAssessments.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-slate-400 italic">
                    Chưa có học sinh nào được chấm điểm và xác nhận cho bài học này. Vui lòng chấm bài tại Bước 6 &ldquo;Chấm / xác nhận&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
