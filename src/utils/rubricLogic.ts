import { AnalysisResult, Criterion, Student } from '../types/rubric';

export function normText(v: string | null | undefined): string {
  return String(v || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  return Number(n).toFixed(2).replace('.', ',');
}

export function scoreLevels(
  levels: (number | null | undefined)[] | null | undefined,
  weights: number[]
): number | null {
  if (!levels || levels.length !== 4) return null;
  if (levels.some((x) => x === null || x === undefined || !Number.isFinite(Number(x)) || Number(x) < 1 || Number(x) > 4)) {
    return null;
  }
  return levels.reduce<number>((acc, level, i) => {
    const l = Number(level);
    const w = weights[i] ?? 25;
    return acc + (l / 4) * (w / 100) * 10;
  }, 0);
}

export function rank(score: number | null | undefined): {
  label: string;
  badgeClass: string;
  badgeBg: string;
  badgeText: string;
} {
  if (score === null || score === undefined || !Number.isFinite(score)) {
    return {
      label: 'Chưa chấm',
      badgeClass: 'none',
      badgeBg: 'bg-slate-100 dark:bg-slate-800',
      badgeText: 'text-slate-600 dark:text-slate-400',
    };
  }
  if (score >= 8.5) {
    return {
      label: 'Tốt',
      badgeClass: 'good',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/50',
      badgeText: 'text-emerald-800 dark:text-emerald-300',
    };
  }
  if (score >= 7.0) {
    return {
      label: 'Khá',
      badgeClass: 'mid',
      badgeBg: 'bg-amber-100 dark:bg-amber-950/50',
      badgeText: 'text-amber-800 dark:text-amber-300',
    };
  }
  if (score >= 5.0) {
    return {
      label: 'Đạt',
      badgeClass: 'ok',
      badgeBg: 'bg-sky-100 dark:bg-sky-950/50',
      badgeText: 'text-sky-800 dark:text-sky-300',
    };
  }
  return {
    label: 'Chưa đạt',
    badgeClass: 'low',
    badgeBg: 'bg-rose-100 dark:bg-rose-950/50',
    badgeText: 'text-rose-800 dark:text-rose-300',
  };
}

export function parseCSV(text: string): Student[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  const clean = text.replace(/^\uFEFF/, '');

  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    const next = clean[i + 1];

    if (c === '"' && quoted && next === '"') {
      field += '"';
      i++;
    } else if (c === '"') {
      quoted = !quoted;
    } else if ((c === ',' || c === ';' || c === '\t') && !quoted) {
      row.push(field.trim());
      field = '';
    } else if ((c === '\n' || c === '\r') && !quoted) {
      if (c === '\r' && next === '\n') i++;
      row.push(field.trim());
      if (row.some((x) => x !== '')) rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }
  row.push(field.trim());
  if (row.some((x) => x !== '')) rows.push(row);

  if (rows.length < 2) return [];

  const headers = rows.shift()!.map((h) => normText(h));
  const find = (names: string[]) => headers.findIndex((h) => names.includes(h));

  const ix = {
    code: find(['mahs', 'mahocsinh', 'studentid', 'code', 'sobaodanh', 'id']),
    name: find(['hoten', 'tenhocsinh', 'fullname', 'name', 'hovaten']),
    grade: find(['khoi', 'khoilop', 'grade', 'caplop']),
    cls: find(['lop', 'malop', 'class', 'classroom']),
  };

  if (ix.name < 0 || ix.cls < 0) {
    throw new Error('Không nhận diện được cột Họ tên và Lớp trong tệp CSV.');
  }

  return rows
    .map((r, i) => {
      const cls = (r[ix.cls] || '').trim();
      const gradeRaw = ix.grade >= 0 ? r[ix.grade] : '';
      const gm = String(gradeRaw || '').match(/\d+/);
      const cm = cls.match(/\d+/);
      const grade = gm ? Number(gm[0]) : cm ? Number(cm[0]) : 6;
      const code = (ix.code >= 0 ? r[ix.code] : '').trim() || `HS${String(i + 1).padStart(4, '0')}`;
      const name = (r[ix.name] || '').trim();

      return {
        code,
        name,
        grade,
        cls,
        levels: null,
        file: '',
        demo: false,
      };
    })
    .filter((s) => s.name && s.cls);
}

export function matchSubmissionFilename(filename: string, studentCode: string): boolean {
  if (!filename || !studentCode) return false;
  const stem = filename.replace(/\.[^.]+$/, '');
  const nFile = normText(stem);
  const nCode = normText(studentCode);
  return nFile.includes(nCode);
}

export async function unzipTextFile(file: File, wanted: string): Promise<string> {
  const buf = await file.arrayBuffer();
  const dv = new DataView(buf);
  let eocd = -1;

  for (let i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 65557); i--) {
    if (dv.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }

  if (eocd < 0) {
    throw new Error('Không tìm thấy cấu trúc ZIP trong tệp DOCX.');
  }

  const count = dv.getUint16(eocd + 10, true);
  const cdOff = dv.getUint32(eocd + 16, true);
  let pos = cdOff;

  for (let i = 0; i < count; i++) {
    if (dv.getUint32(pos, true) !== 0x02014b50) break;
    const method = dv.getUint16(pos + 10, true);
    const csize = dv.getUint32(pos + 20, true);
    const nlen = dv.getUint16(pos + 28, true);
    const elen = dv.getUint16(pos + 30, true);
    const clen = dv.getUint16(pos + 32, true);
    const local = dv.getUint32(pos + 42, true);
    const name = new TextDecoder().decode(new Uint8Array(buf, pos + 46, nlen));

    if (name === wanted) {
      const ln = dv.getUint16(local + 26, true);
      const le = dv.getUint16(local + 28, true);
      const start = local + 30 + ln + le;
      const compressed = buf.slice(start, start + csize);

      let raw: ArrayBuffer;
      if (method === 0) {
        raw = compressed;
      } else if (method === 8) {
        if (!('DecompressionStream' in window)) {
          throw new Error('Trình duyệt chưa hỗ trợ giải nén DecompressionStream. Vui lòng cập nhật Chrome/Edge.');
        }
        const ds = new DecompressionStream('deflate-raw');
        raw = await new Response(new Blob([compressed]).stream().pipeThrough(ds)).arrayBuffer();
      } else {
        throw new Error('Định dạng nén DOCX không được hỗ trợ.');
      }
      return new TextDecoder().decode(raw);
    }
    pos += 46 + nlen + elen + clen;
  }
  throw new Error(`Không tìm thấy "${wanted}" trong tệp.`);
}

export function xmlText(xml: string): string {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  return Array.from(doc.getElementsByTagNameNS('*', 't'))
    .map((n) => n.textContent || '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function inspectSubmission(file: File): Promise<AnalysisResult> {
  const ext = (file.name.split('.').pop() || '').toLowerCase();

  if (ext === 'docx') {
    try {
      const xml = await unzipTextFile(file, 'word/document.xml');
      const doc = new DOMParser().parseFromString(xml, 'application/xml');
      const tables = Array.from(doc.getElementsByTagNameNS('*', 'tbl'));
      const tableInfo = tables.map((t) => {
        const rows = Array.from(t.getElementsByTagNameNS('*', 'tr'));
        return {
          rows: rows.length,
          cols: Math.max(0, ...rows.map((r) => r.getElementsByTagNameNS('*', 'tc').length)),
          text: Array.from(t.getElementsByTagNameNS('*', 't'))
            .map((n) => n.textContent || '')
            .join(' ')
            .trim(),
        };
      });

      const text = xmlText(xml);
      const rowCount = tableInfo.reduce((a, t) => a + t.rows, 0);
      const colMax = Math.max(0, ...tableInfo.map((t) => t.cols));
      const hasWeekDays =
        /thu hai/i.test(normText(text)) &&
        /thu ba/i.test(normText(text)) &&
        /thu tu/i.test(normText(text));
      const nonempty = text.length >= 120;
      const tableOk = tables.length > 0 && rowCount >= 5 && colMax >= 3;
      const contentOk = nonempty && hasWeekDays;
      const formatOk = tableOk && colMax >= 4;

      const levels = [
        tableOk ? (rowCount >= 6 && colMax >= 4 ? 4 : 3) : tables.length ? 2 : 1,
        contentOk ? (text.length > 500 ? 4 : 3) : nonempty ? 2 : 1,
        formatOk ? 3 : tableOk ? 2 : 1,
        nonempty && tableOk ? 3 : 1,
      ];

      return {
        kind: 'DOCX đọc được',
        textLength: text.length,
        tables: tableInfo,
        summary: `Đọc được nội dung DOCX; phát hiện ${tables.length} bảng, ${rowCount} hàng tổng, tối đa ${colMax} cột.`,
        levels,
        evidence: [
          `Phát hiện ${tables.length} bảng; ${rowCount} hàng, tối đa ${colMax} cột.`,
          `Văn bản trích xuất ${text.length} ký tự; ${hasWeekDays ? 'có các ngày trong tuần được phát hiện' : 'chưa phát hiện đủ tên các ngày trong tuần'}.`,
          `Kiểm tra cấu trúc bảng: ${formatOk ? 'có bảng từ 4 cột, ít nhất 5 hàng' : 'chưa đạt điều kiện bảng 4 cột và ít nhất 5 hàng'}.`,
          `Đã trích xuất nội dung; giáo viên cần kiểm tra trực quan kiểu chữ, căn chỉnh và độ dễ đọc.`,
        ],
        rawText: text.slice(0, 1200),
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        kind: 'DOCX lỗi phân tích',
        textLength: 0,
        tables: [],
        summary: `Không thể đọc nội dung DOCX: ${msg}`,
        levels: null,
        evidence: [`Lỗi phân tích: ${msg}`],
        rawText: '',
      };
    }
  }

  if (['txt', 'csv', 'py'].includes(ext)) {
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((x) => x.trim());
      const levels = [
        text.length > 250 ? 3 : text.length > 50 ? 2 : 1,
        lines.length >= 5 ? 3 : lines.length >= 2 ? 2 : 1,
        lines.some((x) => /[;,\t]/.test(x)) ? 3 : 2,
        lines.length >= 8 ? 3 : lines.length ? 2 : 1,
      ];

      return {
        kind: `${ext.toUpperCase()} đọc được`,
        textLength: text.length,
        tables: [],
        summary: `Đọc được văn bản ${text.length} ký tự, ${lines.length} dòng có nội dung.`,
        levels,
        evidence: [
          `Tệp có ${lines.length} dòng không rỗng.`,
          `Độ dài nội dung ${text.length} ký tự.`,
          lines.some((x) => /[;,\t]/.test(x))
            ? 'Có ký tự phân tách dạng bảng/cột.'
            : 'Chưa thấy ký tự phân tách dạng bảng rõ ràng.',
          'Đã đọc nội dung văn bản; tiêu chí định dạng trực quan cần giáo viên đánh giá.',
        ],
        rawText: text.slice(0, 1200),
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        kind: `${ext.toUpperCase()} lỗi`,
        textLength: 0,
        tables: [],
        summary: `Lỗi đọc tệp: ${msg}`,
        levels: null,
        evidence: [`Lỗi: ${msg}`],
        rawText: '',
      };
    }
  }

  return {
    kind: 'Chưa có bộ phân tích',
    textLength: 0,
    tables: [],
    summary: `Chưa có bộ đọc nội dung tự động cho .${ext || 'không rõ định dạng'}. Không tự gán điểm để tránh tạo kết quả sai.`,
    levels: null,
    evidence: ['Định dạng tệp cần giáo viên mở trực tiếp để đối chiếu Rubric.'],
    rawText: '',
  };
}

export function generateDocxBlob(
  title: string,
  criteriaOrContent: Criterion[] | string,
  grade: number = 6,
  lesson: number = 1,
  taskContent?: string
): Blob {
  const esc = (s: unknown) =>
    String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  let rows = '';
  let bodyContent = '';

  if (typeof criteriaOrContent === 'string') {
    bodyContent = `<div style="font-family:Arial,sans-serif;white-space:pre-wrap;font-size:11pt;line-height:1.5;">${esc(
      criteriaOrContent
    )}</div>`;
  } else {
    rows = criteriaOrContent
      .map(
        (x, i) => `
      <tr>
        <td style="text-align:center;">${i + 1}</td>
        <td><b>${esc(x[0])}</b></td>
        <td style="text-align:center;"><b>${esc(x[1])}%</b></td>
        <td>${esc(x[2][0])}</td>
        <td>${esc(x[2][1])}</td>
        <td>${esc(x[2][2])}</td>
        <td>${esc(x[2][3])}</td>
      </tr>`
      )
      .join('');

    bodyContent = taskContent
      ? `<div style="font-family:Arial,sans-serif;white-space:pre-wrap;font-size:11pt;line-height:1.5;">${esc(
          taskContent
        )}</div>`
      : `<ol>
          <li>Mở Microsoft Word và tạo văn bản có tiêu đề <b>THỜI KHÓA BIỂU TRỰC TUẦN</b>, căn giữa, in đậm.</li>
          <li>Tạo bảng gồm <b>4 cột</b>: Thứ/ngày, Buổi sáng, Buổi chiều, Ghi chú; có hàng tiêu đề và ít nhất <b>5 hàng dữ liệu</b> từ Thứ Hai đến Thứ Sáu.</li>
          <li>Điền nội dung hoạt động học tập phù hợp vào bảng; không để trống toàn bộ các ô dữ liệu.</li>
          <li>Định dạng hàng tiêu đề nổi bật; căn chỉnh văn bản, điều chỉnh độ rộng cột để dễ đọc; áp dụng đường viền bảng.</li>
          <li>Thêm dòng họ tên và lớp ở đầu hoặc cuối tài liệu; rà soát lỗi chính tả và lưu tệp .docx.</li>
        </ol>`;
  }

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Đề thực hành - ${esc(title)}</title>
  <style>
    body { font-family: 'Times New Roman', Arial, sans-serif; font-size: 12pt; line-height: 1.45; color: #111; margin: 20px; }
    h1, h2 { text-align: center; margin: 6px 0; }
    h1 { font-size: 16pt; font-weight: bold; }
    h2 { font-size: 14pt; font-weight: bold; color: #174e90; }
    h3 { font-size: 13pt; margin-top: 18px; margin-bottom: 6px; border-bottom: 1px solid #999; padding-bottom: 4px; }
    table { border-collapse: collapse; width: 100%; margin-top: 10px; font-size: 10.5pt; }
    td, th { border: 1px solid #333; padding: 6px 8px; vertical-align: top; }
    th { background-color: #edf4fb; font-weight: bold; text-align: center; }
  </style>
</head>
<body>
  <h1>ĐỀ KIỂM TRA / BÀI THỰC HÀNH TIN HỌC</h1>
  <h2>Khối ${grade} – ${esc(title)}</h2>
  <p><b>Họ và tên học sinh:</b> .................................................... <b>Lớp:</b> ................</p>
  <p><b>Mã học sinh:</b> .................................... <b>Ngày thực hiện:</b> ....../....../..........</p>
  
  <h3>I. Yêu cầu & Nhiệm vụ thực hành</h3>
  ${bodyContent}

  <h3>II. Rubric đánh giá năng lực thực hành</h3>
  <p><i>Thang mức: 1 – Chưa đạt; 2 – Đạt một phần; 3 – Đạt yêu cầu; 4 – Vượt yêu cầu.</i></p>
  <table>
    <thead>
      <tr>
        <th style="width: 35px;">STT</th>
        <th style="width: 140px;">Tiêu chí</th>
        <th style="width: 60px;">Trọng số</th>
        <th>Mức 1 (Chưa đạt)</th>
        <th>Mức 2 (Đạt một phần)</th>
        <th>Mức 3 (Đạt yêu cầu)</th>
        <th>Mức 4 (Vượt yêu cầu)</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <h3>III. Nhận xét & Đánh giá của giáo viên</h3>
  <p>Điểm mạnh: ............................................................................................................................</p>
  <p>Nội dung cần hoàn thiện: ............................................................................................................</p>
  <p>Hướng dẫn tiếp theo: ................................................................................................................</p>
  <table style="border: none; margin-top: 30px; width: 100%;">
    <tr style="border: none;">
      <td style="border: none; width: 50%;"></td>
      <td style="border: none; text-align: center; width: 50%;">
        <i>Ngày ...... tháng ...... năm 202...</i><br>
        <b>Giáo viên ra đề / chấm điểm</b><br>
        <i>(Ký và ghi rõ họ tên)</i>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return new Blob(['\ufeff' + html], { type: 'application/msword;charset=utf-8;' });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }, 1000);
}

export async function readExamFileText(file: File): Promise<string> {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (ext === 'docx') {
    try {
      const xml = await unzipTextFile(file, 'word/document.xml');
      return xmlText(xml);
    } catch {
      return await file.text();
    }
  }
  return await file.text();
}

export function extractRubricFromExamContent(
  examText: string,
  examTitle?: string,
  grade?: number
): { criteria: Criterion[]; weights: number[]; title: string; description: string; grade: number } {
  const norm = normText(examText);
  const title = examTitle?.trim() || 'Đề kiểm tra thực hành Tin học (Giáo viên tự nạp)';
  const targetGrade = grade ? Number(grade) : 6;
  const description = 'Bảng tiêu chí chấm điểm tự động trích xuất từ đề thực hành của giáo viên theo chuẩn GDPT 2018';

  const isProgramming =
    /python|laptrinh|scratch|thuat toan|vonglap|renhanh|bien|ham|code|chuongtrinh/i.test(norm);
  const isTable =
    /bang|table|hang|cot|o gop|thoikhoabieu|bangdiem|cell|merge|border/i.test(norm);
  const isPresentationOrMindmap =
    /powerpoint|trinhchieu|slide|sodotuduy|mindmap|so do/i.test(norm);

  if (isProgramming) {
    const criteria: Criterion[] = [
      [
        'TC1: Thiết kế thuật toán & cấu trúc chương trình',
        35,
        [
          'Chưa xác định đúng Input/Output hoặc thuật toán sai lệch logic cơ bản.',
          'Xác định được Input/Output nhưng cấu trúc chương trình còn lộn xộn, thiếu bước.',
          'Thuật toán đúng đắn, cấu trúc chương trình chuẩn mực và đầy đủ các khối lệnh.',
          'Thuật toán tối ưu, xử lý mượt mà cả các trường hợp biên đặc biệt.',
        ],
      ],
      [
        'TC2: Cú pháp lệnh, biến & cấu trúc điều khiển',
        30,
        [
          'Chương trình còn nhiều lỗi cú pháp, không thể biên dịch/chạy được.',
          'Chạy được một phần nhưng còn lỗi rẽ nhánh (if-else) hoặc vòng lặp chưa chuẩn.',
          'Sử dụng chính xác các câu lệnh, cú pháp chuẩn, cấu trúc điều khiển hoạt động đúng.',
          'Vận dụng linh hoạt các kiểu dữ liệu nâng cao, xử lý ngoại lệ tốt.',
        ],
      ],
      [
        'TC3: Kết quả thực thi với bộ dữ liệu kiểm thử',
        20,
        [
          'Chưa chạy ra kết quả đúng với bộ dữ liệu mẫu trong đề bài.',
          'Cho kết quả đúng ở 1-2 trường hợp đơn giản nhưng sai ở dữ liệu phức tạp.',
          'Chạy đúng và cho kết quả chính xác 100% với các trường hợp kiểm thử chuẩn.',
          'Kiểm thử toàn diện, hiển thị thông báo kết quả thân thiện và chuyên nghiệp.',
        ],
      ],
      [
        'TC4: Kỹ năng số: Chú thích mã nguồn & lưu tệp đúng quy ước',
        15,
        [
          'Mã nguồn không có chú thích, đặt tên biến tùy tiện, lưu sai tên tệp.',
          'Có chú thích sơ lược nhưng tên biến chưa gợi nhớ; đặt tên tệp còn thiếu thông tin.',
          'Đặt tên biến chuẩn, có chú thích giải thích thuật toán, lưu đúng tên tệp mã học sinh.',
          'Mã nguồn viết theo chuẩn PEP8/style guide, lưu và đóng gói tệp hoàn hảo.',
        ],
      ],
    ];
    return { criteria, weights: [35, 30, 20, 15], title: `Rubric: ${title}`, description, grade: targetGrade };
  }

  if (isTable) {
    const criteria: Criterion[] = [
      [
        'TC1: Kỹ thuật tạo và cấu trúc bảng biểu (Hàng, Cột, Gộp ô)',
        35,
        [
          'Chưa tạo được bảng hoặc thiếu hàng, cột, sai cấu trúc gộp ô cơ bản.',
          'Tạo được bảng nhưng còn thiếu sót số hàng/cột hoặc thao tác gộp ô chưa đúng yêu cầu.',
          'Tạo đúng và đủ số lượng hàng, cột, gộp ô chính xác theo mẫu đề thi.',
          'Cấu trúc bảng hoàn hảo, căn chỉnh độ rộng các cột cân đối và bố cục hài hòa.',
        ],
      ],
      [
        'TC2: Định dạng văn bản trong ô, đường viền & màu nền',
        30,
        [
          'Chưa định dạng văn bản trong bảng, không có đường viền hoặc màu nền.',
          'Có định dạng nhưng chưa đồng bộ, căn lề trong ô còn lệch, đường viền chưa chuẩn.',
          'Căn lề chuẩn (giữa ô, trái, phải), kẻ viền bảng rõ ràng, phối màu tiêu đề đúng yêu cầu.',
          'Định dạng xuất sắc, tính thẩm mỹ trang in cao, phân cấp tiêu đề nổi bật.',
        ],
      ],
      [
        'TC3: Tính đầy đủ, chính xác của dữ liệu & chuẩn chính tả tiếng Việt',
        20,
        [
          'Nội dung nhập còn thiếu nhiều dữ liệu mẫu, nhiều lỗi chính tả tiếng Việt.',
          'Nhập được phần lớn dữ liệu nhưng còn sai sót số liệu hoặc lỗi dấu câu.',
          'Nhập đầy đủ, chính xác toàn bộ dữ liệu mẫu trong đề, đúng chính tả tiếng Việt.',
          'Dữ liệu chuẩn xác tuyệt đối, trình bày logic và chuyên nghiệp.',
        ],
      ],
      [
        'TC4: Kỹ năng số: Thao tác lưu trữ tệp đúng định dạng & mã học sinh',
        15,
        [
          'Chưa lưu tệp đúng vị trí hoặc lưu sai định dạng, đặt sai tên tệp.',
          'Lưu được tệp nhưng tên tệp chưa đúng quy ước mã số học sinh.',
          'Lưu tệp đúng định dạng (.docx), đúng thư mục và tên tệp chuẩn quy ước (MAHS_DeBai.docx).',
          'Thao tác lưu tệp nhanh chóng, chuẩn xác, quản lý tệp tin khoa học.',
        ],
      ],
    ];
    return { criteria, weights: [35, 30, 20, 15], title: `Rubric: ${title}`, description, grade: targetGrade };
  }

  if (isPresentationOrMindmap) {
    const criteria: Criterion[] = [
      [
        'TC1: Cấu trúc phân cấp thông tin & sơ đồ khối',
        35,
        [
          'Chưa thể hiện được các nhánh chính hoặc phân cấp thông tin lộn xộn.',
          'Có phân cấp nhưng liên kết giữa các nhánh còn rời rạc, thiếu ý chính.',
          'Xây dựng cấu trúc phân cấp thông tin logic, đầy đủ các nhánh chính và nhánh phụ.',
          'Cấu trúc xuất sắc, hệ thống hóa kiến thức toàn diện và mạch lạc.',
        ],
      ],
      [
        'TC2: Thiết kế trực quan, hình khối, phông chữ & màu sắc',
        30,
        [
          'Màu sắc và phông chữ khó đọc, bố cục các khối bị chồng chéo.',
          'Có dùng màu và khối nhưng chưa hài hòa, còn rối mắt.',
          'Sử dụng hình khối, phông chữ đồng bộ, phối màu trang nhã và dễ quan sát.',
          'Thiết kế ấn tượng, giàu tính thẩm mỹ và phong cách sáng tạo.',
        ],
      ],
      [
        'TC3: Nội dung súc tích, chính xác & từ khóa trọng tâm',
        20,
        [
          'Nội dung sao chép cả đoạn dài, chưa chắt lọc thành từ khóa ngắn gọn.',
          'Đã có từ khóa nhưng còn thiếu thông tin trọng tâm trong đề bài.',
          'Nội dung ngắn gọn, nêu bật các từ khóa quan trọng và minh họa rõ ý.',
          'Thông điệp cô đọng, sắc bén, diễn đạt thuyết phục.',
        ],
      ],
      [
        'TC4: Kỹ năng số: Xuất sản phẩm & lưu tệp đúng quy ước',
        15,
        [
          'Chưa xuất được tệp theo yêu cầu hoặc lưu sai tên tệp.',
          'Xuất được tệp nhưng đặt tên chưa chuẩn theo mã số học sinh.',
          'Lưu tệp đúng định dạng yêu cầu, đặt tên chuẩn MAHS_DeBai.',
          'Thao tác thuần thục, hoàn thiện sản phẩm đúng tiến độ.',
        ],
      ],
    ];
    return { criteria, weights: [35, 30, 20, 15], title: `Rubric: ${title}`, description, grade: targetGrade };
  }

  // Default General Text & Word formatting Rubric
  const criteria: Criterion[] = [
    [
      'TC1: Bố cục văn bản, căn chỉnh lề trang & định dạng đoạn văn',
      35,
      [
        'Chưa căn chỉnh lề trang, đoạn văn thụt lề lộn xộn, sai quy chuẩn soạn thảo.',
        'Có căn lề nhưng chưa đúng thông số đề bài, giãn dòng chưa hợp lý.',
        'Căn lề trang, thụt lề dòng đầu và giãn dòng chuẩn xác theo đúng yêu cầu đề bài.',
        'Bố cục văn bản trang in chuẩn xác tuyệt đối, cân đối và thẩm mỹ cao.',
      ],
    ],
    [
      'TC2: Định dạng ký tự, phông chữ, cỡ chữ & hiệu ứng nhấn mạnh',
      30,
      [
        'Sử dụng phông chữ không đồng nhất, sai cỡ chữ và kiểu chữ quy định.',
        'Có định dạng phông chữ nhưng còn lẫn lộn hoặc thiếu hiệu ứng (đậm/nghiêng/gạch chân).',
        'Định dạng phông chữ, cỡ chữ, kiểu chữ tiêu đề và nội dung đúng yêu cầu.',
        'Sử dụng kiểu chữ và màu sắc tinh tế, phân cấp thông tin rõ ràng và đẹp mắt.',
      ],
    ],
    [
      'TC3: Nội dung văn bản, bảng biểu chèn thêm & chuẩn chính tả tiếng Việt',
      20,
      [
        'Nội dung thiếu nhiều phần so với đề bài, mắc nhiều lỗi chính tả và gõ dấu tiếng Việt.',
        'Đủ nội dung cơ bản nhưng còn một số lỗi chính tả hoặc sai quy tắc đặt dấu câu.',
        'Nội dung đầy đủ, chuẩn xác, không mắc lỗi chính tả tiếng Việt, đặt dấu câu chuẩn.',
        'Trình bày nội dung xuất sắc, hoàn thiện thêm các chi tiết minh họa trực quan.',
      ],
    ],
    [
      'TC4: Kỹ năng số: Lưu trữ tệp tin đúng định dạng & mã học sinh',
      15,
      [
        'Chưa biết cách lưu tệp hoặc lưu sai vị trí, sai định dạng yêu cầu.',
        'Lưu được tệp nhưng đặt tên tệp chưa đúng cú pháp mã số học sinh.',
        'Lưu tệp đúng định dạng (.docx), đúng thư mục và tên tệp chuẩn quy ước (MAHS_DeBai.docx).',
        'Thao tác lưu trữ khoa học, sao lưu an toàn và hoàn thành đúng thời gian quy định.',
      ],
    ],
  ];
  return { criteria, weights: [35, 30, 20, 15], title: `Rubric: ${title}`, description, grade: targetGrade };
}
