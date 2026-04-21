import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export function EmptyState({ title, description, icon: Icon }: any) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border rounded-3xl bg-slate-50/50 border-dashed border-slate-200">
      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-4">
        {Icon ? <Icon className="w-6 h-6 text-slate-400" /> : <div className="w-6 h-6 bg-slate-400" />}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm">{description}</p>
    </div>
  );
}

export function PlaceholderPage({ title, description }: { title: string, description: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="text-slate-500 mt-1">{description}</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <EmptyState 
            title="该模块正在开发中" 
            description="敬请期待！"
            icon={FileText}
          />
        </CardContent>
      </Card>
    </div>
  );
}
