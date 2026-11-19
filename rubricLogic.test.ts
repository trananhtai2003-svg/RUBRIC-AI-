import test from 'node:test';
import assert from 'node:assert/strict';
import { normText, scoreLevels, rank, fmt, matchSubmissionFilename, parseCSV } from './rubricLogic';

test('normText removes Vietnamese diacritics and non-alphanumeric chars', () => {
  assert.equal(normText('Bài 12 – Trình bày bảng'), 'bai12trinhbaybang');
  assert.equal(normText('Nguyễn Văn Đạt'), 'nguyenvandat');
  assert.equal(normText('61001_Bai12.docx'), '61001bai12docx');
});

test('scoreLevels calculates weighted 1-4 scale accurately out of 10', () => {
  // All 4s should be 10.0
  const weights = [40, 30, 20, 10];
  const maxScore = scoreLevels([4, 4, 4, 4], weights);
  assert.equal(maxScore, 10);

  // All 1s should be 2.5 (1/4 * 10)
  const minScore = scoreLevels([1, 1, 1, 1], weights);
  assert.equal(minScore, 2.5);

  // Mixed: [4, 3, 3, 2] with weights [40, 30, 20, 10]
  // 4/4 * 0.4 * 10 = 4.0
  // 3/4 * 0.3 * 10 = 2.25
  // 3/4 * 0.2 * 10 = 1.5
  // 2/4 * 0.1 * 10 = 0.5
  // Total = 4.0 + 2.25 + 1.5 + 0.5 = 8.25
  const mixed = scoreLevels([4, 3, 3, 2], weights);
  assert.equal(mixed, 8.25);

  // Incomplete levels returns null
  assert.equal(scoreLevels([3, 3], weights), null);
  assert.equal(scoreLevels([3, 3, null, 4], weights), null);
});

test('rank assigns correct label and rank badges', () => {
  assert.equal(rank(9.5).label, 'Tốt');
  assert.equal(rank(8.5).label, 'Tốt');
  assert.equal(rank(8.0).label, 'Khá');
  assert.equal(rank(7.0).label, 'Khá');
  assert.equal(rank(6.5).label, 'Đạt');
  assert.equal(rank(5.0).label, 'Đạt');
  assert.equal(rank(4.5).label, 'Chưa đạt');
  assert.equal(rank(null).label, 'Chưa chấm');
});

test('fmt formats numbers with Vietnamese comma separator', () => {
  assert.equal(fmt(8.25), '8,25');
  assert.equal(fmt(10), '10,00');
  assert.equal(fmt(null), '—');
});

test('matchSubmissionFilename finds student code inside filename', () => {
  assert.equal(matchSubmissionFilename('61001_Bai12.docx', '61001'), true);
  assert.equal(matchSubmissionFilename('Bai12_NguyenVanA_61001.doc', '61001'), true);
  assert.equal(matchSubmissionFilename('61002_Bai12.docx', '61001'), false);
});

test('parseCSV parses comma/semicolon separated student roster', () => {
  const csv = `MaHS,HoTen,Khoi,Lop\n61001,Le Vuong Truc An,6,6.1\n61002,Luu Gia An,6,6.1`;
  const students = parseCSV(csv);
  assert.equal(students.length, 2);
  assert.equal(students[0].code, '61001');
  assert.equal(students[0].name, 'Le Vuong Truc An');
  assert.equal(students[0].cls, '6.1');
  assert.equal(students[0].grade, 6);
});

test('generateRubricForLesson creates 4-criterion Rubric tailored to lesson topic and YCCĐ', async () => {
  const { generateRubricForLesson } = await import('./curriculumGenerator.js');
  
  // Test Grade 6 Lesson 1: Thông tin và dữ liệu
  const r1 = generateRubricForLesson({
    id: 'test-6-1',
    grade: 6,
    code: 'Bài 1',
    title: 'Thông tin và dữ liệu',
    objective: 'Phân biệt được thông tin và dữ liệu; vật mang tin; tầm quan trọng của thông tin.',
    periods: 2,
  });
  assert.equal(r1.criteria.length, 4);
  assert.equal(r1.criteria[0][0].includes('Thông tin'), true);
  assert.equal(r1.criteria[1][0].includes('Vật mang tin'), true);
  assert.equal(r1.weights.reduce((a, b) => a + b, 0), 100);

  // Test Grade 6 Lesson 15: Thuật toán
  const r15 = generateRubricForLesson({
    id: 'test-6-15',
    grade: 6,
    code: 'Bài 15',
    title: 'Thuật toán',
    objective: 'Nêu được các cách mô tả thuật toán, vẽ sơ đồ khối.',
    periods: 2,
  });
  assert.equal(r15.criteria.length, 4);
  assert.equal(r15.criteria[0][0].includes('Input') || r15.criteria[1][0].includes('thuật toán'), true);

  // Test Grade 7 Lesson 6: Bảng tính điện tử
  const r7_6 = generateRubricForLesson({
    id: 'test-7-6',
    grade: 7,
    code: 'Bài 6',
    title: 'Làm quen với bảng tính điện tử',
    objective: 'Biết nhập dữ liệu và sử dụng công thức hàm.',
    periods: 2,
  });
  assert.equal(r7_6.criteria.length, 4);
  assert.equal(
    r7_6.criteria[1][0].toLowerCase().includes('công thức') ||
      r7_6.criteria[0][0].toLowerCase().includes('bảng'),
    true
  );
});

test('generateConcreteTaskForLesson creates concrete, non-generic test based on YCCĐ', async () => {
  const { generateConcreteTaskForLesson } = await import('./curriculumGenerator.js');

  const criteria = [
    ['TC1', 40, ['M1', 'M2', 'M3', 'M4']],
    ['TC2', 30, ['M1', 'M2', 'M3', 'M4']],
    ['TC3', 20, ['M1', 'M2', 'M3', 'M4']],
    ['TC4', 10, ['M1', 'M2', 'M3', 'M4']],
  ] as any;

  // Grade 6 Lesson 1
  const task1 = generateConcreteTaskForLesson(
    {
      id: 'test-task-6-1',
      grade: 6,
      code: 'Bài 1',
      title: 'Thông tin và dữ liệu',
      objective: 'Phân biệt thông tin và dữ liệu.',
      periods: 2,
    },
    criteria
  );
  assert.equal(task1.includes('Thông tin và dữ liệu'), true);
  assert.equal(task1.includes('Vật mang tin'), true);
  assert.equal(task1.includes('61001_Bai1_ThongTin.docx'), true);

  // Grade 6 Lesson 11 (Word format)
  const task11 = generateConcreteTaskForLesson(
    {
      id: 'test-task-6-11',
      grade: 6,
      code: 'Bài 11',
      title: 'Định dạng văn bản',
      objective: 'Định dạng ký tự, đoạn văn.',
      periods: 2,
    },
    criteria
  );
  assert.equal(task11.includes('NỘI QUY PHÒNG THỰC HÀNH TIN HỌC'), true);
  assert.equal(task11.includes('Times New Roman'), true);
  assert.equal(task11.includes('Drop Cap'), true);

  // Grade 6 Lesson 12 (Table)
  const task12 = generateConcreteTaskForLesson(
    {
      id: 'test-task-6-12',
      grade: 6,
      code: 'Bài 12',
      title: 'Trình bày thông tin ở dạng bảng',
      objective: 'Chèn bảng, gộp ô.',
      periods: 2,
    },
    criteria
  );
  assert.equal(task12.includes('BẢNG PHÂN CÔNG TRỰC NHẬT'), true);
  assert.equal(task12.includes('Nhóm phân công'), true);
});

test('extractRubricFromExamContent extracts 4 criteria summing to 100% tailored to exam text', async () => {
  const { extractRubricFromExamContent } = await import('./rubricLogic');

  // 1. Table-based teacher exam
  const tableExam = `ĐỀ KIỂM TRA THỰC HÀNH: TẠO BẢNG THỜI KHÓA BIỂU
Yêu cầu: Tạo bảng gồm 6 cột và 8 hàng. Gộp các ô tiêu đề, định dạng viền bảng và màu nền.
Nhập đầy đủ các môn học trong tuần. Lưu tệp theo cú pháp MAHS_TKB.docx`;
  const rTable = extractRubricFromExamContent(tableExam, 'Kiểm tra Bảng biểu');
  assert.equal(rTable.criteria.length, 4);
  assert.equal(rTable.weights.reduce((a, b) => a + b, 0), 100);
  assert.equal(rTable.criteria[0][0].includes('bảng biểu'), true);
  assert.equal(rTable.criteria[0][2].length, 4); // 4 levels M1-M4

  // 2. Programming / Python teacher exam
  const pyExam = `ĐỀ BÀI: LẬP TRÌNH PYTHON TÍNH TỔNG DÃY SỐ
Viết chương trình Python sử dụng vòng lặp for và câu lệnh rẽ nhánh if-else.
In ra kết quả với bộ dữ liệu kiểm thử. Lưu tệp MAHS_BaiTap.py`;
  const rPy = extractRubricFromExamContent(pyExam, 'Lập trình Python');
  assert.equal(rPy.criteria.length, 4);
  assert.equal(rPy.weights.reduce((a, b) => a + b, 0), 100);
  assert.equal(rPy.criteria[0][0].includes('thuật toán') || rPy.criteria[1][0].includes('cú pháp'), true);

  // 3. General formatting text exam
  const textExam = `Soạn thảo đoạn văn bản ngắn, căn lề trang, chỉnh phông chữ Times New Roman cỡ 13, giãn dòng 1.15. Lưu tệp.`;
  const rText = extractRubricFromExamContent(textExam, 'Định dạng văn bản');
  assert.equal(rText.criteria.length, 4);
  assert.equal(rText.weights.reduce((a, b) => a + b, 0), 100);
  assert.equal(rText.criteria[0][0].includes('văn bản') || rText.criteria[1][0].includes('phông chữ'), true);
});

