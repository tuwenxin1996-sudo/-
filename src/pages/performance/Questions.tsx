import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  ExternalLink, 
  Loader2, 
  LogIn, 
  ChevronDown, 
  ChevronRight, 
  Upload, 
  Sparkles,
  AlertCircle,
  FileText
} from 'lucide-react';
import { AIQuestion, AIAnswer } from '@/types';
import { questionService } from '@/services/questionService';
import { seedMockQuestions } from '@/services/seedService';
import { brandService } from '@/services/brandService';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

const TYPE_LABELS: Record<string, string> = {
  BRAND: '品牌词搜索',
  PRODUCT: '产品推荐',
  SCENE: '场景求助',
  COMPARE: '竞品对比',
  LONG_TAIL: '长尾流量'
};

const PRIORITY_LABELS: Record<string, string> = {
  CORE: '核心',
  HIGH: '高',
  NORMAL: '正常'
};

const FAILURE_LABELS: Record<string, string> = {
  captcha: '触发人机验证',
  timeout: '网络采集超时',
  parse_error: '页面内容解析失败'
};

export function PerformanceQuestions() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const brandId = searchParams.get('brandId') || 'b_01HJK';
  
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [expandingAnswer, setExpandingAnswer] = useState<Record<string, AIAnswer | null>>({});
  const [loadingAnswerId, setLoadingAnswerId] = useState<string | null>(null);

  // Discovery / Add Modal states (simplified)
  const [showDiscovery, setShowDiscovery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchQuestions = async () => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const brandName = 'XX美妆'; 
      await brandService.ensureBrandExists(brandId, brandName);
      let data = await questionService.getQuestions(brandId);
      
      if (data.length === 0) {
        await seedMockQuestions(brandId);
        data = await questionService.getQuestions(brandId);
      }
      
      setQuestions(data);
    } catch (error: any) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        fetchQuestions();
      } else {
        setQuestions([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [brandId]);

  const toggleRow = async (qId: string) => {
    if (expandedRow === qId) {
      setExpandedRow(null);
      return;
    }
    
    setExpandedRow(qId);
    if (!expandingAnswer[qId]) {
      setLoadingAnswerId(qId);
      try {
        const ans = await questionService.getLatestAnswer(brandId, qId);
        setExpandingAnswer(prev => ({ ...prev, [qId]: ans }));
      } finally {
        setLoadingAnswerId(null);
      }
    }
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`CSV批量导入已启动: ${file.name}\n符合模板: question_text, question_type, priority`);
      // Here real CSV parse & bulk add logic
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <Card className="p-2 flex flex-wrap gap-3 items-center bg-white shadow-sm border-slate-200 flex-grow">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="搜索问题关键词..." 
              className="w-full h-9 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow transition-colors focus:bg-white" 
            />
          </div>
          <select className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow focus:bg-white transition-colors">
            <option value="">所有类型</option>
            {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <Button variant="outline" size="sm" className="ml-auto" onClick={fetchQuestions}>刷新数据</Button>
        </Card>

        <div className="flex gap-2 shrink-0">
          <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileChange} />
          <Button variant="outline" size="sm" className="bg-white border-slate-200" onClick={handleImportClick}>
            <Upload className="w-3.5 h-3.5 mr-2" /> 批量导入
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowDiscovery(true)}>
            <Sparkles className="w-3.5 h-3.5 mr-2" /> 发现新问题
          </Button>
        </div>
      </div>

      {/* Discovery Candidate Banner */}
      <AnimatePresence>
        {showDiscovery && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-indigo-50 border-indigo-100 p-4 mb-6 relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors" />
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-indigo-900 font-display">智能推荐补齐</h4>
                    <p className="text-xs text-indigo-700 mt-0.5">从“点点 AI 相关推荐”中抓取的新候选问题，补充您的 GEO 防御体系。</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        '夏天出油如何保持底妆不花？', 
                        '混油皮夏日护肤精简方案是什么？',
                        '笔镜持妆粉底液和竞品A哪款更遮瑕？',
                        '早八党必备：5分钟出门的底妆方案',
                        '底妆暗沉发灰怎么办？求抗氧粉底液推荐',
                        '适合大油田在三亚旅游用的粉底液？'
                      ].map(q => (
                        <div key={q} className="px-3 py-1.5 bg-white border border-indigo-100 rounded-lg text-[11px] font-medium text-slate-700 flex items-center shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
                          <span className="group-hover:text-indigo-600 transition-colors">{q}</span>
                          <button className="ml-2 text-indigo-400 group-hover:text-indigo-600 font-bold">+</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-100" onClick={() => setShowDiscovery(false)}>隐藏</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Questions Table */}
      <Card className="overflow-hidden bg-white shadow-sm border-slate-200 min-h-[400px] flex flex-col">
        {!auth.currentUser ? (
          <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <LogIn className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">需要登录</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-xs">查看和管理问答库需要先完成身份验证。</p>
            <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700" onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}>立即登录</Button>
          </div>
        ) : loading ? (
          <div className="flex-grow flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <span className="ml-3 text-slate-500 font-medium font-display">索引处理中...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 pointer-events-none"></th>
                  <th className="px-3 py-4">检测问题</th>
                  <th className="px-6 py-4">类型</th>
                  <th className="px-6 py-4">优先级</th>
                  <th className="px-6 py-4">最近采集状态</th>
                  <th className="px-6 py-4">命中</th>
                  <th className="px-6 py-4 text-right">采集频率</th>
                  <th className="px-6 py-4 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {questions.length === 0 ? (
                   <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400 italic">暂无检测问题</td></tr>
                ) : (
                  questions.map(q => (
                    <React.Fragment key={q.question_id}>
                      <tr 
                        className={`hover:bg-slate-50 transition-colors cursor-pointer group ${expandedRow === q.question_id ? 'bg-indigo-50/20' : ''}`}
                        onClick={() => toggleRow(q.question_id)}
                      >
                        <td className="pl-6 py-4 w-4">
                          {expandedRow === q.question_id ? <ChevronDown className="w-4 h-4 text-indigo-600" /> : <ChevronRight className="w-4 h-4 text-slate-300" />}
                        </td>
                        <td className="px-3 py-4 font-bold text-slate-900">{q.question_text}</td>
                        <td className="px-6 py-4 min-w-[100px]">
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600">{TYPE_LABELS[q.question_type] || q.question_type}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] uppercase tracking-wider font-bold ${q.priority === 'CORE' ? 'text-indigo-600' : q.priority === 'HIGH' ? 'text-rose-500' : 'text-slate-500'}`}>
                            {PRIORITY_LABELS[q.priority] || q.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {q.status === 'FAILED' ? (
                            <div className="flex items-center text-rose-500 gap-1.5 font-medium" title={FAILURE_LABELS[q.failure_reason || 'parse_error']}>
                              <AlertCircle className="w-4 h-4 shrink-0" />
                              <span className="text-xs">采集失败</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-emerald-600 gap-1.5 font-medium">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <span className="text-xs">采集成功</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {Math.random() > 0.3 ? (
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                              <span className="text-xs font-bold text-slate-700">命中位次 1</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-slate-300" />
                              <span className="text-xs text-slate-400">未命中</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-medium text-slate-500">{q.frequency_minutes}m</td>
                        <td className="px-6 py-4 text-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="bg-white border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600"
                            onClick={(e) => { e.stopPropagation(); navigate(`/performance/answers/${q.question_id}`); }}
                          >
                            趋势 <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                          </Button>
                        </td>
                      </tr>
                      {/* Expansion Panel */}
                      <AnimatePresence>
                        {expandedRow === q.question_id && (
                          <tr>
                            <td colSpan={8} className="p-0 border-none">
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-slate-50 border-y border-slate-200 overflow-hidden"
                              >
                                <div className="p-6">
                                  {loadingAnswerId === q.question_id ? (
                                    <div className="flex items-center gap-3 text-slate-400 py-4">
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      <span className="text-xs font-display">正在加载最新复原答案...</span>
                                    </div>
                                  ) : expandingAnswer[q.question_id] ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                      <div className="md:col-span-2">
                                        <div className="flex items-center gap-2 mb-3">
                                          <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                                            <Sparkles className="w-3.5 h-3.5 text-white" />
                                          </div>
                                          <span className="text-xs font-bold text-slate-700 uppercase tracking-tighter">最新采集回答 (复活文本)</span>
                                        </div>
                                        <div className="prose prose-sm max-w-none text-slate-600 line-clamp-4 leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                          <Markdown>{expandingAnswer[q.question_id]?.parsed_answer_md}</Markdown>
                                        </div>
                                      </div>
                                      <div className="space-y-4">
                                        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">多维数据概览</p>
                                          <div className="space-y-3">
                                            <div className="flex justify-between items-center text-xs">
                                              <span className="text-slate-500">采集时间</span>
                                              <span className="font-mono text-slate-900">{new Date(expandingAnswer[q.question_id]?.collected_at || '').toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                              <span className="text-slate-500">回答哈希</span>
                                              <span className="font-mono text-slate-900 text-[10px]">{expandingAnswer[q.question_id]?.answer_hash.slice(0, 12)}...</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                              <span className="text-slate-500">归因笔记</span>
                                              <span className="font-bold text-indigo-600">{expandingAnswer[q.question_id]?.our_citation_count} 条</span>
                                            </div>
                                          </div>
                                        </div>
                                        <Button variant="outline" className="w-full text-indigo-600 border-indigo-100 hover:bg-indigo-50" onClick={() => navigate(`/performance/answers/${q.question_id}`)}>查看全量归因报告</Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="py-8 text-center bg-white rounded-xl border border-dashed border-slate-200">
                                      <FileText className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                      <p className="text-xs text-slate-400">目前暂无采集成功的 AI 回答复原记录</p>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

