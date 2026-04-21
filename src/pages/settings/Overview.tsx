import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Users, 
  MessageCircleQuestion, 
  Swords, 
  Bell, 
  Database,
  Plus,
  Trash2,
  Edit2,
  Upload,
  RefreshCw,
  Search as SearchIcon,
  Check,
  AlertCircle,
  Link as LinkIcon,
  FileSpreadsheet,
  X,
  Sparkles,
  Info,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { intelligenceService } from '@/services/intelligenceService';
import { AccountSearchResult, DiscoveredQuestion, BatchImportRow } from '@/types';
import { motion, AnimatePresence } from 'motion/react';

type SettingsTab = 'BRAND' | 'ACCOUNTS' | 'QUESTIONS' | 'COMPETITORS' | 'RULES' | 'COLLECTION';

export function SettingsOverview() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('BRAND');
  
  // Account Addition State
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [addMethod, setAddMethod] = useState<'LINK' | 'SEARCH' | 'CSV'>('LINK');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AccountSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Question Bank State
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [discoveredQuestions, setDiscoveredQuestions] = useState<DiscoveredQuestion[]>([]);
  const [isLoadingDiscovery, setIsLoadingDiscovery] = useState(false);

  const TABS = [
    { id: 'BRAND', name: '品牌与关键词', icon: Settings },
    { id: 'ACCOUNTS', name: '账号管理', icon: Users },
    { id: 'QUESTIONS', name: '问题库', icon: MessageCircleQuestion },
    { id: 'COMPETITORS', name: '竞品配置', icon: Swords },
    { id: 'RULES', name: '告警规则', icon: Bell },
    { id: 'COLLECTION', name: '数据采集', icon: Database },
  ];

  const handleSearchAccounts = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const results = await intelligenceService.searchAccounts(searchQuery);
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLoadDiscovery = async () => {
    setIsLoadingDiscovery(true);
    try {
      const questions = await intelligenceService.discoverNewQuestions('our_brand');
      setDiscoveredQuestions(questions);
    } finally {
      setIsLoadingDiscovery(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">监测配置</h2>
          <p className="text-slate-500 text-sm mt-1 italic font-serif">配置监测核心参数，管理账号、竞品及告警触发规则</p>
        </div>
        
        {/* Resource Quotas - MVP Limits */}
        <div className="hidden lg:flex items-center gap-6 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
           {[
             { label: '核心问题', current: 12, max: 20, unit: 'h' },
             { label: '高频问题', current: 45, max: 80, unit: '6h' },
             { label: '监测账号', current: 12, max: 100 },
             { label: '竞品实体', current: 4, max: 10 },
           ].map((quota) => (
             <div key={quota.label} className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{quota.label}</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                   <span className={cn(
                     "text-sm font-bold",
                     quota.current / quota.max > 0.8 ? "text-rose-500" : "text-slate-700"
                   )}>{quota.current}</span>
                   <span className="text-[10px] text-slate-300 font-medium">/</span>
                   <span className="text-xs text-slate-400 font-medium">{quota.max}{quota.unit ? `/${quota.unit}` : ''}</span>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
        {/* Sidebar Nav */}
        <div className="space-y-1">
           {TABS.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as SettingsTab)}
               className={cn(
                 "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left",
                 activeTab === tab.id 
                   ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                   : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
               )}
             >
               <tab.icon className="w-4 h-4" />
               {tab.name}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <Card className="lg:col-span-3 p-8 bg-white border-slate-200 shadow-sm min-h-[600px] flex flex-col relative overflow-hidden">
           {activeTab === 'BRAND' && (
             <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                   <h3 className="text-lg font-bold text-slate-900">品牌核心关键词</h3>
                   <Button size="sm" className="bg-indigo-600 text-white font-bold h-9 px-6 shadow-sm">
                      保存更改
                   </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">品牌名 / 别名</label>
                      <input type="text" defaultValue="峰米, Formovie" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
                      <p className="text-[10px] text-slate-400 italic font-serif">用于判定我方笔记及 AI 回复归属</p>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">核心产品词</label>
                      <input type="text" defaultValue="X5, S5, 投影仪, 激光投影" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">排除关键词</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">竞品品牌词串</label>
                      <input type="text" defaultValue="极米, 坚果, 当贝, 海信" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'ACCOUNTS' && (
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between">
                   <h3 className="text-lg font-bold text-slate-900">监测账号管理 ({12}/100)</h3>
                   <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-indigo-600 text-white font-bold h-9 px-6"
                        onClick={() => setShowAddAccount(true)}
                      >
                         <Plus className="w-4 h-4 mr-2" /> 添加账号
                      </Button>
                   </div>
                </div>
                
                <div className="space-y-3">
                   {[
                     { name: '峰米投影官方旗舰店', type: 'OWN_MAIN', id: '123456', avatar: 'https://picsum.photos/seed/a1/100/100' },
                     { name: '小红书影音博主-张三', type: 'OWN_MATRIX', id: '789012', avatar: 'https://picsum.photos/seed/a2/100/100' },
                   ].map((acc) => (
                     <div key={acc.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between group hover:border-indigo-200 transition-colors">
                        <div className="flex items-center gap-3">
                           <img src={acc.avatar} alt="" className="w-10 h-10 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
                           <div>
                              <p className="font-bold text-slate-900">{acc.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{acc.type} • ID: {acc.id}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600"><Edit2 className="w-4 h-4" /></Button>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === 'QUESTIONS' && (
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between">
                   <h3 className="text-lg font-bold text-slate-900">品牌问题库 ({56}/200)</h3>
                   <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-indigo-50 text-indigo-600 border-indigo-100 font-bold h-9 px-4"
                        onClick={() => { setShowDiscovery(true); handleLoadDiscovery(); }}
                      >
                         <Sparkles className="w-3.5 h-3.5 mr-2" /> 发现新问题
                      </Button>
                      <Button size="sm" className="bg-indigo-600 text-white font-bold h-9 px-6">
                         <Plus className="w-4 h-4 mr-2" /> 手动添加
                      </Button>
                   </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                   <Info className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                   <div className="text-xs text-amber-700 leading-relaxed font-serif italic">
                      系统检测到现有问题库中存在多处语义重复项。自动去重功能已锁定语义相似度 &gt; 0.9 的候选问题，建议定期清理合并。
                   </div>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                   {[
                     { q: '峰米X5和坚果N1S Pro哪个好？', freq: '1h', status: 'CORE' },
                     { q: '激光投影仪对眼睛有伤害吗？', freq: '6h', status: 'HIGH_FREQ' },
                     { q: 'Formovie S5 亮度够吗？', freq: 'DAILY', status: 'NORMAL' },
                   ].map((item, idx) => (
                     <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                           <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase tracking-wider">{item.freq}</span>
                           <span className="text-sm font-bold text-slate-700">{item.q}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><Trash2 className="w-3.5 h-3.5" /></Button>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === 'RULES' && (
             <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                   <h3 className="text-lg font-bold text-slate-900">系统告警触发规则</h3>
                   <Button size="sm" className="bg-indigo-600 text-white font-bold h-9 px-6 shadow-sm">
                      全部更新
                   </Button>
                </div>
                <div className="space-y-6">
                   {[
                     { name: '异常互动激增告警', desc: '单篇笔记 1 小时内互动超过预设均值 50% 时触发', threshold: '50', active: true },
                     { name: '竞品大规模投放预警', desc: '监测到竞品连续 3 次 AI 采集占比显著上升时触发', threshold: '20', active: true },
                     { name: '采集异常离线告警', desc: '采集节点由于验证码、封号等原因失败时，立即推送', active: true },
                   ].map((rule) => (
                     <div key={rule.name} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                        <div className="max-w-md">
                           <h4 className="font-bold text-slate-900 flex items-center gap-2">
                             {rule.name}
                             {rule.active && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                           </h4>
                           <p className="text-xs text-slate-500 mt-1 font-serif italic">{rule.desc}</p>
                        </div>
                        <div className="flex items-center gap-4">
                           {rule.threshold && (
                             <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">阈值</span>
                                <input type="text" defaultValue={rule.threshold} className="w-8 text-xs font-bold text-center outline-none" />
                                <span className="text-[10px] font-bold text-slate-400">%</span>
                             </div>
                           )}
                           <div className={cn(
                             "w-10 h-5 rounded-full relative cursor-pointer p-0.5 transition-colors",
                             rule.active ? "bg-indigo-600" : "bg-slate-300"
                           )}>
                              <div className={cn(
                                "w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                                rule.active ? "translate-x-5" : "translate-x-0"
                              )} />
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === 'COLLECTION' && (
             <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                   <h3 className="text-lg font-bold text-slate-900">底层数据采集状态</h3>
                   <Button size="sm" variant="outline" className="text-slate-600 border-slate-200 font-bold h-9 px-6 bg-white">
                      <RefreshCw className="w-4 h-4 mr-2" /> 全量热重载
                   </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <Card className="p-6 border-slate-100 bg-slate-50 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">采集节点状态</span>
                         <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-emerald-600 uppercase">Online</span>
                         </div>
                      </div>
                      <div className="mt-8 flex items-end justify-between">
                         <span className="text-2xl font-bold font-mono">14 / 15</span>
                         <Button variant="ghost" size="sm" className="h-6 text-[10px] font-bold text-indigo-600 p-0">诊断异常 →</Button>
                      </div>
                   </Card>

                   <Card className="p-6 border-slate-100 bg-slate-50">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">昨日请求负载</h4>
                      <div className="flex items-baseline gap-2">
                         <span className="text-2xl font-bold font-mono">2,840</span>
                         <span className="text-[10px] font-bold text-emerald-600">+12%</span>
                      </div>
                   </Card>

                   <Card className="p-6 border-slate-100 bg-indigo-600 text-white flex flex-col items-center justify-center text-center">
                      <AlertCircle className="w-6 h-6 mb-2 opacity-50" />
                      <h4 className="text-xs font-bold font-display">手动触发异步采集</h4>
                      <Button className="mt-4 bg-white text-indigo-600 text-[10px] font-bold h-8 px-6 hover:bg-slate-100">
                         立即触发
                      </Button>
                   </Card>
                </div>
             </div>
           )}

           <div className="mt-auto pt-8 flex items-center gap-4 text-[10px] text-slate-400 border-t border-slate-50 italic font-serif">
              <Check className="w-3 h-3 text-emerald-500" /> 配置实时同步中
              <span className="text-slate-200">|</span>
              当前数据权限: 品牌管理员
           </div>
        </Card>
      </div>

      {/* Account Addition Modal */}
      <AnimatePresence>
        {showAddAccount && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowAddAccount(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                 <div>
                    <h3 className="text-xl font-bold text-slate-900 font-display">添加监测账号</h3>
                    <p className="text-xs text-slate-500 mt-1">支持链接解析、昵称搜索及 CSV 批量导入</p>
                 </div>
                 <Button variant="ghost" size="icon" onClick={() => setShowAddAccount(false)} className="rounded-full">
                    <X className="w-5 h-5 text-slate-400" />
                 </Button>
              </div>

              <div className="flex border-b border-slate-100">
                 {([
                   { id: 'LINK', name: '主页链接', icon: LinkIcon },
                   { id: 'SEARCH', name: '昵称搜索', icon: SearchIcon },
                   { id: 'CSV', name: '批量导入', icon: FileSpreadsheet }
                 ] as const).map((m) => (
                   <button
                     key={m.id}
                     onClick={() => setAddMethod(m.id)}
                     className={cn(
                       "flex-1 py-4 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                       addMethod === m.id ? "text-indigo-600 bg-indigo-50/50" : "text-slate-400 hover:text-slate-600"
                     )}
                   >
                     <m.icon className="w-3.5 h-3.5" /> {m.name}
                   </button>
                 ))}
              </div>

              <div className="p-8 min-h-[300px]">
                 {addMethod === 'LINK' && (
                    <div className="space-y-4">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">粘贴账号主页 URL</label>
                       <div className="relative">
                          <input 
                            type="text" 
                            placeholder="https://www.xiaohongshu.com/user/profile/..." 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500" 
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300 uppercase">Auto Parse</div>
                       </div>
                       <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3">
                          <Info className="w-4 h-4 text-indigo-500 mt-0.5" />
                          <p className="text-[11px] text-indigo-700 leading-relaxed italic">
                             系统将自动解析 user_id 并检索现有数据库。若账号不存在，将自动排队创建新的监控任务。
                          </p>
                       </div>
                    </div>
                 )}

                 {addMethod === 'SEARCH' && (
                    <div className="space-y-6">
                       <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="输入小红书号或昵称..." 
                            className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500" 
                          />
                          <Button 
                            className="bg-indigo-600 px-6 h-12"
                            onClick={handleSearchAccounts}
                            disabled={isSearching}
                          >
                             {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : '搜索'}
                          </Button>
                       </div>
                       
                       <div className="space-y-2">
                          {searchResults.map((res) => (
                            <div key={res.xhs_user_id} className="p-3 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-50">
                               <div className="flex items-center gap-3">
                                  <img src={res.avatar_url} alt="" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                                  <div>
                                     <p className="text-sm font-bold text-slate-900">{res.nickname}</p>
                                     <p className="text-[10px] text-slate-400 font-medium">@{res.handle} • {res.followers_count.toLocaleString()} 粉丝</p>
                                  </div>
                               </div>
                               <Button size="sm" variant="outline" className="h-8 border-slate-200 text-xs font-bold">确认添加</Button>
                            </div>
                          ))}
                          {searchResults.length === 0 && !isSearching && (
                            <div className="py-12 text-center text-slate-400 text-xs italic font-serif">请输入关键词搜索候选账号</div>
                          )}
                       </div>
                    </div>
                 )}

                 {addMethod === 'CSV' && (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl py-12 px-8 text-center bg-slate-50/50 group hover:border-indigo-300 transition-colors">
                       <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                       </div>
                       <h4 className="font-bold text-slate-900 mb-1">CSV 批量导入</h4>
                       <p className="text-xs text-slate-500 mb-6 font-serif italic max-w-xs mx-auto">
                          单次最高支持 500 个账号，模板包含：handle_or_link, group, note。
                       </p>
                       <div className="flex gap-4">
                          <Button variant="outline" size="sm" className="bg-white border-slate-200 h-9 font-bold text-[10px] uppercase tracking-wider">下载模板</Button>
                          <Button className="bg-indigo-600 h-9 font-bold text-[10px] uppercase tracking-wider px-8">重选文件</Button>
                       </div>
                    </div>
                 )}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                 <Button variant="ghost" onClick={() => setShowAddAccount(false)} className="text-slate-500 font-bold">取消</Button>
                 <Button className="bg-indigo-600 px-10 font-bold h-11">开始导入</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Question Discovery Drawer */}
      <AnimatePresence>
        {showDiscovery && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
              onClick={() => setShowDiscovery(false)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-slate-100">
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-xl font-bold text-slate-900 font-display">发现新热点问题</h3>
                   </div>
                   <Button variant="ghost" size="icon" onClick={() => setShowDiscovery(false)} className="rounded-full">
                      <X className="w-5 h-5 text-slate-400" />
                   </Button>
                </div>
                <p className="text-xs text-slate-500 italic font-serif">基于 DotDotAI 语义提取，实时抓取关联的长尾推荐问题</p>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-6">
                 {isLoadingDiscovery ? (
                   <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                      <p className="text-xs text-slate-400 animate-pulse font-bold uppercase tracking-widest font-mono">Scanning DotDotAI Engine...</p>
                   </div>
                 ) : (
                   discoveredQuestions.map((q) => (
                     <div key={q.id} className="group relative">
                        <div className={cn(
                          "p-4 rounded-2xl border transition-all flex flex-col gap-3",
                          q.is_duplicate 
                            ? "bg-slate-50 border-slate-100 opacity-60" 
                            : "bg-white border-slate-200 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-50"
                        )}>
                           <div className="flex items-start justify-between">
                              <p className="text-sm font-bold text-slate-800 flex-grow pr-4">{q.text}</p>
                              {q.is_duplicate ? (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[9px] font-bold shrink-0">
                                   <AlertTriangle className="w-3 h-3" /> 重复率 {((q.similarity_score || 0) * 100).toFixed(0)}%
                                </div>
                              ) : (
                                <button className="p-2 rounded-full bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                   <Plus className="w-4 h-4" />
                                </button>
                              )}
                           </div>
                           
                           {q.is_duplicate && (
                             <div className="flex items-center gap-2 text-[10px] text-slate-400 italic">
                                <ArrowRight className="w-3 h-3" /> 建议与库内 ID: {q.duplicate_id} 合并
                             </div>
                           )}
                           
                           <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Source: {q.source}</span>
                              {!q.is_duplicate && (
                                <Button variant="ghost" size="sm" className="h-auto p-0 text-[10px] font-bold text-indigo-600">预览相关答案 →</Button>
                              )}
                           </div>
                        </div>
                     </div>
                   ))
                 )}
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Found {discoveredQuestions.length} New Candidates
                 </div>
                 <Button 
                   className="bg-indigo-600 px-8 font-bold h-11"
                   onClick={() => setShowDiscovery(false)}
                 >
                    完成批量同步
                 </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
