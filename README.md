# Portfolio của Leo Lam Nguyen

Mã nguồn của site [leolamnguyen.netlify.app](https://leolamnguyen.netlify.app), dựng bằng Astro. Mỗi lần có thay đổi trên nhánh `main` của repo này, Netlify tự build lại và cập nhật site sau khoảng 1 đến 2 phút.

## Sửa nội dung ngay trên GitHub
Không cần cài gì trên máy.

1. Mở file cần sửa trên GitHub, bấm biểu tượng bút chì (Edit this file).
2. Sửa chữ, rồi bấm **Commit changes**, chọn "Commit directly to the main branch".
3. Đợi 1 đến 2 phút rồi tải lại site. Xem tiến độ ở tab Deploys của project trên Netlify.

Nếu build lỗi, Netlify giữ nguyên bản cũ đang chạy, site không bị sập. Mở log của lần deploy lỗi để xem dòng báo lỗi, thường là do gõ sai tên vai trò, chặng hoặc công cụ.

### Nội dung nằm ở đâu
| Muốn sửa | File |
|---|---|
| Nội dung một case study | `src/content/cases/<tên-case>.mdx` |
| Câu nhận xét của đồng nghiệp | `src/data/quotes.json` |
| Email, LinkedIn, tên, chức danh | `src/data/site.ts` |
| Chữ trên trang chủ | `src/pages/index.astro` |
| Chữ trên trang About | `src/pages/about.astro` |
| Trang Lab | `src/pages/lab/index.astro` |
| Trang 404 | `src/pages/404.astro` |

### Cách viết trong file case (`.mdx`)
- Phần trên cùng, giữa hai dòng `---`, là thông tin của case: tiêu đề, vai trò, công cụ, 3 ô số liệu. Giữ nguyên tên trường, chỉ sửa phần sau dấu hai chấm. Chữ có dấu hai chấm thì đặt trong ngoặc kép.
- Vai trò chỉ được chọn 1 trong 4: `Product owner`, `Requirements lead`, `Builder`, `Analyst`.
- Chặng chọn trong: `Discover`, `Define`, `Decide`, `Ship`, `Measure`.
- Công cụ tối đa 4, viết đúng tên trong danh sách ở `src/data/tools.ts`.
- Phần thân bài viết như văn bản thường. Mỗi mục nằm giữa `<Section id="..." title="...">` và `</Section>`. Sửa chữ bên trong thoải mái, chỉ không xóa các thẻ này.
- File mẫu: `src/content/cases/_example.mdx`. File bắt đầu bằng dấu `_` không hiện lên site.

### Quy tắc viết (rút gọn)
- Không dùng dấu gạch dài (—), không dùng dấu chấm giữa (·) để nối các mục, không dùng mũi tên (→) trong câu.
- Viết hoa chữ cái đầu câu tiêu đề, không viết hoa mỗi chữ.
- Không đưa số điện thoại, địa chỉ, ngân sách, mục tiêu, số liệu nội bộ chưa được phép công khai.
- Đầy đủ ở `docs/brand.md` mục 9.7 trong Project trên claude.ai.

## Ảnh
Ảnh nằm trong `src/assets/images`. Astro tự nén và tạo nhiều kích cỡ khi build. Ảnh đã làm mờ chỗ nhạy cảm thì giữ nguyên file, không thay bằng ảnh gốc. Thêm ảnh mới: tải file vào đúng thư mục trên GitHub (Add file, Upload files), rồi nhờ Claude gắn vào trang.

## Đo lường (Umami)
Site dùng Umami Cloud, gói miễn phí, không dùng cookie nên không cần banner xin đồng ý. Script chỉ chạy khi có biến môi trường:

1. Netlify, project `leolamnguyen`, Site configuration, Environment variables.
2. Thêm biến `PUBLIC_UMAMI_WEBSITE_ID`, giá trị là Website ID lấy trong Umami (Settings, Websites).
3. Vào Deploys, bấm Trigger deploy. Biến mới chỉ có tác dụng từ lần build sau.

## Chạy trên máy (không bắt buộc)
Cần Node 22.22 trở lên.

```bash
npm install
npm run dev      # mở http://localhost:4321
npm run build    # build ra thư mục dist/
```

## Cho các phiên Claude sau
Đọc `CLAUDE.md` trước khi sửa code. Nhật ký dựng site ở `BUILD_LOG.md`.
