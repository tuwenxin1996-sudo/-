import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, ComposedChart
} from 'recharts';

const radarData = [
  { subject: '可见度', A: 85, B: 65, fullMark: 100 },
  { subject: '推荐度', A: 78, B: 60, fullMark: 100 },
  { subject: '内容质量', A: 86, B: 75, fullMark: 100 },
  { subject: '账号权威', A: 70, B: 50, fullMark: 100 },
  { subject: '互动率', A: 65, B: 85, fullMark: 100 },
  { subject: '用户偏好', A: 80, B: 70, fullMark: 100 },
];

const horizontalBarData = [
  { name: '竞品A', value: 45 },
  { name: '竞品B', value: 38 },
  { name: '我方品牌', value: 85 },
  { name: '竞品C', value: 20 },
];

const stackedTrendData = [
  { month: 'W1', top1: 15, top2_3: 30, top4_10: 55, line1: 85, line2: 40 },
  { month: 'W2', top1: 20, top2_3: 35, top4_10: 45, line1: 88, line2: 45 },
  { month: 'W3', top1: 25, top2_3: 40, top4_10: 35, line1: 92, line2: 38 },
  { month: 'W4', top1: 30, top2_3: 45, top4_10: 25, line1: 95, line2: 50 },
];

function MetricCard({ title, value, delta, isGood }: any) {
  return (
    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <div className="mt-2">
        <p className="text-xl font-black font-mono text-slate-900">{value}</p>
        <p className={`text-[10px] font-bold mt-1 flex items-center font-mono ${isGood ? 'text-green-600' : 'text-slate-500'}`}>
          {isGood ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowRight className="w-3 h-3 mr-0.5" />}
          {delta}
        </p>
      </div>
    </div>
  );
}

export function PerformanceOverview() {
  return (
    <div className="space-y-6 pb-12">
      {/* Top 6+1+X Cards */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold font-display text-slate-900 text-lg">核心指标体系 (6+1+X)</h3>
          <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800 text-xs font-bold">展开更多指标</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <MetricCard title="综合得分" value="82.5" delta="+2.1" isGood={true} />
          <MetricCard title="点点可见度" value="18.3%" delta="+1.2%" isGood={true} />
          <MetricCard title="点点推荐度" value="12.5%" delta="-0.5%" isGood={false} />
          <MetricCard title="日均引用笔记" value="145" delta="+12" isGood={true} />
          <MetricCard title="Top3 占有率" value="28%" delta="+5%" isGood={true} />
          <MetricCard title="互动转化率" value="4.2%" delta="持平" isGood={false} />
          <MetricCard title="负面提及率" value="0.1%" delta="-0.1%" isGood={true} />
        </div>
      </Card>

      {/* Middle Row: Radar + Horizontal Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold font-display text-slate-900 text-lg mb-4">6 大核心指标雷达对比</h3>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                 <PolarGrid />
                 <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                 <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                 <Radar name="我方品牌" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.5} />
                 <Radar name="行业优秀标准" dataKey="B" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} />
                 <Legend />
                 <Tooltip />
               </RadarChart>
             </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold font-display text-slate-900 text-lg mb-4">横向条形对比图</h3>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart
                 layout="vertical"
                 data={horizontalBarData}
                 margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
               >
                 <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontWeight: 600, fontSize: 12 }} width={80} />
                 <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px' }} />
                 <Bar dataKey="value" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={24} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom Row: Composed Trend */}
      <Card className="p-6">
        <h3 className="font-bold font-display text-slate-900 text-lg mb-4">Top 排名占比堆叠驻 + 多指标趋势图</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={stackedTrendData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid stroke="#f1f5f9" vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(val) => `${val}%`} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: '12px' }} />
              <Legend verticalAlign="top" height={36}/>
              <Bar yAxisId="left" dataKey="top1" stackId="a" fill="#10b981" name="Top 1 占有" barSize={32} radius={[0, 0, 4, 4]} />
              <Bar yAxisId="left" dataKey="top2_3" stackId="a" fill="#f59e0b" name="Top 2-3 占有" />
              <Bar yAxisId="left" dataKey="top4_10" stackId="a" fill="#e2e8f0" name="Top 4-10 占有" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="line1" stroke="#4f46e5" strokeWidth={3} name="综合增长趋势" dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line yAxisId="right" type="monotone" dataKey="line2" stroke="#ea580c" strokeWidth={3} name="行业平均线" dot={false} strokeDasharray="5 5" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
