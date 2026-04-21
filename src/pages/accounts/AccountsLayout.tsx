import React from 'react';
import { Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';

export function AccountsLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // If we're exactly at /accounts, redirect to overview
  if (location.pathname === '/accounts' || location.pathname === '/accounts/') {
    return <Navigate to="/accounts/overview" replace />;
  }

  const isOverview = location.pathname.includes('/overview');
  const isSynergy = location.pathname.includes('/synergy');

  return (
    <div className="flex flex-col h-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight text-slate-900">矩阵账号监测</h1>
        <p className="text-slate-500 mt-1">自用、竞品及合作 KOL 账号在点点AI 中的表现。</p>
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => navigate('/accounts/overview')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
            isOverview
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          账号总览
        </button>
        <button
          onClick={() => navigate('/accounts/synergy')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
            isSynergy
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          矩阵协同分析 (P1)
        </button>
      </div>

      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}
