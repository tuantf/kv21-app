<h1 align="center">
  <p style="color: #ff5000">21</p>
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

- **Trải nghiệm PCCC** - Trang giới thiệu tổng quan về chương trình tuyên truyền, trải nghiệm, thực hành chữa cháy và CNCH do đơn vi tổ chức
- **Chức năng AI**:
  - Hỏi đáp PCCC&CNCH dử dụng NotebookLM
  - AI phục vụ công việc
  - AI nâng cao phục vụ tự động hoá công tác thống kê, báo cáo

## Dành cho nhà phát triển

### Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [InstantDB](https://instantdb.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://www.radix-ui.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Analytics**: [Umami](https://umami.is/)

### Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher (or compatible runtime)
- **Bun** (recommended) or npm/yarn for package management
- **Google Sheets** access with appropriate permissions
- **InstantDB** account and application setup
- Environment variables configured (see below)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ...
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory with the following variables:

   ```env
   SHEET_ID=your_google_sheets_id
   INSTANTDB_APP_ID=your_instantdb_app_id
   INSTANTDB_ADMIN_TOKEN=your_instantdb_admin_token
   SYNC_TOKEN=your_secret_sync_token
   NEXT_PUBLIC_UMAMI_ID=your_umami_id  # Optional
   NEXT_PUBLIC_SYNC_COOLDOWN_MS=30000  # Optional, default: 30000ms
   ```

4. **Run the development server**

   ```bash
   bun dev
   # or
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable                       | Required | Description                                           |
| ------------------------------ | -------- | ----------------------------------------------------- |
| `SHEET_ID`                     | Yes      | Google Sheets ID (the long ID in the sheet URL)       |
| `INSTANTDB_APP_ID`             | Yes      | InstantDB application ID for SDK initialization       |
| `INSTANTDB_ADMIN_TOKEN`        | Yes      | InstantDB admin token for server-side operations      |
| `SYNC_TOKEN`                   | Yes      | Secret token for `/api/sync` endpoint authentication  |
| `NEXT_PUBLIC_UMAMI_ID`         | No       | Umami analytics website ID (optional)                 |
| `NEXT_PUBLIC_SYNC_COOLDOWN_MS` | No       | Sync cooldown period in milliseconds (default: 30000) |

### Getting Your Google Sheets ID

The `SHEET_ID` is the long identifier in your Google Sheets URL:

```
https://docs.google.com/spreadsheets/d/{SHEET_ID_HERE}/edit
```

### Getting InstantDB Credentials

1. Sign up at [InstantDB](https://instantdb.com/)
2. Create a new application
3. Copy your App ID and Admin Token from the dashboard

### Generating SYNC_TOKEN

Generate a secure random token for API authentication:

```bash
openssl rand -hex 32
```

### Usage

#### Development

Start the development server:

```bash
bun dev
# or
npm run dev
```

#### Building for Production

Build the application:

```bash
bun build
# or
npm run build
```

#### Running in Production

Start the production server:

```bash
bun start
# or
npm start
```

### Sync

#### Setting Up Automated Sync

Set up automated synchronization using a cron service like [cron-job.org](https://cron-job.org/):

1. **URL**: `https://your-domain.com/api/sync`
2. **Method**: `GET`
3. **Request Headers**:
   - `Authorization: Bearer YOUR_SYNC_TOKEN`
4. **Schedule**: As needed (e.g., every 15 minutes)
