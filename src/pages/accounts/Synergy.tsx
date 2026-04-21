import React from 'react';
import { Card } from '@/components/ui/card';
import { Info, LayoutGrid } from 'lucide-react';

export function MatrixSynergy() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full">
      <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed bg-slate-50/50 border-slate-200 min-h-[500px]">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
          <LayoutGrid className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold font-display text-slate-900 mb-2">矩阵协同分析 (P1)</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          深入分析不同账号在核心问题上的“配合度”与引用重合情况。该功能正在同步开发中。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl w-full">
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <h4 className="font-bold text-sm text-slate-900 mb-1">引用集中度热力图</h4>
            <p className="text-xs text-slate-500">横轴为账号，纵轴为问题。格子颜色深浅代表引用频率，快速定位“防守漏洞”或“配合死角”。</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <h4 className="font-bold text-sm text-slate-900 mb-1">协同引流效应</h4>
            <p className="text-xs text-slate-500">分析主号与矩阵号在同回答中的协同引用频次，评估多账号包围态势的效果。</p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg text-sm font-medium border border-indigo-100">
          <Info className="w-4 h-4" />
          预计 2024 年 5 月初上线核心预览版
        </div>
      </Card>
    </div>
  );
}
