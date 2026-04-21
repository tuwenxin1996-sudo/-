import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ExternalLink, 
  Clock, 
  Target, 
  TrendingUp, 
  MessageSquare,
  Heart,
  Star as FavIcon,
  Share2,
  Calendar,
  Loader2,
  LayoutGrid,
  ChevronRight,
  ShieldAlert,
  Download,
  AlertCircle
} from 'lucide-react';
import { noteService } from '@/services/noteService';
import { Note } from '@/types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'motion/react';

export function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [disputed, setDisputed] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await noteService.getNoteById(id);
        setNote(data);
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  const exportCitationsCSV = () => {
    const headers = ['Question', 'Citations', 'Pattern', 'Trend'];
    const data = [
      { question: '2024年哪款投影仪性价比最高？', citations: 45, pattern: 'FULL_QUOTE', trend: '+12' },
      { question: '家用投影仪怎么选不踩坑？', citations: 32, pattern: 'PARTIAL', trend: '+5' },
      { question: '千元投影仪真的能看出电影感吗？', citations: 28, pattern: 'FULL_QUOTE', trend: '+8' }
    ];
    
    const rows = data.map(d => [
      `"${d.question}"`,
      d.citations,
      d.pattern,
      d.trend
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `note_citations_${id}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDispute = () => {
    setDisputed(true);
    // In a real app, this would hit an API to put the note in a manual review queue
    alert("已将该笔记争议提交审核。");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center">
        <p className="text-slate-500 font-bold mb-4">未找到该笔记详情</p>
        <Button onClick={() => navigate('/notes')}>返回列表</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 font-bold" onClick={() => navigate('/notes')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> 返回监测列表
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-white border-slate-200">
             同步最新指标
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 h-9">
            <ExternalLink className="w-4 h-4 mr-2" /> 查看原贴
          </Button>
        </div>
      </div>

      {/* Hero: Basic Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className={`lg:col-span-2 p-8 bg-white border-slate-200 overflow-hidden relative ${note.status === 'DELETED' ? 'grayscale opacity-80' : ''}`}>
             <div className="flex flex-col md:flex-row gap-8 relative z-10">
               <div className="shrink-0 relative">
                 <img 
                   src={note.cover_url} 
                   className="w-48 h-64 rounded-2xl object-cover border border-slate-200 shadow-2xl shadow-indigo-100"
                   referrerPolicy="no-referrer"
                 />
                 {note.status === 'DELETED' && (
                   <div className="absolute inset-0 bg-slate-900/60 rounded-2xl flex items-center justify-center">
                      <span className="px-3 py-1 bg-white text-slate-900 font-bold text-xs rounded-lg shadow-lg">已删除 - 历史引用保留</span>
                   </div>
                 )}
               </div>
               <div className="flex-grow space-y-6">
                 <div>
                   <div className="flex items-center gap-2 mb-3">
                     <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 font-bold text-[10px] uppercase">
                       {note.content_type}
                     </span>
                     {note.commercial_tag && (
                       <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-bold text-[10px] uppercase">
                         {note.commercial_tag}
                       </span>
                     )}
                     {note.status !== 'ACTIVE' && (
                       <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                         note.status === 'PRIVATE' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'
                       }`}>
                         {note.status}
                       </span>
                     )}
                   </div>
                   <h1 className="text-3xl font-bold text-slate-900 font-display leading-tight">{note.title}</h1>
                 </div>

                 <div className="flex items-center gap-4">
                   <img src={note.author_avatar} className="w-10 h-10 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
                   <div>
                     <p className="font-bold text-slate-900">{note.author_nickname}</p>
                     <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-0.5">Author • {note.author_group}</p>
                   </div>
                 </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-y border-slate-100">
                  {[
                    { icon: Heart, val: (note.likes / 1000).toFixed(1) + 'k', label: 'Likes' },
                    { icon: FavIcon, val: (note.collects / 1000).toFixed(1) + 'k', label: 'Favorites' },
                    { icon: MessageSquare, val: note.comments, label: 'Comments' },
                    { icon: Share2, val: note.shares, label: 'Shares' },
                  ].map(stat => (
                    <div key={stat.label} className="text-center sm:text-left">
                      <div className="flex items-center gap-1.5 mb-1 justify-center sm:justify-start">
                        <stat.icon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                      </div>
                      <p className="text-lg font-bold text-slate-900 font-display">{stat.val}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">{new Date(note.published_at).toLocaleDateString()} 发布</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <LayoutGrid className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">话题: #智能家居 #测评</span>
                  </div>
                </div>
              </div>
           </div>
        </Card>

        {/* GEO Performance Cards */}
        <div className="space-y-4">
          <Card className="p-6 bg-indigo-600 text-white shadow-xl shadow-indigo-200 border-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Target className="w-24 h-24" />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1">GEO 累积引用</p>
               <h3 className="text-4xl font-bold font-display mb-4">{note.total_citation_count}<span className="text-sm ml-1 text-indigo-300 font-medium">次</span></h3>
               <div className="flex items-center gap-4 text-xs font-medium bg-indigo-500/30 p-3 rounded-xl border border-white/10">
                  <div className="flex-1">
                    <p className="text-indigo-200 text-[9px] uppercase font-bold mb-0.5">覆盖问题数</p>
                    <p className="font-bold">{note.covered_question_count} 个关键词分类</p>
                  </div>
                  <div className="w-px h-6 bg-white/20" />
                  <div className="flex-1">
                    <p className="text-indigo-200 text-[9px] uppercase font-bold mb-0.5">最高命中排名</p>
                    <p className="font-bold">第 1 位</p>
                  </div>
               </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-end border-b border-slate-50 pb-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">首次收录延迟</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span className="text-2xl font-bold font-display">1.2 <span className="text-sm text-slate-400">Days</span></span>
                </div>
              </div>
              <TrendingUp className="w-6 h-6 text-emerald-500 mb-1" />
            </div>
            <div className="pt-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">主要匹配 Pattern</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">
                  {note.citation_pattern === 'FULL_QUOTE' ? '整段精准引用' : '核心观点提取'}
                </span>
                <Target className="w-4 h-4 text-indigo-500" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Latency Curve Chart */}
      <Card className="p-8 bg-white border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">引用时效曲线 (AIS 收录时能)</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">横轴: 发布后天数 | 纵轴: 当日被引次数</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              <span className="text-xs font-bold text-slate-600">引用爆发期</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <span className="text-xs font-bold text-slate-600">常规收录</span>
            </div>
          </div>
        </div>
        <div className="h-[350px] w-full">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={note.latency_curve}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  label={{ value: 'Days after publish', position: 'insideBottom', offset: -5, fontSize: 10, fontWeight: 800, fill: '#cbd5e1' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    fontSize: '12px',
                    fontWeight: 700
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  dot={{ r: 4, fill: '#fff', stroke: '#6366f1', strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
                />
              </AreaChart>
           </ResponsiveContainer>
        </div>
      </Card>

      {/* Citation Details Table (Grouped by Question) */}
      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
           <h3 className="text-sm font-bold text-slate-800 flex items-center">
             <Target className="w-4 h-4 mr-2 text-indigo-600" />
             GEO 详细引用明细 (按问题聚合)
           </h3>
           <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDispute}
                disabled={disputed}
                className={`h-8 text-[10px] uppercase font-bold border-rose-200 ${disputed ? 'bg-slate-50 text-slate-400 border-slate-100' : 'text-rose-600 hover:bg-rose-50'}`}
              >
                <ShieldAlert className="w-3 h-3 mr-1" />
                {disputed ? '争议审核中' : '这不是我的笔记'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportCitationsCSV}
                className="h-8 text-[10px] uppercase font-bold text-slate-500 hover:text-slate-900 border-slate-200"
              >
                <Download className="w-3 h-3 mr-1" />
                导出 CSV
              </Button>
           </div>
        </div>
        <div className="p-0">
           {[
             { question: '2024年哪款投影仪性价比最高？', citations: 45, pattern: 'FULL_QUOTE', trend: '+12' },
             { question: '家用投影仪怎么选不踩坑？', citations: 32, pattern: 'PARTIAL', trend: '+5' },
             { question: '千元投影仪真的能看出电影感吗？', citations: 28, pattern: 'FULL_QUOTE', trend: '+8' }
           ].map((item, idx) => (
             <div key={idx} className="border-b border-slate-50 last:border-none p-6 hover:bg-slate-50/80 transition-colors group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                      <span className="text-indigo-600 font-bold text-xs">P{idx + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.question}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">引用方式: {item.pattern === 'FULL_QUOTE' ? '整段引用' : '局部提取'}</span>
                        <span className="text-[10px] text-slate-200">|</span>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">趋势: {item.trend}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">被引次数</p>
                      <p className="text-xl font-bold font-display text-slate-900">{item.citations}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full border border-slate-100 hover:bg-white hover:border-indigo-200">
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                    </Button>
                  </div>
                </div>
             </div>
           ))}
        </div>
      </Card>
    </div>
  );
}
