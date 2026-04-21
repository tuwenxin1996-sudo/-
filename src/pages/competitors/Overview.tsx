import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Target, 
  Users, 
  FileText, 
  Search, 
  Loader2,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Info
} from 'lucide-react';
import { competitorService } from '@/services/competitorService';
import { Competitor, CompetitorComparisonStats, CandidateCompetitor } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart as RePieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
  Rectangle
} from 'recharts';
import { X, Check, Eye, Plus, Link as LinkIcon, Info as InfoIcon } from 'lucide-react';

export function CompetitorsOverview() {
  const [searchParams] = useSearchParams();
  const brandId = searchParams.get('brandId') || 'b_01HJK';
  
  const [stats, setStats] = useState<CompetitorComparisonStats[]>([]);
  const [candidates, setCandidates] = useState<CandidateCompetitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCompId, setActiveCompId] = useState<string>('c_01');
  const [showCandidates, setShowCandidates] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, candidatesData] = await Promise.all([
          competitorService.getComparisonStats(brandId),
          competitorService.getCandidates(brandId)
        ]);
        setStats(statsData);
        setCandidates(candidatesData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [brandId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const ourStats = stats.find(s => s.competitor_id === 'OURS');
  const activeCompStats = stats.find(s => s.competitor_id === activeCompId);

  // Radar Data
  const radarData = [
    { subject: '可见度', A: ourStats?.metrics.visibility, B: activeCompStats?.metrics.visibility, fullMark: 100 },
    { subject: '推荐度', A: ourStats?.metrics.recommendation, B: activeCompStats?.metrics.recommendation, fullMark: 100 },
    { subject: 'Top1比例', A: (ourStats?.metrics.top1_share || 0) * 100, B: (activeCompStats?.metrics.top1_share || 0) * 100, fullMark: 100 },
    { subject: '爆文率', A: (ourStats?.metrics.viral_ratio || 0) * 100, B: (activeCompStats?.metrics.viral_ratio || 0) * 100, fullMark: 100 },
    { subject: '商单率', A: (ourStats?.metrics.commercial_ratio || 0) * 100, B: (activeCompStats?.metrics.commercial_ratio || 0) * 100, fullMark: 100 },
    { subject: '内容深度', A: (ourStats?.metrics.avg_length || 0) / 15, B: (activeCompStats?.metrics.avg_length || 0) / 15, fullMark: 100 },
  ];

  // Bubble Data
  const bubbleData = stats.map(s => ({
    name: s.name,
    x: s.metrics.visibility,
    y: s.metrics.recommendation,
    z: s.metrics.top1_share * 100,
    top1: s.metrics.top1_share,
    id: s.competitor_id
  }));

  // Matrix Size Data
  const matrixData = stats.map(s => ({
    name: s.name,
    matrix: s.metrics.matrix_accounts,
    kol: s.metrics.kol_collabs,
    id: s.competitor_id
  }));

  const handleCandidateAction = async (id: string, action: 'ACCEPT' | 'IGNORE' | 'MATRIX') => {
    await competitorService.handleCandidate(id, action);
    setCandidates(prev => prev.filter(c => c.candidate_id !== id));
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700/50 backdrop-blur-md">
          <p className="font-bold text-xs mb-2 border-b border-slate-700 pb-2">{data.name}</p>
          <div className="space-y-1.5 text-[10px]">
             <div className="flex justify-between gap-8">
               <span className="text-slate-400">可见度</span>
               <span className="font-mono text-emerald-400">{data.x}%</span>
             </div>
             <div className="flex justify-between gap-8">
               <span className="text-slate-400">推荐度</span>
               <span className="font-mono text-emerald-400">{data.y}%</span>
             </div>
             <div className="flex justify-between gap-8">
               <span className="text-slate-400">Top1 占比</span>
               <span className="font-mono text-indigo-400">{(data.top1 * 100).toFixed(1)}%</span>
             </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">竞品对比分析</h2>
          <p className="text-slate-500 text-sm mt-1 italic font-serif">对标全网 GEO 表现，分析矩阵规模、内容策略及市场地位</p>
        </div>
        <div className="flex items-center gap-2">
          {ourStats?.has_discovery_enabled && (
            <Card className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border-amber-100 text-amber-700 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">AI 发现待扩充竞品: {candidates.length} 个</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCandidates(true)}
                className="h-6 px-2 text-[10px] bg-white border border-amber-200 hover:bg-amber-100 transition-colors"
              >查看</Button>
            </Card>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowConfig(true)}
            className="font-bold text-[10px] uppercase tracking-wider border-slate-200 bg-white"
          >
            配置竞品 (MVP 10)
          </Button>
        </div>
      </div>

      {/* Market Position & Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-8 bg-white border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
             <Target className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                竞品市场地位矩阵
                <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
              </h3>
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>X: 可见度</span>
                <span>Y: 推荐度</span>
                <span>Size: Top1 占比</span>
              </div>
            </div>
            <div className="flex-grow h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <XAxis type="number" dataKey="x" name="可见度" unit="%" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <YAxis type="number" dataKey="y" name="推荐度" unit="%" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <ZAxis type="number" dataKey="z" range={[100, 2000]} name="Top1占比" />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter name="品牌" data={bubbleData} onClick={(data: any) => setActiveCompId(data.id || data.payload?.id)}>
                    {bubbleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.id === 'OURS' ? '#6366f1' : entry.id === activeCompId ? '#f59e0b' : '#e2e8f0'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card className="p-8 bg-white border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-8">被引市场份额</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={stats.map(s => ({ name: s.name, value: s.metrics.market_share }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.competitor_id === 'OURS' ? '#6366f1' : ['#818cf8', '#a5b4fc', '#e2e8f0'][index % 3]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-8 bg-white border-slate-200 shadow-sm h-[500px]">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-slate-800">
                <span className="text-indigo-600">我方</span> vs <span className="text-amber-600">{activeCompStats?.name}</span> 能力雷达
              </h3>
              <select 
                className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none"
                value={activeCompId}
                onChange={(e) => setActiveCompId(e.target.value)}
              >
                {stats.filter(s => s.competitor_id !== 'OURS').map(c => (
                  <option key={c.competitor_id} value={c.competitor_id}>{c.name}</option>
                ))}
              </select>
           </div>
           <ResponsiveContainer width="100%" height="100%">
             <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
               <PolarGrid stroke="#f1f5f9" />
               <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
               <Radar name="我方品牌" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
               <Radar name={activeCompStats?.name} dataKey="B" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
               <Legend />
               <Tooltip />
             </RadarChart>
           </ResponsiveContainer>
        </Card>

        <Card className="p-0 bg-white border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-800">核心指标对比表 (Top N)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
               <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">品牌名称</th>
                    <th className="px-4 py-4 text-center">可见度</th>
                    <th className="px-4 py-4 text-center">推荐度</th>
                    <th className="px-4 py-4 text-center">Top1 占比</th>
                    <th className="px-4 py-4">矩阵规模</th>
                    <th className="px-4 py-4">爆文率</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {stats.map(s => (
                    <tr 
                      key={s.competitor_id} 
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${s.competitor_id === activeCompId ? 'bg-indigo-50/30' : ''}`}
                      onClick={() => s.competitor_id !== 'OURS' && setActiveCompId(s.competitor_id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-nowrap">
                          <div className={`w-2 h-2 rounded-full ${s.competitor_id === 'OURS' ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                          <span className="font-bold text-slate-900">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center font-mono font-bold text-slate-700">{s.metrics.visibility}%</td>
                      <td className="px-4 py-4 text-center font-mono font-bold text-slate-700">{s.metrics.recommendation}%</td>
                      <td className="px-4 py-4 text-center">
                         <div className="inline-flex items-center gap-1.5 font-mono font-bold text-indigo-600">
                           {(s.metrics.top1_share * 100).toFixed(0)}%
                           {s.metrics.top1_share > 0.3 && <ArrowUpRight className="w-3 h-3 text-emerald-500" />}
                         </div>
                      </td>
                      <td className="px-4 py-4">
                        {s.metrics.matrix_accounts === 0 ? (
                           <div className="flex flex-col items-start">
                              <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                                <InfoIcon className="w-3 h-3" /> 未配置矩阵账号
                              </span>
                              <Button 
                                variant="link" 
                                className="h-auto p-0 text-[10px] text-indigo-600 font-bold"
                                onClick={(e) => { e.stopPropagation(); setShowConfig(true); }}
                              >去配置 →</Button>
                           </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[8px] font-bold uppercase text-slate-400">
                              <span>Matrix</span>
                              <span className="text-slate-700">{s.metrics.matrix_accounts}</span>
                            </div>
                            <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-indigo-400" style={{ width: `${(s.metrics.matrix_accounts / 30) * 100}%` }} />
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-bold text-slate-700">{(s.metrics.viral_ratio * 100).toFixed(1)}%</span>
                      </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Matrix Size & Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-8 bg-white border-slate-200 shadow-sm">
           <h3 className="text-sm font-bold text-slate-800 mb-8 flex items-center gap-2">
             <Users className="w-4 h-4 text-indigo-600" />
             矩阵规模对比 (自有账号 vs 合作 KOL)
           </h3>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={matrixData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Legend />
                  <Bar dataKey="matrix" name="自有矩阵账号" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="kol" name="合作 KOL 数" stackId="a" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
           </div>
        </Card>

        <Card className="p-8 bg-white border-slate-200 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            内容策略对比
          </h3>
          <div className="space-y-4">
             <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">商业笔记占比</span>
                   <span className="text-xs font-bold text-slate-900">{(activeCompStats?.metrics.commercial_ratio || 0) * 100}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                  <div className="h-full bg-amber-400" style={{ width: `${(activeCompStats?.metrics.commercial_ratio || 0) * 100}%` }} />
                  <div className="h-full bg-indigo-500" style={{ width: `${(ourStats?.metrics.commercial_ratio || 0) * 100}%` }} />
                </div>
                <div className="flex items-center justify-between text-[8px] font-bold text-slate-400 uppercase">
                   <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {activeCompStats?.name}
                   </div>
                   <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> 我方
                   </div>
                </div>
             </div>

             <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Top 热门话题</p>
                <div className="flex flex-wrap gap-2">
                   {activeCompStats?.metrics.top_topics.map(t => (
                     <span key={t.topic} className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center gap-1.5">
                       {t.topic}
                       <span className="text-slate-300 font-mono">{t.count}</span>
                     </span>
                   ))}
                </div>
             </div>

             <div className="pt-4 border-t border-slate-100">
               <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">平均笔记长度</span>
                  <span className="text-xs font-bold text-slate-900">{activeCompStats?.metrics.avg_length} 字</span>
               </div>
               <p className="text-[11px] text-slate-500 leading-relaxed font-serif italic">
                 {activeCompStats?.metrics.avg_length! > 1000 ? '内容侧重深度专业长文，倾向于建立专家人设。' : '内容侧重碎片化种草，倾向于高频、视觉驱动。'}
               </p>
             </div>
          </div>
        </Card>
      </div>

      {/* Discovery Entrance (P1) */}
      {ourStats?.has_discovery_enabled && (
        <Card className="bg-indigo-900 text-white p-8 rounded-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-700">
             <TrendingUp className="w-48 h-48" />
          </div>
          <div className="relative z-10 max-w-2xl">
             <div className="flex items-center gap-2 mb-4 bg-indigo-500/30 w-fit px-3 py-1 rounded-full border border-white/20">
                <Zap className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">智能竞品发现 (Beta)</span>
             </div>
             <h2 className="text-3xl font-bold font-display leading-tight mb-4">系统基于 AI 回答，<br />发现 {candidates.length} 个超高频出现的未关联账号。</h2>
             <p className="text-indigo-200 text-sm mb-8 font-serif italic">
               我们在针对“4K带云台投影仪”的 AI 回答中监测到某新兴品牌账号出现频率前周环比上升 240%，建议立即对标分析。
             </p>
             <div className="flex items-center gap-4">
                <Button 
                  onClick={() => setShowCandidates(true)}
                  className="bg-white text-indigo-900 hover:bg-slate-100 font-bold"
                >
                   查看详细名单
                </Button>
                <Button variant="ghost" className="text-indigo-200 hover:text-white font-bold">
                   稍后提醒
                </Button>
             </div>
          </div>
        </Card>
      )}

      {/* Candidate Drawer Overlay */}
      <AnimatePresence>
        {showCandidates && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCandidates(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                   <h3 className="font-bold text-slate-900">候选竞品发现</h3>
                   <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-0.5">每周扫描 Citation 自动发现频率 {'>'}= 5 的账号</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowCandidates(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                 {candidates.map(cand => (
                   <Card key={cand.candidate_id} className="p-4 border-slate-200 hover:border-indigo-200 transition-colors">
                      <div className="flex items-center gap-4 mb-4">
                         <img src={cand.avatar_url} className="w-12 h-12 rounded-full border border-slate-100" referrerPolicy="no-referrer" />
                         <div className="flex-1">
                            <p className="font-bold text-slate-900 leading-none">{cand.nickname}</p>
                            <div className="flex items-center gap-2 mt-2">
                               <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded">
                                 发现频率: {cand.discovery_freq}
                               </span>
                               <span className="text-[10px] text-slate-400 font-medium">首次监控: {new Date(cand.discovered_at).toLocaleDateString()}</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <Button 
                           variant="outline" 
                           className="flex-1 h-8 text-[10px] font-bold bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100"
                           onClick={() => handleCandidateAction(cand.candidate_id, 'ACCEPT')}
                         >
                            <Target className="w-3 h-3 mr-1.5" /> 关联为竞品
                         </Button>
                         <Button 
                           variant="outline" 
                           className="flex-1 h-8 text-[10px] font-bold bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100"
                           onClick={() => handleCandidateAction(cand.candidate_id, 'MATRIX')}
                         >
                            <Users className="w-3 h-3 mr-1.5" /> 加入自有矩阵
                         </Button>
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                           onClick={() => handleCandidateAction(cand.candidate_id, 'IGNORE')}
                         >
                            <X className="w-3.5 h-3.5" />
                         </Button>
                      </div>
                   </Card>
                 ))}
                 {candidates.length === 0 && (
                   <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                         <Check className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest">目前没有新的候选竞品</p>
                   </div>
                 )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Manual Configuration Modal */}
      <AnimatePresence>
        {showConfig && (
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowConfig(false)}
               className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
             />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative"
             >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                   <div>
                     <h3 className="text-xl font-bold text-slate-900">竞品手动配置</h3>
                     <p className="text-xs text-slate-500 mt-1">MVP 阶段限制每品牌最多配置 10 个竞品</p>
                   </div>
                   <Button variant="ghost" size="icon" onClick={() => setShowConfig(false)}>
                      <X className="w-5 h-5" />
                   </Button>
                </div>
                <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Plus className="w-3 h-3" /> 新增竞品
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="竞品品牌昵称" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" />
                        <input type="text" placeholder="关键词(逗号分隔)" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" />
                      </div>
                      <Button className="w-full bg-slate-900 text-white font-bold h-11">确认添加竞品</Button>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                         <LinkIcon className="w-3 h-3" /> 已有竞品账号关联
                      </h4>
                      <div className="space-y-2">
                         {stats.filter(s => s.competitor_id !== 'OURS').map(c => (
                           <div key={c.competitor_id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                             <div className="flex items-center gap-2">
                                <div className="relative">
                                   <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                   <input 
                                     type="text" 
                                     placeholder="粘贴小红书主页链接 / 输入昵称" 
                                     className="bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-[10px] w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                                   />
                                </div>
                                <Button size="sm" className="h-8 px-4 bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 font-bold text-[10px]">确认关联</Button>
                             </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
                <div className="p-8 bg-slate-50 mt-auto border-t border-slate-100 flex justify-end">
                   <Button onClick={() => setShowConfig(false)} className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold px-8 h-12 shadow-lg shadow-indigo-200">
                     保存并关闭
                   </Button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
