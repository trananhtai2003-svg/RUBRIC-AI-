import { Criterion, CurriculumLesson, RubricConfig, Student, TaskPractice } from '../types/rubric';

export const GENERIC_CRITERIA: Criterion[] = [
  [
    'Đáp ứng yêu cầu bài học',
    35,
    [
      'Chưa hoàn thành yêu cầu chính.',
      'Hoàn thành một phần yêu cầu.',
      'Hoàn thành đầy đủ các yêu cầu chính.',
      'Hoàn thành vượt yêu cầu, có cải tiến hợp lý.',
    ],
  ],
  [
    'Độ chính xác kỹ thuật & chuyên môn',
    30,
    [
      'Có nhiều lỗi thao tác hoặc sai sót kiến thức.',
      'Còn lỗi thao tác hoặc định dạng cần chỉnh sửa.',
      'Nội dung và thao tác kỹ thuật chính xác.',
      'Chính xác, thành thạo, giải thích rõ phương án.',
    ],
  ],
  [
    'Tổ chức và trình bày sản phẩm',
    20,
    [
      'Bố cục rời rạc, khó theo dõi.',
      'Bố cục chưa nhất quán, thiếu tính thẩm mỹ.',
      'Bố cục rõ ràng, khoa học, dễ theo dõi.',
      'Trình bày chuyên nghiệp, sáng tạo, trực quan.',
    ],
  ],
  [
    'Kiểm tra, lưu trữ và hoàn thiện',
    15,
    [
      'Chưa kiểm tra hoặc lưu sai quy cách.',
      'Có kiểm tra nhưng còn lỗi nhỏ về tên tệp.',
      'Đã kiểm tra, lưu đúng định dạng và tên quy định.',
      'Chủ động rà soát, hoàn thiện tốt trước hạn.',
    ],
  ],
];

export const RUBRICS: Record<string, RubricConfig> = {
  '6-1': {
    title: 'Bài 11 – Định dạng văn bản',
    weights: [30, 25, 25, 20],
    criteria: [
      [
        'Cấu trúc và nội dung văn bản',
        30,
        [
          'Thiếu nội dung hoặc sai cấu trúc văn bản.',
          'Có nội dung nhưng bố cục các đoạn chưa rõ.',
          'Đủ nội dung, bố cục chuẩn theo yêu cầu bài học.',
          'Nội dung đầy đủ, bố cục logic, mạch lạc, dễ theo dõi.',
        ],
      ],
      [
        'Định dạng ký tự và đoạn văn',
        25,
        [
          'Chưa định dạng; phông chữ lộn xộn, khó đọc.',
          'Định dạng chưa thống nhất giữa các đoạn.',
          'Phông, cỡ, kiểu chữ và giãn dòng đoạn phù hợp.',
          'Định dạng nhất quán, màu sắc trang nhã, làm nổi bật ý chính.',
        ],
      ],
      [
        'Bố cục trang và khả năng đọc',
        25,
        [
          'Bố cục rối, căn lề chưa chuẩn.',
          'Một số phần căn chỉnh lề chưa hợp lý.',
          'Tiêu đề, thân bài và căn lề rõ ràng, đúng quy cách.',
          'Bố cục cân đối, hài hòa, trực quan đẹp mắt.',
        ],
      ],
      [
        'Kiểm tra và lưu tệp đúng quy ước',
        20,
        [
          'Chưa kiểm tra chính tả hoặc lưu sai định dạng.',
          'Có lưu tệp nhưng tên tệp chưa đúng quy ước.',
          'Rà soát lỗi chính tả và lưu đúng tên tệp quy định.',
          'Chủ động sửa lỗi, lưu tệp chuẩn xác, nộp đúng hạn.',
        ],
      ],
    ],
  },
  '6-2': {
    title: 'Bài 12 – Trình bày thông tin ở dạng bảng',
    weights: [40, 30, 20, 10],
    criteria: [
      [
        'Cấu trúc và nội dung bảng',
        40,
        [
          'Thiếu/thừa hàng hoặc cột; thông tin sai vị trí hoặc thiếu nhiều.',
          'Có bảng nhưng thiếu nội dung hoặc thông tin đặt chưa đúng ô.',
          'Đủ hàng, cột và nội dung; thông tin đặt đúng ô quy định.',
          'Đầy đủ, chính xác tuyệt đối; tổ chức thông tin khoa học, trực quan.',
        ],
      ],
      [
        'Thao tác tạo và chỉnh sửa bảng',
        30,
        [
          'Chưa tạo được bảng hoàn chỉnh hoặc thao tác sai nhiều.',
          'Tạo được bảng nhưng còn lỗi thêm/xóa hàng cột hoặc kích thước.',
          'Tạo, nhập và chỉnh sửa bảng đúng yêu cầu kỹ thuật.',
          'Thao tác chính xác, độc lập; biết gộp/tách ô và điều chỉnh độ rộng tối ưu.',
        ],
      ],
      [
        'Định dạng và khả năng đọc của bảng',
        20,
        [
          'Chưa định dạng; phông chữ không đồng nhất, khó đọc.',
          'Định dạng chưa thống nhất, căn chỉnh chữ trong ô chưa hợp lý.',
          'Tiêu đề bảng nổi bật; căn chỉnh và độ rộng cột cân đối.',
          'Định dạng thống nhất, viền bảng đẹp mắt, màu nền tương phản tốt.',
        ],
      ],
      [
        'Kiểm tra và hoàn thiện sản phẩm',
        10,
        [
          'Chưa kiểm tra lại hoặc chưa lưu tệp đúng yêu cầu.',
          'Có lưu tệp nhưng còn lỗi nhỏ về chính tả hoặc tên tệp.',
          'Kiểm tra kỹ lưỡng, sửa lỗi và lưu tệp đúng tên theo quy ước.',
          'Chủ động rà soát, hoàn thiện xuất sắc và nộp bài đúng hạn.',
        ],
      ],
    ],
  },
  '10-1': {
    title: 'Chủ đề 1 – Thông tin và xử lí thông tin',
    weights: [30, 25, 25, 20],
    criteria: [
      [
        'Xác định vấn đề và dữ liệu',
        30,
        [
          'Chưa xác định đúng vấn đề hoặc thiếu dữ liệu cơ bản.',
          'Xác định được một phần vấn đề nhưng còn thiếu dữ liệu.',
          'Xác định đúng vấn đề và dữ liệu đầu vào cần xử lý.',
          'Làm rõ bối cảnh, phân tích sâu dữ liệu và bài toán đặt ra.',
        ],
      ],
      [
        'Mô tả quy trình xử lí thông tin',
        25,
        [
          'Quy trình thiếu bước hoặc sai logic xử lý.',
          'Có các bước nhưng thứ tự thực hiện chưa tối ưu.',
          'Mô tả đầy đủ các bước xử lý theo trình tự logic.',
          'Quy trình rõ ràng, giải thích cặn kẽ thuật toán và kiểm tra ngoại lệ.',
        ],
      ],
      [
        'Sản phẩm trình bày và báo cáo',
        25,
        [
          'Sản phẩm sơ sài hoặc khó nắm bắt kết quả.',
          'Có sản phẩm nhưng trình bày chưa mạch lạc.',
          'Sản phẩm rõ ràng, có cấu trúc chặt chẽ và ví dụ minh họa.',
          'Trực quan hóa cao, sử dụng bảng/sơ đồ chuyên nghiệp.',
        ],
      ],
      [
        'Kiểm tra, đánh giá và giải thích',
        20,
        [
          'Chưa kiểm tra kết quả hoặc không giải thích được.',
          'Kiểm tra một phần, giải thích kết quả còn lúng túng.',
          'Kiểm tra kết quả độc lập và giải thích hợp lý.',
          'Tự đánh giá phản biện, nêu rõ ưu nhược điểm và hướng cải tiến.',
        ],
      ],
    ],
  },
  '10-2': {
    title: 'Chủ đề 2 – Tổ chức và trực quan hóa dữ liệu',
    weights: [35, 25, 25, 15],
    criteria: [
      [
        'Cấu trúc và làm sạch dữ liệu',
        35,
        [
          'Thiếu trường dữ liệu hoặc cấu trúc bảng sai lệch.',
          'Thiếu một số trường hoặc dữ liệu chưa được làm sạch đồng nhất.',
          'Trường dữ liệu đầy đủ, đúng kiểu, tổ chức chuẩn.',
          'Tổ chức khoa học, chuẩn hóa cao, dễ lọc và tra cứu.',
        ],
      ],
      [
        'Thao tác phân tích và tính toán',
        25,
        [
          'Thao tác sai công thức nhiều hoặc chưa hoàn thành.',
          'Thực hiện được tính toán cơ bản nhưng còn lỗi kỹ thuật.',
          'Áp dụng đúng công thức và hàm xử lý theo yêu cầu.',
          'Thao tác độc lập, dùng hàm nâng cao, biết kiểm tra sai số.',
        ],
      ],
      [
        'Trực quan hóa biểu đồ và bảng biểu',
        25,
        [
          'Không vẽ biểu đồ hoặc chọn biểu đồ sai bản chất dữ liệu.',
          'Biểu đồ vẽ được nhưng thiếu nhãn hoặc trục tọa độ chưa rõ.',
          'Biểu đồ phù hợp dữ liệu, có tiêu đề, chú giải đầy đủ.',
          'Trực quan sinh động, chọn đúng dạng biểu đồ để làm nổi bật xu hướng.',
        ],
      ],
      [
        'Kiểm tra, lưu trữ và nộp báo cáo',
        15,
        [
          'Chưa kiểm tra lại bảng tính hoặc lưu sai định dạng.',
          'Có lưu bài nhưng còn thiếu sót về quy ước đặt tên.',
          'Kiểm tra dữ liệu, định dạng số chuẩn và lưu tệp đúng hạn.',
          'Hoàn thiện xuất sắc, có ghi chú giải thích và nộp đúng quy định.',
        ],
      ],
    ],
  },
};

export const TIN_HOC_6_LESSONS: CurriculumLesson[] = [
  {
    id: 'th6-b1',
    grade: 6,
    code: 'Bài 1',
    title: 'Thông tin và dữ liệu',
    periods: 2,
    objective:
      '- Phân biệt được thông tin và dữ liệu; vật mang tin; tầm quan trọng của thông tin.\n- Năng lực số: 1.1.TC1a Nhận biết nhu cầu thông tin, phân biệt thông tin – dữ liệu, vật mang tin.\n- Năng lực AI: Nhận biết AI cần dữ liệu đầu vào do con người cung cấp để xử lí và tạo kết quả (6.A1.1: Nhận biết AI do con người tạo ra, lập trình để thực hiện nhiệm vụ).',
    seed: true,
  },
  {
    id: 'th6-b2',
    grade: 6,
    code: 'Bài 2',
    title: 'Xử lí thông tin',
    periods: 2,
    objective:
      '- Nêu được các bước cơ bản trong xử lí thông tin; giải thích máy tính là công cụ hiệu quả.\n- Năng lực số: 1.2.TC1a Nhận biết quá trình thu nhận, xử lí, lưu trữ dữ liệu số.\n- Năng lực AI: Liên hệ quá trình xử lí thông tin của máy tính với quy trình AI: dữ liệu vào → xử lí → kết quả (6.C1.2: Mô tả được ví dụ cơ bản về một số bước hoạt động chính của công cụ AI).',
    seed: true,
  },
  {
    id: 'th6-b3',
    grade: 6,
    code: 'Bài 3',
    title: 'Thông tin trong máy tính',
    periods: 2,
    objective:
      '- Giải thích việc biểu diễn thông tin bằng bit (0, 1); đơn vị bit và đơn vị đo dung lượng.\n- Năng lực số: 1.2.TC1a + 1.3.TC1a Hiểu dữ liệu số, lựa chọn thiết bị lưu trữ phù hợp.\n- Năng lực AI: Nhận biết máy tính là nền tảng vật lý cần thiết để vận hành các hệ thống AI (6.A1.2: Trình bày được AI hoạt động theo lập trình và chỉ là công cụ hỗ trợ).',
    seed: true,
  },
  {
    id: 'th6-b11',
    grade: 6,
    code: 'Bài 11',
    title: 'Định dạng văn bản',
    periods: 2,
    objective:
      '- Trình bày tác dụng của căn lề, định dạng; thực hiện định dạng và in văn bản.\n- Năng lực số: 5.2.TC1a: Xác định nhu cầu cá nhân trong việc trình bày văn bản đẹp và khoa học.\n- Năng lực AI: Trải nghiệm tính năng AI hỗ trợ viết như kiểm tra lỗi, gợi ý từ, tóm tắt nội dung (6.A3.1: Giải thích được AI giúp con người học hỏi và rèn luyện kỹ năng tốt hơn).',
    seed: true,
  },
  {
    id: 'th6-kt-gk1',
    grade: 6,
    code: 'KT Giữa HK1',
    title: 'Kiểm tra giữa học kỳ I',
    periods: 1,
    objective:
      '- Nắm vững kiến thức để làm đúng các bài tập trắc nghiệm, tự luận, thực hành (Tuần 9, 45 phút trên máy tính).\n- Nội dung đánh giá: Phân biệt thông tin và dữ liệu, vật mang tin; các bước xử lí thông tin; biểu diễn thông tin bằng bit (0, 1) và đơn vị đo dung lượng; chức năng soạn thảo văn bản, căn lề, định dạng và in văn bản.',
    seed: true,
  },
  {
    id: 'th6-b12',
    grade: 6,
    code: 'Bài 12',
    title: 'Trình bày thông tin ở dạng bảng',
    periods: 2,
    objective:
      '- Hiểu ý nghĩa tác dụng của bảng; biết chèn, nhập dữ liệu và thay đổi kích thước bảng.\n- Năng lực số: 3.1.TC1a: Biết tạo và trình bày nội dung số dưới dạng bảng để tổ chức thông tin.\n- Năng lực AI: Trải nghiệm AI hỗ trợ tổ chức cấu trúc bảng dữ liệu hiệu quả hơn (6.A3.1: Giải thích được AI giúp con người rèn luyện kỹ năng và mở rộng hiểu biết).',
    seed: true,
  },
  {
    id: 'th6-b13',
    grade: 6,
    code: 'Bài 13',
    title: 'Thực hành: Tìm kiếm và thay thế',
    periods: 1,
    objective:
      '- Sử dụng thành thạo công cụ tìm kiếm và thay thế trong phần mềm soạn thảo.\n- Năng lực số: 5.2.TC1b: Lựa chọn công cụ số (chức năng tìm - thay thế) phù hợp mục đích công việc.\n- Năng lực AI: Hiểu logic tự động hóa của máy tính khi thực hiện các nhiệm vụ lặp lại quy mô lớn (6.A3.1: Giải thích được vai trò của công cụ số/AI trong việc hỗ trợ con người học hỏi).',
    seed: true,
  },
  {
    id: 'th6-b14',
    grade: 6,
    code: 'Bài 14',
    title: 'Thực hành tổng hợp: Hoàn thiện sổ lưu niệm',
    periods: 1,
    objective:
      '- Soạn thảo văn bản phục vụ học tập; sử dụng các chức năng đặc trưng của phần mềm.\n- Năng lực số: 3.1.TC1b: Thể hiện bản thân thông qua việc tạo ra các sản phẩm số (văn bản).\n- Năng lực AI: Áp dụng tư duy hệ thống và AI trợ lý để hoàn thiện sản phẩm số có tính thẩm mỹ (6.A3.1: Nhận biết và giải thích được AI giúp mở rộng hiểu biết cá nhân).',
    seed: true,
  },
  {
    id: 'th6-ot-ck1',
    grade: 6,
    code: 'Ôn tập HK1',
    title: 'Ôn tập kiểm tra cuối học kỳ I',
    periods: 1,
    objective:
      '- Ôn tập nắm vững kiến thức qua các bài tập trắc nghiệm, tự luận, thực hành.\n- Củng cố hệ thống kiến thức học kỳ I: Thông tin và dữ liệu, xử lý thông tin, biểu diễn số nhị phân, định dạng văn bản và bảng biểu.',
    seed: true,
  },
  {
    id: 'th6-kt-ck1',
    grade: 6,
    code: 'KT Cuối HK1',
    title: 'Kiểm tra cuối học kỳ I',
    periods: 1,
    objective:
      '- Nắm vững kiến thức để làm đúng các bài tập trắc nghiệm, tự luận, thực hành (Tuần 15, 45 phút trên máy tính).\n- Nội dung đánh giá tổng hợp: Thông tin, dữ liệu, vật mang tin, quá trình xử lý dữ liệu; đơn vị đo bit; các kỹ năng soạn thảo, căn lề, định dạng trang; tạo và trình bày bảng; tìm kiếm thay thế; hoàn thiện sản phẩm số tổng hợp.',
    seed: true,
  },
  {
    id: 'th6-b4',
    grade: 6,
    code: 'Bài 4',
    title: 'Mạng máy tính',
    periods: 2,
    objective:
      '- Nêu khái niệm, lợi ích và các thành phần của mạng; mạng không dây.\n- Năng lực số: 2.2.TC1a: Giải thích cách sử dụng công nghệ số để chia sẻ thông tin qua mạng.\n- Năng lực AI: Nhận diện mạng máy tính là nền tảng kết nối các thiết bị thông minh và ứng dụng AI (6.A1.2: Nêu được một số ví dụ quen thuộc về các công cụ AI trong đời sống).',
    seed: true,
  },
  {
    id: 'th6-b5',
    grade: 6,
    code: 'Bài 5',
    title: 'Internet',
    periods: 1,
    objective:
      '- Nêu được đặc điểm và lợi ích chính của Internet.\n- Năng lực số: 2.4.TC1a: Giải thích công cụ và công nghệ số hỗ trợ hợp tác trong môi trường mạng.\n- Năng lực AI: Biết Internet là môi trường cung cấp các dịch vụ AI hữu ích (dịch thuật, trợ lý ảo) (6.C2.1: Trình bày được ví dụ về một số tính năng ứng dụng AI gần gũi trong cuộc sống).',
    seed: true,
  },
  {
    id: 'th6-b6',
    grade: 6,
    code: 'Bài 6',
    title: 'Mạng thông tin toàn cầu',
    periods: 2,
    objective:
      '- Trình bày khái niệm WWW, website, địa chỉ website, trình duyệt.\n- Năng lực số: 1.1.TC1c: Giải thích cách truy cập và điều hướng trên website thông qua trình duyệt.\n- Năng lực AI: Trình bày chức năng của trợ lý ảo trong việc tổng hợp tri thức nhanh trên Web (6.A3.1: Nhận biết AI giúp con người học hỏi và mở rộng hiểu biết nếu dùng đúng cách).',
    seed: true,
  },
  {
    id: 'th6-b7',
    grade: 6,
    code: 'Bài 7',
    title: 'Tìm kiếm thông tin trên Internet',
    periods: 2,
    objective:
      '- Nêu công dụng máy tìm kiếm; xác định từ khóa và thực hiện tìm kiếm.\n- Năng lực số: 1.1.TC1d: Giải thích được rõ ràng và theo quy trình chiến lược tìm kiếm thông tin.\n- Năng lực AI: Tìm kiếm thông tin có quy trình và biết phản biện về sự an toàn khi dùng máy tìm kiếm tích hợp AI (6.A3.1: Giải thích được AI giúp con người học hỏi, rèn luyện kỹ năng và mở rộng hiểu biết).',
    seed: true,
  },
  {
    id: 'th6-b10',
    grade: 6,
    code: 'Bài 10',
    title: 'Sơ đồ tư duy',
    periods: 2,
    objective:
      '- Biết sơ đồ tư duy là gì; lợi ích và tạo được sơ đồ đơn giản bằng phần mềm.\n- Năng lực số: 3.1.TC1a: Biết tạo và chỉnh sửa nội dung số (sơ đồ tư duy) qua định dạng rõ ràng.\n- Năng lực AI: Thảo luận cách AI hỗ trợ gợi ý nhánh ý tưởng hoặc tóm tắt sơ đồ tư duy (6.A3.3: Nhận biết nhu cầu bảo vệ dữ liệu cá nhân là tài sản riêng khi dùng công cụ AI).',
    seed: true,
  },
  {
    id: 'th6-b9',
    grade: 6,
    code: 'Bài 9',
    title: 'An toàn thông tin trên Internet',
    periods: 1,
    objective:
      '- Biết tác hại, rủi ro khi dùng Internet; bảo vệ thông tin cá nhân và tài khoản.\n- Năng lực số: 4.3.TC1b: Lựa chọn được những cách thức đơn giản để bảo vệ bản thân khỏi nguy cơ số.\n- Năng lực AI: Nhận diện rủi ro khi AI tạo tin giả (Deepfake) hoặc lợi dụng thu thập dữ liệu trái phép (6.B1.1: Nêu được ví dụ về tác động tích cực và tiêu cực của AI).',
    seed: true,
  },
  {
    id: 'th6-kt-gk2',
    grade: 6,
    code: 'KT Giữa HK2',
    title: 'Kiểm tra giữa học kỳ II',
    periods: 1,
    objective:
      '- Nắm vững kiến thức để làm đúng các bài tập trắc nghiệm, tự luận, thực hành (Tuần 26, 45 phút trên máy tính).\n- Nội dung đánh giá: Trình bày khái niệm WWW, địa chỉ website, trình duyệt; sử dụng máy tìm kiếm, xác định từ khóa; tạo và biểu diễn sơ đồ tư duy; các biện pháp phòng ngừa rủi ro và bảo vệ thông tin cá nhân trên mạng.',
    seed: true,
  },
  {
    id: 'th6-b15',
    grade: 6,
    code: 'Bài 15',
    title: 'Thuật toán',
    periods: 2,
    objective:
      '- Diễn tả khái niệm thuật toán qua ví dụ; mô tả bằng liệt kê hoặc sơ đồ khối.\n- Năng lực số: 3.4.TC1a: Liệt kê và trình bày được các bước chỉ dẫn (thuật toán) bằng sơ đồ khối.\n- Năng lực AI: Liên hệ thuật toán trong đời sống với các quy tắc "nếu... thì" đơn giản trong huấn luyện AI (6.C5.1: Nêu được ví dụ đơn giản về quá trình huấn luyện AI thông qua thuật toán).',
    seed: true,
  },
  {
    id: 'th6-b16',
    grade: 6,
    code: 'Bài 16',
    title: 'Các cấu trúc điều khiển',
    periods: 2,
    objective:
      '- Biết cấu trúc tuần tự, rẽ nhánh và lặp; mô tả được thuật toán đơn giản có các cấu trúc trên.\n- Năng lực số: 3.4.TC1a: Biểu diễn các bước giải quyết vấn đề theo nhiều cách đa dạng.\n- Năng lực AI: Hiểu rằng cấu trúc điều khiển là logic cơ bản để AI đưa ra phản hồi hoặc quyết định (6.D1.1: Trình bày được ý kiến về việc nên hay không nên sử dụng AI trong tình huống thực tế).',
    seed: true,
  },
  {
    id: 'th6-ot-ck2',
    grade: 6,
    code: 'Ôn tập HK2',
    title: 'Ôn tập kiểm tra Cuối Học Kỳ II',
    periods: 1,
    objective:
      '- Ôn tập nắm vững kiến thức qua các bài tập trắc nghiệm, tự luận, thực hành.\n- Tổng kết kiến thức học kỳ II: Mạng WWW, công cụ tìm kiếm, sơ đồ tư duy, an toàn thông tin số, thuật toán và cấu trúc tuần tự, rẽ nhánh, lặp.',
    seed: true,
  },
  {
    id: 'th6-kt-ck2',
    grade: 6,
    code: 'KT Cuối HK2',
    title: 'Kiểm tra cuối học kỳ II',
    periods: 1,
    objective:
      '- Nắm vững kiến thức để làm đúng các bài tập trắc nghiệm, tự luận, thực hành (Tuần 32, 45 phút trên máy tính).\n- Nội dung đánh giá tổng hợp: Khai thác thông tin WWW; tìm kiếm từ khóa; tạo sơ đồ tư duy; phòng tránh mã độc và rủi ro mạng; khái niệm thuật toán, mô tả sơ đồ khối; các cấu trúc tuần tự, rẽ nhánh, lặp.',
    seed: true,
  },
  {
    id: 'th6-b17',
    grade: 6,
    code: 'Bài 17',
    title: 'Chương trình máy tính',
    periods: 2,
    objective:
      '- Biết chương trình máy tính là bản mô tả thuật toán cho máy tính thực hiện.\n- Năng lực số: 3.4.TC1a: Viết và thực hiện chương trình Scratch để giải quyết bài tập thực hành.\n- Năng lực AI: Nhận thức rõ AI là sản phẩm trí tuệ do con người lập trình, thiết kế và điều khiển (6.A1.1: Nhận biết và giải thích được rằng AI không tự sinh ra mà do con người tạo ra).',
    seed: true,
  },
  {
    id: 'th6-b8',
    grade: 6,
    code: 'Bài 8',
    title: 'Thư điện tử',
    periods: 2,
    objective:
      '- Nêu ưu/nhược điểm của email; biết địa chỉ và cách đăng ký, gửi, nhận thư.\n- Năng lực số: 2.1.TC1a: Thực hiện tương tác qua email rõ ràng và thường xuyên (soạn, gửi).\n- Năng lực AI: Nhận biết tính năng AI lọc thư rác (Spam) và vai trò quyết định của con người khi xử lý (6.B2.1: Nêu được các câu hỏi kiểm tra tính an toàn và minh bạch của ứng dụng AI).',
    seed: true,
  },
];

export const TIN_HOC_7_LESSONS: CurriculumLesson[] = [
  {
    id: 'th7-b1',
    grade: 7,
    code: 'Bài 1',
    title: 'Thiết bị vào ra',
    periods: 2,
    objective:
      '- Biết và nhận ra được các thiết bị vào - ra có nhiều loại, hình dạng khác nhau, biết được chức năng của mỗi loại thiết bị này trong thu thập, lưu trữ, xử lí và truyền thông tin.\n- Thực hiện đúng các thao tác với các thiết bị thông dụng của máy tính.\n- Nêu được ví dụ cụ thể về những thao tác không đúng cách sẽ gây ra lỗi cho các thiết bị và hệ thống xử lí thông tin.\n- Năng lực số: Nhận biết được các thiết bị vào - ra cơ bản và chức năng của chúng, biết kết nối đúng thiết bị vào cổng tương ứng; biết cách tắt máy an toàn, ngắt kết nối thiết bị ngoại vi (USB, thẻ nhớ) đúng cách; tuân thủ quy tắc an toàn điện và vệ sinh thiết bị.\n- Năng lực AI: Giải thích được lý do vì sao con người cần giữ quyền ra quyết định (đảm bảo công bằng, an toàn).',
    seed: true,
  },
  {
    id: 'th7-b2',
    grade: 7,
    code: 'Bài 2',
    title: 'Phần mềm máy tính',
    periods: 2,
    objective:
      '- Giải thích được sơ lược chức năng điều khiển và quản lí của hệ điều hành, qua đó phân biệt được hệ điều hành với phần mềm ứng dụng.\n- Nêu được tên một số phần mềm ứng dụng đã sử dụng.\n- Giải thích được phần mở rộng của tên tệp cho biết tệp thuộc loại gì, nêu được ví dụ minh hoạ.\n- Năng lực số: Lựa chọn phần mềm ứng dụng phù hợp mục đích (Word để soạn thảo, Scratch để lập trình) tương thích HĐH; nhận biết vai trò nền tảng của HĐH; phân biệt và sử dụng phần mềm có bản quyền hoặc mã nguồn mở an toàn, đúng pháp luật.\n- Năng lực AI: Nêu được các hậu quả có thể xảy ra nếu không có các quy định pháp lý nhằm ngăn chặn việc thiết kế các công cụ AI có hại.',
    seed: true,
  },
  {
    id: 'th7-b3',
    grade: 7,
    code: 'Bài 3',
    title: 'Quản lý dữ liệu trong máy tính',
    periods: 2,
    objective:
      '- Thao tác thành thạo với tệp và thư mục: tạo, sao chép, di chuyển, đổi tên, xoá tệp và thư mục.\n- Biết được tệp chương trình cũng là dữ liệu, có thể được lưu trữ trong máy tính.\n- Nêu được ví dụ về biện pháp bảo vệ dữ liệu như sao lưu, phòng chống virus,...\n- Năng lực số: Thực hiện thành thạo thao tác quản lý tệp/thư mục để tổ chức thông tin khoa học, dễ tìm kiếm truy xuất; nhận biết rủi ro virus, hỏng hóc và áp dụng sao lưu dữ liệu vào USB, Google Drive, ổ cứng ngoài; sử dụng phần mềm diệt virus.\n- Năng lực AI: Phân tích được các vấn đề đạo đức nảy sinh từ dữ liệu huấn luyện AI (như thiếu dữ liệu đa dạng dẫn đến phân biệt đối xử).',
    seed: true,
  },
  {
    id: 'th7-b4',
    grade: 7,
    code: 'Bài 4',
    title: 'Mạng xã hội và một số kênh trao đổi thông tin trên Internet',
    periods: 2,
    objective:
      '- Nêu được một số chức năng cơ bản của mạng xã hội. Nhận biết được một số website là mạng xã hội.\n- Sử dụng được một số chức năng cơ bản của một mạng xã hội để giao lưu và chia sẻ thông tin.\n- Nêu được tên một kênh trao đổi thông tin thông dụng trên Internet và loại thông tin trao đổi trên kênh đó; nêu ví dụ hậu quả sử dụng thông tin sai trái.\n- Năng lực số: Lựa chọn phương tiện giao tiếp phù hợp (Facebook, email, diễn đàn); chia sẻ thông tin an toàn, có trách nhiệm; quản lý hồ sơ và nhận thức "dấu ấn số"; cài đặt quyền riêng tư, phòng tránh bắt nạt, lừa đảo.\n- Năng lực AI: Thể hiện được thái độ và cam kết cá nhân trong việc sử dụng AI có trách nhiệm thông qua bài viết, phát biểu.',
    seed: true,
  },
  {
    id: 'th7-kt1',
    grade: 7,
    code: 'KT Giữa HK1',
    title: 'Kiểm tra giữa học kỳ I',
    periods: 1,
    objective:
      '- Học sinh ôn tập kiến thức, vận dụng kiến thức đã học vào để làm bài kiểm tra.\n- Kiểm tra đánh giá kết hợp Trắc nghiệm và Thực hành: Nhận biết thiết bị vào - ra; phân biệt hệ điều hành và phần mềm ứng dụng; thành thạo thao tác quản lý tệp và thư mục; sử dụng mạng xã hội an toàn.',
    seed: true,
  },
  {
    id: 'th7-b5',
    grade: 7,
    code: 'Bài 5',
    title: 'Ứng xử trên mạng',
    periods: 2,
    objective:
      '- Nêu được một số ví dụ truy cập không hợp lệ vào các nguồn thông tin và kênh truyền thông tin.\n- Thực hiện được giao tiếp qua mạng (trực tuyến hay không trực tuyến) theo đúng quy tắc và bằng ngôn ngữ lịch sự, thể hiện ứng xử có văn hoá.\n- Biết được tác hại của bệnh nghiện Internet, từ đó có ý thức phòng tránh; biết cách ứng xử hợp lí khi gặp thông tin xấu, nhờ người lớn giúp đỡ khi bị bắt nạt.\n- Năng lực số: Tuân thủ quy tắc giao tiếp văn minh, bảo vệ thông tin cá nhân và tôn trọng quyền riêng tư; tự điều chỉnh thời gian sử dụng thiết bị số hợp lý.\n- Năng lực AI: Nêu một số tiêu chí đơn giản để đánh giá mức độ phù hợp, an toàn của một ứng dụng AI.',
    seed: true,
  },
  {
    id: 'th7-b6',
    grade: 7,
    code: 'Bài 6',
    title: 'Làm quen với phần mềm bảng tính',
    periods: 2,
    objective:
      '- Nêu được một số chức năng cơ bản của phần mềm bảng tính.\n- Thực hiện được một số thao tác đơn giản: chọn phông chữ, căn chỉnh dữ liệu trong ô tính, thay đổi độ rộng cột.\n- Năng lực số: Tổ chức dữ liệu khảo sát dự án "Trường học xanh" dưới dạng bảng biểu có cấu trúc rõ ràng trên phần mềm Excel để dễ dàng lưu trữ, tìm kiếm và cập nhật; giải thích lý do nên dùng Excel thay vì Word; sử dụng thành thạo nhóm lệnh Font và Alignment để trình bày bảng dữ liệu rõ ràng, dễ hiểu.\n- Năng lực AI: Phân tích được tầm quan trọng của việc sử dụng bộ dữ liệu “sạch” và “công bằng” để tạo ra các công cụ AI có đạo đức.',
    seed: true,
  },
  {
    id: 'th7-b7',
    grade: 7,
    code: 'Bài 7',
    title: 'Tính toán tự động trên bảng tính',
    periods: 2,
    objective:
      '- Nhận biết được một số kiểu dữ liệu trên bảng tính.\n- Sử dụng được công thức và dùng được địa chỉ trong công thức, tạo được bảng tính đơn giản có số liệu tính toán bằng công thức.\n- Giải thích được việc đưa các công thức vào bảng tính là một cách điều khiển tính toán tự động trên dữ liệu.\n- Năng lực số: Sử dụng công thức trong Excel để tự động tính tổng số cây và thành tiền cho dự án Trường học xanh, đảm bảo tính chính xác và tự động cập nhật; nhận biết khi nào cần thiết lập công thức; vận dụng linh hoạt địa chỉ ô tương đối và tính năng sao chép công thức nhanh chóng, hiệu quả.\n- Năng lực AI: Mô tả được ví dụ cơ bản về một số bước hoạt động chính của công cụ AI.',
    seed: true,
  },
  {
    id: 'th7-kt2',
    grade: 7,
    code: 'KT Cuối HK1',
    title: 'Kiểm tra cuối học kỳ I',
    periods: 1,
    objective:
      '- Học sinh ôn tập kiến thức, vận dụng kiến thức đã học vào để làm bài kiểm tra.\n- Kiểm tra tổng hợp học kỳ I (Trắc nghiệm và Thực hành): Thiết bị vào ra, hệ điều hành, bảo vệ dữ liệu, mạng xã hội, ứng xử văn hóa số, tạo bảng tính Excel và tính toán tự động bằng công thức số học.',
    seed: true,
  },
  {
    id: 'th7-b8',
    grade: 7,
    code: 'Bài 8',
    title: 'Công cụ hỗ trợ tính toán',
    periods: 2,
    objective:
      '- Thực hiện được một số phép toán thông dụng, sử dụng được một số hàm đơn giản như MAX, MIN, SUM, AVERAGE, COUNT,...\n- Năng lực số: Sử dụng các hàm (MAX, MIN, AVERAGE) để phân tích và đánh giá sơ bộ dữ liệu trồng cây thực tế của các lớp; lựa chọn đúng hàm để giải quyết yêu cầu tính toán trong bảng dữ liệu dự án Trường học xanh; tổ chức và cập nhật dữ liệu để các hàm tự động tính toán lại khi số liệu thay đổi.\n- Năng lực AI: Nêu được ví dụ cụ thể về một vấn đề trong trường học hoặc cộng đồng có thể giải quyết bằng AI.',
    seed: true,
  },
  {
    id: 'th7-b9',
    grade: 7,
    code: 'Bài 9',
    title: 'Trình bày bảng tính',
    periods: 2,
    objective:
      '- Biết và thực hiện một số chức năng định dạng dữ liệu số và trình bày bảng tính.\n- Áp dụng được một số hàm đơn giản như MAX, MIN, SUM, AVERAGE.\n- Năng lực số: Sử dụng công cụ định dạng số, ngày tháng, kẻ khung và tô màu tạo bảng tính Dự án Trường học xanh chuyên nghiệp, dễ đọc; chỉnh sửa cấu trúc bảng (chèn, xóa hàng, cột, gộp ô); chọn đúng kiểu Percentage, Currency, Date; tổ chức dữ liệu và hiểu cách hàm xử lý số và bỏ qua văn bản/ô trống.\n- Năng lực AI: Nêu được ví dụ và phân tích được tính khả thi của ý tưởng dự án AI (dựa trên dữ liệu, rủi ro, chi phí).',
    seed: true,
  },
  {
    id: 'th7-b10',
    grade: 7,
    code: 'Bài 10',
    title: 'Hoàn thiện bảng tính',
    periods: 2,
    objective:
      '- Thực hiện được các thao tác hoàn thiện bảng tính.\n- Sử dụng được bảng tính điện tử để giải quyết một vài công việc cụ thể đơn giản.\n- Năng lực số: Thực hiện các thao tác định dạng, căn chỉnh và in ấn để tạo ra một bảng tính hoàn chỉnh, có tính thẩm mỹ và dễ đọc, phục vụ cho việc báo cáo hoặc lưu trữ; vận dụng tổng hợp kiến thức (nhập liệu, dùng hàm, định dạng) để tự thiết kế bảng tính mới giải quyết nhu cầu thực tế (ví dụ: bảng quản lý chi tiêu gia đình).\n- Năng lực AI: Lập được kế hoạch cho một dự án sáng tạo có sử dụng AI theo nhóm nhỏ và thực hành tạo sản phẩm đơn giản.',
    seed: true,
  },
  {
    id: 'th7-b11',
    grade: 7,
    code: 'Bài 11',
    title: 'Tạo bài trình chiếu',
    periods: 2,
    objective:
      '- Nêu được một số chức năng cơ bản của phần mềm trình chiếu.\n- Tạo được một báo cáo có tiêu đề, cấu trúc phân cấp.\n- Năng lực số: Sử dụng phần mềm trình chiếu PowerPoint để tạo bài trình chiếu "Trường học xanh" chứa văn bản và hình ảnh phục vụ báo cáo dự án; tổ chức thông tin theo cấu trúc phân cấp gồm tiêu đề trang, nội dung chính và nội dung chi tiết mạch lạc; lựa chọn mẫu bố trí Layout có sẵn trong PowerPoint chuyên nghiệp và thẩm mỹ.\n- Năng lực AI: Giải thích được lý do vì sao con người cần giữ quyền ra quyết định (tránh AI gây ra nguy hiểm, sai lệch).',
    seed: true,
  },
  {
    id: 'th7-kt3',
    grade: 7,
    code: 'KT Giữa HK2',
    title: 'Kiểm tra giữa học kỳ II',
    periods: 1,
    objective:
      '- Học sinh ôn tập kiến thức, vận dụng kiến thức đã học vào để làm bài kiểm tra.\n- Kiểm tra đánh giá (Trắc nghiệm và Thực hành): Định dạng dữ liệu số và trình bày bảng tính Excel; vận dụng các hàm thống kê; hoàn thiện và in ấn bảng tính; thiết kế bài trình chiếu PowerPoint theo cấu trúc phân cấp.',
    seed: true,
  },
  {
    id: 'th7-b12',
    grade: 7,
    code: 'Bài 12',
    title: 'Định dạng đối tượng trên trang chiếu',
    periods: 2,
    objective:
      '- Sao chép được dữ liệu từ tệp văn bản sang trang trình chiếu.\n- Đưa hình ảnh minh hoạ vào bài trình chiếu; biết sử dụng các định dạng cho văn bản, ảnh minh hoạ một cách hợp lí.\n- Năng lực số: Sử dụng các công cụ định dạng nâng cao như đổi màu, cỡ chữ, viền ảnh, lớp ảnh trên PowerPoint để tăng tính thẩm mỹ và hiệu quả truyền đạt của bài trình chiếu "Trường học xanh"; kết hợp hài hòa giữa văn bản và ảnh minh họa chủ đề môi trường; áp dụng đúng Theme trong thẻ Design tiết kiệm thời gian.\n- Năng lực AI: Trình bày được ví dụ về các hành động cụ thể nhằm góp phần xây dựng môi trường AI có đạo đức.',
    seed: true,
  },
  {
    id: 'th7-b13',
    grade: 7,
    code: 'Bài 13',
    title: 'Thực hành tổng hợp',
    periods: 1,
    objective:
      '- Đưa hiệu ứng động vào bài trình chiếu; biết sử dụng hiệu ứng một cách hợp lí.\n- Biết tổng hợp, sắp xếp các nội dung đã có thành một bài trình chiếu hoàn chỉnh.\n- Năng lực số: Thêm các hiệu ứng động Animation cho đối tượng và Transition cho trang chiếu làm bài trình chiếu dự án "Trường học xanh" sinh động và chuyên nghiệp; tổng hợp văn bản, hình ảnh, bảng biểu vào bài trình chiếu; lựa chọn hiệu ứng xuất hiện và chuyển trang phù hợp, tránh lạm dụng gây rối mắt.\n- Năng lực AI: Thể hiện được thái độ và cam kết cá nhân trong việc sử dụng AI có trách nhiệm.',
    seed: true,
  },
  {
    id: 'th7-b14',
    grade: 7,
    code: 'Bài 14',
    title: 'Thuật toán tìm kiếm tuần tự',
    periods: 2,
    objective:
      '- Giải thích được thuật toán tìm kiếm tuần tự bằng các bước thủ công (không cần dùng máy tính).\n- Biểu diễn và mô phỏng được hoạt động của thuật toán tìm kiếm tuần tự trên một bộ dữ liệu vào có kích thước nhỏ.\n- Năng lực số: Hiểu và mô tả được thuật toán tìm kiếm tuần tự bằng cách xét từng phần tử từ đầu đến cuối danh sách khách hàng để tìm địa chỉ; nhận biết phương pháp tìm kiếm tuần tự là giải pháp đơn giản nhưng hiệu quả để giải quyết bài toán tìm kiếm trên bộ dữ liệu nhỏ như danh mục sách lớp học.\n- Năng lực AI: Nêu được ví dụ về quá trình huấn luyện AI một cách đơn giản.',
    seed: true,
  },
  {
    id: 'th7-b15',
    grade: 7,
    code: 'Bài 15',
    title: 'Thuật toán tìm kiếm nhị phân',
    periods: 2,
    objective:
      '- Giải thích được thuật toán tìm kiếm tuần tự và nhị phân bằng các bước thủ công (không cần dùng máy tính).\n- Biểu diễn và mô phỏng được hoạt động của thuật toán tìm kiếm nhị phân trên một bộ dữ liệu vào có kích thước nhỏ.\n- Giải thích được mối liên quan giữa sắp xếp và tìm kiếm, nêu được ví dụ minh hoạ.\n- Năng lực số: Hiểu và mô tả thuật toán tìm kiếm nhị phân bằng cách chia đôi khoảng tìm kiếm trên danh sách đã sắp xếp; nhận ra ưu điểm vượt trội so với tìm kiếm tuần tự để tối ưu hóa bài toán quản lý cửa hàng.\n- Năng lực AI: Trình bày và phân biệt được ba phương pháp học máy cơ bản (có giám sát, không giám sát, tăng cường).',
    seed: true,
  },
  {
    id: 'th7-kt4',
    grade: 7,
    code: 'KT Cuối HK2',
    title: 'Kiểm tra cuối học kỳ II',
    periods: 1,
    objective:
      '- Học sinh ôn tập kiến thức, vận dụng kiến thức đã học vào để làm bài kiểm tra.\n- Kiểm tra tổng hợp học kỳ II (Trắc nghiệm và Thực hành): Định dạng dữ liệu và hàm tính toán bảng tính, bài trình chiếu PowerPoint hoàn chỉnh đa phương tiện và hiệu ứng, thuật toán tìm kiếm tuần tự, tìm kiếm nhị phân và thuật toán sắp xếp.',
    seed: true,
  },
  {
    id: 'th7-b16',
    grade: 7,
    code: 'Bài 16',
    title: 'Thuật toán sắp xếp',
    periods: 2,
    objective:
      '- Giải thích được một vài thuật toán sắp xếp cơ bản.\n- Biểu diễn và mô phỏng được hoạt động của thuật toán sắp xếp trên một bộ dữ liệu vào có kích thước nhỏ.\n- Nêu được ý nghĩa của việc chia một bài toán thành những bài toán nhỏ hơn.\n- Năng lực số: Hiểu và mô tả được ý tưởng chính của hai thuật toán sắp xếp cơ bản: Sắp xếp nổi bọt (Bubble Sort) và Sắp xếp chọn (Selection Sort) để hiểu cách máy tính tổ chức dữ liệu; áp dụng phương pháp "chia nhỏ bài toán" (Decomposition); nhận biết sắp xếp dữ liệu là bước chuẩn bị cần thiết tăng tốc độ tìm kiếm và xử lý thông tin.\n- Năng lực AI: Phân tích được tầm quan trọng của việc sử dụng bộ dữ liệu “sạch” và “công bằng”.',
    seed: true,
  },
];

export const INITIAL_LESSONS: CurriculumLesson[] = [
  ...TIN_HOC_6_LESSONS,
  ...TIN_HOC_7_LESSONS,
  {
    id: 'seed-8-1',
    grade: 8,
    code: 'Bài 8',
    title: 'Làm quen với thuật toán và sơ đồ khối',
    periods: 2,
    objective: 'Mô tả thuật toán bằng sơ đồ khối, nhận biết cấu trúc tuần tự, rẽ nhánh và lặp.',
    seed: true,
  },
  {
    id: 'seed-8-2',
    grade: 8,
    code: 'Bài 9',
    title: 'Lập trình trực quan Scratch / Python cơ bản',
    periods: 3,
    objective: 'Xây dựng kịch bản chương trình giải quyết bài toán tính toán số học.',
    seed: true,
  },
  {
    id: 'seed-9-1',
    grade: 9,
    code: 'Bài 3',
    title: 'Tổ chức dữ liệu trong bảng và cơ sở dữ liệu',
    periods: 2,
    objective: 'Hiểu cấu trúc bảng dữ liệu, khóa chính và lọc tìm kiếm dữ liệu.',
    seed: true,
  },
  {
    id: 'seed-9-2',
    grade: 9,
    code: 'Bài 4',
    title: 'Bảo mật và an toàn thông tin trên mạng',
    periods: 2,
    objective: 'Nhận biết nguy cơ mất an toàn thông tin và thực hành các biện pháp phòng vệ.',
    seed: true,
  },
  {
    id: 'seed-10-1',
    grade: 10,
    code: 'Chủ đề 1',
    title: 'Thông tin và xử lí thông tin',
    periods: 3,
    objective: 'Phân tích bản chất thông tin, biểu diễn số nhị phân và thiết bị số.',
    seed: true,
  },
  {
    id: 'seed-10-2',
    grade: 10,
    code: 'Chủ đề 2',
    title: 'Tổ chức và trực quan hóa dữ liệu',
    periods: 3,
    objective: 'Xử lý dữ liệu đa chiều, vẽ đồ thị phân tích xu hướng với bảng tính điện tử.',
    seed: true,
  },
  {
    id: 'seed-11-1',
    grade: 11,
    code: 'Chủ đề 3',
    title: 'Lập trình thuật toán nâng cao trong Python',
    periods: 4,
    objective: 'Cài đặt thuật toán sắp xếp, tìm kiếm nhị phân và xử lý mảng hai chiều.',
    seed: true,
  },
  {
    id: 'seed-11-2',
    grade: 11,
    code: 'Chủ đề 4',
    title: 'Hệ quản trị cơ sở dữ liệu quan hệ (RDBMS)',
    periods: 4,
    objective: 'Thiết kế lược đồ cơ sở dữ liệu, viết câu lệnh SQL truy vấn và kết xuất dữ liệu.',
    seed: true,
  },
  {
    id: 'seed-12-1',
    grade: 12,
    code: 'Chủ đề 5',
    title: 'Trí tuệ nhân tạo (AI) và ứng dụng thực tiễn',
    periods: 3,
    objective: 'Khám phá các mô hình học máy, đạo đức ứng dụng AI và phân tích dữ liệu tự động.',
    seed: true,
  },
  {
    id: 'seed-12-2',
    grade: 12,
    code: 'Chủ đề 6',
    title: 'Dự án phần mềm hướng nghiệp',
    periods: 5,
    objective: 'Làm việc nhóm theo quy trình phát triển sản phẩm, kiểm thử và nghiệm thu theo Rubric.',
    seed: true,
  },
];

export const INITIAL_TASKS: TaskPractice[] = [
  {
    id: 'task-seed-1',
    grade: 6,
    code: 'Bài 12',
    title: 'Trình bày thông tin ở dạng bảng',
    content: `ĐỀ THỰC HÀNH TIN HỌC – KHỐI 6
Bài 12: Trình bày thông tin ở dạng bảng

Họ và tên: ........................................ Lớp: ............ Mã học sinh: ................
Thời gian: 45 phút

I. MỤC TIÊU
Hoàn thành sản phẩm thực hành đáp ứng yêu cầu bài học và các tiêu chí Rubric được giáo viên công khai trước khi làm bài.

II. NHIỆM VỤ THỰC HÀNH
1. Mở phần mềm Microsoft Word, tạo văn bản mới.
2. Nhập tiêu đề “THỜI KHÓA BIỂU TRỰC TUẦN”, định dạng phông chữ Times New Roman hoặc Arial, cỡ 16pt, in đậm, căn giữa trang.
3. Chèn một bảng gồm 4 cột (Thứ/ngày, Buổi sáng, Buổi chiều, Ghi chú) và có ít nhất 5 hàng dữ liệu tương ứng từ Thứ Hai đến Thứ Sáu.
4. Điền nội dung chi tiết các hoạt động học tập hoặc trực nhật vào từng ô. Không để trống tất cả các ô.
5. Định dạng hàng tiêu đề nổi bật (màu nền nhạt, chữ in đậm), căn chỉnh chữ trong ô cân đối, kẻ đường viền rõ nét.
6. Thêm dòng họ tên, lớp và mã học sinh ở đầu bài làm.
7. Rà soát lỗi chính tả và lưu tệp theo đúng quy ước: MAHS_Bai12.docx (Ví dụ: 61001_Bai12.docx).

III. SẢN PHẨM CẦN NỘP
- Tệp văn bản Word hoàn chỉnh (.docx).
- Tên tệp có mã học sinh để hệ thống ghép bài chính xác.

IV. TỰ KIỂM TRA TRƯỚC KHI NỘP
- Bảng có đủ 4 cột và ít nhất 5 hàng.
- Tiêu đề bảng được căn giữa và làm nổi bật.
- Không có lỗi chính tả trong bảng.
- Đã lưu tệp đúng cú pháp quy định.`,
    notes: 'Yêu cầu phòng máy có Microsoft Word 2016 trở lên. Học sinh nộp tệp qua thư mục dùng chung hoặc nạp trực tiếp vào phần mềm.',
    ai: 'gemini',
    updated: new Date().toISOString(),
  },
];

export const DEMO_ROSTER: Student[] = [
  {"code":"61001","name":"Lê Vương Trúc An","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61002","name":"Lưu Gia An","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61003","name":"Lê Đình Anh","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61004","name":"Lý Quốc Anh","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61005","name":"Nguyễn Bảo Lam Anh","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61006","name":"Nguyễn Lạc Bảo Anh","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61007","name":"Nguyễn Phú Anh","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61008","name":"Nguyễn Phúc Anh","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61009","name":"Phạm Duy Anh","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61010","name":"Ngô Quốc Bảo","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61011","name":"Nguyễn Thị Bảo Châu","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61012","name":"Đàm Quang Dũng","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61013","name":"Nguyễn Lâm Ánh Dương","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61014","name":"Trương Phạm Linh Đan","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61015","name":"Nông Hải Đăng","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61016","name":"Bùi Ngô Bảo Hà","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61017","name":"Hoàng Anh Hào","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61018","name":"Lê Vương Trúc Khang","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61019","name":"Trần Phúc Khang","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61020","name":"Lý Anh Khôi","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61021","name":"Nay Hoàng Nguyên","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61022","name":"Phan Minh Nhật","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61023","name":"Hà Lưu Phát","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61024","name":"Vương Gia Phát","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61025","name":"Thái Hoàng Phú","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61026","name":"Trần Gia Phú","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61027","name":"Nguyễn Lê Phúc","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61028","name":"Phan Đại Phúc","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61029","name":"Trần Thiên Phúc","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61030","name":"Trần Minh Quang","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61031","name":"Nguyễn Hoàng Sơn","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61032","name":"Tống Nguyên Tài","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61033","name":"Nguyễn Minh Thiện","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61034","name":"Đinh Hoàng Gia Thuyên","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61035","name":"Phan Ngọc Thủy Tiên","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61036","name":"Vũ Nhật Tiến","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61037","name":"Nguyễn Hữu Trọng","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61038","name":"Phạm Vương Trung","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61039","name":"Nguyễn Phúc Trường","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"61040","name":"Nguyễn Phúc Bảo Việt","grade":6,"cls":"6.1","levels":null,"file":"","demo":false},
  {"code":"62001","name":"Liêu Quốc Anh","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62002","name":"Lý Trương Hoài Anh","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62003","name":"Nguyễn Từ Thiên Ân","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62004","name":"Trương Phạm Nguyên Bảo","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62005","name":"Mang Duy Chí","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62006","name":"Trương Trí Dũng","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62007","name":"Nguyễn Trần Mỹ Duyên","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62008","name":"Đặng Hải Đăng","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62009","name":"Ngô Thế Minh Đức","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62010","name":"Thạch Ngọc Hiếu","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62011","name":"Dương Hoàng Minh Huy","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62012","name":"Phan Gia Hưng","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62013","name":"K' Thị Jun Hy","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62014","name":"Nguyễn Bảo Khang","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62015","name":"Trần Bảo Khang","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62016","name":"Chao Đăng Khoa","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62017","name":"Danh Tiến Khoa","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62018","name":"Liêu Anh Khoa","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62019","name":"Lê Bạch Quốc Khôi","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62020","name":"Hà Hoàng Ngọc Kiên","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62021","name":"Lê Minh Kiên","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62022","name":"Nguyễn Minh Kỳ","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62023","name":"Mai Lâm Trọng Lễ","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62024","name":"Võ Văn Đăng Nguyên","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62025","name":"Bạch Thành Nhân","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62026","name":"Đặng Bảo Nhi","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62027","name":"Châu Nhật Phát","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62028","name":"Trần Gia Phát","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62029","name":"Lâm Vĩnh Phúc","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62030","name":"Nguyễn Trọng Phúc","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62031","name":"Trần Thái Gia Phúc","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62032","name":"Nguyễn Anh Quân","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62033","name":"Nguyễn Minh Quân","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62034","name":"Tếp Phi Run","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62035","name":"Trần Trọng Sang","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62036","name":"Lâm Linh Tâm","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62037","name":"Bờ Đam Nhật Thi","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62038","name":"Mang Thị Yến Trâm","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62039","name":"Võ Khắc Long Vũ","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"62040","name":"Lê Anh Vui","grade":6,"cls":"6.2","levels":null,"file":"","demo":false},
  {"code":"63001","name":"K’ Lơ Mu Ales","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63002","name":"Lê Quỳnh Anh","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63003","name":"Mô Lô Bút Chiêm","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63004","name":"Thạch Nguyễn Khánh Duy","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63005","name":"Danh Thành Đạt","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63006","name":"Xuân Tiến Đạt","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63007","name":"Bùi Trần Hải Đăng","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63008","name":"Nguyễn Văn Minh Đức","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63009","name":"Nguyễn Quỳnh Giang","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63010","name":"Mai Trần Anh Huy","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63011","name":"Lê Thế Khải","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63012","name":"Trần Phạm Trọng Khiêm","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63013","name":"Điểu Trần Thục Linh","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63014","name":"Mang Ngọc Minh","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63015","name":"Lê Viết Nghiêm","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63016","name":"Danh Tấn Ngọc","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63017","name":"Lê Vũ Khánh Ngọc","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63018","name":"Nguyễn Hoàng Ngọc","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63019","name":"Trần Trọng Nhân","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63020","name":"Võ Thiện Nhân","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63021","name":"Lê Tấn Song Phi","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63022","name":"Điểu Duy Phong","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63023","name":"Liêu Hồng Phong","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63024","name":"Phan Đại Phú","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63025","name":"Tô Minh Phú","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63026","name":"Triệu Gia Phú","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63027","name":"Nguyễn Minh Phương","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63028","name":"Lục Quân","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63029","name":"Châu Lưu Tôn Quý","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63030","name":"Lê Bá Thanh","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63031","name":"Đặng Quốc Thắng","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63032","name":"K' Tô Thắng","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63033","name":"Trần Quốc Thịnh","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63034","name":"Võ Minh Trọng","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63035","name":"Trần Minh Trung","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63036","name":"Nguyễn Minh Tùng","grade":6,"cls":"6.3","levels":null,"file":"","demo":false},
  {"code":"63037","name":"Chao Ngọc Như Ý","grade":6,"cls":"6.3","levels":null,"file":"","demo":false}
];
