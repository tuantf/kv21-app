<h1 align="center">
    <a href="https://kv21.io.vn">
    <img src="./public/21.webp">
    </a>
</h1>

A comprehensive web application for managing fire safety and rescue operations (PCCC & CNCH) for ĐKV21. This system provides real-time tracking, reporting, and analytics for fire incidents, rescue operations, work assignments, and performance metrics.

## Features

### Core Functionality

- **Dashboard** - Real-time charts and work tracking overview
- **Work Tracking** (Theo dõi công việc) - Monitor daily and weekly work assignments
- **Target Tracking** (Theo dõi chỉ tiêu) - Track performance indicators and metrics
- **Topic Tracking** (Theo dõi chuyên đề) - Manage and track specialized topics/projects
- **Daily Reports** (Báo cáo ngày) - Generate and view daily activity reports
- **Summary Work** (Công tác tổng hợp) - Comprehensive work summaries and aggregations

### Additional Features

- **Fire Safety Experience** (Trải nghiệm PCCC) - Interactive fire safety resources
- **AI Features**:
  - Q&A for Fire Safety & Rescue (Hỏi đáp PCCC&CNCH)
  - AI Work Assistant (AI phục vụ công việc)
  - Advanced AI Tools (AI nâng cao)

### Technical Features

- **Google Sheets Integration** - Automatic synchronization from Google Sheets
- **Real-time Updates** - Live data updates via InstantDB
- **Analytics** - Built-in Umami analytics integration
- **Responsive Design** - Modern UI built with Radix UI and Tailwind CSS

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16.0.3 (App Router)
- **Runtime**: [React](https://react.dev/) 19.2.0
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5.9.3
- **Database**: [InstantDB](https://instantdb.com/) - Real-time database
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4.1.17
- **UI Components**: [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- **Animations**: [Motion](https://motion.dev/) 12.23.24
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation
- **Charts**: [Recharts](https://recharts.org/) 2.15.4
- **Analytics**: [Umami](https://umami.is/) - Privacy-focused analytics

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher (or compatible runtime)
- **Bun** (recommended) or npm/yarn for package management
- **Google Sheets** access with appropriate permissions
- **InstantDB** account and application setup
- Environment variables configured (see below)

## Installation

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

## Environment Variables

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
https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
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

## Usage

### Development

Start the development server:

```bash
bun dev
# or
npm run dev
```

### Building for Production

Build the application:

```bash
bun build
# or
npm run build
```

### Running in Production

Start the production server:

```bash
bun start
# or
npm start
```

## Sync

### Setting Up Automated Sync

Set up automated synchronization using a cron service like [cron-job.org](https://cron-job.org/):

1. **URL**: `https://your-domain.com/api/sync`
2. **Method**: `GET`
3. **Request Headers**:
   - `Authorization: Bearer YOUR_SYNC_TOKEN`
4. **Schedule**: As needed (e.g., every 15 minutes)

#**Note**: This application is designed specifically for ĐKV21.
