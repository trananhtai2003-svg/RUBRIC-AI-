import React from 'react';
import { HelpCircle, CheckCircle2, FileSpreadsheet, UploadCloud, FileText, Download } from 'lucide-react';

export const GuideView: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: 'Chọn khối và bài học',
      desc: 'Sử dụng thanh công cụ trên cùng để chọn Khối (6 đến 12) và Bài học theo phân phối chương trình của trường.',
      icon: <HelpCircle className="w-4 h-4 text-blue-600" />,
    },
    {
      num: 2,
      title: 'Đọc kỹ Rubric và trọng số',
      desc: 'Công khai bảng Rubric cho học sinh trước tiết thực hành. Rubric quy định rõ 4 mức đạt (1: Chưa đạt, 2: Đạt một phần, 3: Đạt yêu cầu, 4: Vượt yêu cầu) cùng trọng số của từng tiêu chí.',
      icon: <FileSpreadsheet className="w-4 h-4 text-rose-600" />,
    },
    {
      num: 3,
      title: 'Soạn đề và xem trước trên trang',
      desc: 'Tận dụng công cụ Soạn đề Word với sự hỗ trợ của Gemini/ChatGPT. Thầy cô chỉnh sửa đề trực tiếp và xem trước ngay trên trang, sau đó xuất ra tệp Word (.doc) hoàn chỉnh.',
      icon: <FileText className="w-4 h-4 text-emerald-600" />,
    },
    {
      num: 4,
      title: 'Kéo thả nạp bài nộp & Phân tích tự động',
      desc: 'Tại trang "Ghép bài nộp", kéo thả toàn bộ tệp DOCX/TXT/Python của học sinh. Hệ thống tự động trích xuất cấu trúc văn bản, số hàng, số cột, kiểm tra ngày tháng để đề xuất mức điểm ban đầu.',
      icon: <UploadCloud className="w-4 h-4 text-indigo-600" />,
    },
    {
      num: 5,
      title: 'Rà soát minh chứng & Xác nhận phiếu chấm',
      desc: 'Mở phiếu chấm cạnh kết quả phân tích, kiểm tra sản phẩm thực tế, ghi nhận minh chứng cụ thể cho từng tiêu chí và bấm "Xác nhận & lưu phiếu chấm". Chỉ phiếu đã xác nhận mới tính vào thống kê.',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    },
    {
      num: 6,
      title: 'Xuất báo cáo & Sao lưu dữ liệu',
      desc: 'Xuất bảng điểm chính thức sang tệp CSV hoặc in ra PDF để lưu trữ hồ sơ chuyên môn và báo cáo Sáng kiến kinh nghiệm (SKKN). Định kỳ bấm "Sao lưu dữ liệu JSON" để bảo vệ dữ liệu.',
      icon: <Download className="w-4 h-4 text-blue-600" />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          Hướng dẫn quy trình vận hành hệ thống RUBRIC AI
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Quy trình 6 bước khép kín từ khâu chuẩn bị đề, công khai Rubric, thu bài, phân tích minh chứng đến nghiệm thu kết quả.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start gap-3"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                {st.num}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                  {st.title}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 p-3.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
          <h4 className="font-bold mb-1">💡 Lưu ý quan trọng về tính bảo mật và độc lập:</h4>
          <p>
            Toàn bộ quá trình giải nén tệp DOCX, đọc bảng và phân tích diễn ra hoàn toàn <strong>ngay trên trình duyệt của giáo viên</strong>.
            Tệp bài làm không bị tải lên bất kỳ máy chủ bên thứ ba nào, đảm bảo an toàn thông tin của học sinh và nhà trường.
          </p>
        </div>
      </div>
    </div>
  );
};
