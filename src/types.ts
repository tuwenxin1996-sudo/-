export type QuestionType = 'BRAND' | 'PRODUCT' | 'SCENE' | 'COMPARE' | 'LONG_TAIL';
export type Priority = 'CORE' | 'HIGH' | 'NORMAL';
export type QuestionStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'FAILED';

export interface AIQuestion {
  question_id: string; // ULID
  brand_id: string;
  question_text: string;
  question_type: QuestionType;
  priority: Priority;
  frequency_minutes: number; // 60/360/1440
  status: QuestionStatus;
  failure_reason?: 'captcha' | 'timeout' | 'parse_error';
  created_at: string;
  last_collected_at: string | null;
  last_seen_at?: string; // For duplicates
  // ... existing UI fields
  isHit?: boolean;
  ourNotes?: number;
  topRank?: number | string;
  competitors?: string;
  pulls?: number; 
}

export interface AIAnswer {
  answer_id: string; // CHAR(26)
  question_id: string; // CHAR(26)
  collected_at: string; // TIMESTAMPTZ
  answer_hash: string; // CHAR(64)
  is_duplicate: boolean;
  is_empty?: boolean; //our_citation_count=0 but participates in denominator
  raw_html_oss_path: string;
  parsed_answer_md: string;
  citation_count: number;
  our_citation_count: number;
  top_position: number | null; // NULL = miss
  collection_cost_ms: number;
  collector_account_id: string;
  created_at: string;
}

export type CitationType = 'FULL_QUOTE' | 'PARTIAL' | 'LINK_ONLY';
export type BrandAttribution = 'OURS' | 'COMPETITOR' | 'NEUTRAL';

export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED' | 'DELETED';
export type AccountGroup = 'OWN_MAIN' | 'OWN_SUB' | 'OWN_EMPLOYEE' | 'COMPETITOR' | 'KOL_COLLAB' | 'KOL_POTENTIAL';

export interface Account {
  account_id: string; // CHAR(26) (ULID)
  xhs_user_id: string; // VARCHAR(64)
  handle: string;
  nickname: string;
  avatar_url: string;
  bio: string;
  gender: string;
  ip_location: string;
  followers_count: number;
  followers_tier: string; // LT_1W/1W_10W/10W_100W/GT_100W
  following_count: number;
  notes_count: number;
  commercial_tier: string; // NONE/STORE/PUGONGYING/PGC_BRAND
  status: AccountStatus;
  first_discovered_at: string;
  last_profile_fetched_at: string;
  created_at: string;
}

export type NotePattern = 'FULL_QUOTE' | 'PARTIAL' | 'LINK_ONLY' | 'NOT_CITED';
export type NoteStatus = 'ACTIVE' | 'DELETED' | 'PRIVATE' | 'UNREACHABLE';

export interface NoteCitationDaily {
  note_id: string;
  date: string; // DATE
  citation_count: number;
  avg_position: number;
  full_quote_count: number;
  partial_quote_count: number;
  link_only_count: number;
}
export type EngagementTier = 'VIRAL' | 'MID' | 'LONG_TAIL';
export type ContentType = 'IMAGE_TEXT' | 'VIDEO' | 'LONG_FORM';

export interface Note {
  note_id: string; // 小红书原生 note_id
  author_account_id: string; // REFERENCES accounts(account_id)
  brand_id: string; // context-specific
  
  xsec_token: string | null;
  xsec_token_expires_at: string | null;
  
  title: string;
  body: string | null;
  body_length: number | null;
  content_type: ContentType | null;
  cover_url: string;
  video_url: string | null;
  image_urls: string[] | null;
  tags: string[] | null;
  
  category_l1: string | null;
  category_l2: string | null;
  commercial_tag: string | null; // NONE/STORE_INTEGRATED/PUGONGYING/PGC_BRAND/...
  
  published_at: string;
  
  // Engagement Metrics (XHS Native)
  likes: number;
  collects: number;
  comments: number;
  shares: number;
  engagement_tier: EngagementTier | null;
  
  // Performance Analytics (AIS/GEO)
  first_cited_at: string | null;
  last_cited_at: string | null;
  total_citation_count: number;
  covered_question_count: number;
  citation_pattern: NotePattern | null;
  pattern_updated_at: string | null;
  
  // UI/Derived fields (not in DDL but useful for FE)
  author_nickname?: string;
  author_avatar?: string;
  author_group?: AccountGroup; // New field for filtering in UI
  avg_position?: number;
  latency_curve?: { day: number; count: number }[];
  
  status: NoteStatus;
  first_fetched_at: string | null;
  last_fetched_at: string | null;
  created_at: string;
}

export interface BrandAccount {
  brand_id: string;
  account_id: string;
  account_group: AccountGroup;
  group_note: string;
  added_by: string;
  added_at: string;
}

export interface AccountMetricDaily {
  account_id: string; // CHAR(26)
  brand_id: string; // CHAR(26)
  date: string; // DATE
  cited_notes_count: number;
  citation_total: number;
  avg_citation_position: number;
  citation_weight_score: number;
  full_quote_count: number;
  partial_quote_count: number;
  link_only_count: number;
}

// UI composite type for matrix monitoring
export interface MatrixAccount extends Account {
  // Brand relationship info
  brand_id: string; // derived from context
  group: AccountGroup; // mapped from BrandAccount
  
  // Performance analytics (calculated/aggregated)
  notes_30d_count: number;
  cited_notes_count: number;
  total_citations: number;
  citation_weight_score: number;
  avg_citation_position: number;
  viral_note_ratio: number; // 0-1
  trend_data: { date: string; value: number }[];
  note_type_distribution: { type: string; count: number }[];

  // State Matrix fields
  is_new_24h?: boolean;
  nickname_history?: { nickname: string; changed_at: string }[];
}

export interface CitedNote {
  note_id: string;
  account_id: string;
  title: string;
  citation_count: number;
  avg_position: number;
  published_at: string;
}

export interface Citation {
  citation_id: string; // CHAR(26)
  answer_id: string; // CHAR(26)
  note_id: string; // Red note_id
  position: number;
  citation_type: CitationType;
  cited_text: string | null;
  cited_text_length: number | null;
  match_ratio: number;
  relevance_score: number;
  brand_attribution: BrandAttribution;
  competitor_id: string | null;
  created_at: string;
}

export interface Brand {
  brand_id: string;
  brand_name: string;
  logo_url: string;
  description: string;
  owner_uid: string;
  created_at: string;
  updated_at: string;
}

export interface Competitor {
  competitor_id: string;
  brand_id: string; // The brand this competitor is being compared against
  competitor_name: string;
  keywords: string[];
  priority: number;
  status: 'ACTIVE' | 'INACTIVE';
  added_at: string;
}

export interface CompetitorAccount {
  competitor_id: string;
  account_id: string;
  added_at: string;
}

export interface CompetitorComparisonStats {
  competitor_id: string; // 'OURS' or actual competitorId
  name: string;
  metrics: {
    visibility: number;      // 可见度 (0-100)
    recommendation: number;  // 推荐度 (0-100)
    top1_share: number;      // Top1 占比 (0-1)
    market_share: number;    // 市场份额 (0-1)
    matrix_accounts: number; // 矩阵账号数
    kol_collabs: number;     // 合作 KOL 数
    commercial_ratio: number;// 商业笔记占比 (0-1)
    viral_ratio: number;     // 爆文占比 (0-1)
    avg_length: number;      // 平均笔记长度
    top_topics: { topic: string; count: number }[]; // Top 话题
  };
  has_discovery_enabled: boolean;
}

export interface CandidateCompetitor {
  candidate_id: string; // account_id
  nickname: string;
  avatar_url: string;
  discovery_freq: number; // Appearance frequency in AI answers
  representative_note_id: string;
  discovered_at: string;
  status: 'PENDING' | 'ACCEPTED' | 'IGNORED' | 'MAPPED';
}

export interface TopicAnalysis {
  tag: string;
  count: number;
  our_ratio: number;
  competitor_ratio: number;
  trend: { date: string; value: number }[];
}

export interface StrategyRecommendation {
  id: string;
  title: string;
  content: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  source_evidence: string; // Link or description
  status: 'PENDING' | 'ADOPTED' | 'IGNORED';
  created_at: string;
}

export interface Alert {
  id: string;
  type: 'ABNORMAL_ENGAGEMENT' | 'NEGATIVE_SENTIMENT' | 'COMPETITOR_ATTACK' | 'COLLECTION_FAILED';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  related_note_id?: string;
  status: 'UNREAD' | 'RESOLVED' | 'MUTE';
  created_at: string;
}

export interface DiagnosisReport {
  id: string;
  type: 'WEEKLY' | 'MONTHLY';
  title: string;
  date_range: string;
  core_metrics: { label: string; current: number; previous: number }[];
  created_at: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  type: 'WEEKLY' | 'MONTHLY';
  description: string;
  chapters: string[];
}

export interface ExportJob {
  id: string;
  brand_id: string;
  user_id: string;
  type: 'WEEKLY_PDF' | 'MONTHLY_PDF' | 'NOTES_XLSX' | 'CITATIONS_XLSX';
  format: 'PDF' | 'EXCEL' | 'CSV';
  time_range: { start: string; end: string };
  template_options?: Record<string, boolean>;
  status: 'QUEUED' | 'PROCESSING' | 'READY' | 'FAILED' | 'EXPIRED';
  progress: number;
  file_size_bytes?: number;
  download_url?: string;
  expires_at?: string;
  failure_reason?: string;
  created_at: string;
  completed_at?: string;
}

export interface AccountSearchResult {
  xhs_user_id: string;
  nickname: string;
  handle: string;
  avatar_url: string;
  followers_count: number;
}

export interface BatchImportRow {
  handle_or_link: string;
  group: AccountGroup;
  note: string;
  error?: string;
  isValid: boolean;
}

export interface DiscoveredQuestion {
  id: string;
  text: string;
  similarity_score?: number; // For de-duplication
  is_duplicate?: boolean;
  duplicate_id?: string;
  source: 'DOT_DOT_AI' | 'MANUAL_DISCOVERY';
}

export interface UserProfile {
  uid: string;
  nickname: string;
  email: string;
  phone?: string;
  avatar_url: string;
  password_configured: boolean;
  two_factor_enabled: boolean;
  third_party_bindings: {
    provider: 'GOOGLE' | 'GITHUB' | 'WECHAT';
    nickname: string;
    bound_at: string;
  }[];
}

export interface SubscriptionInfo {
  plan_name: string; // 'FREE' | 'PRO' | 'ENTERPRISE'
  status: 'ACTIVE' | 'EXPIRED' | 'PAUSED';
  expires_at: string;
  usage: {
    label: string;
    current: number;
    max: number;
    unit?: string;
  }[];
}

export interface LoginDevice {
  id: string;
  device_name: string;
  browser: string;
  location: string;
  last_active_at: string;
  is_current: boolean;
}
