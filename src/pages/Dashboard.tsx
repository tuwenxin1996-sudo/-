import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowRight, ExternalLink, Database, Bot, Smartphone, MessageCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { EmptyState } from '@/pages/Placeholder';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const trendData = [
  { date: '04-12', visibility: 0.16, recommendation: 0.11, cited_notes: 30, cited_accounts: 5 },
  { date: '04-13', visibility: 0.16, recommendation: 0.12, cited_notes: 32, cited_accounts: 5 },
  { date: '04-14', visibility: 0.15, recommendation: 0.10, cited_notes: 28, cited_accounts: 4 },
  { date: '04-15', visibility: 0.17, recommendation: 0.11, cited_notes: 35, cited_accounts: 6 },
  { date: '04-16', visibility: 0.16, recommendation: 0.12, cited_notes: 33, cited_accounts: 6 },
  { date: '04-17', visibility: 0.18, recommendation: 0.12, cited_notes: 38, cited_accounts: 7 },
  { date: '04-18', visibility: 0.183, recommendation: 0.125, cited_notes: 42, cited_accounts: 8 },
];

const initialAlerts = [
  { id: 1, title: '竞品A可见度超越我方 +3.2pp', type: 'warning', desc: '规则: R05 可见度断崖', time: '10分钟前' },
  { id: 2, title: '笔记"夏日防晒测评"首次被引用', type: 'info', desc: '笔记 ID: 19823xx', time: '2小时前' },
  { id: 3, title: '账号@子号3七日无引用', type: 'warning', desc: '规则: R02 账号沉默', time: '5小时前' },
  { id: 4, title: '系统健康检查正常', type: 'info', desc: '所有区域集群已同步', time: '12小时前' },
];

const topNotes = [
  { id: '1', title: '油皮亲妈！这款粉底液真的不暗沉', author: '@美妆课代表', views: 1204, position: 1 },
  { id: '2', title: '新手早八妆容分享，5分钟出门', author: '@早起鸟', views: 893, position: 2 },
  { id: '3', title: '夏日防晒大作战，这几款必入', author: '@爱防晒星人', views: 841, position: 1 },
  { id: '4', title: '平价口红推荐，学生党盲买不心疼', author: '@吃土少女', views: 622, position: 3 },
  { id: '5', title: '年度爱用好物大盘点', author: '@好物推荐官', views: 512, position: 2 },
];

const AVAILABLE_METRICS = [
  { id: 'visibility', name: '可见度', color: '#4f46e5', isPercent: true },
  { id: 'recommendation', name: '推荐度', color: '#cbd5e1', isPercent: true },
  { id: 'cited_notes', name: '引用笔记数', color: '#f59e0b', isPercent: false },
  { id: 'cited_accounts', name: '引用账号数', color: '#10b981', isPercent: false },
];

const clusterTasks = [
  { id: 1, persona: '一二线 / 女性 / 25-30岁', prompt: '夏天敏感肌用什么粉底液不出错？', result: '成功提取 5 篇推荐笔记', brandMention: '发现本品入选 (Top 1)' },
  { id: 2, persona: '二线 / 大学生 / 混干皮', prompt: '军训防晒平价推荐，不要泛白', result: '成功提取 4 篇推荐笔记', brandMention: null },
  { id: 3, persona: '新一线 / 职场新人', prompt: '求推荐平价早八通勤底妆组合', result: '成功提取 6 篇推荐笔记', brandMention: '发现本品入选 (Top 3)' },
  { id: 4, persona: '三线 / 宝妈 / 30-35岁', prompt: '有哪些遮瑕效果好又养肤的粉底液？', result: '成功提取 5 篇推荐笔记', brandMention: null },
];

function KpiCard({ title, value, delta, deltaType = 'up', suffix = '', onClick }: any) {
  const isUp = deltaType === 'up';
  const isFlat = deltaType === 'flat';
  return (
    <div 
      onClick={onClick}
      className="p-5 bg-white rounded-3xl border border-slate-200 transition-colors hover:border-slate-400 flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-md"
    >
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <div className="mt-2">
        <p className="text-2xl font-black font-mono text-slate-900">{value}<span className="text-xl">{suffix}</span></p>
        {!isFlat && delta && (
          <p className={`text-[10px] font-bold mt-2 flex items-center font-mono ${isUp ? 'text-green-600' : 'text-slate-500'}`}>
            <ArrowUpRight className={`w-3 h-3 mr-0.5 ${!isUp ? 'rotate-90 text-slate-500' : ''}`} />
            {delta}
          </p>
        )}
        {isFlat && delta && (
          <p className="text-[10px] font-medium mt-2 flex items-center text-slate-400 italic">
            <ArrowRight className="w-3 h-3 mr-0.5" />
            <span className="font-mono">{delta}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export function Dashboard() {
  const [searchParams] = useSearchParams();
  const currentBrandId = searchParams.get('brandId') || 'b_01HJK';

  const [alerts, setAlerts] = useState(initialAlerts);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['visibility', 'recommendation']);
  const navigate = useNavigate();

  if (currentBrandId === 'b_04NEW') {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4">
        <EmptyState 
          title="系统正在全力采集中" 
          description="您刚刚添加了此品牌。笔镜 NoteLens 正在为您建立完整的 GEO 索引与基线，数据采集中，预计 48 小时后完整可见。"
          icon={Database}
        />
      </div>
    );
  }

  const handleAlertClick = (id: number) => {
    navigate('/insights');
    // 模拟标记为已读
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const toggleMetric = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      if (selectedMetrics.length < 3) {
        setSelectedMetrics([...selectedMetrics, id]);
      } else {
        e.preventDefault(); // 超出3条阻止选中
      }
    } else {
      if (selectedMetrics.length > 1) {
        setSelectedMetrics(selectedMetrics.filter(m => m !== id));
      }
    }
  };

  // 获取当前图表中是否包含百分比类型和数值类型的指标，决定 Y 轴格式
  const activeMetrics = AVAILABLE_METRICS.filter(m => selectedMetrics.includes(m.id));
  const hasPercent = activeMetrics.some(m => m.isPercent);
  const hasNumber = activeMetrics.some(m => !m.isPercent);

  return (
    <div className="grid grid-cols-12 auto-rows-min gap-5">
      <div className="col-span-12 flex flex-col space-y-1 mt-2 mb-2">
        <h1 className="text-3xl font-bold font-display tracking-tight text-slate-900">早上好，Linda。</h1>
        <p className="text-slate-500 mt-1 max-w-md">本周可见度 <span className="font-mono font-bold">18.3%</span>，较上周 <span className="text-green-600 border-b border-green-600/30 font-mono font-bold">↑ 2.1pp</span></p>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-5">
        <KpiCard title="可见度" value="18.3" suffix="%" delta="2.1pp" deltaType="up" onClick={() => navigate('/performance')} />
        <KpiCard title="推荐度" value="12.5" suffix="%" delta="0.8pp" deltaType="up" onClick={() => navigate('/performance')} />
        <KpiCard title="引用笔记数" value="42" delta="5" deltaType="up" onClick={() => navigate('/notes')} />
        <KpiCard title="引用账号数" value="8" delta="持平" deltaType="flat" onClick={() => navigate('/accounts')} />
      </div>

      <Card className="col-span-12 lg:col-span-4 bg-slate-900 border-none text-white relative flex flex-col p-6 row-span-2 shadow-xl shadow-slate-200 overflow-hidden">
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold">告警流</h3>
              <p className="text-slate-400 text-xs mt-1 italic">近期异常与关键事件</p>
            </div>
            <button className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest hover:text-indigo-300">查看全部</button>
          </div>
          
          <div className="space-y-6 flex-grow overflow-y-auto scroll-hide">
            {alerts.length === 0 && (
              <p className="text-sm text-slate-400 italic">所有告警已确认</p>
            )}
            {alerts.map(alert => (
              <div 
                key={alert.id} 
                onClick={() => handleAlertClick(alert.id)}
                className="flex gap-4 group cursor-pointer"
              >
                <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.1)] transition-transform group-hover:scale-125 ${
                  alert.type === 'warning' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]'
                }`} />
                <div>
                  <p className="text-sm font-semibold text-slate-100 leading-tight group-hover:text-amber-400 transition-colors">{alert.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{alert.desc}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-700/50">
             <button onClick={() => { setAlerts([]); navigate('/insights'); }} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/50 transition-colors">
               确认全部未读告警
             </button>
          </div>
        </div>
        <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none"></div>
      </Card>

      <Card className="col-span-12 lg:col-span-8 flex flex-col justify-between p-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-full">趋势分析</span>
            <h2 className="text-2xl font-bold font-display text-slate-900 mt-4">30 天多指标曲线</h2>
            <p className="text-slate-500 text-xs mt-1">最高可叠加选择 3 条指标对比</p>
          </div>
          <div className="flex space-x-4 items-center">
            {AVAILABLE_METRICS.map(metric => (
              <label key={metric.id} className={`flex items-center text-[10px] font-bold cursor-pointer transition-colors ${selectedMetrics.includes(metric.id) ? 'text-slate-900' : 'text-slate-400'}`}>
                <input 
                  type="checkbox" 
                  className="mr-1.5 accent-indigo-600 rounded cursor-pointer"
                  checked={selectedMetrics.includes(metric.id)}
                  onChange={(e) => toggleMetric(metric.id, e)}
                />
                <div className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: metric.color, opacity: selectedMetrics.includes(metric.id) ? 1 : 0.3 }}></div>
                {metric.name}
              </label>
            ))}
          </div>
        </div>
        <div className="h-[220px] w-full mt-6 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
              
              {hasPercent && (
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} tickFormatter={(val) => `${(val * 100).toFixed(0)}%`} width={50} />
              )}
              {hasNumber && (
                 <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} width={40} />
              )}

              <Tooltip 
                formatter={(value: number, name: string) => {
                  const metric = AVAILABLE_METRICS.find(m => m.name === name);
                  if (metric?.isPercent) return [`${(value * 100).toFixed(1)}%`, name];
                  return [value, name];
                }}
                contentStyle={{ borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
              />
              
              {activeMetrics.map((metric) => (
                <Line 
                  key={metric.id}
                  yAxisId={metric.isPercent ? "left" : "right"}
                  type="monotone" 
                  dataKey={metric.id} 
                  name={metric.name} 
                  stroke={metric.color} 
                  strokeWidth={3} 
                  dot={{ r: 0, strokeWidth: 2 }} 
                  activeDot={{ r: 6, fill: metric.color }} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Cluster Status Card */}
      <Card className="col-span-12 lg:col-span-4 bg-indigo-50 border-none shadow-sm relative flex flex-col p-6 rounded-3xl overflow-hidden">
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-indigo-100 flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
                实时探测集群
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
              </h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mt-1">
                正在解析 "点点 AI" 回执
              </p>
            </div>
          </div>
          
          <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium">
            通过海量真机节点模拟用户行为，与小红书官方助手「点点」进行自然语言交互，逆向采集其推荐的真实笔记与排序基线。
          </p>

          <div className="flex-grow overflow-y-auto scroll-hide space-y-3 max-h-[300px] pr-1">
            {clusterTasks.map((task) => (
              <div key={task.id} className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl text-xs space-y-2.5 border border-indigo-100/50 shadow-sm relative overflow-hidden flex-shrink-0">
                <div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${task.brandMention ? 'bg-emerald-400' : 'bg-indigo-400'}`}></div>
                
                <div className="flex items-center gap-2.5 text-slate-500 font-medium pl-1">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">特征：{task.persona}</span>
                </div>
                
                <div className="flex items-start gap-2.5 text-indigo-700 font-bold pl-1">
                  <MessageCircle className="w-3.5 h-3.5 mt-0.5 text-indigo-500 flex-shrink-0" />
                  <span className="leading-tight">问：「点点」"{task.prompt}"</span>
                </div>
                
                <div className="flex items-start gap-2.5 text-slate-700 font-medium pl-1">
                  <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${task.brandMention ? 'text-emerald-500' : 'text-slate-400'}`} />
                  <div className="leading-tight flex flex-col gap-1.5 items-start">
                    <span>{task.result}</span>
                    {task.brandMention && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
                        <Sparkles className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                        {task.brandMention}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute right-[-20%] bottom-[-20%] w-64 h-64 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none"></div>
      </Card>

      <Card className="col-span-12 lg:col-span-8 p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-900 text-lg tracking-tight">今日引用 Top 5 笔记</h3>
          <button className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest hover:text-indigo-800">查看全部</button>
        </div>
        <div className="w-full overflow-x-auto scroll-hide">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              <tr>
                <th className="px-4 py-3 font-bold">排名</th>
                <th className="px-4 py-3 font-bold">笔记标题</th>
                <th className="px-4 py-3 font-bold">作者</th>
                <th className="px-4 py-3 font-bold text-right">被引用次数</th>
                <th className="px-4 py-3 font-bold text-right">平均位次</th>
                <th className="px-4 py-3 font-bold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 pt-2">
              {topNotes.map((note, idx) => (
                <tr 
                  key={note.id} 
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/notes/${note.id}`)}
                >
                  <td className="px-4 py-4 font-bold text-slate-400">
                    <span className="w-7 h-7 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">{idx + 1}</span>
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-800 max-w-[200px] truncate" title={note.title}>{note.title}</td>
                  <td className="px-4 py-4 text-slate-500 text-xs font-semibold">{note.author}</td>
                  <td className="px-4 py-4 text-right font-black text-slate-700">{note.views}</td>
                  <td className="px-4 py-4 text-right">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Top {note.position}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 hover:bg-slate-100 rounded-xl">
                      详情
                      <ExternalLink className="w-3 h-3 ml-1 text-slate-400 group-hover:text-indigo-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
    </div>
  );
}
