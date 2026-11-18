import { Criterion, CurriculumLesson, RubricConfig } from '../types/rubric';

/**
 * Intelligent Curriculum-aware Rubric & Task Generator
 * Generates tailored, pedagogical 4-criterion Rubrics and concrete Word Practice Tasks
 * strictly aligned with CT GDPT 2018 Learning Objectives (YCCĐ).
 */

export function generateRubricForLesson(lesson: CurriculumLesson): RubricConfig {
  const code = (lesson.code || '').trim();
  const title = (lesson.title || '').trim();
  const obj = (lesson.objective || '').toLowerCase();
  const titleLower = title.toLowerCase();

  // 1. TOPIC: Thông tin và dữ liệu (Bài 1 Tin 6)
  if (titleLower.includes('thông tin và dữ liệu') || (code === 'Bài 1' && Number(lesson.grade) === 6)) {
    return {
      title: `${code} – ${title}`,
      weights: [35, 30, 20, 15],
      criteria: [
        [
          'Phân biệt khái niệm Thông tin và Dữ liệu',
          35,
          [
            'Chưa phân biệt được thông tin và dữ liệu; còn nhầm lẫn giữa hai khái niệm.',
            'Nêu được định nghĩa nhưng lấy ví dụ minh họa chưa chính xác hoặc còn lúng túng.',
            'Phân biệt chính xác thông tin và dữ liệu; lấy được ví dụ thực tế đời sống rõ ràng.',
            'Giải thích sâu sắc mối quan hệ thông tin - dữ liệu; phân tích thành thạo các tình huống phức tạp.',
          ],
        ],
        [
          'Nhận biết Vật mang tin & Tầm quan trọng của thông tin',
          30,
          [
            'Chưa chỉ ra được vật mang tin trong các ví dụ thực tế.',
            'Chỉ ra được một số vật mang tin quen thuộc nhưng chưa giải thích được tầm quan trọng.',
            'Nhận biết chính xác vật mang tin; nêu rõ ví dụ về tầm quan trọng của thông tin trong quyết định.',
            'Phân loại đa dạng các dạng vật mang tin (chữ, hình ảnh, âm thanh); phân tích sắc sảo vai trò thông tin.',
          ],
        ],
        [
          'Năng lực số: Xác định nhu cầu thông tin & Phân loại dữ liệu số',
          20,
          [
            'Chưa xác định được thông tin cần tìm cho nhiệm vụ học tập.',
            'Xác định được nhu cầu thông tin cơ bản nhưng chưa biết phân loại dữ liệu số.',
            'Xác định đúng nhu cầu thông tin và phân loại được các dạng dữ liệu số cơ bản.',
            'Chủ động đề xuất phương án thu thập thông tin và tổ chức dữ liệu số khoa học.',
          ],
        ],
        [
          'Năng lực AI & Hoàn thiện bài làm theo quy ước',
          15,
          [
            'Chưa nêu được liên hệ giữa dữ liệu và AI; nộp bài chưa đúng hạn hoặc sai tên tệp.',
            'Nêu được sơ lược AI cần dữ liệu nhưng bài làm còn lỗi chính tả nhỏ.',
            'Hiểu rõ AI cần dữ liệu đầu vào do con người cung cấp; lưu tệp MAHS_Bai1 đúng quy ước.',
            'Giải thích chuẩn xác vai trò dữ liệu đối với AI; bài làm trình bày xuất sắc, nộp sớm.',
          ],
        ],
      ],
    };
  }

  // 2. TOPIC: Xử lí thông tin (Bài 2 Tin 6)
  if (titleLower.includes('xử lí thông tin') || titleLower.includes('xử lý thông tin')) {
    return {
      title: `${code} – ${title}`,
      weights: [35, 30, 20, 15],
      criteria: [
        [
          'Mô tả 4 bước trong quy trình xử lí thông tin',
          35,
          [
            'Chưa nêu đủ 4 bước (Thu nhận - Xử lí - Lưu trữ - Xuất/Truyền) hoặc sắp xếp sai thứ tự.',
            'Nêu được 4 bước nhưng chưa giải thích rõ hoạt động cụ thể ở từng bước.',
            'Mô tả chính xác và đầy đủ 4 bước xử lí thông tin kèm ví dụ minh họa thực tế.',
            'Phân tích chi tiết dòng dữ liệu qua từng bước; liên hệ thành thạo hoạt động của con người và máy tính.',
          ],
        ],
        [
          'Phân tích vai trò của máy tính trong xử lí thông tin',
          30,
          [
            'Chưa chỉ ra được ưu điểm của máy tính so với con người trong xử lí thông tin.',
            'Nêu được máy tính xử lí nhanh nhưng chưa chỉ ra được tính chính xác và khả năng lưu trữ lớn.',
            'Giải thích rõ ràng máy tính là công cụ xử lí thông tin hiệu quả (tốc độ, độ chính xác, lưu trữ, làm việc liên tục).',
            'Đánh giá toàn diện vai trò của máy tính trong chuyển đổi số và đời sống hiện đại.',
          ],
        ],
        [
          'Năng lực số: Nhận diện quá trình thu nhận và xử lí dữ liệu số',
          20,
          [
            'Chưa phân biệt được các thiết bị tương ứng với từng bước xử lí dữ liệu số.',
            'Nhận biết được một số thiết bị vào/ra nhưng liên kết với quy trình xử lí còn hạn chế.',
            'Nhận biết chính xác thiết bị và phần mềm tương ứng với các giai đoạn xử lí dữ liệu số.',
            'Hệ thống hóa lưu đồ dòng chảy dữ liệu số trong môi trường công nghệ rõ ràng.',
          ],
        ],
        [
          'Năng lực AI: So sánh chu trình xử lý thông tin với mô hình AI',
          15,
          [
            'Chưa liên hệ được quy trình xử lí thông tin với công cụ AI.',
            'Nhận biết sơ lược AI cũng có đầu vào và đầu ra nhưng mô tả còn đơn giản.',
            'Mô tả được các bước hoạt động chính của công cụ AI (Dữ liệu vào -> Xử lí -> Kết quả); lưu tệp đúng tên.',
            'Phân tích sâu sắc sự tương đồng và khác biệt giữa xử lý thông thường và học máy của AI; trình bày chuẩn mực.',
          ],
        ],
      ],
    };
  }

  // 3. TOPIC: Thông tin trong máy tính / Biểu diễn thông tin / Dãy bit (Bài 3 Tin 6)
  if (titleLower.includes('thông tin trong máy tính') || titleLower.includes('dãy bit') || titleLower.includes('biểu diễn thông tin')) {
    return {
      title: `${code} – ${title}`,
      weights: [35, 30, 20, 15],
      criteria: [
        [
          'Hiểu biểu diễn thông tin bằng dãy bit (0 và 1)',
          35,
          [
            'Chưa hiểu khái niệm bit; không giải thích được vì sao máy tính chỉ hiểu dãy bit.',
            'Nêu được bit gồm hai ký hiệu 0 và 1 nhưng chưa giải thích được cơ chế biểu diễn văn bản, số, hình ảnh.',
            'Giải thích được mọi thông tin trong máy tính đều được biểu diễn thành dãy bit (0, 1).',
            'Giải thích tường minh nguyên lý mã hóa nhị phân; mô phỏng dãy bit cho ký tự một cách chính xác.',
          ],
        ],
        [
          'Quy đổi và tính toán đơn vị đo dung lượng thông tin',
          30,
          [
            'Không nhớ thứ tự các đơn vị (B, KB, MB, GB, TB) hoặc tính sai hoàn toàn.',
            'Nhớ thứ tự đơn vị nhưng còn nhầm lẫn hệ số quy đổi 1024 (hoặc 1000).',
            'Thực hiện chính xác các phép quy đổi đơn vị đo dung lượng thông tin thông dụng.',
            'Tính toán thành thạo các bài toán dung lượng thực tế (ước lượng số bài hát, ảnh, video trên thiết bị lưu trữ).',
          ],
        ],
        [
          'Năng lực số: Lựa chọn thiết bị lưu trữ dữ liệu số phù hợp',
          20,
          [
            'Chưa phân biệt được dung lượng của các thiết bị lưu trữ phổ biến (USB, thẻ nhớ, ổ cứng, đám mây).',
            'Biết các thiết bị nhưng chưa ước lượng được dung lượng cần thiết cho công việc.',
            'Lựa chọn chính xác thiết bị lưu trữ phù hợp với quy mô dữ liệu cần sao lưu.',
            'Đề xuất giải pháp lưu trữ tối ưu kết hợp giữa thiết bị vật lý và lưu trữ đám mây an toàn.',
          ],
        ],
        [
          'Năng lực AI & Trình bày bài tập tính toán',
          15,
          [
            'Chưa hoàn thành bảng tính toán; tệp bài nộp đặt sai quy định.',
            'Hoàn thành bảng tính toán nhưng trình bày chưa rõ ràng các bước đổi đơn vị.',
            'Trình bày bài giải mạch lạc; hiểu máy tính là nền tảng vật lý vận hành AI; lưu tệp MAHS_Bai3 đúng chuẩn.',
            'Bài làm xuất sắc, có bảng so sánh trực quan; giải thích rõ vì sao mô hình AI cần dung lượng lưu trữ khổng lồ.',
          ],
        ],
      ],
    };
  }

  // 4. TOPIC: Định dạng văn bản (Bài 11 Tin 6)
  if (titleLower.includes('định dạng văn bản') || (code === 'Bài 11' && Number(lesson.grade) === 6)) {
    return {
      title: `${code} – ${title}`,
      weights: [30, 30, 25, 15],
      criteria: [
        [
          'Kỹ thuật định dạng ký tự (Font, Size, Style, Color)',
          30,
          [
            'Chưa định dạng ký tự; văn bản để phông chữ mặc định lộn xộn, sai cỡ chữ quy định.',
            'Định dạng được một phần văn bản nhưng phông chữ chưa thống nhất, còn lỗi dùng màu sắc.',
            'Định dạng chính xác phông chữ tiếng Việt chuẩn (Times New Roman / Arial), đúng cỡ chữ tiêu đề và nội dung.',
            'Phối hợp hài hòa giữa kiểu chữ (Đậm, Nghiêng), màu sắc trang nhã, làm nổi bật thông điệp chính.',
          ],
        ],
        [
          'Kỹ thuật định dạng đoạn văn (Alignment, Indent, Line Spacing)',
          30,
          [
            'Chưa căn lề đoạn văn; khoảng cách dòng và khoảng cách đoạn quá sát hoặc quá thưa.',
            'Căn lề được tiêu đề nhưng phần nội dung chưa căn đều hai bên (Justify), chưa thụt đầu dòng.',
            'Căn đều hai bên (Justify) nội dung, căn giữa tiêu đề, thiết lập thụt dòng đầu tiên và dãn dòng 1.2 - 1.5 lines chuẩn.',
            'Định dạng đoạn văn chuyên nghiệp, khoảng cách trước/sau đoạn (Before/After) cân đối, chuẩn thể thức văn bản.',
          ],
        ],
        [
          'Bố cục trang giấy, hiệu ứng Drop Cap & Border',
          25,
          [
            'Chưa thiết lập lề trang giấy (Margins); không tạo được viền trang hoặc hiệu ứng chữ lớn.',
            'Có thiết lập trang nhưng kích thước lề chưa chuẩn; hiệu ứng Drop Cap chưa đúng số hàng.',
            'Thiết lập đúng lề trang theo yêu cầu (Trên, Dưới, Trái, Phải); tạo được chữ lớn đầu đoạn (Drop Cap) và viền trang đẹp mắt.',
            'Bố cục trang in hoàn hảo, trực quan, cân đối; sẵn sàng xuất bản hoặc in ấn mà không bị tràn trang.',
          ],
        ],
        [
          'Kiểm tra chính tả, Năng lực AI & Lưu tệp đúng quy ước',
          15,
          [
            'Văn bản còn nhiều lỗi chính tả tiếng Việt; đặt tên tệp sai quy ước.',
            'Còn 1-2 lỗi chính tả; đã lưu tệp nhưng chưa đúng cú pháp mã học sinh.',
            'Rà soát sạch lỗi chính tả; biết dùng công cụ kiểm tra của Word/AI; lưu đúng MAHS_Bai11.docx.',
            'Chủ động dùng gợi ý chỉnh sửa của công cụ số/AI; bài nộp hoàn thiện sớm, chuẩn mực tuyệt đối.',
          ],
        ],
      ],
    };
  }

  // 5. TOPIC: Trình bày thông tin ở dạng bảng (Bài 12 Tin 6)
  if (titleLower.includes('dạng bảng') || titleLower.includes('bảng biểu') || (code === 'Bài 12' && Number(lesson.grade) === 6)) {
    return {
      title: `${code} – ${title}`,
      weights: [35, 30, 20, 15],
      criteria: [
        [
          'Cấu trúc bảng và nhập dữ liệu (Số hàng, Số cột, Gộp ô)',
          35,
          [
            'Chưa tạo được bảng hoàn chỉnh; thiếu/thừa nhiều hàng cột so với đề bài yêu cầu.',
            'Tạo được bảng nhưng thao tác gộp/tách ô chưa chính xác hoặc còn để trống ô dữ liệu.',
            'Tạo bảng đủ số hàng, số cột theo đúng mẫu; gộp ô tiêu đề chuẩn; nhập đầy đủ 100% dữ liệu.',
            'Cấu trúc bảng chính xác tuyệt đối; tổ chức thông tin khoa học, phân chia hàng cột logic tối ưu.',
          ],
        ],
        [
          'Thao tác chỉnh sửa và định dạng bảng biểu',
          30,
          [
            'Chưa biết chỉnh độ rộng cột; chữ trong ô bị tràn viền hoặc ngắt dòng luộm thuộm.',
            'Đã chỉnh độ rộng nhưng chưa cân đối; căn lề chữ trong ô chưa hợp lý.',
            'Căn giữa tiêu đề cột, căn trái/phải dữ liệu phù hợp; điều chỉnh độ rộng cột cân đối, dễ đọc.',
            'Thao tác thành thạo căn giữa cả chiều ngang và dọc (Align Center); định dạng bảng chuyên nghiệp.',
          ],
        ],
        [
          'Trang trí thẩm mỹ (Borders viền bảng & Shading màu nền)',
          20,
          [
            'Bảng chưa có viền hoặc viền mặc định mờ nhạt; không có màu nền phân biệt tiêu đề.',
            'Có tô màu nền nhưng màu quá tối làm chìm chữ; kẻ viền chưa đúng loại đường nét yêu cầu.',
            'Tô màu nền tiêu đề nhã nhặn, tương phản tốt; kẻ viền bảng rõ nét (viền ngoài đậm/đôi, viền trong đơn).',
            'Bảng có tính thẩm mỹ cao, phối màu bảng chuẩn phong cách báo cáo; đường viền sắc nét, ấn tượng.',
          ],
        ],
        [
          'Kiểm tra dữ liệu, Năng lực AI & Lưu tệp bài làm',
          15,
          [
            'Nhiều lỗi chính tả trong bảng; đặt tên tệp sai quy định hoặc nộp trễ hạn.',
            'Có kiểm tra nhưng còn sót lỗi nhỏ; lưu tệp gần đúng cú pháp.',
            'Kiểm tra kỹ lưỡng số liệu và chính tả; hiểu AI giúp cấu trúc bảng dữ liệu; lưu tệp MAHS_Bai12.docx.',
            'Chủ động rà soát, hoàn thiện sản phẩm xuất sắc; tệp bài làm đạt chuẩn sư phạm cao.',
          ],
        ],
      ],
    };
  }

  // 6. TOPIC: Tìm kiếm và thay thế (Bài 13 Tin 6)
  if (titleLower.includes('tìm kiếm và thay thế') || (code === 'Bài 13' && Number(lesson.grade) === 6)) {
    return {
      title: `${code} – ${title}`,
      weights: [30, 35, 20, 15],
      criteria: [
        [
          'Kỹ năng sử dụng công cụ Tìm kiếm (Find)',
          30,
          [
            'Chưa biết mở hộp thoại Find; tìm kiếm thủ công bằng mắt dẫn đến sót từ.',
            'Mở được công cụ Find nhưng chưa biết duyệt qua các vị trí xuất hiện của từ trong văn bản.',
            'Sử dụng thành thạo hộp thoại Find để định vị chính xác tất cả các vị trí của từ/cụm từ.',
            'Thành thạo các tùy chọn tìm kiếm nâng cao (Match case, Find whole words only) nhanh chóng.',
          ],
        ],
        [
          'Thao tác Thay thế từ ngữ (Replace / Replace All)',
          35,
          [
            'Chưa thực hiện được thao tác thay thế tự động; sửa tay từng từ.',
            'Thực hiện được lệnh Replace nhưng chưa biết dùng Replace All hoặc thay thế nhầm vị trí.',
            'Sử dụng thành thạo Replace và Replace All để thay thế chính xác toàn bộ từ cần sửa theo đề bài.',
            'Kiểm soát hoàn hảo số lượng từ được thay thế; không làm ảnh hưởng đến các từ ngữ khác trong văn bản.',
          ],
        ],
        [
          'Định dạng làm nổi bật cụm từ sau khi thay thế',
          20,
          [
            'Chưa định dạng nổi bật từ mới thay thế.',
            'Chỉ đổi màu chữ nhưng chưa in đậm hoặc làm sót một số vị trí.',
            'Đổi màu chữ và in đậm đồng bộ cho tất cả các từ mới được thay thế đúng yêu cầu.',
            'Định dạng trực quan xuất sắc, tạo điểm nhấn rõ ràng giúp người đọc đối chiếu dễ dàng.',
          ],
        ],
        [
          'Tính toàn vẹn văn bản, Năng lực AI & Lưu tệp',
          15,
          [
            'Văn bản sau thay thế bị mất đoạn hoặc sai ngữ pháp; lưu tệp sai tên.',
            'Văn bản nguyên vẹn nhưng chưa rà soát kỹ; lưu tệp chưa đúng cú pháp.',
            'Đảm bảo văn bản liền mạch, không lỗi chính tả; hiểu logic tự động hóa của máy tính/AI; lưu đúng quy ước.',
            'Phân tích sâu sắc lợi ích của tự động hóa và AI trong xử lý dữ liệu lớn; bài nộp hoàn hảo.',
          ],
        ],
      ],
    };
  }

  // 7. TOPIC: Thực hành tổng hợp: Hoàn thiện sổ lưu niệm (Bài 14 Tin 6)
  if (titleLower.includes('sổ lưu niệm') || (code === 'Bài 14' && Number(lesson.grade) === 6)) {
    return {
      title: `${code} – ${title}`,
      weights: [35, 30, 20, 15],
      criteria: [
        [
          'Tích hợp đa phương tiện (Văn bản, Hình ảnh, Bảng biểu, WordArt)',
          35,
          [
            'Thiếu nhiều thành phần (không có ảnh hoặc không có bảng); chỉ có văn bản đơn điệu.',
            'Có đủ thành phần nhưng ảnh chèn bị méo tỉ lệ hoặc bảng biểu chèn lệch trang.',
            'Tích hợp đầy đủ tiêu đề WordArt, hình ảnh minh họa cân đối, bảng danh sách thành viên và đoạn cảm nghĩ.',
            'Bố trí đa phương tiện sáng tạo, chèn khung viền ảnh nghệ thuật, phối hợp chữ và hình ảnh hài hòa xuất sắc.',
          ],
        ],
        [
          'Bố cục trang sổ lưu niệm và tính thẩm mỹ',
          30,
          [
            'Bố cục lộn xộn, khoảng cách giữa các phần không đều, màu sắc chói mắt.',
            'Bố cục tương đối nhưng các khối nội dung chưa gắn kết chặt chẽ.',
            'Bố cục trang cân đối, màu sắc trang nhã, phân chia các khu vực nội dung khoa học, đẹp mắt.',
            'Thiết kế trang sổ lưu niệm độc đáo, mang phong cách riêng, có viền trang nghệ thuật ấn tượng.',
          ],
        ],
        [
          'Chất lượng nội dung và thông điệp cảm xúc',
          20,
          [
            'Nội dung sơ sài, sao chép hoặc còn nhiều lỗi chính tả câu cú.',
            'Nội dung đầy đủ nhưng còn mang tính liệt kê, cảm xúc chưa sâu sắc.',
            'Nội dung ý nghĩa, câu văn trau chuốt, chính tả chuẩn mực, truyền tải tình cảm bạn bè trường lớp.',
            'Lời văn giàu cảm xúc, sáng tạo, thông điệp truyền cảm hứng tích cực, trình bày ấn tượng.',
          ],
        ],
        [
          'Kỹ năng xuất bản, Năng lực AI & Lưu tệp sản phẩm',
          15,
          [
            'Chưa biết lưu tệp hoặc tệp bị lỗi định dạng khi mở; nộp trễ.',
            'Lưu được tệp nhưng kích thước tệp quá nặng do chưa nén ảnh; tên tệp chưa chuẩn.',
            'Lưu tệp đúng định dạng .docx theo quy ước MAHS_Bai14; biết ứng dụng AI hỗ trợ gợi ý ý tưởng.',
            'Chủ động xuất bản thêm bản PDF chất lượng cao; nộp bài sớm, kỹ năng tin học thành thạo.',
          ],
        ],
      ],
    };
  }

  // 8. TOPIC: Sơ đồ tư duy (Bài 10 Tin 6)
  if (titleLower.includes('sơ đồ tư duy') || titleLower.includes('mindmap') || (code === 'Bài 10' && Number(lesson.grade) === 6)) {
    return {
      title: `${code} – ${title}`,
      weights: [35, 30, 20, 15],
      criteria: [
        [
          'Chủ đề trung tâm và cấu trúc phân nhánh logic',
          35,
          [
            'Chưa xác định rõ chủ đề trung tâm; các nhánh vẽ tùy tiện, thiếu cấu trúc phân cấp.',
            'Có chủ đề trung tâm nhưng chỉ có 1-2 nhánh chính, chưa phát triển được nhánh phụ cấp 2.',
            'Xác định rõ chủ đề trung tâm ở vị trí nổi bật; phát triển đủ các nhánh chính cấp 1 và nhánh phụ cấp 2 hợp lý.',
            'Cấu trúc sơ đồ logic sâu sắc, phân nhánh phân cấp hoàn hảo từ bao quát đến chi tiết.',
          ],
        ],
        [
          'Kỹ thuật vẽ sơ đồ (Shapes / SmartArt / Phần mềm chuyên dụng)',
          30,
          [
            'Chưa biết dùng công cụ vẽ; các đường nối bị đứt gãy hoặc hình khối méo mó.',
            'Vẽ được hình nhưng các nhánh nối chưa liên kết vào khối, kích thước chữ trong nhánh chưa đều.',
            'Sử dụng thành thạo các hình khối, đường nối kết nối chính xác giữa các nút thông tin; nhập chữ rõ ràng.',
            'Thao tác vẽ điêu luyện, đường cong mềm mại, căn chỉnh khoảng cách các nhánh đồng đều, khoa học.',
          ],
        ],
        [
          'Trực quan hóa (Màu sắc nhánh, Từ khóa & Biểu tượng Icon)',
          20,
          [
            'Sơ đồ đơn sắc, viết cả đoạn văn dài vào nhánh thay vì dùng từ khóa.',
            'Có dùng màu sắc nhưng chưa phân biệt theo từng cụm nhánh; từ khóa còn dài dòng.',
            'Mỗi nhánh chính dùng một màu sắc phân biệt; cô đọng nội dung thành từ khóa ngắn gọn; có chèn biểu tượng minh họa.',
            'Trực quan hóa xuất sắc, màu sắc hài hòa kích thích thị giác; biểu tượng icon sáng tạo, dễ ghi nhớ.',
          ],
        ],
        [
          'Chèn sơ đồ vào văn bản, Năng lực AI & Lưu trữ',
          15,
          [
            'Chưa chèn được hình ảnh sơ đồ vào Word; đặt tên tệp sai quy định.',
            'Đã chèn sơ đồ vào văn bản nhưng vị trí chưa cân đối, thiếu phần chú thích sơ đồ.',
            'Chèn sơ đồ vào tài liệu Word sắc nét, có chú thích rõ ràng; lưu tệp đúng quy ước MAHS_Bai10.',
            'Vận dụng công cụ AI để mở rộng ý tưởng cho sơ đồ; bài nộp trình bày chuyên nghiệp, mẫu mực.',
          ],
        ],
      ],
    };
  }

  // 9. TOPIC: Mạng máy tính & Internet (Bài 4, 5 Tin 6)
  if (titleLower.includes('mạng máy tính') || (titleLower.includes('internet') && !titleLower.includes('tìm kiếm')) || ((code === 'Bài 4' || code === 'Bài 5') && Number(lesson.grade) === 6)) {
    return {
      title: `${code} – ${title}`,
      weights: [35, 30, 20, 15],
      criteria: [
        [
          'Nhận biết thành phần mạng & Phân loại mạng có dây / không dây',
          35,
          [
            'Chưa nêu được các thành phần chính của mạng; nhầm lẫn giữa thiết bị đầu cuối và thiết bị kết nối.',
            'Nêu được một số thành phần nhưng chưa phân biệt rõ ưu/nhược điểm giữa mạng có dây và không dây.',
            'Nhận biết chính xác các thành phần mạng (thiết bị đầu cuối, thiết bị kết nối, phần mềm mạng); phân loại rõ mạng có dây/không dây.',
            'Phân tích sâu sắc nguyên lý hoạt động của mạng LAN; đề xuất giải pháp mạng phù hợp cho từng không gian.',
          ],
        ],
        [
          'Hiểu bản chất và các dịch vụ cơ bản của Internet',
          30,
          [
            'Chưa hiểu Internet là gì; nhầm lẫn giữa mạng nội bộ và mạng Internet toàn cầu.',
            'Kể được một số dịch vụ quen thuộc (xem phim, lướt web) nhưng chưa hiểu cách thức hoạt động.',
            'Giải thích được Internet là mạng kết nối toàn cầu; nêu rõ lợi ích của các dịch vụ: tra cứu, trao đổi thư từ, học trực tuyến.',
            'Đánh giá toàn diện vai trò của Internet trong kết nối vạn vật (IoT), điện toán đám mây và hạ tầng phát triển AI.',
          ],
        ],
        [
          'Năng lực số: Nhận diện hạ tầng mạng phục vụ học tập số',
          20,
          [
            'Chưa biết kiểm tra kết nối mạng của thiết bị khi gặp sự cố.',
            'Biết kết nối Wi-Fi cơ bản nhưng chưa hiểu về an toàn mạng công cộng.',
            'Thao tác kết nối mạng an toàn; nhận diện đúng các nguy cơ khi dùng Wi-Fi không mật khẩu.',
            'Chủ động xử lý các sự cố mạng cơ bản; thiết lập thói quen sử dụng Internet lành mạnh, an toàn.',
          ],
        ],
        [
          'Trình bày sơ đồ mạng, Năng lực AI & Lưu tệp bài tập',
          15,
          [
            'Bảng so sánh mạng sơ sài; không vẽ được sơ đồ mạng; lưu sai tên tệp.',
            'Bảng so sánh đầy đủ nhưng sơ đồ mạng vẽ còn đơn giản; lưu tệp gần đúng cú pháp.',
            'Vẽ được sơ đồ kết nối mạng phòng máy hoàn chỉnh; hiểu Internet là môi trường truyền tải dữ liệu của AI; lưu tệp đúng quy ước.',
            'Sơ đồ mạng trực quan, chuyên nghiệp; bài viết liên hệ sâu sắc về kỷ nguyên Internet và AI.',
          ],
        ],
      ],
    };
  }

  // 10. TOPIC: Mạng thông tin toàn cầu & Tìm kiếm thông tin trên Internet (Bài 6, 7 Tin 6)
  if (titleLower.includes('mạng thông tin toàn cầu') || titleLower.includes('tìm kiếm thông tin') || ((code === 'Bài 6' || code === 'Bài 7') && Number(lesson.grade) === 6)) {
    return {
      title: `${code} – ${title}`,
      weights: [30, 35, 20, 15],
      criteria: [
        [
          'Khái niệm WWW, Website, Trang web và Siêu liên kết',
          30,
          [
            'Chưa phân biệt được giữa Internet và World Wide Web (WWW); nhầm lẫn giữa website và trang web.',
            'Nêu được định nghĩa nhưng chưa chỉ ra được siêu liên kết (Hyperlink) hoạt động như thế nào.',
            'Phân biệt rõ ràng WWW, website, trang web chủ và trang web con; giải thích đúng bản chất siêu liên kết.',
            'Giải thích sâu sắc cấu trúc không gian thông tin mạng toàn cầu; nhận biết địa chỉ URL chuẩn.',
          ],
        ],
        [
          'Kỹ năng chọn từ khóa và sử dụng công cụ tìm kiếm',
          35,
          [
            'Chưa biết dùng máy tìm kiếm; gõ câu hỏi dài dòng, không chọn lọc từ khóa.',
            'Biết gõ từ khóa đơn giản nhưng chưa biết thu hẹp phạm vi tìm kiếm khi ra quá nhiều kết quả rác.',
            'Xác định từ khóa chính xác, cô đọng; biết sử dụng dấu ngoặc kép " " và các toán tử để lọc thông tin hiệu quả.',
            'Sử dụng điêu luyện các kỹ thuật tìm kiếm nâng cao (tìm theo định dạng tệp filetype, tìm trên trang web site:); tìm nhanh và chuẩn.',
          ],
        ],
        [
          'Đánh giá độ tin cậy và trích dẫn nguồn thông tin số',
          20,
          [
            'Tin tưởng tuyệt đối vào kết quả đầu tiên tìm thấy; không kiểm tra nguồn gốc tác giả.',
            'Biết có thông tin giả nhưng chưa nêu được tiêu chí cụ thể để kiểm chứng.',
            'Đánh giá được độ tin cậy dựa trên tác giả, cơ quan chủ quản, thời gian xuất bản; biết trích dẫn nguồn rõ ràng.',
            'Phân tích phản biện sắc bén đối với thông tin trên Internet; tuân thủ nghiêm túc bản quyền số.',
          ],
        ],
        [
          'Tổng hợp báo cáo, Năng lực AI & Lưu tệp',
          15,
          [
            'Bảng kết quả tìm kiếm sơ sài; không lưu được tệp bài làm.',
            'Bảng tổng hợp tương đối nhưng trích dẫn link web chưa đầy đủ; lưu tệp còn lỗi tên.',
            'Tổng hợp thông tin mạch lạc vào bảng Word; hiểu máy tìm kiếm ứng dụng AI xếp hạng kết quả; lưu tệp đúng quy ước.',
            'Bài tổng hợp thông tin chất lượng cao, có nhận xét sâu sắc; nộp bài đúng hạn, chuẩn sư phạm.',
          ],
        ],
      ],
    };
  }

  // 11. TOPIC: Thư điện tử (Bài 8 Tin 6)
  if (titleLower.includes('thư điện tử') || titleLower.includes('email') || (code === 'Bài 8' && Number(lesson.grade) === 6)) {
    return {
      title: `${code} – ${title}`,
      weights: [30, 35, 20, 15],
      criteria: [
        [
          'Hiểu cấu trúc hộp thư điện tử và địa chỉ Email',
          30,
          [
            'Chưa viết đúng định dạng một địa chỉ email; nhầm lẫn giữa tên đăng nhập và tên miền dịch vụ.',
            'Viết được địa chỉ email nhưng chưa phân biệt rõ chức năng các hộp thư (Hộp thư đến, Thư đã gửi, Thùng rác, Thư rác/Spam).',
            'Nhận biết chính xác cấu trúc địa chỉ email (tên_người_dùng@tên_miền); giải thích đúng vai trò các thư mục trong hộp thư.',
            'Phân tích thành thạo ưu/nhược điểm của thư điện tử so với thư truyền thống và các ứng dụng nhắn tin tức thời.',
          ],
        ],
        [
          'Kỹ năng soạn thảo thư điện tử chuẩn mực (Tiêu đề, Nội dung, Chữ ký)',
          35,
          [
            'Để trống dòng tiêu đề thư (Subject); nội dung thư cộc lốc, không có lời chào và lời kết.',
            'Có tiêu đề nhưng chưa rõ ràng; nội dung thiếu kính ngữ hoặc còn viết tắt tùy tiện.',
            'Tiêu đề thư ngắn gọn nêu rõ mục đích; nội dung có lời thưa gửi lễ phép, trình bày mạch lạc, có chữ ký người gửi.',
            'Phong cách thư tín văn minh, chuẩn mực giao tiếp sư phạm; câu từ chuẩn xác, thể hiện văn hóa ứng xử số cao.',
          ],
        ],
        [
          'Thao tác đính kèm tệp tin và an toàn thư tín',
          20,
          [
            'Chưa biết thao tác đính kèm tệp (Attach file) hoặc đính kèm nhầm tệp.',
            'Đính kèm được tệp nhưng dung lượng quá lớn hoặc chưa kiểm tra tính an toàn của tệp.',
            'Đính kèm tệp đúng yêu cầu; nhận biết nguy cơ lừa đảo qua thư rác, tệp đính kèm chứa mã độc.',
            'Thao tác nén tệp đính kèm chuyên nghiệp; nêu rõ các biện pháp phòng ngừa phishing qua email.',
          ],
        ],
        [
          'Năng lực AI & Hoàn thiện bài làm lưu trữ',
          15,
          [
            'Chưa hoàn thành bản thảo thư trong Word; lưu sai quy cách.',
            'Bản thảo đầy đủ nhưng căn lề chưa đẹp; lưu tệp gần đúng cú pháp.',
            'Bản thảo thư trình bày chỉn chu trong Word; hiểu AI hỗ trợ lọc spam và gợi ý soạn thảo email; lưu tệp MAHS_Bai8.',
            'Bài làm xuất sắc, có bảng checklist quy tắc gửi email an toàn; hoàn thành trước thời hạn.',
          ],
        ],
      ],
    };
  }

  // 12. TOPIC: An toàn thông tin trên Internet (Bài 9 Tin 6)
  if (titleLower.includes('an toàn thông tin') || (code === 'Bài 9' && Number(lesson.grade) === 6)) {
    return {
      title: `${code} – ${title}`,
      weights: [35, 30, 20, 15],
      criteria: [
        [
          'Nhận diện các mối nguy hại và hành vi lừa đảo trên không gian mạng',
          35,
          [
            'Chưa nhận thức được nguy cơ mất an toàn thông tin; cho rằng môi trường mạng hoàn toàn vô hại.',
            'Kể được virus máy tính nhưng chưa nhận diện được các hình thức lừa đảo tinh vi (giả mạo link, mạo danh người thân).',
            'Chỉ ra rõ ràng các nguy cơ: lộ dữ liệu cá nhân, lừa đảo trực tuyến, mã độc tống tiền, bẫy thông tin độc hại.',
            'Phân tích sắc sảo các thủ đoạn lừa đảo công nghệ cao và hệ quả nghiêm trọng đối với bản thân và gia đình.',
          ],
        ],
        [
          'Quy tắc tạo mật khẩu mạnh và bảo vệ dữ liệu cá nhân',
          30,
          [
            'Đặt mật khẩu quá yếu (123456, ngày sinh); dùng chung một mật khẩu cho mọi tài khoản.',
            'Biết đặt mật khẩu dài nhưng chưa kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt.',
            'Xây dựng được mật khẩu mạnh (trên 8 ký tự, đủ 4 thành phần); biết kích hoạt xác thực hai yếu tố (2FA).',
            'Đề xuất chiến lược quản lý mật khẩu khoa học, an toàn tuyệt đối mà không sợ quên.',
          ],
        ],
        [
          'Năng lực số: Văn hóa ứng xử và bảo vệ quyền riêng tư số',
          20,
          [
            'Tự do chia sẻ thông tin cá nhân (địa chỉ, số điện thoại, vị trí thời gian thực) lên mạng xã hội.',
            'Biết hạn chế chia sẻ nhưng chưa có thói quen kiểm tra quyền riêng tư của ứng dụng.',
            'Tuân thủ nguyên tắc bảo vệ quyền riêng tư; không lan truyền tin giả; ứng xử văn minh, tôn trọng người khác trên mạng.',
            'Là tuyên truyền viên tích cực lan tỏa thông điệp an toàn số và lối sống số lành mạnh trong lớp học.',
          ],
        ],
        [
          'Năng lực AI: Đạo đức AI & Lưu tệp sản phẩm cẩm nang',
          15,
          [
            'Chưa nhận thức về quyền riêng tư khi nạp dữ liệu vào AI; lưu sai tên tệp.',
            'Hiểu sơ lược không nạp mật khẩu vào AI nhưng giải thích chưa thuyết phục.',
            'Hiểu rõ dữ liệu người dùng nạp vào AI có thể dùng để huấn luyện mô hình; thiết kế cẩm nang an toàn số; lưu tệp MAHS_Bai9.',
            'Sản phẩm cẩm nang an toàn số xuất sắc, có giá trị ứng dụng thực tiễn cao cho học sinh toàn trường.',
          ],
        ],
      ],
    };
  }

  // 13. TOPIC: Thuật toán & Cấu trúc điều khiển (Bài 15, 16 Tin 6, Bài 14, 15, 16 Tin 7)
  if (titleLower.includes('thuật toán') || titleLower.includes('cấu trúc điều khiển') || titleLower.includes('sắp xếp') || titleLower.includes('tìm kiếm')) {
    return {
      title: `${code} – ${title}`,
      weights: [30, 35, 20, 15],
      criteria: [
        [
          'Xác định bài toán (Input / Output) & Ý tưởng thuật toán',
          30,
          [
            'Chưa xác định đúng dữ liệu đầu vào (Input) và kết quả đầu ra (Output) của bài toán.',
            'Xác định được Input/Output nhưng ý tưởng giải quyết còn mơ hồ, chưa logic.',
            'Xác định chính xác tuyệt đối Input và Output; nêu rõ ý tưởng thuật toán mạch lạc, dễ hiểu.',
            'Phân tích sâu sắc bài toán, tối ưu hóa ý tưởng thuật toán với các trường hợp đặc biệt.',
          ],
        ],
        [
          'Mô tả thuật toán (Liệt kê các bước & Sơ đồ khối Flowchart)',
          35,
          [
            'Mô tả các bước rời rạc, thiếu tính tuần tự hoặc vẽ sai các hình khối quy ước.',
            'Liệt kê được các bước nhưng chưa vẽ được sơ đồ khối hoặc vẽ thiếu các đường mũi tên chỉ hướng.',
            'Mô tả chính xác từng bước thuật toán bằng liệt kê; vẽ đúng sơ đồ khối chuẩn quy ước (Hình oval, bình hành, chữ nhật, thoi).',
            'Sơ đồ khối vẽ đẹp mắt, khoa học, chính xác 100%; thể hiện hoàn hảo các cấu trúc tuần tự, rẽ nhánh hoặc lặp.',
          ],
        ],
        [
          'Kỹ năng chạy thử (Trace table) với bộ dữ liệu cụ thể',
          20,
          [
            'Chưa biết chạy thử thuật toán; không theo dõi được sự thay đổi của biến số qua từng bước.',
            'Chạy thử được với dữ liệu đơn giản nhưng bị nhầm lẫn khi gặp điều kiện rẽ nhánh.',
            'Lập bảng theo dõi từng bước (Trace table) chính xác với các bộ dữ liệu thử nghiệm, đưa ra đúng kết quả.',
            'Chạy thử thành thạo với nhiều trường hợp biên phức tạp; chứng minh được tính đúng đắn của thuật toán.',
          ],
        ],
        [
          'Năng lực AI: So sánh thuật toán con người và máy học AI',
          15,
          [
            'Chưa liên hệ được thuật toán với trí tuệ nhân tạo; nộp tệp sai quy định.',
            'Nêu được AI cũng dựa trên thuật toán nhưng chưa phân biệt rõ thuật toán truyền thống và học máy.',
            'Hiểu thuật toán là nền tảng cốt lõi của lập trình và AI; lưu tệp bài giải đúng cú pháp quy định.',
            'Phân tích sâu sắc sự chuyển dịch từ thuật toán quy tắc cố định sang mô hình học từ dữ liệu của AI.',
          ],
        ],
      ],
    };
  }

  // 14. TOPIC: Chương trình máy tính / Scratch (Bài 17 Tin 6)
  if (titleLower.includes('chương trình máy tính') || titleLower.includes('scratch') || (code === 'Bài 17' && Number(lesson.grade) === 6)) {
    return {
      title: `${code} – ${title}`,
      weights: [30, 35, 20, 15],
      criteria: [
        [
          'Chuyển đổi từ thuật toán sang kịch bản chương trình',
          30,
          [
            'Chưa hiểu mối liên hệ giữa thuật toán và câu lệnh; lập trình chắp vá không theo kịch bản.',
            'Có kịch bản nhưng ghép lệnh chưa ăn khớp; nhân vật hoạt động không đúng dự kiến.',
            'Chuyển đổi chính xác từng bước thuật toán thành các khối lệnh tương ứng trong phần mềm lập trình trực quan.',
            'Thiết kế kịch bản sáng tạo, logic chặt chẽ, tối ưu hóa các khối lệnh ngắn gọn, hiệu quả.',
          ],
        ],
        [
          'Kỹ năng sử dụng các nhóm lệnh (Sự kiện, Chuyển động, Điều khiển, Bút vẽ)',
          35,
          [
            'Chưa biết dùng khối sự kiện khởi động (Khi bấm vào lá cờ xanh); ghép sai thứ tự khối lệnh.',
            'Dùng được lệnh chuyển động nhưng chưa làm chủ được khối lệnh lặp (Repeat / Forever) hoặc biến số.',
            'Sử dụng thành thạo các nhóm lệnh: Sự kiện, Chuyển động, Bút vẽ, Lặp và Rẽ nhánh theo đúng yêu cầu đề bài.',
            'Làm chủ hoàn hảo các khối lệnh nâng cao, xử lý va chạm, tọa độ và biến số mượt mà, chuyên nghiệp.',
          ],
        ],
        [
          'Kỹ năng kiểm thử, phát hiện lỗi và gỡ lỗi (Debugging)',
          20,
          [
            'Khi chương trình chạy sai thì lúng túng, không biết tìm nguyên nhân.',
            'Phát hiện có lỗi nhưng phải nhờ giáo viên trợ giúp mới sửa được.',
            'Độc lập phát hiện vị trí câu lệnh bị sai logic và chỉnh sửa thành công để chương trình chạy đúng.',
            'Kỹ năng gỡ lỗi điêu luyện, thử nghiệm nhiều phương án cải tiến chương trình tối ưu hơn.',
          ],
        ],
        [
          'Báo cáo sản phẩm, Năng lực AI & Lưu tệp dự án',
          15,
          [
            'Chưa chụp được ảnh khối lệnh chèn vào báo cáo Word; lưu tệp dự án sai.',
            'Có ảnh khối lệnh nhưng chú thích chưa rõ ràng; tệp lưu gần đúng tên.',
            'Chèn ảnh kịch bản lệnh rõ nét vào tài liệu Word, có giải thích hoạt động; lưu tệp MAHS_Bai17 đúng quy ước.',
            'Tự hào giới thiệu sản phẩm; liên hệ kiến thức lập trình với cách AI sinh mã tự động; bài nộp xuất sắc.',
          ],
        ],
      ],
    };
  }

  // 15. TOPIC: Bảng tính điện tử Excel (Khối 7: Bài 6, 7, 8, 9, 10)
  if (titleLower.includes('bảng tính') || titleLower.includes('excel') || (Number(lesson.grade) === 7 && ['Bài 6', 'Bài 7', 'Bài 8', 'Bài 9', 'Bài 10'].includes(code))) {
    return {
      title: `${code} – ${title}`,
      weights: [30, 35, 20, 15],
      criteria: [
        [
          'Cấu trúc bảng dữ liệu & Định dạng dữ liệu số / tiền tệ / ngày tháng',
          30,
          [
            'Chưa nhập đúng dữ liệu; sai kiểu dữ liệu (nhập số thành văn bản); bảng biểu xộc xệch.',
            'Nhập đủ dữ liệu nhưng chưa định dạng phân cách hàng nghìn hoặc chưa căn chỉnh đúng kiểu số/chữ.',
            'Tạo bảng chuẩn cấu trúc; định dạng chính xác kiểu số, số thập phân, tiền tệ; căn phải số, căn trái chữ.',
            'Trình bày bảng tính chuyên nghiệp, định dạng có điều kiện (Conditional Formatting) làm nổi bật dữ liệu quan trọng.',
          ],
        ],
        [
          'Sử dụng công thức và hàm tính toán (SUM, AVERAGE, MAX, MIN, COUNT, IF)',
          35,
          [
            'Tính toán bằng cách nhập số thủ công thay vì dùng công thức hoặc viết sai cú pháp hàm.',
            'Dùng được hàm SUM nhưng chưa biết dùng AVERAGE hoặc nhầm lẫn địa chỉ tương đối/tuyệt đối khi sao chép công thức.',
            'Sử dụng chính xác các hàm thống kê theo yêu cầu đề bài; sao chép công thức thành thạo cho toàn cột.',
            'Vận dụng linh hoạt các hàm lồng nhau (IF, AND, OR, VLOOKUP); công thức tính toán tự động chuẩn xác 100%.',
          ],
        ],
        [
          'Trực quan hóa dữ liệu bằng Biểu đồ (Charts)',
          20,
          [
            'Chưa vẽ được biểu đồ hoặc chọn sai vùng dữ liệu dẫn đến biểu đồ vô nghĩa.',
            'Vẽ được biểu đồ nhưng chọn sai dạng biểu đồ (ví dụ số liệu cơ cấu lại chọn biểu đồ đường).',
            'Chọn đúng dạng biểu đồ (Cột, Tròn, Đường) phù hợp với mục đích so sánh; có tiêu đề biểu đồ và nhãn dữ liệu rõ ràng.',
            'Biểu đồ trực quan, phối màu hài hòa, có chú giải rõ ràng; phân tích và rút ra nhận xét sâu sắc từ biểu đồ.',
          ],
        ],
        [
          'In ấn bảng tính, Năng lực AI & Lưu trữ tệp',
          15,
          [
            'Bảng in bị tràn sang nhiều trang; đặt tên tệp sai quy định.',
            'Thiết lập trang in tương đối nhưng chữ còn bị che khuất; lưu tệp chưa chuẩn.',
            'Thiết lập vùng in (Print Area), vừa vặn trên trang giấy A4; hiểu AI phân tích bảng tính tự động; lưu đúng tệp quy định.',
            'Bài làm xuất sắc, hoàn thiện sớm; kỹ năng bảng tính vững vàng, sẵn sàng ứng dụng quản lý số liệu thực tế.',
          ],
        ],
      ],
    };
  }

  // 16. TOPIC: Bài trình chiếu PowerPoint (Khối 7: Bài 11, 12, 13)
  if (titleLower.includes('trình chiếu') || titleLower.includes('powerpoint') || (Number(lesson.grade) === 7 && ['Bài 11', 'Bài 12', 'Bài 13'].includes(code))) {
    return {
      title: `${code} – ${title}`,
      weights: [30, 30, 25, 15],
      criteria: [
        [
          'Cấu trúc phân cấp và nội dung bài trình chiếu',
          30,
          [
            'Nội dung quá nhiều chữ; không có cấu trúc phân cấp (tiêu đề, ý chính, ý phụ); thiếu slide kết luận.',
            'Có phân cấp nhưng slide còn dàn trải, chưa cô đọng thành các gạch đầu dòng ngắn gọn.',
            'Tổ chức bài trình chiếu mạch lạc theo cấu trúc phân cấp rõ ràng; nội dung súc tích, giàu thông tin.',
            'Nội dung xuất sắc, logic lôi cuốn; thông điệp truyền cảm hứng mạnh mẽ; cấu trúc slide bài bản.',
          ],
        ],
        [
          'Định dạng đối tượng, hình ảnh & Mẫu bố cục (Layout/Theme)',
          30,
          [
            'Màu chữ trùng màu nền khó đọc; hình ảnh chèn tùy tiện, méo hình; dùng quá nhiều kiểu phông chữ.',
            'Đọc được nhưng chưa áp dụng Theme thống nhất; hình ảnh minh họa chưa thực sự ăn khớp với nội dung.',
            'Áp dụng Theme trang nhã; độ tương phản chữ và nền tốt; chèn hình ảnh minh họa sắc nét, đúng chủ đề.',
            'Thiết kế đồ họa slide đẳng cấp, phối màu chuyên nghiệp, bố cục không gian trống hài hòa, ấn tượng.',
          ],
        ],
        [
          'Hiệu ứng chuyển trang (Transitions) và hiệu ứng đối tượng (Animations)',
          25,
          [
            'Lạm dụng hiệu ứng quá đà gây rối mắt, mất tập trung hoặc không thiết lập bất kỳ hiệu ứng nào.',
            'Có hiệu ứng nhưng thứ tự xuất hiện chưa hợp lý; tốc độ hiệu ứng quá chậm hoặc quá nhanh.',
            'Sử dụng hiệu ứng chuyển trang và xuất hiện đối tượng hợp lý, nhịp nhàng, hỗ trợ người nghe theo dõi bài.',
            'Phối hợp hiệu ứng điêu luyện, tinh tế; làm nổi bật trọng tâm bài thuyết trình một cách thuyết phục.',
          ],
        ],
        [
          'Kỹ năng xuất bản, Năng lực AI & Lưu tệp bài làm',
          15,
          [
            'Không lưu được tệp đúng định dạng bài trình chiếu; nộp bài muộn.',
            'Lưu được tệp nhưng chưa kiểm tra khả năng trình chiếu F5; tên tệp chưa chuẩn.',
            'Kiểm tra bài trình chiếu mượt mà khi bấm F5; hiểu AI hỗ trợ gợi ý thiết kế slide; lưu tệp đúng quy định.',
            'Tự tin thuyết trình thử nghiệm; chủ động xuất thêm bản handout PDF tóm tắt; bài làm mẫu mực.',
          ],
        ],
      ],
    };
  }

  // 17. TOPIC: Kiểm tra định kỳ (Giữa HK1, Cuối HK1, Giữa HK2, Cuối HK2)
  if (titleLower.includes('kiểm tra') || titleLower.includes('ôn tập') || code.startsWith('KT')) {
    return {
      title: `${code} – ${title}`,
      weights: [30, 40, 20, 10],
      criteria: [
        [
          'Nắm vững kiến thức trọng tâm (Lý thuyết / Trắc nghiệm)',
          30,
          [
            'Trả lời sai nhiều câu hỏi trắc nghiệm kiến thức cốt lõi; chưa hiểu khái niệm cơ bản.',
            'Đạt từ 50% - 70% số câu hỏi lý thuyết; còn nhầm lẫn một số câu hỏi phân loại nâng cao.',
            'Làm đúng đa số các câu hỏi trắc nghiệm và câu hỏi tự luận ngắn; nắm vững kiến thức toàn kỳ.',
            'Đạt điểm tối đa phần lý thuyết; giải thích chính xác, thấu đáo mọi câu hỏi vận dụng cao.',
          ],
        ],
        [
          'Kỹ năng thực hành tổng hợp trên máy tính theo yêu cầu đề bài',
          40,
          [
            'Chưa hoàn thành nhiệm vụ thực hành chính; thao tác chậm, sai sót nhiều bước kỹ thuật.',
            'Hoàn thành một phần bài thực hành nhưng chưa xong các yêu cầu nâng cao.',
            'Thực hiện đầy đủ, chuẩn xác tất cả các nhiệm vụ thực hành được giao trong thời gian quy định.',
            'Thao tác thuần thục, chính xác tuyệt đối; hoàn thành trọn vẹn sản phẩm thực hành xuất sắc.',
          ],
        ],
        [
          'Chất lượng sản phẩm thực hành & Tính thẩm mỹ, chính xác',
          20,
          [
            'Sản phẩm còn nhiều lỗi định dạng, sai số liệu hoặc lỗi chính tả.',
            'Sản phẩm đạt yêu cầu cơ bản nhưng tính thẩm mỹ chưa cao; căn chỉnh còn lệch.',
            'Sản phẩm hoàn thiện đẹp mắt, căn chỉnh cân đối, không có lỗi chính tả, số liệu chính xác 100%.',
            'Sản phẩm có tính sáng tạo nổi bật, tính thẩm mỹ cao, thể hiện năng lực tin học vượt trội.',
          ],
        ],
        [
          'Ý thức làm bài, kỷ luật phòng thi & Quy ước lưu tệp nộp bài',
          10,
          [
            'Vi phạm quy chế phòng máy; lưu sai vị trí hoặc sai tên tệp nộp bài.',
            'Tuân thủ quy chế nhưng nộp bài sát giờ; tên tệp còn thiếu thông tin.',
            'Nghiêm túc làm bài độc lập; lưu tệp đúng cú pháp MAHS_TenDe và nộp đúng hạn.',
            'Tác phong học sinh chuẩn mực; hoàn thành bài trước hạn, kiểm tra kỹ lưỡng trước khi nộp.',
          ],
        ],
      ],
    };
  }

  // DEFAULT / CUSTOM LESSON: Extract from lesson's actual objectives
  const lines = obj.split(/[\n;.-]+/).map((s) => s.trim()).filter((s) => s.length > 5);
  const core1 = lines[0] || `Nắm vững kiến thức cốt lõi của bài học ${title}`;
  const core2 = lines[1] || `Thực hiện thành thạo các thao tác thực hành chuyên môn`;
  const core3 = lines[2] || `Năng lực số: Tạo và trình bày sản phẩm số khoa học, trực quan`;
  const core4 = lines[3] || `Năng lực AI: Kiểm tra, hoàn thiện và lưu trữ bài làm an toàn`;

  return {
    title: `${code} – ${title}`,
    weights: [35, 30, 20, 15],
    criteria: [
      [
        `Kiến thức cốt lõi: ${title.slice(0, 35)}`,
        35,
        [
          `Chưa nắm được nội dung cơ bản của ${title}; còn nhiều sai sót.`,
          `Nắm được một phần kiến thức nhưng vận dụng còn lúng túng.`,
          `Hiểu và trình bày đúng chuẩn kiến thức: ${core1.slice(0, 75)}.`,
          `Làm chủ hoàn hảo kiến thức, giải thích sâu sắc và liên hệ thực tế phong phú.`,
        ],
      ],
      [
        `Kỹ năng thực hành & Thao tác công cụ`,
        30,
        [
          `Chưa thực hiện được các thao tác kỹ thuật cơ bản của bài học.`,
          `Thực hiện được thao tác nhưng còn chậm và cần sự hướng dẫn.`,
          `Thao tác kỹ thuật chính xác, độc lập: ${core2.slice(0, 75)}.`,
          `Thao tác thành thạo, khéo léo, tối ưu hóa các bước thực hiện.`,
        ],
      ],
      [
        `Năng lực số & Trình bày sản phẩm`,
        20,
        [
          `Sản phẩm rời rạc, chưa đúng quy cách hoặc bố cục luộm thuộm.`,
          `Trình bày được sản phẩm nhưng tính trực quan và thẩm mỹ còn hạn chế.`,
          `Sản phẩm rõ ràng, khoa học: ${core3.slice(0, 75)}.`,
          `Sản phẩm chuyên nghiệp, sáng tạo, trực quan, thẩm mỹ xuất sắc.`,
        ],
      ],
      [
        `Năng lực AI, Tự đánh giá & Hoàn thiện tệp`,
        15,
        [
          `Chưa hoàn thành tệp bài làm hoặc lưu sai quy ước.`,
          `Hoàn thành sản phẩm nhưng chưa rà soát kỹ lỗi chính tả.`,
          `Kiểm tra kỹ lưỡng, lưu đúng tệp: ${core4.slice(0, 75)}.`,
          `Chủ động tự đánh giá theo Rubric, hoàn thiện xuất sắc và nộp đúng hạn.`,
        ],
      ],
    ],
  };
}

/**
 * Concrete Word Practice Task Generator
 * Generates specific, non-generic practice tasks with real text passages, actual tables,
 * precise numbers, exact formatting, and file-naming conventions for each lesson.
 */
export function generateConcreteTaskForLesson(
  lesson: CurriculumLesson,
  criteria: Criterion[],
  customStyle?: string
): string {
  const g = Number(lesson.grade) || 6;
  const code = (lesson.code || 'Bài 1').trim();
  const title = (lesson.title || '').trim();
  const titleLower = title.toLowerCase();

  const rubricText = criteria
    .map(
      (c, i) =>
        `TC${i + 1} (${c[0]} - ${c[1]}%):\n  - Mức 1: ${c[2][0]}\n  - Mức 2: ${c[2][1]}\n  - Mức 3: ${c[2][2]}\n  - Mức 4: ${c[2][3]}`
    )
    .join('\n\n');

  // Specific task 1: Bài 1 Tin 6 (Thông tin và dữ liệu)
  if (titleLower.includes('thông tin và dữ liệu') || (code === 'Bài 1' && g === 6)) {
    return `UBND THÀNH PHỐ / TRƯỜNG PHỔ THÔNG THỰC HÀNH SƯ PHẠM
BỘ MÔN: TIN HỌC KHỐI 6 – NĂM HỌC 2026 - 2027

ĐỀ KIỂM TRA THỰC HÀNH TRÊN MÁY TÍNH (45 PHÚT)
Chủ đề: ${code} – ${title}
(Thực hiện trên Microsoft Word – Đánh giá theo chuẩn Rubric GDPT 2018)

Họ và tên học sinh: .................................................... Lớp: ................
Mã học sinh: .................................... Máy tính số: ............

I. MỤC TIÊU CẦN ĐẠT CỦA BÀI HỌC
- Phân biệt chính xác giữa Thông tin và Dữ liệu; xác định được Vật mang tin và tầm quan trọng của thông tin.
- Năng lực số: Nhận biết nhu cầu thông tin, phân loại dữ liệu số.
- Năng lực AI: Nhận biết AI cần dữ liệu đầu vào do con người cung cấp để xử lý và tạo kết quả.

II. NỘI DUNG VÀ NHIỆM VỤ THỰC HÀNH CỤ THỂ

Nhiệm vụ 1: Thiết lập trang văn bản và tiêu đề bài làm (15 điểm)
1. Mở phần mềm Microsoft Word, tạo một tài liệu mới (Blank Document).
2. Thiết lập lề trang giấy (Margins): Top 2cm, Bottom 2cm, Left 2.5cm, Right 2cm.
3. Gõ tiêu đề bằng chữ in hoa, in đậm, cỡ chữ 16pt, căn giữa trang:
   "PHIẾU KHẢO SÁT VÀ PHÂN TÍCH THÔNG TIN - DỮ LIỆU ĐỜI SỐNG"
4. Thêm dòng thông tin học sinh: Họ tên, Lớp, Mã số học sinh ngay dưới tiêu đề.

Nhiệm vụ 2: Tạo bảng phân loại tình huống thực tế (40 điểm)
Chèn một bảng biểu gồm 5 CỘT và 5 HÀNG, nhập đầy đủ và chính xác dữ liệu phân tích cho 4 tình huống sau:

| STT | Tình huống quan sát trong thực tế | Vật mang tin | Dữ liệu thu nhận được | Thông tin rút ra & Hành động xử lý |
| 1 | Tiếng trống trường vang lên từng hồi dồn dập "Tùng! Tùng! Tùng!" | Sóng âm thanh, mặt trống | Âm thanh tiếng trống vang to | Đã đến giờ vào lớp, học sinh nhanh chóng di chuyển vào phòng học |
| 2 | Đèn tín hiệu giao thông tại ngã tư chuyển sang màu Đỏ | Cột đèn giao thông | Tín hiệu ánh sáng màu đỏ | Dừng phương tiện lại trước vạch quy định để đảm bảo an toàn |
| 3 | Màn hình nhiệt kế điện tử phòng học hiển thị con số "16°C" | Màn hình LED nhiệt kế | Con số 16 và ký hiệu °C | Thời tiết đang rất lạnh, cần mặc thêm áo ấm và đóng cửa sổ phòng |
| 4 | Bảng tin điện tử của trường có thông báo "Học sinh nghỉ học Thứ Hai" | Màn hình LCD bảng tin | Dòng chữ văn bản tiếng Việt | Nắm được lịch nghỉ học để sắp xếp thời gian tự ôn tập tại nhà |

Yêu cầu định dạng bảng:
- Hàng tiêu đề: In đậm, cỡ chữ 12pt, căn giữa theo cả chiều ngang và dọc, tô màu nền xám nhạt (Shading 20%).
- Cột 1 (STT): Căn giữa. Cột 2, 3, 4, 5: Căn trái hoặc căn giữa phù hợp, điều chỉnh độ rộng cột hài hòa.
- Kẻ viền bảng: Viền bao ngoài dùng nét đôi 1.5pt, viền ngăn cách bên trong nét đơn 0.75pt.

Nhiệm vụ 3: Viết đoạn phân tích khái niệm và liên hệ Năng lực AI (35 điểm)
Gõ đoạn văn bản sau (cỡ chữ 13pt, Times New Roman, dãn dòng 1.3 lines, căn đều hai bên Justify):
1. Phân tích: "Dữ liệu là các số liệu, ký hiệu, hình ảnh, âm thanh được con người hoặc thiết bị ghi lại. Khi dữ liệu được xử lý, sắp xếp và đem lại ý nghĩa hiểu biết cho con người thì trở thành thông tin. Ví dụ, các chữ số rời rạc 1, 6, °C là dữ liệu; còn biết nhiệt độ 16°C rất lạnh để mặc áo ấm chính là thông tin."
2. Liên hệ AI: "Trí tuệ nhân tạo (AI) hoạt động dựa trên việc thu nhận một khối lượng dữ liệu khổng lồ do con người cung cấp (như bài viết, hình ảnh, mã nguồn). Nếu không có dữ liệu đầu vào chất lượng, các hệ thống AI sẽ không thể học tập và không thể đưa ra kết quả chính xác."

Nhiệm vụ 4: Kiểm tra và lưu tệp bài làm (10 điểm)
- Rà soát sạch lỗi chính tả tiếng Việt.
- Lưu tệp bài làm vào thư mục bài tập với định dạng chuẩn: MAHS_Bai1_ThongTin.docx
  (Ví dụ: Học sinh mã 61001 lưu tên: 61001_Bai1_ThongTin.docx).

III. BẢNG RUBRIC ĐỐI CHIẾU KẾT QUẢ ĐÁNH GIÁ
${rubricText}`;
  }

  // Specific task 2: Bài 11 Tin 6 (Định dạng văn bản)
  if (titleLower.includes('định dạng văn bản') || (code === 'Bài 11' && g === 6)) {
    return `UBND THÀNH PHỐ / TRƯỜNG PHỔ THÔNG THỰC HÀNH SƯ PHẠM
BỘ MÔN: TIN HỌC KHỐI 6 – NĂM HỌC 2026 - 2027

ĐỀ KIỂM TRA THỰC HÀNH TRÊN MÁY TÍNH (45 PHÚT)
Chủ đề: ${code} – ${title}
(Thực hành Word: Định dạng ký tự, đoạn văn bản, lề trang và hiệu ứng)

Họ và tên học sinh: .................................................... Lớp: ................
Mã học sinh: .................................... Máy tính số: ............

I. MỤC TIÊU CẦN ĐẠT CỦA BÀI HỌC
- Biết tác dụng của việc căn lề và định dạng văn bản; thực hiện thành thạo định dạng ký tự, định dạng đoạn và in ấn.
- Năng lực số: Xác định nhu cầu cá nhân trong trình bày văn bản khoa học, trang nhã.
- Năng lực AI: Trải nghiệm công cụ kiểm tra lỗi, hoàn thiện bố cục văn bản chuẩn mực.

II. NỘI DUNG VÀ NHIỆM VỤ THỰC HÀNH CỤ THỂ

Nhiệm vụ 1: Soạn thảo văn bản thô (20 điểm)
Mở Microsoft Word, nhập chính xác đoạn văn bản sau (chưa cần định dạng vội):

NỘI QUY PHÒNG THỰC HÀNH TIN HỌC VÀ KHÔNG GIAN SỐ
Phòng thực hành Tin học là không gian học tập nghiên cứu công nghệ hiện đại. Để đảm bảo an toàn thiết bị và phát huy hiệu quả học tập, toàn thể học sinh cần nghiêm túc chấp hành các quy định sau:
Một là, trang phục chỉnh tề, ngồi đúng vị trí máy tính được phân công. Tuyệt đối không mang đồ ăn, nước uống hoặc các vật dễ gây cháy nổ vào phòng máy.
Hai là, tuân thủ đúng quy trình khởi động và tắt máy tính. Không tự ý cắm rút dây cáp nguồn, cáp mạng hoặc thay đổi cấu hình phần cứng của nhà trường.
Ba là, chỉ sử dụng Internet và các phần mềm phục vụ cho bài học. Tuyệt đối không tải các tệp tin không rõ nguồn gốc, không truy cập trang web xấu hoặc phát tán thông tin độc hại.
Bốn là, luôn có ý thức bảo mật tài khoản cá nhân, sao lưu bài làm đúng thư mục và tắt máy gọn gàng trước khi rời khỏi phòng học.

Nhiệm vụ 2: Thực hiện định dạng ký tự và đoạn văn (40 điểm)
1. Tiêu đề văn bản "NỘI QUY PHÒNG THỰC HÀNH TIN HỌC VÀ KHÔNG GIAN SỐ":
   - Phông chữ: Arial hoặc Times New Roman, In hoa (UPPERCASE), In đậm (Bold).
   - Cỡ chữ: 16pt, Căn giữa trang (Center), Màu chữ: Xanh dương đậm (Dark Blue).
2. Đoạn văn giới thiệu:
   - Phông chữ: Times New Roman, cỡ 13pt, In nghiêng (Italic), Căn đều hai bên (Justify), Giãn dòng 1.3 lines.
3. 4 điều quy định (Một là, Hai là, Ba là, Bốn là):
   - Phông chữ: Times New Roman, cỡ 13pt, Căn đều hai bên (Justify).
   - In đậm và đổi màu đỏ cho các cụm từ đầu: "Một là,", "Hai là,", "Ba là,", "Bốn là,".
   - Thụt lề đầu dòng mỗi điều (First Line Indent): 1.27 cm (0.5 inch).
   - Khoảng cách giữa các đoạn (Spacing After): 6pt, Giãn dòng (Line Spacing): 1.25 lines.

Nhiệm vụ 3: Thiết lập bố cục trang và hiệu ứng thẩm mỹ (30 điểm)
1. Căn lề trang giấy (Margins): Top: 2cm, Bottom: 2cm, Left: 2.5cm, Right: 2cm, Khổ giấy: A4.
2. Tạo chữ cái lớn đầu dòng (Drop Cap) cho chữ "P" trong từ "Phòng thực hành...": Chiều cao 2 hàng (Lines to drop: 2).
3. Kẻ khung viền bao quanh toàn bộ đoạn văn bản (Borders and Shading): Dùng đường nét đôi thanh lịch, tô màu nền xám nhạt (Shading 10%).

Nhiệm vụ 4: Kiểm tra và lưu tệp bài nộp (10 điểm)
- Đọc lại toàn bộ để kiểm tra lỗi chính tả và dấu câu.
- Thêm chân trang (Footer): "Bài thực hành Tin học 6 - Học sinh: [Họ và tên] - Mã số: [Mã số]".
- Lưu tệp bài làm: MAHS_Bai11_DinhDang.docx (Ví dụ: 61001_Bai11_DinhDang.docx).

III. BẢNG RUBRIC ĐỐI CHIẾU KẾT QUẢ ĐÁNH GIÁ
${rubricText}`;
  }

  // Specific task 3: Bài 12 Tin 6 (Trình bày thông tin ở dạng bảng)
  if (titleLower.includes('dạng bảng') || (code === 'Bài 12' && g === 6)) {
    return `UBND THÀNH PHỐ / TRƯỜNG PHỔ THÔNG THỰC HÀNH SƯ PHẠM
BỘ MÔN: TIN HỌC KHỐI 6 – NĂM HỌC 2026 - 2027

ĐỀ KIỂM TRA THỰC HÀNH TRÊN MÁY TÍNH (45 PHÚT)
Chủ đề: ${code} – ${title}
(Thực hành tạo bảng biểu, gộp ô, định dạng viền bảng và dãn cách hàng cột)

Họ và tên học sinh: .................................................... Lớp: ................
Mã học sinh: .................................... Máy tính số: ............

I. MỤC TIÊU CẦN ĐẠT CỦA BÀI HỌC
- Hiểu ý nghĩa, tác dụng của việc trình bày thông tin dạng bảng biểu; biết chèn bảng, nhập dữ liệu, chỉnh kích thước hàng cột.
- Thực hiện thành thạo thao tác gộp ô, căn chỉnh chữ trong ô và trang trí viền bảng.
- Năng lực số: Tạo và trình bày nội dung số dạng bảng trực quan, khoa học.

II. NỘI DUNG VÀ NHIỆM VỤ THỰC HÀNH CỤ THỂ

Nhiệm vụ 1: Tiêu đề văn bản (15 điểm)
1. Khởi động Microsoft Word, mở tài liệu mới.
2. Nhập tiêu đề sau bằng chữ in hoa, in đậm, cỡ chữ 15pt, căn giữa trang:
   "BẢNG PHÂN CÔNG TRỰC NHẬT VÀ THEO DÕI THI ĐUA LỚP HỌC"
3. Dòng phụ đề: "Tuần lễ thi đua chào mừng ngày Nhà giáo Việt Nam 20/11", cỡ chữ 12pt, in nghiêng, căn giữa.

Nhiệm vụ 2: Tạo và nhập bảng dữ liệu chi tiết (40 điểm)
Chèn một bảng gồm 6 CỘT và 7 HÀNG, nhập đầy đủ và chính xác dữ liệu sau đây:

| STT | Thứ / Ngày | Nhóm phân công | Nội dung công việc vệ sinh | Điểm tự chấm | Ghi chú & Đánh giá GV |
| 1 | Thứ Hai (16/11) | Nhóm 1 (Tổ 1) | Quét dọn phòng học, lau bảng và giặt khăn lau | 10 / 10 | Hoàn thành xuất sắc, đúng giờ |
| 2 | Thứ Ba (17/11) | Nhóm 2 (Tổ 2) | Kê lại bàn ghế ngay ngắn, lau bệ cửa sổ phòng | 9.5 / 10 | Bàn ghế thẳng hàng, sạch sẽ |
| 3 | Thứ Tư (18/11) | Nhóm 3 (Tổ 3) | Thu gom rác thải, đổ rác đúng nơi quy định | 10 / 10 | Phân loại rác tái chế rất tốt |
| 4 | Thứ Năm (19/11) | Nhóm 4 (Tổ 4) | Lau sàn nhà, vệ sinh bục giảng và bàn giáo viên | 9.0 / 10 | Cần lau lại góc cuối phòng |
| 5 | Thứ Sáu (20/11) | Ban Cán sự lớp | Tưới cây xanh hành lang, trang trí bảng hoa | 10 / 10 | Trang trí bảng rất trang trọng |
| 6 | Thứ Bảy (21/11) | Cả lớp cùng làm | Tổng vệ sinh phòng máy và sắp xếp thiết bị | 10 / 10 | Tinh thần tập thể rất tích cực |

Nhiệm vụ 3: Yêu cầu định dạng bảng biểu kỹ thuật cao (35 điểm)
1. Hàng tiêu đề của bảng (Hàng 1):
   - Chữ in đậm, cỡ 12pt, căn giữa theo cả chiều ngang và chiều dọc (Align Center).
   - Tô màu nền tiêu đề: Xanh dương nhạt hoặc Xám nhạt (Shading 15% - 20%).
2. Các hàng dữ liệu (Hàng 2 đến 7):
   - Cột "STT", "Thứ / Ngày", "Điểm tự chấm": Căn giữa ô.
   - Cột "Nhóm phân công", "Nội dung công việc vệ sinh", "Ghi chú": Căn trái ô, dãn cách lề trong ô cân đối.
3. Chỉnh kích thước hàng cột:
   - Chiều cao các hàng tối thiểu 0.8 cm.
   - Điều chỉnh độ rộng các cột hợp lý để không có chữ nào bị ngắt dòng cụt ngủn.
4. Đường viền bảng (Borders):
   - Đường viền ngoài cùng bao quanh bảng: Dạng đường đôi (Double Line 1.5pt).
   - Đường kẻ phân cách bên trong: Dạng đường nét đơn mảnh (0.75pt).

Nhiệm vụ 4: Kiểm tra và lưu tệp bài làm (10 điểm)
- Kiểm tra lại toàn bộ số liệu và chính tả.
- Thêm dòng góc trên: "Học sinh: [Họ và tên] - Lớp: [Lớp] - Mã HS: [Mã số]".
- Lưu tệp bài làm: MAHS_Bai12_TrinhBayBang.docx (Ví dụ: 61001_Bai12_TrinhBayBang.docx).

III. BẢNG RUBRIC ĐỐI CHIẾU KẾT QUẢ ĐÁNH GIÁ
${rubricText}`;
  }

  // Specific task 4: Bài 15, 16 Tin 6 hoặc Thuật toán Tin 7
  if (titleLower.includes('thuật toán') || titleLower.includes('cấu trúc điều khiển') || titleLower.includes('tìm kiếm') || titleLower.includes('sắp xếp')) {
    return `UBND THÀNH PHỐ / TRƯỜNG PHỔ THÔNG THỰC HÀNH SƯ PHẠM
BỘ MÔN: TIN HỌC KHỐI ${g} – NĂM HỌC 2026 - 2027

ĐỀ KIỂM TRA THỰC HÀNH TRÊN MÁY TÍNH (45 PHÚT)
Chủ đề: ${code} – ${title}
(Thực hành xây dựng thuật toán, vẽ sơ đồ khối và lập bảng chạy thử Trace Table)

Họ và tên học sinh: .................................................... Lớp: ................
Mã học sinh: .................................... Máy tính số: ............

I. MỤC TIÊU CẦN ĐẠT CỦA BÀI HỌC
- Giải thích được ý tưởng thuật toán; biểu diễn thuật toán bằng phương pháp liệt kê và sơ đồ khối.
- Lập bảng mô phỏng (chạy thử) hoạt động của thuật toán trên một bộ dữ liệu cụ thể.
- Năng lực số: Vận dụng tư duy thuật toán để giải quyết bài toán thực tế.

II. NỘI DUNG VÀ NHIỆM VỤ THỰC HÀNH CỤ THỂ

BÀI TOÁN THỰC TẾ:
"Trường học cần xây dựng quy trình tự động xếp loại kết quả rèn luyện của học sinh dựa trên Điểm trung bình đánh giá (ĐTB).
Quy tắc xếp loại như sau:
- Nếu ĐTB >= 8.5 thì xếp loại 'Tốt'
- Nếu 6.5 <= ĐTB < 8.5 thì xếp loại 'Khá'
- Nếu 5.0 <= ĐTB < 6.5 thì xếp loại 'Đạt'
- Nếu ĐTB < 5.0 thì xếp loại 'Chưa đạt'."

Nhiệm vụ 1: Xác định bài toán và liệt kê các bước thuật toán (25 điểm)
Mở Microsoft Word và trình bày:
1. Xác định bài toán:
   - Đầu vào (Input): Điểm trung bình ĐTB của học sinh (số thực từ 0 đến 10).
   - Đầu ra (Output): Kết quả xếp loại rèn luyện tương ứng ('Tốt', 'Khá', 'Đạt', hoặc 'Chưa đạt').
2. Liệt kê các bước của thuật toán:
   - Bước 1: Nhập vào giá trị ĐTB.
   - Bước 2: Nếu ĐTB >= 8.5 thì Kết luận "Xếp loại Tốt" rồi chuyển đến Bước 6.
   - Bước 3: Nếu ĐTB >= 6.5 thì Kết luận "Xếp loại Khá" rồi chuyển đến Bước 6.
   - Bước 4: Nếu ĐTB >= 5.0 thì Kết luận "Xếp loại Đạt" rồi chuyển đến Bước 6.
   - Bước 5: Kết luận "Xếp loại Chưa đạt" và chuyển đến Bước 6.
   - Bước 6: Kết thúc thuật toán.

Nhiệm vụ 2: Vẽ sơ đồ khối (Flowchart) bằng công cụ Shapes trong Word (40 điểm)
Sử dụng các hình khối chuẩn quy ước trong Word (Insert -> Shapes):
1. Khối Bắt đầu và Kết thúc: Dùng hình Oval (Terminator).
2. Khối Nhập giá trị ĐTB và Xuất kết quả: Dùng hình Bình hành (Data/Input/Output).
3. Khối Kiểm tra điều kiện (ĐTB >= 8.5, ĐTB >= 6.5, ĐTB >= 5.0): Dùng hình Thoi (Decision).
4. Đường mũi tên kết nối chỉ rõ hướng đi: Nhánh "Đúng" (True) và nhánh "Sai" (False).
Yêu cầu vẽ ngay ngắn, các khối căn thẳng hàng, màu sắc phân biệt rõ ràng, chữ trong khối hiển thị đầy đủ.

Nhiệm vụ 3: Lập bảng chạy thử thuật toán (Trace Table) (25 điểm)
Tạo bảng gồm 5 CỘT và 5 HÀNG kiểm tra với 4 học sinh cụ thể:

| STT | Tên học sinh thử nghiệm | Giá trị ĐTB đầu vào | Các bước điều kiện được duyệt qua | Kết quả xếp loại đầu ra |
| 1 | Nguyễn Phú Anh | 9.2 | Bước 1 -> Bước 2 (Đúng) -> Bước 6 | Xếp loại Tốt |
| 2 | Trần Mai Lan | 7.8 | Bước 1 -> Bước 2 (Sai) -> Bước 3 (Đúng) -> Bước 6 | Xếp loại Khá |
| 3 | Lê Hoàng Nam | 5.5 | Bước 1 -> Bước 2 (Sai) -> Bước 3 (Sai) -> Bước 4 (Đúng) -> Bước 6 | Xếp loại Đạt |
| 4 | Phạm Đức Minh | 4.2 | Bước 1 -> Bước 2, 3, 4 (Đều Sai) -> Bước 5 -> Bước 6 | Xếp loại Chưa đạt |

Nhiệm vụ 4: Kiểm tra và lưu tệp bài nộp (10 điểm)
- Rà soát lại sơ đồ khối và bảng kiểm thử.
- Lưu tệp bài làm: MAHS_${code.replace(/\s+/g, '')}_ThuatToan.docx
  (Ví dụ: 61001_${code.replace(/\s+/g, '')}_ThuatToan.docx).

III. BẢNG RUBRIC ĐỐI CHIẾU KẾT QUẢ ĐÁNH GIÁ
${rubricText}`;
  }

  // Specific task 5: Bảng tính Excel Khối 7
  if (titleLower.includes('bảng tính') || (g === 7 && ['Bài 6', 'Bài 7', 'Bài 8', 'Bài 9', 'Bài 10'].includes(code))) {
    return `UBND THÀNH PHỐ / TRƯỜNG PHỔ THÔNG THỰC HÀNH SƯ PHẠM
BỘ MÔN: TIN HỌC KHỐI 7 – NĂM HỌC 2026 - 2027

ĐỀ KIỂM TRA THỰC HÀNH TRÊN MÁY TÍNH (45 PHÚT)
Chủ đề: ${code} – ${title}
(Thực hành xử lý dữ liệu bảng tính, thiết lập công thức hàm thống kê và biểu đồ)

Họ và tên học sinh: .................................................... Lớp: ................
Mã học sinh: .................................... Máy tính số: ............

I. MỤC TIÊU CẦN ĐẠT CỦA BÀI HỌC
- Thực hiện định dạng dữ liệu số, căn chỉnh bảng tính rõ ràng, thẩm mỹ.
- Sử dụng thành thạo các hàm tính toán cơ bản: SUM, AVERAGE, MAX, MIN.
- Năng lực số: Tự thiết kế và xử lý bảng tính phục vụ nhu cầu thực tế.

II. NỘI DUNG VÀ NHIỆM VỤ THỰC HÀNH CỤ THỂ

Nhiệm vụ 1: Nhập bảng dữ liệu khảo sát chi phí dự án (30 điểm)
Mở phần mềm Bảng tính (Excel / Calc), nhập bảng dữ liệu sau:

| STT | Tên hạng mục thiết bị | Đơn vị tính | Số lượng | Đơn giá (VNĐ) | Thành tiền (VNĐ) | Ghi chú |
| 1 | Bộ máy tính để bàn học tập | Bộ | 10 | 8500000 | (Dùng công thức) | Đã kiểm định |
| 2 | Máy in Laser văn phòng | Cái | 2 | 4200000 | (Dùng công thức) | Bản in sắc nét |
| 3 | Thiết bị phát Wi-Fi tốc độ cao | Chiếc | 4 | 1250000 | (Dùng công thức) | Vùng phủ rộng |
| 4 | Bàn ghế phòng máy chuyên dụng | Bộ | 10 | 1800000 | (Dùng công thức) | Gỗ công nghiệp |
| 5 | Dây cáp mạng CAT6 đúc sẵn | Cuộn | 5 | 650000 | (Dùng công thức) | Chống nhiễu |
| - | TỔNG CỘNG CHI PHÍ DỰ ÁN | - | - | - | (Dùng hàm SUM) | - |
| - | CHI PHÍ TRUNG BÌNH MỖI MỤC | - | - | - | (Dùng hàm AVERAGE) | - |
| - | CHI PHÍ CAO NHẤT | - | - | - | (Dùng hàm MAX) | - |
| - | CHI PHÍ THẤP NHẤT | - | - | - | (Dùng hàm MIN) | - |

Nhiệm vụ 2: Thiết lập công thức và hàm thống kê (35 điểm)
1. Cột "Thành tiền (VNĐ)": Dùng công thức = Số lượng * Đơn giá (Ví dụ ô F2 = D2 * E2) rồi sao chép xuống cho các dòng còn lại.
2. Dòng "TỔNG CỘNG CHI PHÍ DỰ ÁN": Dùng hàm =SUM(...) tính tổng toàn bộ cột Thành tiền.
3. Dòng "CHI PHÍ TRUNG BÌNH MỖI MỤC": Dùng hàm =AVERAGE(...) tính giá trị trung bình cột Thành tiền.
4. Dòng "CHI PHÍ CAO NHẤT" và "CHI PHÍ THẤP NHẤT": Dùng hàm =MAX(...) và =MIN(...).

Nhiệm vụ 3: Định dạng hiển thị chuyên nghiệp (25 điểm)
1. Định dạng kiểu số tiền tệ: Phân cách hàng nghìn (ví dụ 8,500,000) cho toàn bộ các cột Đơn giá và Thành tiền.
2. Căn lề: Cột STT căn giữa, Tên hạng mục căn trái, Đơn vị tính căn giữa, Số lượng căn giữa, Tiền căn phải.
3. Tô màu nền: Tiêu đề cột tô màu xanh nhạt, dòng Tổng cộng tô màu vàng nhạt in đậm. Kẻ đường viền bảng rõ ràng.

Nhiệm vụ 4: Kiểm tra và lưu tệp (10 điểm)
- Sao chép toàn bộ bảng tính và dán vào file Word báo cáo hoặc lưu tệp bảng tính theo quy ước:
  MAHS_${code.replace(/\s+/g, '')}_BangTinh.xlsx (hoặc .docx).

III. BẢNG RUBRIC ĐỐI CHIẾU KẾT QUẢ ĐÁNH GIÁ
${rubricText}`;
  }

  // Specific task 6: Bài trình chiếu PowerPoint Khối 7
  if (titleLower.includes('trình chiếu') || (g === 7 && ['Bài 11', 'Bài 12', 'Bài 13'].includes(code))) {
    return `UBND THÀNH PHỐ / TRƯỜNG PHỔ THÔNG THỰC HÀNH SƯ PHẠM
BỘ MÔN: TIN HỌC KHỐI 7 – NĂM HỌC 2026 - 2027

ĐỀ KIỂM TRA THỰC HÀNH TRÊN MÁY TÍNH (45 PHÚT)
Chủ đề: ${code} – ${title}
(Thực hành thiết kế bài trình chiếu đa phương tiện, phân cấp tiêu đề và hiệu ứng)

Họ và tên học sinh: .................................................... Lớp: ................
Mã học sinh: .................................... Máy tính số: ............

I. MỤC TIÊU CẦN ĐẠT CỦA BÀI HỌC
- Tạo được bài trình chiếu có tiêu đề, cấu trúc phân cấp mạch lạc.
- Chèn và định dạng hợp lý hình ảnh, văn bản; áp dụng hiệu ứng chuyển trang và hiệu ứng động vừa phải.
- Năng lực số: Trình bày ý tưởng số thuyết phục, phục vụ báo cáo dự án học tập.

II. NỘI DUNG VÀ NHIỆM VỤ THỰC HÀNH CỤ THỂ

CHỦ ĐỀ BÁO CÁO: "TRƯỜNG HỌC XANH – NÓI KHÔNG VỚI RÁC THẢI NHỰA"

Nhiệm vụ 1: Thiết kế cấu trúc 4 Slide trình chiếu (40 điểm)
Khởi động phần mềm PowerPoint, tạo 4 trang chiếu với nội dung cụ thể sau:

Trang 1: Trang tiêu đề (Title Slide)
- Tiêu đề chính: "DỰ ÁN HÀNH ĐỘNG: TRƯỜNG HỌC XANH" (Chữ in hoa, cỡ 40pt, in đậm, màu xanh lá cây đậm).
- Tiêu đề phụ: "Chung tay loại bỏ rác thải nhựa dùng một lần", cỡ 24pt, in nghiêng.
- Thông tin tác giả: "Người thực hiện: [Họ và tên học sinh] - Lớp 7...".

Trang 2: Thực trạng rác thải nhựa học đường (Title and Content)
- Tiêu đề trang: "1. THỰC TRẠNG ĐÁNG BÁO ĐỘNG TẠI TRƯỜNG HỌC"
- Nội dung phân cấp:
  + Mỗi ngày có hàng trăm chai nhựa, hộp xốp, ống hút bị vứt bỏ sau giờ ra chơi.
  + Rác thải nhựa mất từ 100 đến 500 năm mới có thể phân hủy trong tự nhiên.
  + Thói quen sử dụng đồ nhựa tiện lợi gây ô nhiễm cảnh quan và nguy cơ cho sức khỏe.
- Chèn 1 hình ảnh minh họa về rác thải nhựa hoặc thùng rác trường học.

Trang 3: Giải pháp hành động thiết thực (Two Content)
- Tiêu đề trang: "2. HÀNH ĐỘNG NHỎ - THAY ĐỔI LỚN CỦA CHÚNG TA"
- Cột bên trái (Văn bản phân cấp):
  + Mang theo bình nước cá nhân bằng kim loại hoặc thủy tinh tái sử dụng.
  + Thay thế ống hút nhựa bằng ống hút giấy hoặc ống hút inox.
  + Phân loại rác tại nguồn: Rác hữu cơ, rác tái chế và rác vô cơ.
- Cột bên phải: Chèn một bảng biểu nhỏ thống kê số lượng chai nhựa giảm được sau mỗi tuần.

Trang 4: Thông điệp kêu gọi (Section Header hoặc Blank)
- Tiêu đề: "HÃY HÀNH ĐỘNG VÌ MỘT TƯƠNG LAI XANH TƯƠI ĐẸP!"
- Đoạn thông điệp ngắn 3 dòng kêu gọi các bạn học sinh tham gia phong trào bảo vệ môi trường.

Nhiệm vụ 2: Định dạng Theme, phông chữ và hình ảnh (30 điểm)
1. Chọn một mẫu thiết kế (Theme trong thẻ Design) trang nhã, màu sắc chủ đạo xanh lá cây hoặc xanh da trời.
2. Thống nhất phông chữ chuẩn (Arial hoặc Calibri hoặc Times New Roman) cho toàn bộ 4 trang chiếu.
3. Định dạng hình ảnh: Chèn viền ảnh mỏng, bo tròn góc nhẹ nhàng, không để ảnh méo tỷ lệ.

Nhiệm vụ 3: Thiết lập hiệu ứng chuyển động vừa phải (20 điểm)
1. Hiệu ứng chuyển trang (Transitions): Áp dụng hiệu ứng nhẹ nhàng (Fade hoặc Push hoặc Wipe) với thời gian 1.0 giây cho tất cả các slide.
2. Hiệu ứng đối tượng (Animations): Áp dụng hiệu ứng xuất hiện (Appear hoặc Fade) cho các dòng gạch đầu dòng để trình chiếu lần lượt khi thuyết trình.

Nhiệm vụ 4: Kiểm tra và lưu tệp bài làm (10 điểm)
- Bấm phím F5 để trình chiếu thử nghiệm toàn bộ bài thuyết trình từ đầu đến cuối.
- Lưu tệp bài làm: MAHS_${code.replace(/\s+/g, '')}_TrinhChieu.pptx (hoặc dán báo cáo tóm tắt vào .docx).

III. BẢNG RUBRIC ĐỐI CHIẾU KẾT QUẢ ĐÁNH GIÁ
${rubricText}`;
  }

  // Specific task 7: Kiểm tra định kỳ (Giữa kỳ / Cuối kỳ)
  if (titleLower.includes('kiểm tra') || titleLower.includes('ôn tập') || code.startsWith('KT')) {
    return `SỞ GIÁO DỤC VÀ ĐÀO TẠO / TRƯỜNG THCS & THPT THỰC HÀNH
HỘI ĐỒNG RA ĐỀ VÀ KHẢO THÍ CHẤT LƯỢNG GIÁO DỤC

ĐỀ KIỂM TRA ĐỊNH KỲ MÔN TIN HỌC KHỐI ${g} (THỜI GIAN: 45 PHÚT)
Môn thi: Tin học ${g} – Kế hoạch giáo dục 2026 - 2027
Đề bài: ${code} – ${title}
(Gồm 02 phần: Trắc nghiệm khách quan 3.0 điểm và Thực hành trên máy tính 7.0 điểm)

Họ và tên thí sinh: .................................................... Lớp: ................
Mã học sinh: .................................... Máy thi số: ............

-----------------------------------------------------------------------------------------
PHẦN I. TRẮC NGHIỆM KHÁCH QUAN (3.0 ĐIỂM – 6 CÂU HỎI)
(Học sinh đọc kỹ câu hỏi và ghi phương án chọn A, B, C hoặc D vào bảng trả lời bên dưới)

Câu 1: Thiết bị nào sau đây là thiết bị vào (Input Device) của máy tính?
A. Màn hình máy tính.        B. Bàn phím và chuột.
C. Máy in Laser.             D. Loa và tai nghe.

Câu 2: Đơn vị đo dung lượng thông tin nào sau đây có giá trị lớn nhất?
A. Byte (B)                  B. Megabyte (MB)
C. Gigabyte (GB)             D. Kilobyte (KB)

Câu 3: Trong phần mềm Microsoft Word, tổ hợp phím nào dùng để căn đều hai bên cho đoạn văn bản?
A. Ctrl + L                  B. Ctrl + R
C. Ctrl + E                  D. Ctrl + J

Câu 4: Khi tạo bảng trong phần mềm soạn thảo văn bản, thao tác "Merge Cells" có tác dụng gì?
A. Tách một ô thành nhiều ô nhỏ.         B. Gộp nhiều ô liền kề thành một ô duy nhất.
C. Xóa hoàn toàn một hàng trong bảng.    D. Chèn thêm một cột mới vào bên phải.

Câu 5: Dấu hiệu nào sau đây cảnh báo một thông tin hoặc đường liên kết có thể là lừa đảo trên mạng?
A. Được đăng tải trên cổng thông tin có đuôi tên miền .gov.vn của chính phủ.
B. Yêu cầu cung cấp mật khẩu, mã OTP và thông báo trúng thưởng số tiền lớn bất ngờ.
C. Có tên tác giả và ngày giờ xuất bản rõ ràng.
D. Được thầy cô giáo gửi trên hệ thống quản lý học tập chính thức của nhà trường.

Câu 6: Trí tuệ nhân tạo (AI) học tập và đưa ra kết quả dự đoán chủ yếu dựa vào thành phần nào sau đây?
A. Khối lượng dữ liệu huấn luyện do con người cung cấp.
B. Chỉ cần cắm điện mà không cần bất kỳ dữ liệu nào.
C. Tốc độ gõ phím của người sử dụng.
D. Độ phân giải của màn hình máy tính.

BẢNG TRẢ LỜI TRẮC NGHIỆM:
| Câu hỏi | Câu 1 | Câu 2 | Câu 3 | Câu 4 | Câu 5 | Câu 6 |
| Phương án chọn | ... | ... | ... | ... | ... | ... |

-----------------------------------------------------------------------------------------
PHẦN II. THỰC HÀNH TRÊN MÁY TÍNH (7.0 ĐIỂM)

Nhiệm vụ 1: Soạn thảo và định dạng văn bản (3.0 điểm)
1. Mở phần mềm soạn thảo Word, nhập đoạn văn sau:
   "KỶ NGUYÊN SỐ VÀ TRÁCH NHIỆM CỦA HỌC SINH CHÚNG TA
   Công nghệ số và trí tuệ nhân tạo đang làm thay đổi sâu sắc cách con người học tập, lao động và kết nối. Là những chủ nhân tương lai của đất nước, học sinh cần trang bị kỹ năng tin học vững vàng, tư duy sáng tạo và ý thức trách nhiệm khi tham gia không gian mạng. Hãy sử dụng công nghệ như một công cụ hỗ trợ đắc lực để mở rộng hiểu biết và đóng góp tích cực cho xã hội."
2. Định dạng:
   - Tiêu đề: Cỡ chữ 15pt, In hoa, In đậm, Căn giữa trang.
   - Thân bài: Cỡ chữ 13pt, Phông Times New Roman, Căn đều hai bên (Justify), Thụt đầu dòng 1.27cm, Giãn dòng 1.3 lines.

Nhiệm vụ 2: Tạo bảng dữ liệu và hoàn thiện sản phẩm (4.0 điểm)
Chèn một bảng gồm 5 CỘT và 4 HÀNG với dữ liệu thống kê sau:

| STT | Kỹ năng số cần rèn luyện | Tần suất thực hành | Mức độ tự đánh giá | Kế hoạch hoàn thiện tiếp theo |
| 1 | Soạn thảo văn bản và bảng biểu | 3 buổi / tuần | Thành thạo (Mức 4) | Tiếp tục rèn luyện tốc độ gõ phím 10 ngón |
| 2 | Tìm kiếm thông tin và thẩm định nguồn | Hàng ngày khi học | Đạt yêu cầu (Mức 3) | Học thêm các cú pháp tìm kiếm nâng cao |
| 3 | Bảo vệ mật khẩu và an toàn số | Thường xuyên | Tốt (Mức 4) | Bật xác thực 2 bước cho mọi tài khoản |

Yêu cầu định dạng bảng:
- Hàng tiêu đề in đậm, căn giữa, tô màu nền xám nhạt (Shading 15%).
- Kẻ viền bảng rõ ràng, căn chỉnh độ rộng cột cân đối.
- Lưu tệp bài thi: MAHS_KiemTraDinhKy.docx (Ví dụ: 61001_KiemTraDinhKy.docx).

III. BẢNG RUBRIC ĐỐI CHIẾU KẾT QUẢ ĐÁNH GIÁ
${rubricText}`;
  }

  // Generic fallback for any other custom lesson: generates a rich, concrete test directly based on the lesson's objective
  return `UBND THÀNH PHỐ / TRƯỜNG PHỔ THÔNG THỰC HÀNH SƯ PHẠM
BỘ MÔN: TIN HỌC KHỐI ${g} – NĂM HỌC 2026 - 2027

ĐỀ KIỂM TRA THỰC HÀNH TRÊN MÁY TÍNH (45 PHÚT)
Chủ đề: ${code} – ${title}
(Thực hiện theo Yêu cầu cần đạt CT GDPT 2018)

Họ và tên học sinh: .................................................... Lớp: ................
Mã học sinh: .................................... Máy tính số: ............

I. MỤC TIÊU CẦN ĐẠT CỦA BÀI HỌC
${lesson.objective || 'Thực hiện thành thạo các thao tác thực hành tin học chuẩn mực theo chương trình.'}

II. NỘI DUNG VÀ NHIỆM VỤ THỰC HÀNH CỤ THỂ

Nhiệm vụ 1: Thiết lập môi trường và tiêu đề báo cáo (20 điểm)
1. Khởi động phần mềm chuyên dụng (Microsoft Word / Bảng tính / Phần mềm bài học).
2. Thiết lập trang giấy: Khổ A4, lề trang chuẩn (Top 2cm, Bottom 2cm, Left 2.5cm, Right 2cm).
3. Nhập tiêu đề bằng chữ in hoa, in đậm, cỡ chữ 15pt, căn giữa trang:
   "BÁO CÁO THỰC HÀNH CHUYÊN ĐỀ: ${title.toUpperCase()}"
4. Ghi đầy đủ thông tin định danh học sinh: Họ tên, Lớp, Mã số học sinh, Ngày thực hiện.

Nhiệm vụ 2: Soạn thảo nội dung kiến thức trọng tâm (30 điểm)
Nhập đoạn văn bản phân tích chuyên môn (cỡ chữ 13pt, phông Times New Roman, căn đều hai bên Justify, dãn dòng 1.25):
"Nội dung trọng tâm của ${code} – ${title} tập trung vào việc hình thành và phát triển các kỹ năng số thiết yếu cho học sinh. Thông qua việc tìm hiểu các khái niệm, quy trình thực hiện và thực hành thao tác trên máy tính, học sinh làm chủ được công cụ công nghệ thông tin để giải quyết các vấn đề thực tiễn của cuộc sống và học tập."

Nhiệm vụ 3: Xây dựng bảng biểu dữ liệu chi tiết minh họa (35 điểm)
Tạo một bảng gồm 4 CỘT và 5 HÀNG với dữ liệu phân loại cụ thể cho chủ đề ${title}:

| STT | Thành phần / Nhiệm vụ thực hành | Yêu cầu kỹ thuật cần đạt | Mức độ hoàn thành dự kiến |
| 1 | Tìm hiểu bản chất và cấu trúc lý thuyết | Hiểu rõ khái niệm và nguyên lý hoạt động | Đạt mức 3 hoặc mức 4 |
| 2 | Thực hiện các thao tác kỹ năng cơ bản | Thao tác chính xác, đúng quy trình sư phạm | Đạt mức 3 trở lên |
| 3 | Vận dụng giải quyết tình huống bài toán | Linh hoạt, sáng tạo, giải quyết trọn vẹn | Đạt mức 4 |
| 4 | Tổng hợp, đánh giá và đối chiếu Rubric | Rà soát lỗi, tự chấm điểm đối chiếu | Hoàn thành xuất sắc |

Định dạng bảng: Tiêu đề ô in đậm căn giữa tô màu nền, viền bảng nét đôi ngoài và nét đơn trong, điều chỉnh độ rộng cột cân đối.

Nhiệm vụ 4: Kiểm tra và lưu tệp bài làm (15 điểm)
- Rà soát toàn bộ lỗi chính tả tiếng Việt.
- Lưu tệp bài làm vào thư mục theo đúng quy ước: MAHS_${code.replace(/\s+/g, '')}.docx
  (Ví dụ: 61001_${code.replace(/\s+/g, '')}.docx).

III. BẢNG RUBRIC ĐỐI CHIẾU KẾT QUẢ ĐÁNH GIÁ
${rubricText}`;
}
