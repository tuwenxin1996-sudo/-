import { Competitor, CompetitorComparisonStats, CandidateCompetitor } from '@/types';

// Mock data for competitor analysis
const MOCK_COMPETITORS: Competitor[] = [
  {
    competitor_id: 'c_01',
    brand_id: 'b_01HJK',
    competitor_name: '品牌A (极米)',
    keywords: ['极米', 'XGIMI', 'H6'],
    priority: 1,
    status: 'ACTIVE',
    added_at: '2024-01-15T10:00:00Z'
  },
  {
    competitor_id: 'c_02',
    brand_id: 'b_01HJK',
    competitor_name: '品牌B (坚果)',
    keywords: ['坚果', 'JMGO', 'N1'],
    priority: 2,
    status: 'ACTIVE',
    added_at: '2024-01-20T11:00:00Z'
  },
  {
    competitor_id: 'c_03',
    brand_id: 'b_01HJK',
    competitor_name: '品牌C (当贝)',
    keywords: ['当贝', 'Dangbei', 'X5'],
    priority: 3,
    status: 'ACTIVE',
    added_at: '2024-02-01T09:00:00Z'
  }
];

const MOCK_COMPARISON_STATS: CompetitorComparisonStats[] = [
  {
    competitor_id: 'OURS',
    name: '我方品牌 (峰米)',
    metrics: {
      visibility: 85,
      recommendation: 78,
      top1_share: 0.25,
      market_share: 0.18,
      matrix_accounts: 12,
      kol_collabs: 45,
      commercial_ratio: 0.65,
      viral_ratio: 0.12,
      avg_length: 1250,
      top_topics: [
        { topic: '投影仪评测', count: 45 },
        { topic: '家庭影院', count: 32 },
        { topic: '沉浸式体验', count: 28 }
      ]
    },
    has_discovery_enabled: true
  },
  {
    competitor_id: 'c_01',
    name: '极米',
    metrics: {
      visibility: 92,
      recommendation: 88,
      top1_share: 0.45,
      market_share: 0.35,
      matrix_accounts: 25,
      kol_collabs: 120,
      commercial_ratio: 0.75,
      viral_ratio: 0.22,
      avg_length: 1100,
      top_topics: [
        { topic: '极米H6', count: 88 },
        { topic: '4K投影', count: 65 },
        { topic: '画质对比', count: 42 }
      ]
    },
    has_discovery_enabled: false
  },
  {
    competitor_id: 'c_02',
    name: '坚果',
    metrics: {
      visibility: 78,
      recommendation: 82,
      top1_share: 0.15,
      market_share: 0.12,
      matrix_accounts: 0, // Mocking empty account state
      kol_collabs: 65,
      commercial_ratio: 0.55,
      viral_ratio: 0.08,
      avg_length: 950,
      top_topics: [
        { topic: '坚果N1', count: 52 },
        { topic: '三色激光', count: 38 },
        { topic: '便携投影', count: 25 }
      ]
    },
    has_discovery_enabled: false
  },
  {
    competitor_id: 'c_03',
    name: '当贝',
    metrics: {
      visibility: 72,
      recommendation: 75,
      top1_share: 0.10,
      market_share: 0.10,
      matrix_accounts: 10,
      kol_collabs: 40,
      commercial_ratio: 0.60,
      viral_ratio: 0.05,
      avg_length: 1300,
      top_topics: [
        { topic: '当贝F5', count: 35 },
        { topic: '亮度评测', count: 28 },
        { topic: '激光投影', count: 22 }
      ]
    },
    has_discovery_enabled: false
  }
];

const MOCK_CANDIDATES: CandidateCompetitor[] = [
  {
    candidate_id: 'acc_cand_01',
    nickname: '数码达人李阿宅',
    avatar_url: 'https://picsum.photos/seed/tech1/200/200',
    discovery_freq: 8,
    representative_note_id: 'note_cand_01',
    discovered_at: '2024-04-18T14:00:00Z',
    status: 'PENDING'
  },
  {
    candidate_id: 'acc_cand_02',
    nickname: '投影家生活馆',
    avatar_url: 'https://picsum.photos/seed/life1/200/200',
    discovery_freq: 6,
    representative_note_id: 'note_cand_02',
    discovered_at: '2024-04-19T09:00:00Z',
    status: 'PENDING'
  }
];

export const competitorService = {
  getCompetitors: async (brandId: string): Promise<Competitor[]> => {
    return MOCK_COMPETITORS.filter(c => c.brand_id === brandId);
  },
  getComparisonStats: async (brandId: string): Promise<CompetitorComparisonStats[]> => {
    return MOCK_COMPARISON_STATS;
  },
  getCandidates: async (brandId: string): Promise<CandidateCompetitor[]> => {
    return MOCK_CANDIDATES;
  },
  handleCandidate: async (candidateId: string, action: 'ACCEPT' | 'IGNORE' | 'MATRIX'): Promise<void> => {
    console.log(`Handling candidate ${candidateId} with action ${action}`);
  },
  addCompetitor: async (brandId: string, name: string, keywords: string[]): Promise<Competitor> => {
    return {
      competitor_id: `c_new_${Math.random().toString(36).substr(2, 9)}`,
      brand_id: brandId,
      competitor_name: name,
      keywords,
      priority: 100,
      status: 'ACTIVE',
      added_at: new Date().toISOString()
    };
  }
};
