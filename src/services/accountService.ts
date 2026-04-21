import { MatrixAccount, AccountGroup, CitedNote } from '../types';

const MOCK_ACCOUNTS: MatrixAccount[] = [
  {
    account_id: 'acc_01',
    brand_id: 'b_01HJK',
    xhs_user_id: 'xhs_u_887766',
    handle: 'bijjing_official',
    nickname: '笔镜官方旗舰店',
    avatar_url: 'https://picsum.photos/seed/acc1/200/200',
    group: 'OWN_MAIN',
    followers_count: 125000,
    followers_tier: '10W_100W',
    following_count: 120,
    notes_count: 450,
    commercial_tier: 'STORE',
    status: 'ACTIVE',
    ip_location: '上海',
    gender: 'FEMALE',
    bio: '专注科技美妆，让美更有深度。',
    first_discovered_at: '2024-01-01T00:00:00Z',
    last_profile_fetched_at: new Date().toISOString(),
    notes_30d_count: 45,
    cited_notes_count: 12,
    total_citations: 156,
    citation_weight_score: 92.5,
    avg_citation_position: 1.2,
    viral_note_ratio: 0.15,
    trend_data: Array.from({ length: 30 }, (_, i) => ({
      date: `04-${i + 1 < 10 ? '0' + (i + 1) : i + 1}`,
      value: Math.floor(Math.random() * 20) + 10
    })),
    note_type_distribution: [
      { type: '教程', count: 20 },
      { type: '测评', count: 15 },
      { type: '日常', count: 10 }
    ],
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1h ago
    is_new_24h: true
  },
  {
    account_id: 'acc_02',
    brand_id: 'b_01HJK',
    xhs_user_id: 'xhs_u_223344',
    handle: 'beauty_expert_a',
    nickname: '美妆达人A (原:美妆小白)',
    avatar_url: 'https://picsum.photos/seed/acc2/200/200',
    group: 'KOL_COLLAB',
    followers_count: 850000,
    followers_tier: '10W_100W',
    following_count: 560,
    notes_count: 1200,
    commercial_tier: 'PUGONGYING',
    status: 'BANNED',
    ip_location: '北京',
    gender: 'FEMALE',
    bio: '分享最真实的护肤心得。',
    first_discovered_at: '2024-02-15T00:00:00Z',
    last_profile_fetched_at: new Date().toISOString(),
    notes_30d_count: 8,
    cited_notes_count: 23,
    total_citations: 89,
    citation_weight_score: 85.0,
    avg_citation_position: 2.1,
    viral_note_ratio: 0.35,
    nickname_history: [
      { nickname: '美妆小白', changed_at: '2024-03-01T10:00:00Z' }
    ],
    trend_data: Array.from({ length: 30 }, (_, i) => ({
      date: `04-${i + 1 < 10 ? '0' + (i + 1) : i + 1}`,
      value: Math.floor(Math.random() * 15) + 5
    })),
    note_type_distribution: [
      { type: '好物分享', count: 5 },
      { type: '深度测评', count: 3 }
    ],
    created_at: '2024-01-10T00:00:00Z'
  },
  {
    account_id: 'acc_03',
    brand_id: 'b_01HJK',
    xhs_user_id: 'xhs_u_554433',
    handle: 'comp_beauty',
    nickname: '竞品旗舰官方',
    avatar_url: 'https://picsum.photos/seed/acc3/200/200',
    group: 'COMPETITOR',
    followers_count: 98000,
    followers_tier: '1W_10W',
    following_count: 80,
    notes_count: 320,
    commercial_tier: 'STORE',
    status: 'ACTIVE',
    ip_location: '广州',
    gender: 'UNKNOWN',
    bio: '引领行业新潮流。',
    first_discovered_at: '2024-03-01T00:00:00Z',
    last_profile_fetched_at: new Date().toISOString(),
    notes_30d_count: 38,
    cited_notes_count: 8,
    total_citations: 45,
    citation_weight_score: 65.2,
    avg_citation_position: 3.5,
    viral_note_ratio: 0.05,
    trend_data: Array.from({ length: 30 }, (_, i) => ({
      date: `04-${i + 1 < 10 ? '0' + (i + 1) : i + 1}`,
      value: Math.floor(Math.random() * 10) + 2
    })),
    note_type_distribution: [
      { type: '新闻', count: 10 },
      { type: '产品', count: 28 }
    ],
    created_at: new Date().toISOString()
  }
];

const MOCK_NOTES: CitedNote[] = [
  {
    note_id: 'note_01',
    account_id: 'acc_01',
    title: '【干货】夏天不花妆的秘密，这几款粉底液绝了！',
    citation_count: 45,
    avg_position: 1.1,
    published_at: '2024-04-10T10:00:00Z'
  },
  {
    note_id: 'note_02',
    account_id: 'acc_01',
    title: '早八党福音：5分钟搞定全脸清透底妆',
    citation_count: 32,
    avg_position: 1.3,
    published_at: '2024-04-12T09:30:00Z'
  }
];

export const accountService = {
  async getAccounts(brandId: string): Promise<MatrixAccount[]> {
    return MOCK_ACCOUNTS.filter(a => a.brand_id === brandId);
  },

  async getAccountById(accountId: string): Promise<MatrixAccount | null> {
    return MOCK_ACCOUNTS.find(a => a.account_id === accountId) || null;
  },

  async getCitedNotes(accountId: string): Promise<CitedNote[]> {
    return MOCK_NOTES.filter(n => n.account_id === accountId);
  }
};
