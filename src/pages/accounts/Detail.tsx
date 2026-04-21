import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  BarChart3, 
  History, 
  TrendingUp, 
  FileText,
  PieChart as PieChartIcon,
  Loader2,
  ExternalLink,
  Award
} from 'lucide-react';
import { MatrixAccount, CitedNote } from '@/types';
import { accountService } from '@/services/accountService';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const PIE_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

export function AccountDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const brandId = searchParams.get('brandId') || 'b_01HJK';

  const [account, setAccount] = useState<MatrixAccount | null>(null);
  const [notes, setNotes] = useState<CitedNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [accountData, notesData] = await Promise.all([
          accountService.getAccountById(id),
          accountService.getCitedNotes(id)
        ]);
        setAccount(accountData);
        setNotes(notesData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="p-12 text-center text-slate-500">
        找不该账号信息。
        <Button variant="link" onClick={() => navigate('/accounts/overview')}>返回列表</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/accounts/overview')} className="p-0 h-8 w-8 rounded-full border border-slate-200">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-bold font-display text-slate-900 tracking-tight">账号详情分析</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：账号基础卡 */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <img 
              src={account.avatar_url} 
              alt={account.nickname} 
              className="w-20 h-20 rounded-2xl border-2 border-indigo-50 shadow-sm object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{account.nickname}</h3>
              {account.nickname_history && account.nickname_history.length > 0 && (
                <p className="text-[10px] text-slate-400 mt-0.5">
                  曾用名: {account.nickname_history.map(h => h.nickname).join(', ')}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1 text-slate-500 text-xs font-medium">
                <span className="text-slate-400 font-mono">@{account.handle}</span>
                <span className="mx-1">|</span>
                <MapPin className="w-3 h-3" />
                <span>{account.ip_location}</span>
                <span className="mx-1">•</span>
                <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600">
                  {account.commercial_tier}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">个人简介</p>
            <p className="text-sm text-slate-600 leading-relaxed italic">"{account.bio}"</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <p className="text-xs font-bold text-indigo-900 mb-1">粉丝数</p>
              <p className="text-2xl font-bold font-display text-indigo-600">{(account.followers_count / 10000).toFixed(1)}w</p>
            </div>
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <p className="text-xs font-bold text-emerald-900 mb-1">内容活跃度</p>
              <p className="text-2xl font-bold font-display text-emerald-600">{account.notes_30d_count}</p>
              <p className="text-[10px] text-emerald-700 mt-1">近 30 天笔记</p>
            </div>
          </div>
        </Card>

        {/* 右侧：引用表现区 stats */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-white border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">被引笔记数</p>
            <h4 className="text-4xl font-bold font-display text-indigo-600">{account.cited_notes_count}</h4>
            <div className="flex items-center gap-1 mt-2 text-emerald-600 font-bold text-[10px]">
              <TrendingUp className="w-3 h-3" /> +12%
            </div>
          </Card>
          <Card className="p-6 bg-white border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">引用总次数</p>
            <h4 className="text-4xl font-bold font-display text-emerald-600">{account.total_citations}</h4>
            <div className="flex items-center gap-1 mt-2 text-emerald-600 font-bold text-[10px]">
              <TrendingUp className="w-3 h-3" /> +5%
            </div>
          </Card>
          <Card className="p-6 bg-white border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">平均引用位次</p>
            <h4 className="text-4xl font-bold font-display text-amber-500">{account.avg_citation_position.toFixed(1)}</h4>
            <div className="text-[10px] text-slate-400 mt-2 font-medium">行业均值: 4.2</div>
          </Card>
          <Card className="p-6 bg-white border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">爆文占比</p>
            <h4 className="text-4xl font-bold font-display text-rose-500">{(account.viral_note_ratio * 100).toFixed(0)}%</h4>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
               <div className="h-full bg-rose-500" style={{ width: `${account.viral_note_ratio * 100}%` }} />
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 近 30 天引用趋势 */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold font-display text-slate-900 flex items-center">
              <History className="w-4 h-4 mr-2 text-indigo-600" />
              近 30 天引用趋势
            </h3>
            <div className="flex gap-2">
              <span className="flex items-center text-[10px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mr-1.5" /> 每日引用量
              </span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={account.trend_data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  interval={4}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 笔记类型分布 */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
           <h3 className="font-bold font-display text-slate-900 mb-6 flex items-center">
            <PieChartIcon className="w-4 h-4 mr-2 text-indigo-600" />
            被引笔记类型分布
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-[250px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={account.note_type_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="type"
                  >
                    {account.note_type_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              {account.note_type_distribution.map((item, idx) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                    <span className="text-sm font-medium text-slate-600">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-900">{item.count} 篇</span>
                    <span className="text-xs text-slate-400 font-mono">
                      {(item.count / account.note_type_distribution.reduce((acc, curr) => acc + curr.count, 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* 该账号被引用笔记榜 (Top 20) */}
      <Card className="overflow-hidden bg-white border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold font-display text-slate-900 flex items-center">
            <Award className="w-4 h-4 mr-2 text-indigo-600" />
            该账号被引用笔记榜 (Top 20)
          </h3>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">RANKED BY CITATION COUNT</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">排名</th>
                <th className="px-6 py-4">笔记标题</th>
                <th className="px-6 py-4 text-center">被引次数</th>
                <th className="px-6 py-4 text-center">平均位次</th>
                <th className="px-6 py-4 text-center">发布时间</th>
                <th className="px-6 py-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {notes.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">暂无被引笔记数据</td></tr>
              ) : (
                notes.map((note, idx) => (
                  <tr key={note.note_id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                       <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${idx === 0 ? 'bg-amber-100 text-amber-700' : idx === 1 ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-500'}`}>
                         {idx + 1}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{note.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {note.note_id}</p>
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-indigo-600">
                      {note.citation_count}
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-slate-900">
                      {note.avg_position.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500 font-medium whitespace-nowrap">
                      {new Date(note.published_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 hover:bg-indigo-50 hover:text-indigo-600"
                        onClick={() => navigate(`/notes/${note.note_id}`)}
                      >
                        分析详情 <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
