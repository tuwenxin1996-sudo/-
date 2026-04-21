import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  Lightbulb, 
  Bell, 
  FileText, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  History,
  MoreVertical,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { intelligenceService } from '@/services/intelligenceService';
import { StrategyRecommendation, Alert, DiagnosisReport } from '@/types';
import { cn } from '@/lib/utils';

export function InsightsOverview() {
  const [recs, setRecs] = useState<StrategyRecommendation[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [reports, setReports] = useState<DiagnosisReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'RECS' | 'ALERTS' | 'REPORTS'>('RECS');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [recsData, alertsData, reportsData] = await Promise.all([
          intelligenceService.getRecommendations(),
          intelligenceService.getAlerts(),
          intelligenceService.getReports()
        ]);
        setRecs(recsData);
        setAlerts(alertsData);
        setReports(reportsData);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">策略建议与告警</h2>
          <p className="text-slate-500 text-sm mt-1 italic font-serif">基于规则引擎产出的诊断报告、优化清单与实时告警</p>
        </div>
        <div className="flex items-center gap-4">
           {['RECS', 'ALERTS', 'REPORTS'].map((tab) => (
             <Button
               key={tab}
               variant="ghost"
               onClick={() => setActiveTab(tab as any)}
               className={cn(
                 "relative px-4 py-2 font-bold text-[10px] uppercase tracking-widest transition-all",
                 activeTab === tab ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
               )}
             >
               {tab === 'RECS' && '优化清单'}
               {tab === 'ALERTS' && '告警中心'}
               {tab === 'REPORTS' && '诊断报告'}
               {activeTab === tab && (
                 <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />
               )}
             </Button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {activeTab === 'RECS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recs.map((rec) => (
              <Card key={rec.id} className="p-6 bg-white border-slate-200 shadow-sm flex flex-col group hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    rec.priority === 'HIGH' ? "bg-rose-50 text-rose-600" : "bg-indigo-50 text-indigo-600"
                  )}>
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                    rec.priority === 'HIGH' ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"
                  )}>
                    {rec.priority === 'HIGH' ? '核心优化' : '建议关注'}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{rec.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-serif italic flex-grow">{rec.content}</p>
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">证据来源</span>
                      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600 mt-1">
                         <FileText className="w-3 h-3" />
                         {rec.source_evidence}
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </Button>
                      <Button size="sm" className="bg-indigo-600 text-white h-8 px-4 font-bold text-[10px]">
                        采纳
                      </Button>
                   </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'ALERTS' && (
          <Card className="p-0 bg-white border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <h3 className="text-sm font-bold text-slate-800">实时告警流水</h3>
                   <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full text-[10px] font-bold">
                        <AlertCircle className="w-3 h-3" /> 1 严重
                      </span>
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">
                        <AlertTriangle className="w-3 h-3" /> 1 警告
                      </span>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="outline" size="sm" className="bg-white text-[10px] h-8 font-bold border-slate-200 uppercase">
                      批量忽略
                   </Button>
                   <Button variant="outline" size="sm" className="bg-white text-[10px] h-8 font-bold border-slate-200 uppercase">
                      <Filter className="w-3.5 h-3.5 mr-2" /> 筛选
                   </Button>
                </div>
             </div>
             <div className="divide-y divide-slate-100">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-6 flex items-start gap-6 hover:bg-slate-50/50 transition-colors">
                     <div className={cn(
                       "p-3 rounded-xl",
                       alert.severity === 'CRITICAL' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                     )}>
                        {alert.severity === 'CRITICAL' ? <AlertCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                     </div>
                     <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {alert.type}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="text-[10px] font-bold text-slate-400">
                                {new Date(alert.created_at).toLocaleString()}
                              </span>
                           </div>
                           <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase text-slate-400 hover:text-slate-600">忽略</Button>
                              <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase text-indigo-600 hover:text-indigo-700">处理告警</Button>
                           </div>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{alert.message}</p>
                        {alert.related_note_id && (
                          <Button variant="link" className="p-0 h-auto text-[11px] text-indigo-600 font-bold mt-2">
                            查看关联笔记 <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                     </div>
                  </div>
                ))}
             </div>
          </Card>
        )}

        {activeTab === 'REPORTS' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="space-y-6">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <History className="w-3.5 h-3.5 mr-2" /> 历史诊断报告
                </h4>
                <div className="space-y-4">
                   {reports.map((report) => (
                     <Card key={report.id} className="p-6 bg-white border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                              <FileText className="w-6 h-6" />
                           </div>
                           <div>
                              <h5 className="font-bold text-slate-900 leading-none">{report.title}</h5>
                              <p className="text-xs text-slate-500 mt-2 font-serif italic">{report.date_range}</p>
                           </div>
                        </div>
                        <Button variant="outline" size="sm" className="bg-white border-slate-200 group-hover:border-indigo-200 group-hover:text-indigo-600">
                           <Download className="w-4 h-4" />
                        </Button>
                     </Card>
                   ))}
                </div>
             </div>

             <Card className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between h-[400px]">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                   <FileText className="w-48 h-48" />
                </div>
                <div className="relative z-10">
                   <div className="flex items-center gap-2 mb-4 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10">
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">最新报告速览</span>
                   </div>
                   <h3 className="text-2xl font-bold font-display mb-1">{reports[0]?.title}</h3>
                   <p className="text-slate-400 text-xs italic font-serif opacity-80">{reports[0]?.date_range}</p>
                </div>
                <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
                   {reports[0]?.core_metrics.map((metric) => (
                     <div key={metric.label}>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">{metric.label}</p>
                        <div className="flex items-baseline gap-2">
                           <span className="text-2xl font-bold font-mono">{metric.current}{metric.label.includes('率') || metric.label.includes('占比') ? '%' : ''}</span>
                           <span className={cn(
                             "text-[10px] font-bold",
                             metric.current > metric.previous ? "text-emerald-400" : "text-rose-400"
                           )}>
                             {metric.current > metric.previous ? '↑' : '↓'}
                           </span>
                        </div>
                     </div>
                   ))}
                </div>
                <Button className="relative z-10 w-full bg-white text-slate-900 font-bold h-12 rounded-xl mt-8 hover:bg-slate-100 transition-colors">
                   下载完整 PDF 诊断报告
                </Button>
             </Card>
          </div>
        )}
      </div>
    </div>
  );
}
