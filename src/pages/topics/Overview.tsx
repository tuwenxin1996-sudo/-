import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, Search, Info, Download, Filter, MessageCircleQuestion } from 'lucide-react';
import { intelligenceService } from '@/services/intelligenceService';
import { TopicAnalysis } from '@/types';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export function TopicsOverview() {
  const [topics, setTopics] = useState<TopicAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await intelligenceService.getTopicAnalysis();
        setTopics(data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
          <h2 className="text-2xl font-bold text-slate-900 font-display">话题与问题分析</h2>
          <p className="text-slate-500 text-sm mt-1 italic font-serif">监测 AI 环境中高频出现的检索话题、品牌占比及讨论趋势</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-wider">
            <Download className="w-3.5 h-3.5 mr-2" /> 导出报表
          </Button>
          <Button className="bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider px-6">
            更新全局分析
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-indigo-600 text-white flex flex-col justify-between">
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">覆盖核心话题</span>
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                 <TrendingUp className="w-4 h-4" />
              </div>
           </div>
           <div className="mt-8">
              <span className="text-4xl font-bold font-display">{topics.length}</span>
              <span className="text-xs ml-2 opacity-60">个分类标签</span>
           </div>
           <p className="text-[11px] mt-4 opacity-70 italic font-serif">话题覆盖度环比上周提升 12.5%，新增“氛围感”热词。</p>
        </Card>

        <Card className="p-6 bg-white border-slate-200 shadow-sm md:col-span-2">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">话题分布概览 (MVP)</h3>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-indigo-600" /> 我方笔记占比
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-slate-200" /> 竞品合计占比
                 </div>
              </div>
           </div>
           <div className="space-y-4 pt-2">
              {topics.slice(0, 3).map(topic => (
                <div key={topic.tag} className="space-y-1.5">
                   <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-700">{topic.tag}</span>
                      <span className="text-slate-400">Total: {topic.count}</span>
                   </div>
                   <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-indigo-600" style={{ width: `${topic.our_ratio * 100}%` }} />
                      <div className="h-full bg-slate-300" style={{ width: `${topic.competitor_ratio * 100}%` }} />
                      <div className="h-full bg-slate-100" style={{ width: `${(1 - topic.our_ratio - topic.competitor_ratio) * 100}%` }} />
                   </div>
                </div>
              ))}
           </div>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="p-0 bg-white border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
           <h3 className="text-sm font-bold text-slate-800">话题标签分析表 (MVP 简版)</h3>
           <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="搜索标签..." 
                  className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs w-48 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                />
              </div>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                 <Filter className="w-4 h-4 text-slate-400" />
              </Button>
           </div>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                 <tr>
                    <th className="px-6 py-4">标签名称</th>
                    <th className="px-4 py-4">出现次数</th>
                    <th className="px-4 py-4">我方笔记占比</th>
                    <th className="px-4 py-4">竞品占比</th>
                    <th className="px-6 py-4 w-40">近 7 天趋势</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {topics.map((topic) => (
                   <tr key={topic.tag} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{topic.tag}</span>
                            <Info className="w-3 h-3 text-slate-300 cursor-help" />
                         </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-slate-500 font-medium">
                         {topic.count.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                         <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-700">{(topic.our_ratio * 100).toFixed(1)}%</span>
                            <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-indigo-600" style={{ width: `${topic.our_ratio * 100}%` }} />
                            </div>
                         </div>
                      </td>
                      <td className="px-4 py-4">
                         <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-700">{(topic.competitor_ratio * 100).toFixed(1)}%</span>
                            <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-slate-300" style={{ width: `${topic.competitor_ratio * 100}%` }} />
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="h-8 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                               <LineChart data={topic.trend}>
                                  <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={false} />
                               </LineChart>
                            </ResponsiveContainer>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </Card>

      {/* Placeholder for M+1 Features */}
      <Card className="p-8 bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center text-center">
         <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-200 mb-4">
            <MessageCircleQuestion className="w-6 h-6 text-slate-400" />
         </div>
         <h4 className="text-sm font-bold text-slate-900">M+1 迭代预告</h4>
         <p className="text-xs text-slate-500 max-w-sm mt-1 font-serif italic">
            下一版本将上线“问题语义聚类”与“关键词引用情感分析”，提供更深度的用户意图洞察。
         </p>
      </Card>
    </div>
  );
}
