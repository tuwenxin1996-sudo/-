import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Bell, RefreshCw, ChevronDown, Check, User as UserIcon, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';

const BRANDS = [
  { id: 'b_01HJK', name: '花西子 Florasis' },
  { id: 'b_02ABC', name: '欧莱雅 L\'Oréal' },
  { id: 'b_03XYZ', name: 'Babycare' },
  { id: 'b_04NEW', name: '波司登 Bosideng (近期添加)' }
];

const TIME_RANGES = [
  { value: '7d', label: '最近 7 天' },
  { value: '14d', label: '最近 14 天' },
  { value: '30d', label: '最近 30 天' },
];

export function Header() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  const handleSignOut = () => signOut(auth);

  const currentBrandId = searchParams.get('brandId') || BRANDS[0].id;
  const currentBrand = BRANDS.find(b => b.id === currentBrandId) || BRANDS[0];
  
  const currentRange = searchParams.get('range') || TIME_RANGES[0].value;
  const currentRangeStr = TIME_RANGES.find(r => r.value === currentRange) || TIME_RANGES[0];

  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  
  const brandRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const mockNotifications = [
    { id: 1, title: '账号@花西子官方旗舰店 七日被引用了10次！', type: 'success', time: '10分钟前' },
    { id: 2, title: '完美日记可见度超越我方 +3.2pp', type: 'warning', time: '2小时前' },
    { id: 3, title: '笔记"花西子空气蜜粉测评"首次被引用', type: 'info', time: '5小时前' }
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (brandRef.current && !brandRef.current.contains(event.target as Node)) setIsBrandOpen(false);
      if (rangeRef.current && !rangeRef.current.contains(event.target as Node)) setIsRangeOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) setIsNotificationsOpen(false);
      if (userRef.current && !userRef.current.contains(event.target as Node)) setIsUserOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBrandChange = (brandId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('brandId', brandId);
    navigate(`${location.pathname}?${params.toString()}`);
    setIsBrandOpen(false);
  };

  const handleRangeChange = (rangeValue: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('range', rangeValue);
    navigate(`${location.pathname}?${params.toString()}`);
    setIsRangeOpen(false);
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* 品牌切换组件 */}
        <div className="relative" ref={brandRef}>
          <button 
            onClick={() => { setIsBrandOpen(!isBrandOpen); setIsRangeOpen(false); }}
            className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl bg-white shadow-sm hover:border-slate-300 text-sm font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            {currentBrand.name}
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isBrandOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isBrandOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 py-2 z-50">
              <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">选择品牌</div>
              <div className="px-2 py-1 space-y-1">
                {BRANDS.map(brand => (
                  <button
                    key={brand.id}
                    onClick={() => handleBrandChange(brand.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors"
                  >
                    <span className={`font-medium ${brand.id === currentBrand.id ? 'text-indigo-700 font-bold' : ''}`}>
                      {brand.name}
                    </span>
                    {brand.id === currentBrand.id && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-100 mt-2 pt-2 px-3">
                 <button className="w-full px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors text-left flex items-center">
                   <span className="text-lg leading-none mr-2">+</span>
                   添加新品牌
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* 时间范围切换组件 */}
        <div className="relative" ref={rangeRef}>
          <button 
            onClick={() => { setIsRangeOpen(!isRangeOpen); setIsBrandOpen(false); }}
            className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl bg-white shadow-sm hover:border-slate-300 text-sm font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            {currentRangeStr.label}
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isRangeOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isRangeOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 py-2 z-50">
              <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">时间范围</div>
              <div className="px-2 py-1 space-y-1">
                {TIME_RANGES.map(range => (
                  <button
                    key={range.value}
                    onClick={() => handleRangeChange(range.value)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <span className={`font-medium ${range.value === currentRange ? 'text-indigo-700 font-bold' : ''}`}>
                      {range.label}
                    </span>
                    {range.value === currentRange && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <div className="relative" ref={notificationsRef}>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsBrandOpen(false); setIsRangeOpen(false); }}
              className="text-slate-400 hover:text-slate-600 rounded-xl relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 border-2 border-white rounded-full"></span>
            </Button>
            
            {isNotificationsOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 py-3 z-50">
                <div className="px-4 pb-2 border-b border-slate-100 flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">预警与通知</span>
                  <button className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700">全部已读</button>
                </div>
                <div className="px-2 space-y-1 max-h-64 overflow-y-auto scroll-hide">
                  {mockNotifications.map(notif => (
                    <div key={notif.id} className="p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group flex items-start gap-3">
                      <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                        notif.type === 'success' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' :
                        notif.type === 'warning' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 
                        'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]'
                      }`} />
                      <div>
                        <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors leading-tight">
                          {notif.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-100 mt-2 pt-2 px-3">
                   <button className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors text-center">
                     查看所有消息
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="relative" ref={userRef}>
          {authLoading ? (
            <div className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 animate-pulse" />
          ) : user ? (
            <div 
              className="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer group"
              onClick={() => setIsUserOpen(!isUserOpen)}
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{user.displayName || '用户'}</p>
                <p className="text-xs text-slate-500 italic">运营总监</p>
              </div>
              <div className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden shadow-sm group-hover:border-indigo-300 transition-colors">
                <img 
                  src={user.photoURL || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"} 
                  alt="用户头像" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {isUserOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-50 mb-1">
                    <p className="text-xs font-bold text-slate-400 uppercase">账号管理</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => { navigate('/account'); setIsUserOpen(false); }}
                    className="w-full flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    个人设置
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button 
              variant="outline" 
              onClick={handleSignIn}
              className="h-9 px-4 rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            >
              <LogIn className="w-4 h-4 mr-2" />
              立即登录
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
