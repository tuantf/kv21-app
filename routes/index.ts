import {
  LayoutDashboard,
  Table2,
  UserStar,
  CalendarCheck2,
  FileUp,
  Sparkle,
  Sparkles,
  FireExtinguisher,
  Info,
  BotMessageSquare,
  Target,
  Book,
  BookOpen,
} from 'lucide-react'

const routes = {
  user: {
    name: 'Xin chào',
    email: 'xinchao@kv21.io.vn',
    avatar: '/other/21.svg',
  },
  overview: [
    {
      title: 'Trang chủ',
      slug: 'trang-chu',
      href: '/',
      icon: LayoutDashboard,
      isActive: false,
    },
    {
      title: 'Theo dõi công việc',
      slug: 'theo-doi-cong-viec',
      href: '/theo-doi-cong-viec',
      icon: CalendarCheck2,
      isActive: false,
    },
    {
      title: 'Theo dõi chỉ tiêu',
      slug: 'theo-doi-chi-tieu',
      href: '/theo-doi-chi-tieu',
      icon: Target,
      isActive: false,
    },
    {
      title: 'Theo dõi chuyên đề',
      slug: 'theo-doi-chuyen-de',
      href: '/theo-doi-chuyen-de',
      icon: Table2,
      isActive: false,
    },
    {
      title: 'Báo cáo ngày',
      slug: 'bao-cao-ngay',
      href: '/bao-cao-ngay',
      icon: FileUp,
      isActive: false,
    },
    {
      title: 'Công tác tổng hợp',
      slug: 'cong-tac-tong-hop',
      href: '/cong-tac-tong-hop',
      icon: UserStar,
      isActive: false,
    },
  ],
  other: [
    {
      title: 'Trải nghiệm PCCC',
      slug: 'trai-nghiem-pccc',
      href: '/trai-nghiem-pccc',
      icon: FireExtinguisher,
      isActive: false,
    },
  ],
  ai: [
    {
      title: 'Hỏi đáp PCCC&CNCH',
      slug: 'hoi-dap-pccc-cnch',
      href: '/hoi-dap-pccc-cnch',
      icon: BotMessageSquare,
      isActive: false,
    },
    {
      title: 'AI phục vụ công việc',
      slug: 'ai-phuc-vu-cong-viec',
      href: '/ai-phuc-vu-cong-viec',
      icon: Sparkle,
      isActive: false,
    },
    {
      title: 'AI nâng cao',
      slug: 'ai-nang-cao',
      href: '/ai-nang-cao',
      icon: Sparkles,
      isActive: false,
    },
  ],
  helper: [
    {
      title: 'Giới thiệu',
      slug: 'gioi-thieu',
      href: '/gioi-thieu',
      icon: Info,
    },
    {
      title: 'Hướng dẫn sử dụng',
      slug: 'huong-dan-su-dung',
      href: '/huong-dan-su-dung',
      icon: BookOpen,
    },
  ],
}

export { routes }
