import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  FileSpreadsheet, 
  ChevronRight,
  Printer,
  Share2,
  Zap,
  X,
  AlertCircle,
  AlertTriangle,
  History,
  Info
} from 'lucide-react';
import { intelligenceService } from '@/services/intelligenceService';
import { ReportTemplate, ExportJob } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function ReportsOverview() {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    try {
      const [tplData, jobData] = await Promise.all([
        intelligenceService.getReportTemplates(),
        intelligenceService.getExportJobs()
      ]);
      setTemplates(tplData);
      setJobs(jobData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

  // Polling logic for incomplete jobs
  useEffect(() => {
    const incompleteJobs = jobs.filter(j => j.status === 'QUEUED' || j.status === 'PROCESSING');
    
    if (incompleteJobs.length > 0 && !pollingIntervalRef.current) {
      pollingIntervalRef.current = setInterval(async () => {
        const updatedJobs = await Promise.all(jobs.map(async (job) => {
          if (job.status === 'QUEUED' || job.status === 'PROCESSING') {
            const statusUpdate = await intelligenceService.getExportJobStatus(job.id);
            // Simulate progression
            if (statusUpdate.progress >= 95) {
               return { ...job, ...statusUpdate, status: 'READY' as const, progress: 100, download_url: '#' };
            }
            return { ...job, ...statusUpdate };
          }
          return job;
        }));
        setJobs(updatedJobs);
      }, 3000);
    } else if (incompleteJobs.length === 0 && pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, [jobs]);

  const handleTriggerExport = async () => {
    if (!selectedTemplate) return;
    setIsTriggering(true);
    try {
      const taskId = await intelligenceService.triggerExport({
        type: selectedTemplate.type === 'WEEKLY' ? 'WEEKLY_PDF' : 'MONTHLY_PDF',
        time_range: { start: '2024-04-14', end: '2024-04-20' },
      });

      const newJob: ExportJob = {
        id: taskId,
        brand_id: 'b_01',
        user_id: 'u_01',
        type: selectedTemplate.type === 'WEEKLY' ? 'WEEKLY_PDF' : 'MONTHLY_PDF',
        format: 'PDF',
        time_range: { start: '2024-04-14', end: '2024-04-20' },
        status: 'QUEUED',
        progress: 0,
        created_at: new Date().toISOString()
      };

      setJobs(prev => [newJob, ...prev]);
      setShowPreview(false);
    } finally {
      setIsTriggering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const getStatusIcon = (status: ExportJob['status'], format: ExportJob['format']) => {
    if (status === 'QUEUED' || status === 'PROCESSING') return <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />;
    if (status === 'READY') return format === 'PDF' ? <FileText className="w-4 h-4 text-rose-600" /> : <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
    if (status === 'FAILED') return <AlertTriangle className="w-4 h-4 text-rose-500" />;
    if (status === 'EXPIRED') return <Clock className="w-4 h-4 text-slate-400" />;
    return <FileText className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">报告与导出</h2>
          <p className="text-slate-500 text-sm mt-1 italic font-serif">生产高质量 PDF 品牌周报/月报，或导出全量数据明细</p>
        </div>
        
        {/* MVP Limits Display */}
        <div className="flex items-center gap-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl px-4 py-2">
           <Zap className="w-4 h-4 text-amber-500" />
           <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-900">
             今日剩余生成配额: <span className="text-indigo-600">8 / 10</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Templates Section */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <Zap className="w-3.5 h-3.5 text-amber-500" /> 报告智能生成模板
              </h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((tpl) => (
                <Card 
                   key={tpl.id} 
                   className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col cursor-pointer overflow-hidden relative"
                   onClick={() => { setSelectedTemplate(tpl); setShowPreview(true); }}
                >
                   <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                         <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full uppercase">
                         {tpl.type === 'WEEKLY' ? '周报 PDF' : '月报 PDF'}
                      </span>
                   </div>
                   <h4 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{tpl.name}</h4>
                   <p className="text-xs text-slate-500 font-serif italic leading-relaxed flex-grow">
                      {tpl.description}
                   </p>
                   <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="text-[10px] text-slate-300 font-medium">
                         Puppeteer SSR 渲染 • 含 12+ 图表
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                   </div>
                </Card>
              ))}

              <Card className="p-6 border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white hover:border-indigo-300 transition-all shadow-sm">
                 <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4 text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-600 transition-all">
                    <Download className="w-5 h-5" />
                 </div>
                 <h4 className="text-sm font-bold text-slate-600">明细数据导出</h4>
                 <p className="text-[11px] text-slate-400 mt-1 font-serif italic max-w-[180px]">支持笔记、引用、账号多维度 Excel/CSV 导出</p>
              </Card>
           </div>
        </div>

        {/* Recent Jobs Section */}
        <div className="space-y-6">
           <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <History className="w-3.5 h-3.5" /> 导出历史 (保留 7 天)
           </h3>
           <div className="space-y-3">
              {jobs.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs italic font-serif bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                  暂无导出记录
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between hover:border-slate-300 transition-all shadow-sm group">
                     <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          job.status === 'READY' ? (job.format === 'PDF' ? "bg-rose-50" : "bg-emerald-50") : "bg-slate-50"
                        )}>
                           {getStatusIcon(job.status, job.format)}
                        </div>
                        <div>
                           <p className="text-[11px] font-bold text-slate-900 leading-tight">
                              {job.type.includes('WEEKLY') ? '品牌监测周报' : job.type.includes('MONTHLY') ? '品牌监测月报' : '笔记明细数据'}
                           </p>
                           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mt-1 flex items-center gap-1.5">
                              {new Date(job.created_at).toLocaleDateString()}
                              <span className="text-slate-200">|</span>
                              {job.status === 'READY' ? (Math.random() * 5 + 2).toFixed(1) + 'MB' : job.status}
                           </p>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-2">
                        {(job.status === 'QUEUED' || job.status === 'PROCESSING') && (
                          <div className="flex flex-col items-end">
                             <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-indigo-600" 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${job.progress}%` }}
                                />
                             </div>
                             <span className="text-[8px] font-bold text-indigo-600 mt-1">{job.progress}%</span>
                          </div>
                        )}
                        {job.status === 'READY' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50">
                             <Download className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        {job.status === 'FAILED' && (
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                        )}
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>

      {/* PDF Report Preview Modal */}
      <AnimatePresence>
        {showPreview && selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
               onClick={() => setShowPreview(false)}
             />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
               className="bg-slate-100 rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] relative z-10 overflow-hidden flex flex-col"
             >
                {/* PDF Header Controls */}
                <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                         <FileText className="w-4 h-4" />
                      </div>
                      <div>
                         <h3 className="text-sm font-bold text-slate-900">PDF 报告预览</h3>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{selectedTemplate.name} • 12+ Pages</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-9 px-4 text-[11px] font-bold uppercase border-slate-200">
                         <Printer className="w-3.5 h-3.5 mr-2" /> 预览打印
                      </Button>
                      <Button variant="outline" size="sm" className="h-9 px-4 text-[11px] font-bold uppercase border-slate-200">
                         <Share2 className="w-3.5 h-3.5 mr-2" /> 邀请审阅
                      </Button>
                      <Button 
                         className="h-9 px-6 text-[11px] font-bold uppercase bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                         disabled={isTriggering}
                         onClick={handleTriggerExport}
                      >
                         {isTriggering ? (
                           <><Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> 触发生成中...</>
                         ) : (
                           <><Download className="w-3.5 h-3.5 mr-2" /> 立即生成 PDF 并下载</>
                         )}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setShowPreview(false)} className="rounded-full ml-4">
                         <X className="w-5 h-5 text-slate-400" />
                      </Button>
                   </div>
                </div>

                {/* PDF Content Area */}
                <div className="flex-grow overflow-y-auto p-12 bg-slate-200 flex flex-col items-center gap-12 scroll-hide">
                   {/* Cover Page */}
                   <div className="w-[700px] h-[980px] bg-white shadow-2xl rounded-sm flex flex-col relative overflow-hidden flex-shrink-0">
                      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-900 select-none" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
                      <div className="p-20 flex-grow flex flex-col justify-center gap-20 relative z-10">
                         <div className="space-y-4">
                            <Zap className="w-12 h-12 text-indigo-600" />
                            <h1 className="text-5xl font-bold text-slate-900 font-display">笔镜 NoteLens</h1>
                            <p className="text-xl text-slate-500 font-serif italic">Brand Intelligence Intelligence System</p>
                         </div>
                         <div className="space-y-2">
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-600 text-white rounded-full font-bold uppercase tracking-widest text-xs">
                               {selectedTemplate.type === 'WEEKLY' ? 'WEEKLY PERFORMANCE' : 'MONTHLY RECAP'}
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800">小红书品牌监测分析报告</h2>
                         </div>
                         <div className="space-y-6 pt-20 border-l-4 border-indigo-600 pl-8">
                            <div className="space-y-1">
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">报告主体</p>
                               <p className="text-lg font-bold text-slate-800">峰米投影 (Formovie)</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">监测周期</p>
                               <p className="text-sm font-medium text-slate-500">2024.04.14 - 2024.04.20 (7 Days)</p>
                            </div>
                         </div>
                      </div>
                      <div className="p-12 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                         <span>AIS-INTEL-REPORT-{selectedTemplate.id}</span>
                         <span>GENERATED BY Puppeteer-SSR-W1</span>
                      </div>
                   </div>

                   {/* Info Panel about the process */}
                   <div className="w-[700px] p-6 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4">
                      <Info className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-800 leading-relaxed font-serif italic">
                         报告生成流程说明：系统将启动 Puppeteer 无头浏览器进行 HTML2PDF 渲染。生成过程约需 15-45 秒，完成后将上传至 OSS 并生成有效期 7 天的下载链接。
                      </p>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
