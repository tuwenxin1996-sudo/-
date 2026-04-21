import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  Eye, 
  ExternalLink, 
  Loader2,
  ChevronRight,
  UserCheck,
  Download,
  X,
  XCircle,
  ArrowLeft
} from 'lucide-react';
import { MatrixAccount, AccountGroup } from '@/types';
import { accountService } from '@/services/accountService';
import { motion, AnimatePresence } from 'motion/react';

// Simple Swords icon replacement since Swords is not imported directly from lucide-react in the same way
const Swords = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 17.5 3 6V3h3l11.5 11.5" />
    <path d="m13 19 6-6" />
    <path d="m16 16 4 4" />
    <path d="m19 21 1-1" />
    <path d="M14.5 6.5 18 3h3v3l-3.5 3.5" />
    <path d="m15 5 4 4" />
  </svg>
);

const GROUP_CONFIG: Record<AccountGroup, { label: string, color: string, bg: string, icon: any }> = {
  OWN_MAIN: { label: '自有主号', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Users },
  OWN_SUB: { label: '自有矩阵', color: 'text-indigo-500', bg: 'bg-indigo-50/50', icon: Users },
  OWN_EMPLOYEE: { label: '员工/内部', color: 'text-blue-600', bg: 'bg-blue-50', icon: UserCheck },
  COMPETITOR: { label: '竞品矩阵', color: 'text-rose-600', bg: 'bg-rose-50', icon: Swords },
  KOL_COLLAB: { label: '合作 KOL', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: UserCheck },
  KOL_POTENTIAL: { label: '潜在 KOL', color: 'text-amber-600', bg: 'bg-amber-50', icon: UserPlus }
};

export function AccountsOverview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const brandId = searchParams.get('brandId') || 'b_01HJK';
  
  const [accounts, setAccounts] = useState<MatrixAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('citation_weight_score');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isCompareMode, setIsCompareMode] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        let data = await accountService.getAccounts(brandId);
        
        // Sorting logic
        data = [...data].sort((a, b) => {
          const valA = (a as any)[sortBy] || 0;
          const valB = (b as any)[sortBy] || 0;
          return valB - valA;
        });

        setAccounts(data);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [brandId, sortBy]);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const stats = {
    OWN_MAIN: 1,
    OWN_SUB: 11,
    OWN_EMPLOYEE: 5,
    COMPETITOR: 8,
    KOL_COLLAB: 23,
    KOL_POTENTIAL: 15
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const selectedAccounts = accounts.filter(a => selectedIds.has(a.account_id));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 顶部分组概览卡 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {(Object.keys(GROUP_CONFIG) as AccountGroup[]).map((group, idx) => {
          const config = GROUP_CONFIG[group];
          const Icon = config.icon;
          return (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-4 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className={`absolute -right-4 -top-4 w-16 h-16 ${config.bg} rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity`} />
                <div className="flex flex-col gap-2 relative z-10 text-center sm:text-left">
                  <div className={`w-8 h-8 mx-auto sm:mx-0 ${config.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider line-clamp-1">{config.label}</p>
                    <h3 className={`text-xl font-bold font-display ${config.color}`}>
                      {stats[group]} <span className="text-[10px] font-medium text-slate-400">个</span>
                    </h3>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* 操作栏 */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto">
          <AnimatePresence>
            {selectedIds.size > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex gap-2 mr-2">
                <Button size="sm" variant="outline" className="h-9 px-4 bg-white border-slate-200 text-slate-700 font-bold text-xs" onClick={() => alert('已选账号修改分组')}>修改分组</Button>
                <Button size="sm" variant="outline" className="h-9 px-4 bg-white border-rose-100 text-rose-600 hover:bg-rose-50 font-bold text-xs" onClick={() => alert('已选账号移除监测')}>移除监测</Button>
                <Button size="sm" className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm" onClick={() => setIsCompareMode(true)} disabled={selectedIds.size < 2 || selectedIds.size > 3}>
                  对比选定 ({selectedIds.size})
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <Button variant="outline" size="sm" className="h-9 px-4 bg-white border-slate-200 text-slate-600 font-bold text-xs" onClick={() => alert('正在导出列表报告...')}>
            <Download className="w-3.5 h-3.5 mr-2" /> 导出报告
          </Button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto bg-white p-1 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-3">排序</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="h-8 px-2 bg-transparent text-xs font-bold text-slate-700 border-none outline-none cursor-pointer"
          >
            <option value="citation_weight_score">引用权重 (默认)</option>
            <option value="cited_notes_count">被引笔记量</option>
            <option value="followers_count">粉丝总数</option>
            <option value="notes_30d_count">内容活跃度</option>
          </select>
        </div>
      </div>

      {/* 账号列表表格 */}
      <Card className="overflow-hidden bg-white border-slate-200 shadow-sm min-h-[400px]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800 flex items-center">
            <Users className="w-4 h-4 mr-2 text-indigo-600" />
            所有监测账号 ({accounts.length})
          </h3>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs h-8 px-4 rounded-lg">添加监测账号</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                    checked={selectedIds.size === accounts.length && accounts.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(new Set(accounts.map(a => a.account_id)));
                      else setSelectedIds(new Set());
                    }}
                  />
                </th>
                <th className="px-3 py-4">账号</th>
                <th className="px-4 py-4">分组</th>
                <th className="px-4 py-4">粉丝量级</th>
                <th className="px-4 py-4">商业等级</th>
                <th className="px-4 py-4 text-center">近 30 天笔记数</th>
                <th className="px-4 py-4 text-center">被引笔记数</th>
                <th className="px-4 py-4 text-center">引用权重得分</th>
                <th className="px-4 py-4">趋势</th>
                <th className="px-6 py-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accounts.map((account) => {
                const isBanned = account.status === 'BANNED';
                const isNew = account.is_new_24h;

                return (
                  <tr key={account.account_id} className={`hover:bg-slate-50 transition-colors group ${isBanned ? 'bg-slate-50/50' : ''}`}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                        checked={selectedIds.has(account.account_id)}
                        onChange={() => toggleSelect(account.account_id)}
                      />
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={account.avatar_url} 
                            alt={account.nickname} 
                            className={`w-10 h-10 rounded-full border border-slate-200 object-cover ${isBanned ? 'grayscale opacity-50' : ''}`}
                            referrerPolicy="no-referrer"
                          />
                          {isBanned && (
                            <div className="absolute -bottom-1 -right-1 bg-rose-500 rounded-full border-2 border-white p-0.5" title="账号不可访问">
                              <XCircle className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <p className={`font-bold line-clamp-1 ${isBanned ? 'text-slate-400' : 'text-slate-900'}`}>{account.nickname}</p>
                             {isNew && (
                               <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded text-[9px] font-bold">24H 采集</span>
                             )}
                          </div>
                          {isBanned ? (
                            <p className="text-[10px] text-rose-500 font-medium italic">账号不可访问 (封禁/注销)</p>
                          ) : (
                            <p className="text-[10px] text-slate-400 font-mono">ID: {account.account_id}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${GROUP_CONFIG[account.group].bg} ${GROUP_CONFIG[account.group].color} border border-current opacity-80`}>
                        {GROUP_CONFIG[account.group].label}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-700">
                      {isNew ? <span className="text-slate-300">采集中...</span> : `${(account.followers_count / 10000).toFixed(1)}w`}
                    </td>
                    <td className="px-4 py-4">
                      <span className="min-w-[60px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px] text-center inline-block">
                        {isNew ? '--' : account.commercial_tier}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center font-mono font-bold text-slate-900">
                      {account.notes_30d_count}
                    </td>
                    <td className="px-4 py-4 text-center font-mono text-indigo-600 font-bold">
                      {account.cited_notes_count}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isBanned ? 'bg-slate-300' : 'bg-indigo-500'}`}
                            style={{ width: `${account.citation_weight_score}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold ${isBanned ? 'text-slate-400' : 'text-slate-600'}`}>{account.citation_weight_score.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {isBanned ? <ArrowLeft className="w-4 h-4 text-slate-300 opacity-0" /> : <TrendingUp className="w-4 h-4 text-emerald-500" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                        onClick={() => navigate(`/accounts/${account.account_id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 对比视图悬浮层 */}
      <AnimatePresence>
        {isCompareMode && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Swords className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">账号并行对比</h3>
                    <p className="text-xs text-slate-500 mt-0.5">对比所选账号的核心指标表现</p>
                  </div>
                </div>
                <Button variant="ghost" className="rounded-full h-10 w-10 p-0 hover:bg-slate-200" onClick={() => setIsCompareMode(false)}><X className="w-5 h-5" /></Button>
              </div>
              <div className="p-8 overflow-x-auto">
                <div className="flex gap-6 min-w-[800px]">
                  {selectedAccounts.map((a, i) => (
                    <div key={a.account_id} className="flex-1 bg-white border border-slate-100 rounded-2xl p-6 relative group overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 text-indigo-600 font-bold text-6xl">#0{i+1}</div>
                      <div className="flex items-center gap-3 mb-6 relative z-10">
                        <img src={a.avatar_url} className="w-12 h-12 rounded-xl border border-slate-100 object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <p className="font-bold text-slate-900">{a.nickname}</p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${GROUP_CONFIG[a.group].bg} ${GROUP_CONFIG[a.group].color}`}>
                            {GROUP_CONFIG[a.group].label}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: '引用权重', val: a.citation_weight_score, unit: '分' },
                          { label: '被引笔记', val: a.cited_notes_count, unit: '篇' },
                          { label: '粉丝总数', val: (a.followers_count / 10000).toFixed(1), unit: 'w' },
                          { label: '爆文率', val: (a.viral_note_ratio * 100).toFixed(0), unit: '%' }
                        ].map(metric => (
                          <div key={metric.label} className="flex justify-between items-end border-b border-slate-50 pb-2">
                            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{metric.label}</span>
                            <span className="text-sm font-bold text-slate-900 font-display">{metric.val}<span className="text-[10px] ml-0.5">{metric.unit}</span></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-center">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 px-8 rounded-full h-11 font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95" onClick={() => setIsCompareMode(false)}>确认对比并关闭</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
