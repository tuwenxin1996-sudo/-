import React from 'react';
import { Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';

export function PerformanceLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // If we're exactly at /performance, redirect to overview
  if (location.pathname === '/performance' || location.pathname === '/performance/') {
    return <Navigate to="/performance/overview" replace />;
  }

  const isOverview = location.pathname.includes('/overview');
  const isQuestions = location.pathname.includes('/questions');
  const isAnswers = location.pathname.includes('/answers');

  return (
    <div className="flex flex-col h-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight text-slate-900">点点AI 表现</h1>
        <p className="text-slate-500 mt-1">核心指标体系的展开视图与按问题维度的引用钻取。</p>
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => navigate('/performance/overview')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
            isOverview
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          核心指标体系
        </button>
        <button
          onClick={() => navigate('/performance/questions')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
            isQuestions || isAnswers
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          问答库监测
        </button>
      </div>

      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}
