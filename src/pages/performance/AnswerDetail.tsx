import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, History, ExternalLink, Bot, User, Loader2 } from 'lucide-react';
import { AIAnswer, Citation, AIQuestion } from '@/types';
import { questionService } from '@/services/questionService';
import Markdown from 'react-markdown';

export function PerformanceAnswerDetail() {
  const { answer_id: question_id } = useParams(); // Using answer_id param as questionId
  const [searchParams] = useSearchParams();
  const brandId = searchParams.get('brandId') || 'b_01HJK';
  const navigate = useNavigate();

  const [question, setQuestion] = useState<AIQuestion | null>(null);
  const [answer, setAnswer] = useState<AIAnswer | null>(null);
  const [prevAnswer, setPrevAnswer] = useState<AIAnswer | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [prevCitations, setPrevCitations] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareMode, setCompareMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!question_id) return;
      try {
        setLoading(true);
        const history = await questionService.getAnswerHistory(brandId, question_id);
        if (history.length > 0) {
          const current = history[0];
          setAnswer(current);
          const cits = await questionService.getCitations(brandId, question_id, current.answer_id);
          setCitations(cits);

          if (history.length > 1) {
            const prev = history[1];
            setPrevAnswer(prev);
            const pCits = await questionService.getCitations(brandId, question_id, prev.answer_id);
            setPrevCitations(pCits);
          }
        }
      } catch (error) {
        console.error("Failed to fetch answer details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [brandId, question_id]);

  if (loading) {
//... existing loading UI
    return (
      <div className="flex flex-col items-center justify-center p-24">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-display">正在获取 AI 复原答案与归因数据...</p>
      </div>
    );
  }

  if (!answer) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Bot className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 font-display">未查找到相关答案</h3>
        <p className="text-slate-500 text-sm mt-1 max-w-xs">由于采集频率设置或品牌变动，该问题的暂未复原出最新的 AI 回答数据。</p>
        <Button variant="outline" className="mt-6" onClick={() => navigate(-1)}>返回列表</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center space-x-3 mb-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-slate-200">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Button>
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900">问题采集详情</h2>
          <div className="flex items-center text-xs text-slate-500 mt-1 space-x-4">
            <span className="flex items-center font-mono text-[10px]">
              <Clock className="w-3.5 h-3.5 mr-1" /> 
              Answer ID: {answer.answer_id.slice(0, 12)}... | 采集于 {new Date(answer.collected_at).toLocaleString()}
            </span>
            <button 
              onClick={() => setCompareMode(!compareMode)}
              className={`flex items-center px-2 py-1 rounded transition-colors ${compareMode ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-50'}`}
              disabled={!prevAnswer}
            >
              <History className="w-3.5 h-3.5 mr-1" /> {compareMode ? '退出对比' : '与上次结果对比'}
            </button>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${compareMode ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6`}>
        {/* Main Answer View */}
        <div className={compareMode ? 'space-y-6' : 'lg:col-span-2'}>
          <Card className="p-6 bg-white shadow-sm border-slate-200">
            <h3 className="font-bold font-display text-slate-900 text-sm mb-4 flex items-center justify-between">
              <span className="flex items-center">
                <Bot className="w-5 h-5 text-indigo-600 mr-2" />
                {compareMode ? '本次采集记录' : 'AI 点点助手原声回答 (复原)'}
              </span>
              {compareMode && <span className="text-[10px] text-slate-400 font-mono">{new Date(answer.collected_at).toLocaleDateString()}</span>}
            </h3>
            <div className={`markdown-body ${compareMode ? 'text-xs' : 'prose prose-sm'} max-w-none text-slate-700 leading-loose`}>
              <Markdown>{answer.parsed_answer_md}</Markdown>
            </div>
          </Card>
          
          {compareMode && (
             <Card className="p-4 border-slate-200 bg-slate-50/50">
               <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-tighter">引用变化 (Diff)</h4>
               <div className="space-y-2">
                 {/* Logic: find citations in current NOT in prev */}
                 {citations.filter(c => !prevCitations.find(pc => pc.note_id === c.note_id)).map(c => (
                   <div key={c.citation_id} className="text-[10px] text-emerald-600 font-medium flex items-center">
                     <span className="w-3 h-3 bg-emerald-100 rounded-full flex items-center justify-center mr-2 text-[8px]">+</span>
                     新增引用: {c.note_id} (位次 {c.position})
                   </div>
                 ))}
                 {prevCitations.filter(pc => !citations.find(c => c.note_id === pc.note_id)).map(pc => (
                    <div key={pc.citation_id} className="text-[10px] text-rose-500 font-medium flex items-center">
                      <span className="w-3 h-3 bg-rose-100 rounded-full flex items-center justify-center mr-2 text-[8px]">-</span>
                      消失引用: {pc.note_id} (原位次 {pc.position})
                    </div>
                 ))}
               </div>
             </Card>
          )}
        </div>

        {compareMode ? (
          /* Previous Answer View in Compare Mode */
          <div className="space-y-6">
            <Card className="p-6 bg-slate-50 shadow-sm border-slate-200 border-dashed">
              <h3 className="font-bold font-display text-slate-500 text-sm mb-4 flex items-center justify-between">
                <span className="flex items-center">
                  <Bot className="w-5 h-5 text-slate-400 mr-2" />
                  上次历史记录
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{prevAnswer ? new Date(prevAnswer.collected_at).toLocaleDateString() : '无数据'}</span>
              </h3>
              <div className="markdown-body text-xs max-w-none text-slate-500 leading-loose grayscale opacity-70">
                <Markdown>{prevAnswer?.parsed_answer_md || '暂无历史对比数据'}</Markdown>
              </div>
            </Card>
          </div>
        ) : (
          /* Citations View in Normal Mode */
          <div className="col-span-1 flex flex-col space-y-4">
            <h3 className="font-bold font-display text-slate-900 text-lg">引用源排布 ({citations.length})</h3>
            {/* ... Existing citations map code ... */}
          
          {citations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed text-sm">
              暂无引用的具体笔记源
            </div>
          ) : (
            citations.map(cit => {
              const themeColor = cit.brand_attribution === 'OURS' ? 'indigo' : cit.brand_attribution === 'COMPETITOR' ? 'amber' : 'slate';
              const borderClass = cit.brand_attribution === 'OURS' ? 'border-l-indigo-500' : cit.brand_attribution === 'COMPETITOR' ? 'border-l-amber-500' : 'border-l-slate-400';
              const bgClass = cit.brand_attribution === 'OURS' ? 'bg-indigo-50/30' : cit.brand_attribution === 'COMPETITOR' ? 'bg-amber-50/30' : 'bg-slate-50';
              const labelBg = cit.brand_attribution === 'OURS' ? 'bg-indigo-100 text-indigo-800' : cit.brand_attribution === 'COMPETITOR' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700';
              const textColor = cit.brand_attribution === 'OURS' ? 'text-indigo-600' : cit.brand_attribution === 'COMPETITOR' ? 'text-amber-600' : 'text-slate-600';

              return (
                <Card key={cit.citation_id} className={`p-4 border-l-4 ${borderClass} ${bgClass} shadow-sm transition-shadow hover:shadow-md cursor-pointer group`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${labelBg}`}>
                      [{cit.position}] {cit.brand_attribution === 'OURS' ? '我方' : cit.brand_attribution === 'COMPETITOR' ? '竞品' : '其他'}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center">
                      匹配度: <span className={`font-mono ${textColor} ml-1`}>{Math.round(cit.relevance_score * 100)}%</span>
                    </span>
                  </div>
                  <h4 className={`font-bold text-slate-900 text-sm group-hover:${textColor} transition-colors line-clamp-2`}>
                    笔记: {cit.note_id}
                  </h4>
                  {cit.cited_text && (
                    <div className="mt-3 p-2 bg-white rounded border border-slate-100 text-[11px] text-slate-600 leading-relaxed italic border-l-2 border-l-slate-300">
                      "{cit.cited_text}"
                    </div>
                  )}
                  <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                    <span className="flex items-center"><User className="w-3 h-3 mr-1" /> 已通过笔记验证</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}
      </div>
    </div>
  );
}
