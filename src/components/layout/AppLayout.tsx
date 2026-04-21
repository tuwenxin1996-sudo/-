import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LineChart, 
  Users, 
  User,
  FileText, 
  Swords, 
  MessageCircleQuestion, 
  Lightbulb, 
  ClipboardList,
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Header } from './Header';

const NAV_ITEMS = [
  { name: '仪表盘', icon: LayoutDashboard, path: '/' },
  { name: '点点AI 表现', icon: LineChart, path: '/performance' },
  { name: '矩阵账号监测', icon: Users, path: '/accounts' },
  { name: '笔记监测', icon: FileText, path: '/notes' },
  { name: '竞品分析', icon: Swords, path: '/competitors' },
  { name: '话题与问题分析', icon: MessageCircleQuestion, path: '/topics' },
  { name: '策略建议与告警', icon: Lightbulb, path: '/insights' },
  { name: '报告与导出', icon: ClipboardList, path: '/reports' },
  { name: '账户设置', icon: User, path: '/account' },
  { name: '监测配置', icon: Settings, path: '/settings' },
];

export function AppLayout() {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col hidden md:flex z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-200">
              <div className="w-3.5 h-3.5 border-2 border-white rounded-[2px] rotate-45"></div>
            </div>
            <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">笔镜 NoteLens</h1>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scroll-hide">
          <div className="mb-4 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">主菜单</div>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 font-bold shadow-sm shadow-indigo-100/50"
                    : "text-slate-500 font-medium hover:text-slate-900 hover:bg-slate-100"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("w-4 h-4", isActive ? "stroke-[2.5]" : "stroke-2")} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-hide">
          <div className="max-w-[1400px] mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
