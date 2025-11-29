<h1 align="center">
  <p>KV21</p>
</h1>

<p align="center">
  <i align="center">Phần mềm cung cấp số liệu thời gian thực, phục vụ công tác thống kê, báo cáo, theo dõi công việc và theo dõi chỉ tiêu công tác 🚀</i>
</p>

## Tổng quan

### Chức năng chính

- **Bảng dữ liệu** - Biều đồ và bảng thời gian thực để có cái nhìn tổng quan về số liệu vụ cháy, nổ, CNCH và theo dõi công việc trong ngày
- **Theo dõi công việc** - Theo dõi công việc trong ngày, công việc trong tuần và công việc tuần tới
- **Theo dõi chỉ tiêu** - Biểu đồ thời gian thực theo dõi toàn bộ chỉ tiêu công tác
- **Theo dõi chuyên đề** - Thống kê các chuyên đề đang thực hiện, đã kết thúc và tiến độ thực hiện từng chuyên đề
- **Báo cáo ngày** - Sử dụng Google Form để gửi báo cáo kết quả công tác trong ngày
- **Công tác tổng hợp** - Thống kê các phần việc tổng hợp

### Chức năng khác

- **Trải nghiệm PCCC** - Trang giới thiệu tổng quan về chương trình tuyên truyền, trải nghiệm, thực hành chữa cháy và CNCH do đơn vị tổ chức
- **Chức năng AI**:
  - Hỏi đáp PCCC&CNCH sử dụng NotebookLM
  - AI phục vụ công việc
  - AI nâng cao phục vụ tự động hoá công tác thống kê, báo cáo

## Dành cho nhà phát triển

### Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [InstantDB](https://instantdb.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Analytics**: [Umami](https://umami.is/)

### If you want to build similar software for your unit

**1. Clone the repository**

**2. Install dependencies**

**3. Set up environment variables**

```env
SHEET_ID=your_google_sheets_id
INSTANTDB_APP_ID=your_instantdb_app_id
INSTANTDB_ADMIN_TOKEN=your_instantdb_admin_token
SYNC_TOKEN=your_secret_sync_token
NEXT_PUBLIC_UMAMI_ID=your_umami_id  # Optional
NEXT_PUBLIC_SYNC_COOLDOWN_MS=30000  # Optional, default: 30000ms
```

**4. Getting InstantDB Credentials**

1. Sign up at [InstantDB](https://instantdb.com/)
1. Create a new application
1. Copy your App ID and Admin Token from the dashboard

**5. Set up automated sync**

```
Set up automated synchronization data from Google Sheets into InstantDB using a cron service like [cron-job.org](https://cron-job.org/):
1. URL: `https://your-domain.com/api/sync`
2. Method: `GET`
3. Request Headers:
  - `Authorization: Bearer YOUR_SYNC_TOKEN`
4. Schedule: As needed (e.g., every 15 minutes)
```
