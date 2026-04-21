import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  BarChart3, 
  Clock, 
  PieChart, 
  List, 
  Search, 
  Filter,
  ArrowRight,
  TrendingUp,
  LayoutGrid,
  Loader2,
  Download,
  AlertTriangle
} from 'lucide-react';
import { noteService } from '@/services/noteService';
import { Note } from '@/types';
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
  ReferenceArea
} from 'recharts';

type ViewMode = 'list' | 'latency' | 'content' | 'mode';

export function NotesOverview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const brandId = searchParams.get('brandId') || 'b_01HJK';
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeTab, setActiveTab] = useState<'OWN' | 'COMPETITOR' | 'KOL' | 'ALL'>('ALL');
  const [keywordFilter, setKeywordFilter] = useState<string | null>(null);
  const [latencyRange, setLatencyRange] = useState<[number, number] | null>(null);

  // Scatter selection state
  const [selection, setSelection] = useState<{ y1: number; y2: number } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const data = await noteService.getNotes(brandId);
        setNotes(data);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [brandId]);

  const filteredNotes = notes.filter(note => {
    const matchesTab = 
      activeTab === 'ALL' || 
      (activeTab === 'OWN' && (note.author_group === 'OWN_MAIN' || note.author_group === 'OWN_SUB' || note.author_group === 'OWN_EMPLOYEE')) ||
      (activeTab === 'COMPETITOR' && note.author_group === 'COMPETITOR') ||
      (activeTab === 'KOL' && (note.author_group === 'KOL_COLLAB' || note.author_group === 'KOL_POTENTIAL'));
    
    const matchesKeyword = !keywordFilter || note.tags?.includes(keywordFilter) || note.title.includes(keywordFilter);
    const isCited = note.citation_pattern !== 'NOT_CITED' || activeTab === 'ALL';
    const matchesLatency = !latencyRange || (note.avg_position >= latencyRange[0] && note.avg_position <= latencyRange[1]);

    return matchesTab && matchesKeyword && isCited && matchesLatency;
  });

  const exportToCSV = () => {
    const headers = ['Note ID', 'Title', 'Author', 'Group', 'Likes', 'Citations', 'Status'];
    const rows = filteredNotes.map(n => [
      n.note_id,
      `"${n.title.replace(/"/g, '""')}"`,
      n.author_nickname || '-',
      n.author_group || '-',
      n.likes,
      n.total_citation_count,
      n.status
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `notes_monitoring_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = [
    { label: '监测笔记总数', value: '1,280', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: '被引用笔记数', value: '456', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: '平均被引率', value: '35.6%', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '爆文数 (1k+赞)', value: '124', icon: LayoutGrid, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: '长尾型笔记', value: '332', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">笔记监测分析</h2>
          <p className="text-slate-500 text-sm mt-1 italic font-serif">追踪笔记引用效率、内容特征及发布到收录的时效曲线</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(['list', 'latency', 'content', 'mode'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === mode 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {mode === 'list' && <List className="w-3.5 h-3.5" />}
              {mode === 'latency' && <Clock className="w-3.5 h-3.5" />}
              {mode === 'content' && <BarChart3 className="w-3.5 h-3.5" />}
              {mode === 'mode' && <PieChart className="w-3.5 h-3.5" />}
              {mode === 'list' ? '列表视图' : mode === 'latency' ? '时效视图' : mode === 'content' ? '内容特征' : '引用方式'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="p-4 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold font-display text-slate-900 tracking-tight">{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters (Mock) */}
      <Card className="p-4 bg-white border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200 w-fit">
            {[
              { id: 'ALL', label: '全部笔记' },
              { id: 'OWN', label: '我方笔记' },
              { id: 'COMPETITOR', label: '竞品笔记' },
              { id: 'KOL', label: 'KOL 笔记' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {latencyRange && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">延迟范围: {latencyRange[0].toFixed(1)}d - {latencyRange[1].toFixed(1)}d</span>
                <button onClick={() => setLatencyRange(null)} className="text-emerald-400 hover:text-emerald-600">
                   <Filter className="w-3 h-3 rotate-180" />
                </button>
              </div>
            )}
            {keywordFilter && (
              <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">关键词: {keywordFilter}</span>
                <button onClick={() => setKeywordFilter(null)} className="text-indigo-400 hover:text-indigo-600">
                  <Filter className="w-3 h-3 rotate-180" />
                </button>
              </div>
            )}
            <div className="relative flex-grow max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索标题、标签..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                onChange={(e) => setKeywordFilter(e.target.value || null)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={exportToCSV} className="h-10 px-4 bg-white border-slate-200 font-bold text-xs flex items-center gap-2">
              <Download className="w-4 h-4" /> 导出 CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Main View */}
      <AnimatePresence mode="wait">
        {viewMode === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card className="overflow-hidden bg-white border-slate-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">笔记信息</th>
                      <th className="px-4 py-4">笔记类型</th>
                      <th className="px-4 py-4 text-center">互动量</th>
                      <th className="px-4 py-4 text-center">被引次数</th>
                      <th className="px-4 py-4">收录时效</th>
                      <th className="px-4 py-4">主要引用方式</th>
                      <th className="px-6 py-4 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredNotes.map((note) => (
                      <tr key={note.note_id} className={`hover:bg-slate-50 transition-colors group ${note.status === 'DELETED' ? 'opacity-60 grayscale' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative shrink-0">
                              <img 
                                src={note.cover_url} 
                                alt={note.title} 
                                className="w-12 h-16 rounded-lg object-cover border border-slate-200 shadow-sm"
                                referrerPolicy="no-referrer"
                              />
                              {note.status === 'DELETED' && (
                                <div className="absolute inset-0 bg-slate-900/40 rounded-lg flex items-center justify-center">
                                  <span className="text-[8px] font-bold text-white uppercase tracking-tighter">DELETED</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-slate-900 line-clamp-1 max-w-[240px]">{note.title}</p>
                                {note.status === 'PRIVATE' && <span className="bg-amber-100 text-amber-700 text-[8px] px-1 rounded font-bold">PRIVATE</span>}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <img src={note.author_avatar} className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{note.author_nickname}</span>
                                <span className="text-xs text-slate-200 mx-1">|</span>
                                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{note.author_group}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 font-bold text-[10px] uppercase">
                            {note.content_type}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center font-mono">
                          <span className="text-slate-900 font-bold">{(note.likes / 1000).toFixed(1)}k</span>
                          <span className="text-slate-400 text-[10px] ml-1">赞</span>
                        </td>
                        <td className="px-4 py-4 text-center font-mono text-indigo-600 font-bold">
                          {note.total_citation_count}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase whitespace-nowrap">首次被引于发布后</span>
                            <span className="font-bold text-slate-700">1.2 天</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                           <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-100 text-indigo-700 bg-indigo-50/30">
                            {note.citation_pattern === 'FULL_QUOTE' ? '整段引用' : note.citation_pattern === 'PARTIAL' ? '片断引用' : '仅链接'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 group-hover:bg-indigo-50 group-hover:text-indigo-600 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                            onClick={() => navigate(`/notes/${note.note_id}`)}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {viewMode === 'latency' && (
          <motion.div key="latency" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[500px] bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-8 flex items-center justify-between">
              <span>时效视图：发布时间 vs 首次被引延迟 (按 Y 轴框选钻取)</span>
              <span className="text-[10px] text-slate-400 font-medium">气泡大小代表引用总量</span>
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart 
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                onMouseDown={(e: any) => {
                  if (e) {
                    setIsSelecting(true);
                    setSelection({ y1: e.activeCoordinate.y, y2: e.activeCoordinate.y });
                  }
                }}
                onMouseMove={(e: any) => {
                  if (isSelecting && e) {
                    setSelection(prev => prev ? { ...prev, y2: e.activeCoordinate.y } : null);
                  }
                }}
                onMouseUp={() => {
                  if (isSelecting && selection) {
                    // Map generic vertical pixels to day values roughly for mock (0-14 days range)
                    const yMinPercent = Math.min(selection.y1, selection.y2) / 400;
                    const yMaxPercent = Math.max(selection.y1, selection.y2) / 400;
                    const dMin = (1 - yMaxPercent) * 14;
                    const dMax = (1 - yMinPercent) * 14;
                    setLatencyRange([Math.max(0, dMin), Math.min(14, dMax)]);
                    setViewMode('list');
                  }
                  setIsSelecting(false);
                  setSelection(null);
                }}
              >
                <XAxis type="number" dataKey="x" name="发布日期 (相对)" unit="天" hide />
                <YAxis type="number" dataKey="y" name="延迟" unit="天" domain={[0, 14]} />
                <ZAxis type="number" dataKey="z" range={[100, 1000]} name="引用量" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="笔记" data={filteredNotes.map((n, i) => ({
                  x: i * 5,
                  y: n.avg_position || (Math.random() * 12),
                  z: n.total_citation_count,
                  name: n.title
                }))} fill="#6366f1" />
                {isSelecting && selection && (
                  <ReferenceArea 
                    y1={selection.y1} // This is coordinate based, simplified for demo
                    y2={selection.y2}
                    fill="#6366f1"
                    fillOpacity={0.1}
                  />
                )}
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {viewMode === 'content' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-[400px] bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
               <h3 className="text-sm font-bold text-slate-800 mb-8">内容类型分布</h3>
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: '测评', count: 450 },
                    { name: '种草', count: 320 },
                    { name: '教程', count: 210 },
                    { name: '避坑', count: 180 },
                    { name: '好物', count: 120 }
                  ]}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {[0,1,2,3,4].map((_, i) => (
                        <Cell key={i} fill={i === 0 ? '#6366f1' : '#e2e8f0'} />
                      ))}
                    </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-[400px] bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
               <h3 className="text-sm font-bold text-slate-800 mb-8">关键词热力分布 (词云点击下钻)</h3>
               <div className="flex flex-wrap gap-3 items-center justify-center h-full">
                  {['投影仪', '沉浸式', '电影感', '性价比', '洗地机', '后悔晚买', '智能家居', '深度测评', '画质', '续航'].map((word, i) => (
                    <button 
                      key={word} 
                      onClick={() => { setKeywordFilter(word); setViewMode('list'); }}
                      className="font-bold text-slate-700 hover:text-indigo-600 transition-colors" 
                      style={{ fontSize: `${Math.max(12, 40 - i * 3)}px`, opacity: 1 - i * 0.08 }}
                    >
                      {word}
                    </button>
                  ))}
               </div>
            </motion.div>
          </div>
        )}

        {viewMode === 'mode' && (
          <motion.div key="mode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[500px] bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row items-center">
            <div className="flex-1 w-full h-full">
              <h3 className="text-sm font-bold text-slate-800 mb-8">引用深度占比</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={[
                      { name: '整段引用', value: 45 },
                      { name: '片段引用', value: 35 },
                      { name: '仅链接', value: 20 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#6366f1" />
                    <Cell fill="#818cf8" />
                    <Cell fill="#e2e8f0" />
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 p-8 space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">典型引用样本</h4>
              {[
                 { type: '整段引用', text: '“该投影仪在暗光环境下表现惊人，对比度极高，无虚焦现象...”', color: 'bg-indigo-50 border-indigo-100 text-indigo-700' },
                 { type: '片段引用', text: '“不仅画质优秀，而且其系统响应速度也非常快，几乎无延迟。”', color: 'bg-slate-50 border-slate-100 text-slate-600' }
              ].map((sample, i) => (
                <div key={i} className={`p-4 rounded-xl border ${sample.color}`}>
                  <p className="text-[10px] font-bold uppercase mb-2">{sample.type}</p>
                  <p className="text-sm italic italic font-serif leading-relaxed line-clamp-2">{sample.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
