import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Lock, 
  Smartphone, 
  ShieldCheck, 
  CreditCard, 
  Bell, 
  Monitor, 
  Download, 
  Plus, 
  ChevronRight, 
  Camera,
  LogOut,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Globe,
  MessageSquareShare,
  Zap,
  FileText,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { intelligenceService } from '@/services/intelligenceService';
import { UserProfile, SubscriptionInfo, LoginDevice, ExportJob } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type AccountTab = 'PROFILE' | 'SUBSCRIPTION' | 'SECURITY' | 'NOTIFICATIONS';

export function AccountSettings() {
  const [activeTab, setActiveTab] = useState<AccountTab>('PROFILE');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [devices, setDevices] = useState<LoginDevice[]>([]);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prof, sub, dev, jobs] = await Promise.all([
          intelligenceService.getUserProfile(),
          intelligenceService.getSubscriptionInfo(),
          intelligenceService.getLoginDevices(),
          intelligenceService.getExportJobs()
        ]);
        setProfile(prof);
        setSubscription(sub);
        setDevices(dev);
        setExportJobs(jobs);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const TABS = [
    { id: 'PROFILE', name: '个人资料', icon: User },
    { id: 'SUBSCRIPTION', name: '订阅服务', icon: CreditCard },
    { id: 'SECURITY', name: '账号安全', icon: ShieldCheck },
    { id: 'NOTIFICATIONS', name: '偏好设置', icon: Bell },
  ];

  if (loading || !profile) return (
    <div className="flex items-center justify-center p-24 animate-pulse">
      <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 font-display">账户设置</h2>
        <p className="text-slate-500 text-sm mt-1 italic font-serif">管理您的个人信息、订阅计划及安全偏好</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-1">
           {TABS.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as AccountTab)}
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
           <div className="mt-8 pt-8 border-t border-slate-100 px-4">
              <Button variant="ghost" className="w-full justify-start text-rose-500 font-bold gap-3 hover:bg-rose-50 hover:text-rose-600 rounded-xl">
                 <LogOut className="w-4 h-4" /> 退出登录
              </Button>
           </div>
        </div>

        {/* Content Area */}
        <Card className="lg:col-span-3 p-8 bg-white border-slate-200 shadow-sm min-h-[600px] flex flex-col relative overflow-hidden">
           
           {activeTab === 'PROFILE' && (
             <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
                {/* Avatar Section */}
                <div className="flex items-center gap-8 border-b border-slate-100 pb-8">
                   <div className="relative group">
                      <img src={profile.avatar_url} alt="" className="w-24 h-24 rounded-3xl border-4 border-slate-50 shadow-sm object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-slate-900/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                         <Camera className="w-6 h-6 text-white" />
                      </div>
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-xl font-bold text-slate-900 font-display">{profile.nickname}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">UID: {profile.uid}</p>
                      <div className="flex gap-2 mt-3">
                         <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase tracking-wider px-4">更换头像</Button>
                         <Button size="sm" variant="ghost" className="h-8 text-[10px] font-bold uppercase tracking-wider px-4 text-rose-500">移除</Button>
                      </div>
                   </div>
                </div>

                {/* Form Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">昵称</label>
                      <input type="text" defaultValue={profile.nickname} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">电子邮箱</label>
                      <div className="relative">
                         <input type="email" defaultValue={profile.email} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" />
                         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">已验证</span>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">手机号</label>
                      <input type="text" defaultValue={profile.phone} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">所属品牌</label>
                      <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 flex items-center justify-between">
                         峰米科技 (Formovie)
                         <Globe className="w-4 h-4 text-slate-300" />
                      </div>
                   </div>
                </div>

                {/* Third Party Bindings */}
                <div className="pt-6">
                   <h5 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider">第三方集成</h5>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.third_party_bindings.map((binding) => (
                        <div key={binding.provider} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                 {binding.provider === 'GOOGLE' && <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-4 h-4" alt="Google" />}
                                 {binding.provider === 'WECHAT' && <MessageSquareShare className="w-4 h-4 text-emerald-500" />}
                              </div>
                              <div>
                                 <p className="text-[11px] font-bold text-slate-900">{binding.nickname}</p>
                                 <p className="text-[9px] text-slate-400 font-medium">于 {binding.bound_at} 绑定</p>
                              </div>
                           </div>
                           <Button variant="ghost" size="sm" className="text-[10px] font-bold text-slate-400 hover:text-rose-500 px-0">解绑</Button>
                        </div>
                      ))}
                      <Button variant="outline" className="h-full min-h-[64px] border-dashed border-slate-200 text-slate-400 text-xs font-bold gap-2 rounded-2xl hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all">
                         <Plus className="w-4 h-4" /> 绑定新账号
                      </Button>
                   </div>
                </div>

                <div className="pt-10 flex justify-end">
                   <Button className="bg-indigo-600 text-white font-bold h-11 px-10 shadow-lg shadow-indigo-100">保存更新</Button>
                </div>
             </div>
           )}

           {activeTab === 'SUBSCRIPTION' && subscription && (
             <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
                {/* Plan Info */}
                <div className="relative p-10 bg-indigo-600 rounded-[2.5rem] text-white overflow-hidden shadow-xl shadow-indigo-100">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl select-none" />
                   <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                      <div>
                         <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                            <Zap className="w-3 h-3 text-amber-300 fill-amber-300" /> Current Plan
                         </div>
                         <h3 className="text-4xl font-bold font-display">{subscription.plan_name} 企业旗舰版</h3>
                         <p className="text-indigo-100 mt-2 text-sm font-medium flex items-center gap-2 italic">
                            将于 {new Date(subscription.expires_at).toLocaleDateString()} 自动续订
                         </p>
                      </div>
                      <Button className="bg-white text-indigo-600 font-bold px-8 h-12 shadow-xl hover:bg-slate-50">升级版本 / 管理包</Button>
                   </div>
                </div>

                {/* Usage Stats */}
                <div className="space-y-6">
                   <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <LineChartIcon className="w-3.5 h-3.5" /> 本计费周期资源统计
                   </h5>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {subscription.usage.map((item) => (
                        <div key={item.label} className="space-y-3">
                           <div className="flex justify-between items-end">
                              <div>
                                 <p className="text-xs font-bold text-slate-900">{item.label}</p>
                                 <p className="text-[10px] text-slate-400 font-medium">
                                    {item.current} / {item.max} {item.unit ? `/${item.unit}` : ''}
                                 </p>
                              </div>
                              <span className="text-sm font-bold font-mono text-slate-700">
                                 {Math.round((item.current / item.max) * 100)}%
                              </span>
                           </div>
                           <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.current / item.max) * 100}%` }}
                                className={cn(
                                   "h-full rounded-full transition-all",
                                   (item.current / item.max) > 0.8 ? "bg-rose-500" : "bg-indigo-600"
                                )}
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Export History (Module 10 MVP req) */}
                <div className="pt-6">
                   <div className="flex items-center justify-between mb-4">
                      <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">最近导出记录</h5>
                      <Button variant="ghost" size="sm" className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-50">查看全量记录 →</Button>
                   </div>
                   <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-50 shadow-sm">
                      {exportJobs.slice(0, 3).map((job) => (
                        <div key={job.id} className="p-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                 {job.format === 'PDF' ? <FileText className="w-4 h-4" /> : <FileSpreadsheet className="w-4 h-4" />}
                              </div>
                              <div>
                                 <p className="text-[11px] font-bold text-slate-900">{job.type.includes('WEEKLY') ? '品牌监测周报' : '全量数据导出'}</p>
                                 <p className="text-[9px] text-slate-400 font-medium">{new Date(job.created_at).toLocaleString()} • {job.format}</p>
                              </div>
                           </div>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-indigo-600"><Download className="w-3.5 h-3.5" /></Button>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'SECURITY' && (
             <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                   <h3 className="text-lg font-bold text-slate-900">账号安全中心</h3>
                   <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase">
                      <ShieldCheck className="w-3 h-3" /> 账号状态: 安全
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-indigo-200 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                            <Lock className="w-5 h-5 text-slate-400" />
                         </div>
                         <div>
                            <h4 className="text-sm font-bold text-slate-900">登录密码</h4>
                            <p className="text-xs text-slate-500 mt-0.5 italic font-serif">定期更换密码可提高账户安全性</p>
                         </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-9 px-6 font-bold text-[10px] uppercase tracking-wider border-slate-200">修改</Button>
                   </div>

                   <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-indigo-200 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-slate-400" />
                         </div>
                         <div>
                            <div className="flex items-center gap-2">
                               <h4 className="text-sm font-bold text-slate-900">双因素认证 (2FA)</h4>
                               <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full">建议开启</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 italic font-serif">为您的账号增加一层额外的保护建议</p>
                         </div>
                      </div>
                      <div className="w-10 h-5 rounded-full bg-slate-300 relative cursor-pointer p-0.5">
                         <div className="w-4 h-4 bg-white rounded-full transition-all shadow-sm" />
                      </div>
                   </div>
                </div>

                {/* Device Management */}
                <div className="pt-6">
                   <h5 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-indigo-500" /> 登录设备管理
                   </h5>
                   <div className="space-y-3">
                      {devices.map((device) => (
                        <div key={device.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm">
                           <div className="flex items-center gap-4">
                              <div className={cn(
                                 "w-2 h-2 rounded-full",
                                 device.is_current ? "bg-emerald-500" : "bg-slate-300"
                              )} />
                              <div>
                                 <p className="text-[11px] font-bold text-slate-900 flex items-center gap-2">
                                    {device.device_name}
                                    {device.is_current && <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">当前设备</span>}
                                 </p>
                                 <p className="text-[9px] text-slate-400 font-medium">
                                    {device.browser} • {device.location} • 最后活跃于 {new Date(device.last_active_at).toLocaleTimeString()}
                                 </p>
                              </div>
                           </div>
                           {!device.is_current && (
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-rose-500"><X className="w-4 h-4" /></Button>
                           )}
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'NOTIFICATIONS' && (
             <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="border-b border-slate-100 pb-6">
                   <h3 className="text-lg font-bold text-slate-900">告警通知偏好</h3>
                   <p className="text-xs text-slate-500 mt-1 italic font-serif">配置系统重要变动及业务预警的推送渠道</p>
                </div>

                <div className="space-y-6">
                   {[
                     { id: 'app', name: '站内信通知', desc: '在系统顶部铃铛图标处实时展示告警气泡', active: true },
                     { id: 'email', name: '邮件通知', desc: '关键任务失败或品牌受到恶意攻击时发送至您的邮箱', active: true },
                     { id: 'webhook', name: '企微 Webhook', desc: '通过企业微信机器人推送核心预警至部门群组', active: false },
                   ].map((item) => (
                     <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                        <div className="max-w-md">
                           <h4 className="font-bold text-slate-900">{item.name}</h4>
                           <p className="text-xs text-slate-500 mt-1 font-serif italic">{item.desc}</p>
                        </div>
                        <div className={cn(
                          "w-10 h-5 rounded-full relative cursor-pointer p-0.5 transition-colors",
                          item.active ? "bg-indigo-600" : "bg-slate-300"
                        )}>
                           <div className={cn(
                             "w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                             item.active ? "translate-x-5" : "translate-x-0"
                           )} />
                        </div>
                     </div>
                   ))}
                </div>

                <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4">
                   <ShieldAlert className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                   <div className="space-y-1">
                      <p className="text-xs font-bold text-amber-900">重要安全提示</p>
                      <p className="text-[11px] text-amber-800 leading-relaxed font-serif italic">
                         启用 企微 Webhook 后，请确保您的 Webhook URL 经过加密存储且未被泄露，否则可能面临业务数据快照泄露风险。
                      </p>
                   </div>
                </div>
             </div>
           )}

           <div className="mt-auto pt-8 flex items-center justify-between border-t border-slate-50">
              <div className="flex items-center gap-4 text-[10px] text-slate-400 italic font-serif">
                 <RefreshCw className="w-3 h-3 text-emerald-500" /> 安全审计已同步
                 <span className="text-slate-200">|</span>
                 上次登录: 12 分钟前 (上海, 中国)
              </div>
              <Button variant="ghost" size="sm" className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1">
                 <ExternalLink className="w-3 h-3" /> 用户协议与条款
              </Button>
           </div>
        </Card>
      </div>
    </div>
  );
}

function LineChartIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}
