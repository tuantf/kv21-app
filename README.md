# KV21 - Fire Safety & Rescue Management System

![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)

A comprehensive web application for managing fire safety and rescue operations (PCCC & CNCH) for ĐKV 21. This system provides real-time tracking, reporting, and analytics for fire incidents, rescue operations, work assignments, and performance metrics.

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
   cd kv213
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

### Linting

Run ESLint to check for code issues:

```bash
npm run lint
```

## API Documentation

### Sync Endpoint

The sync endpoint synchronizes data from Google Sheets to InstantDB.

**Endpoint**: `/api/sync`  
**Method**: `GET`  
**Authentication**: Bearer token

#### Request

```bash
curl -X GET "https://your-domain.com/api/sync" \
  -H "Authorization: Bearer YOUR_SYNC_TOKEN"
```

#### Response

```json
{
  "sheets": [
    {
      "sheetName": "chay",
      "success": true
    },
    {
      "sheetName": "cnch",
      "success": true
    }
  ],
  "chuyenDe": {
    "success": true
  }
}
```

#### Error Response

```json
{
  "error": "Unauthorized"
}
```

#### Setting Up Automated Sync

You can set up automated synchronization using a cron service like [cron-job.org](https://cron-job.org/):

1. **URL**: `https://your-domain.com/api/sync`
2. **Method**: `GET`
3. **Request Headers**:
   - `Authorization: Bearer YOUR_SYNC_TOKEN`
4. **Schedule**: As needed (e.g., every 15 minutes)

The sync endpoint processes the following Google Sheets:

- `chay` - Fire incidents
- `cnch` - Rescue operations
- `cvhomnay` - Today's work
- `chitieu` - Performance indicators
- `cvtuannay` - This week's work
- `cvtuantoi` - Next week's work

## Project Structure

```
kv213/
├── app/                    # Next.js App Router pages
│   ├── (overview)/        # Overview pages (dashboard, tracking, etc.)
│   ├── (ai)/             # AI feature pages
│   ├── (other)/          # Other feature pages
│   └── api/              # API routes
│       └── sync/         # Sync endpoint
├── components/            # React components
│   ├── ui/               # UI component library (Radix UI)
│   └── sidebar/          # Sidebar navigation
├── libs/                  # Utility functions and business logic
│   ├── sync.ts           # Google Sheets synchronization logic
│   ├── instantdb.ts      # InstantDB client configuration
│   └── route.ts          # Route configuration
├── hooks/                 # Custom React hooks
├── public/                # Static assets
└── proxy.ts              # API proxy middleware
```

## Development

### Code Formatting

This project uses [Prettier](https://prettier.io/) for code formatting. Format your code with:

```bash
npx prettier --write .
```

### Type Checking

TypeScript is configured with strict mode. Check types with:

```bash
npx tsc --noEmit
```

### Key Development Files

- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.*` - Tailwind CSS configuration
- `eslint.config.mjs` - ESLint configuration

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0).

Copyright (C) 2024 KV21

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the [GNU General Public License](https://www.gnu.org/licenses/) for more details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Note**: This application is designed specifically for Water Company #21 (Công ty nước số 21) fire safety and rescue operations management.
