import { 
  TopicAnalysis, 
  StrategyRecommendation, 
  Alert, 
  DiagnosisReport,
  AccountSearchResult,
  DiscoveredQuestion,
  BatchImportRow,
  ReportTemplate,
  ExportJob,
  UserProfile,
  SubscriptionInfo,
  LoginDevice
} from '@/types';

const MOCK_TOPICS: TopicAnalysis[] = [
  {
    tag: '空气蜜粉测评',
    count: 1240,
    our_ratio: 0.15,
    competitor_ratio: 0.45,
    trend: Array.from({ length: 7 }, (_, i) => ({ date: `04-${14+i}`, value: 150 + Math.random() * 50 }))
  },
  {
    tag: '东方美学彩妆',
    count: 890,
    our_ratio: 0.28,
    competitor_ratio: 0.32,
    trend: Array.from({ length: 7 }, (_, i) => ({ date: `04-${14+i}`, value: 100 + Math.random() * 40 }))
  },
  {
    tag: '控油持妆力',
    count: 650,
    our_ratio: 0.08,
    competitor_ratio: 0.55,
    trend: Array.from({ length: 7 }, (_, i) => ({ date: `04-${14+i}`, value: 80 + Math.random() * 30 }))
  },
  {
    tag: '氛围感',
    count: 2100,
    our_ratio: 0.42,
    competitor_ratio: 0.15,
    trend: Array.from({ length: 7 }, (_, i) => ({ date: `04-${14+i}`, value: 250 + Math.random() * 100 }))
  }
];

const MOCK_RECOMMENDATIONS: StrategyRecommendation[] = [
  {
    id: 'r_01',
    title: '提升“控油持妆”话题下的渗透率',
    content: '当前竞品完美日记在“控油持妆”话题下的占比高达 55%，而我方仅 8%。建议增加空气蜜粉系列产品的笔记投放。',
    priority: 'HIGH',
    source_evidence: '话题分析报表 - 2024-Q2',
    status: 'PENDING',
    created_at: '2024-04-18T10:00:00Z'
  },
  {
    id: 'r_02',
    title: '加强矩阵号在晚间黄金时段的互动',
    content: '监测发现晚间 20:00-22:00 是用户检索高频期，建议矩阵号在该时段通过评论维护提升笔记权重。',
    priority: 'MEDIUM',
    source_evidence: '矩阵协同分析 - 流量分布曲线',
    status: 'PENDING',
    created_at: '2024-04-19T14:30:00Z'
  }
];

const MOCK_ALERTS: Alert[] = [
  {
    id: 'a_01',
    type: 'ABNORMAL_ENGAGEMENT',
    severity: 'WARNING',
    message: '笔记 "花西子空气蜜粉实测..." 互动数据增速异常，疑似遭遇恶意刷量。',
    related_note_id: 'note_123',
    status: 'UNREAD',
    created_at: '2024-04-20T08:15:00Z'
  },
  {
    id: 'a_02',
    type: 'COLLECTION_FAILED',
    severity: 'CRITICAL',
    message: '品牌词采集任务连续 3 次失败，请检查账号状态或验证码。',
    status: 'UNREAD',
    created_at: '2024-04-20T09:00:00Z'
  }
];

const MOCK_REPORTS: DiagnosisReport[] = [
  {
    id: 'rep_01',
    type: 'WEEKLY',
    title: '小红书品牌监测周报',
    date_range: '2024.04.14 - 2024.04.20',
    core_metrics: [
      { label: '品牌可见度', current: 85, previous: 82 },
      { label: 'TOP1 占比', current: 18, previous: 15 },
      { label: '负面舆情率', current: 1.2, previous: 2.5 }
    ],
    created_at: '2024-04-20T18:00:00Z'
  }
];

export const intelligenceService = {
  getTopicAnalysis: async (): Promise<TopicAnalysis[]> => {
    return MOCK_TOPICS;
  },
  getRecommendations: async (): Promise<StrategyRecommendation[]> => {
    return MOCK_RECOMMENDATIONS;
  },
  getAlerts: async (): Promise<Alert[]> => {
    return MOCK_ALERTS;
  },
  getReports: async (): Promise<DiagnosisReport[]> => {
    return MOCK_REPORTS;
  },
  searchAccounts: async (query: string): Promise<AccountSearchResult[]> => {
    // Mocking account search
    return [
      {
        xhs_user_id: 'xhs_u_1',
        nickname: '数码测评君',
        handle: 'tech_reviewer',
        avatar_url: 'https://picsum.photos/seed/u1/100/100',
        followers_count: 52000
      },
      {
        xhs_user_id: 'xhs_u_2',
        nickname: '投影生活指南',
        handle: 'projector_guide',
        avatar_url: 'https://picsum.photos/seed/u2/100/100',
        followers_count: 12800
      }
    ].filter(a => a.nickname.includes(query) || a.handle.includes(query));
  },
  discoverNewQuestions: async (brandId: string): Promise<DiscoveredQuestion[]> => {
    // Mocking DOT_DOT_AI discovery with de-duplication sim
    return [
      { id: 'dq_1', text: '花西子和完美日记蜜粉哪个粉质更细？', source: 'DOT_DOT_AI' },
      { id: 'dq_2', text: '花西子空气蜜粉值得买吗？', source: 'DOT_DOT_AI', is_duplicate: true, duplicate_id: 'existing_q_101', similarity_score: 0.94 },
      { id: 'dq_3', text: '适合大油皮的控油蜜粉推荐哪款？', source: 'DOT_DOT_AI' },
      { id: 'dq_4', text: '蚕丝粉和云母粉在蜜粉里的区别？', source: 'DOT_DOT_AI' }
    ];
  },
  processBatchImport: async (rows: BatchImportRow[]): Promise<void> => {
    console.log('Processing batch import:', rows);
  },
  getReportTemplates: async (): Promise<ReportTemplate[]> => {
    return [
      {
        id: 't_weekly',
        name: '标准品牌周报',
        type: 'WEEKLY',
        description: '固定模板，覆盖核心指标、TOP 笔记、竞品对比、行动建议',
        chapters: ['摘要', '点点AI表现', '矩阵账号表现', '笔记 Highlights', '竞品对比', '行动建议']
      },
      {
        id: 't_monthly',
        name: '深度月度汇演',
        type: 'MONTHLY',
        description: '周报基础上增加月度趋势、矩阵协同分析',
        chapters: ['摘要', '点点AI表现', '矩阵账号表现', '笔记 Highlights', '竞品对比', '行动建议', '月度复盘']
      }
    ];
  },
  getExportJobs: async (): Promise<ExportJob[]> => {
    return [
      {
        id: 'ex_01',
        brand_id: 'b_01',
        user_id: 'u_01',
        type: 'WEEKLY_PDF',
        format: 'PDF',
        time_range: { start: '2024-04-14', end: '2024-04-20' },
        status: 'READY',
        progress: 100,
        download_url: '#',
        expires_at: '2024-04-27T10:00:00Z',
        created_at: '2024-04-20T10:00:00Z',
        completed_at: '2024-04-20T10:02:00Z'
      },
      {
        id: 'ex_02',
        brand_id: 'b_01',
        user_id: 'u_01',
        type: 'NOTES_XLSX',
        format: 'EXCEL',
        time_range: { start: '2024-04-01', end: '2024-04-20' },
        status: 'PROCESSING',
        progress: 65,
        created_at: '2024-04-20T11:30:00Z'
      }
    ];
  },
  triggerExport: async (params: { 
    type: ExportJob['type']; 
    time_range: { start: string; end: string }; 
    template_options?: Record<string, boolean> 
  }): Promise<string> => {
    console.log('Triggering export with params:', params);
    return `task_${Math.random().toString(36).substr(2, 9)}`;
  },
  getExportJobStatus: async (taskId: string): Promise<ExportJob> => {
    // Simulated status check
    return {
      id: taskId,
      brand_id: 'b_01',
      user_id: 'u_01',
      type: 'WEEKLY_PDF',
      format: 'PDF',
      time_range: { start: '2024-04-14', end: '2024-04-20' },
      status: 'PROCESSING',
      progress: Math.floor(Math.random() * 100),
      created_at: new Date().toISOString()
    };
  },
  getUserProfile: async (): Promise<UserProfile> => {
    return {
      uid: 'u_001',
      nickname: 'BrandAdmin_NoteLens',
      email: 'admin@notelens.com',
      phone: '+86 138****8888',
      avatar_url: 'https://picsum.photos/seed/user/100/100',
      password_configured: true,
      two_factor_enabled: false,
      third_party_bindings: [
        { provider: 'GOOGLE', nickname: 'NoteLens Official', bound_at: '2024-01-15' },
        { provider: 'WECHAT', nickname: '笔镜官方', bound_at: '2024-02-10' }
      ]
    };
  },
  getSubscriptionInfo: async (): Promise<SubscriptionInfo> => {
    return {
      plan_name: 'ENTERPRISE',
      status: 'ACTIVE',
      expires_at: '2025-04-20T23:59:59Z',
      usage: [
        { label: '核心问题', current: 12, max: 50, unit: 'h' },
        { label: '高频问题', current: 45, max: 200, unit: '6h' },
        { label: '监测账号', current: 12, max: 500 },
        { label: '竞品实体', current: 4, max: 20 }
      ]
    };
  },
  getLoginDevices: async (): Promise<LoginDevice[]> => {
    return [
      {
        id: 'd_01',
        device_name: 'MacBook Pro 14"',
        browser: 'Chrome 123.0.0',
        location: '上海, 中国',
        last_active_at: new Date().toISOString(),
        is_current: true
      },
      {
        id: 'd_02',
        device_name: 'iPhone 15 Pro',
        browser: 'Mobile Safari',
        location: '北京, 中国',
        last_active_at: '2024-04-19T14:20:00Z',
        is_current: false
      }
    ];
  }
};
