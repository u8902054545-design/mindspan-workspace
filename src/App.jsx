import React, { useState, useEffect, useCallback } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { Home, CalendarRange, FolderOpen, CreditCard, GraduationCap, MessageSquareMore } from 'lucide-react';
import Login from './components/Login';
import Navigation from './components/Navigation';
import NotFound from './pages/NotFound';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedSections, setLoadedSections] = useState({ 0: true });

  const navItems = [
    { id: 0, label: 'Главный', icon: Home },
    { id: 1, label: 'Слоты', icon: CalendarRange },
    { id: 2, label: 'Файлы', icon: FolderOpen },
    { id: 3, label: 'Выплаты', icon: CreditCard },
    { id: 4, label: 'Обучение', icon: GraduationCap },
    { id: 5, label: 'Чаты', icon: MessageSquareMore },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      const encodedEmail = currentUser.email.replace(/\./g, ',');
      const sessionRef = ref(db, `whitelist/${encodedEmail}/currentToken`);
      const unsubscribeSession = onValue(sessionRef, (snapshot) => {
        const remoteToken = snapshot.val();
        const localToken = localStorage.getItem('session_token');
        if (remoteToken === 'revoked' || (remoteToken && localToken && remoteToken !== localToken)) {
          localStorage.removeItem('session_token');
          signOut(auth);
          setUser(null);
        } else if (remoteToken && remoteToken === localToken) {
          setUser(currentUser);
        }
        setLoading(false);
      });
      return () => unsubscribeSession();
    });
    return () => unsubscribe();
  }, []);

  const handleNavClick = useCallback((targetIndex) => {
    if (currentIndex === targetIndex) return;
    if (navigator.vibrate) navigator.vibrate(8);
    if (!loadedSections[targetIndex]) {
      setLoadedSections(prev => ({ ...prev, [targetIndex]: true }));
    }
    setCurrentIndex(targetIndex);
  }, [currentIndex, loadedSections]);

  if (loading) return null;

  return (
    <div className="fixed inset-0 w-full h-full bg-[#08070b] text-[#E6E1E5] font-sans overflow-hidden">
      <style>{`
        :root {
            --md-sys-color-background: #08070b;
            --md-sys-color-primary: #0000FF; 
        }
        .background-wrapper { position: absolute; inset: 0; z-index: -2; overflow: hidden; background-color: var(--md-sys-color-background); }
        .bg-orb { position: absolute; border-radius: 50%; filter: blur(80px); animation: float 20s infinite ease-in-out alternate; will-change: transform; }
        .orb-1 { width: 70vw; height: 70vw; background: radial-gradient(circle, rgba(0, 0, 255, 0.25) 0%, rgba(0,0,0,0) 70%); top: -20%; left: -10%; }
        .orb-2 { width: 60vw; height: 60vw; background: radial-gradient(circle, rgba(127, 106, 245, 0.2) 0%, rgba(0,0,0,0) 70%); bottom: -10%; right: -20%; animation-delay: -5s; }
        .orb-3 { width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(0, 150, 255, 0.15) 0%, rgba(0,0,0,0) 70%); top: 40%; left: 40%; animation-delay: -10s; }
        @keyframes float { 0% { transform: translate(0, 0) scale(1); } 33% { transform: translate(5%, 15%) scale(1.1); } 66% { transform: translate(-10%, 5%) scale(0.9); } 100% { transform: translate(0, 0) scale(1); } }
        .bg-noise { position: absolute; inset: 0; z-index: -1; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); opacity: 0.05; mix-blend-mode: overlay; pointer-events: none; }
        
        /* АНИМАЦИЯ ПЕРЕХОДА АВТОРИЗАЦИИ */
        .auth-container {
          position: absolute; inset: 0;
          transition: transform 0.8s cubic-bezier(0.7, 0, 0.3, 1), opacity 0.6s ease;
          z-index: 50;
        }
        .workspace-container {
          position: absolute; inset: 0;
          transition: transform 0.8s cubic-bezier(0.7, 0, 0.3, 1);
          z-index: 40;
        }
        
        /* СЛАЙДЕР РАЗДЕЛОВ (ВНУТРИ WORKSPACE) */
        .sections-wrapper {
          display: flex; width: 600%; height: calc(100% - 80px);
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
          will-change: transform;
        }
        .section-page { width: 16.6666%; height: 100%; flex-shrink: 0; overflow: hidden; }

        .mindspan-title {
            background: linear-gradient(90deg, #FFFFFF 0%, #A594FD 50%, #FFFFFF 100%);
            background-size: 200% auto;
            -webkit-background-clip: text; background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shine 8s linear infinite;
        }
        @keyframes shine { to { background-position: 200% center; } }
      `}</style>

      {/* Статичный фон для всех состояний */}
      <div className="background-wrapper"><div className="bg-orb orb-1"></div><div className="bg-orb orb-2"></div><div className="bg-orb orb-3"></div></div>
      <div className="bg-noise"></div>

      {/* ЭКРАН ЛОГИНА (УЕЗЖАЕТ ВПРАВО ПРИ ВХОДЕ) */}
      <div className="auth-container" style={{ 
        transform: user ? 'translateX(100%)' : 'translateX(0)',
        opacity: user ? 0 : 1,
        pointerEvents: user ? 'none' : 'auto'
      }}>
        <Login />
      </div>

      {/* ЭКРАН РАБОЧЕГО ПРОСТРАНСТВА (ВЫЕЗЖАЕТ СЛЕВА ПРИ ВХОДЕ) */}
      <div className="workspace-container" style={{ 
        transform: user ? 'translateX(0)' : 'translateX(-100%)'
      }}>
        <div className="w-full h-full flex flex-col pt-[8vh]">
          {/* Шапка оригинальная */}
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-4xl font-semibold mindspan-title tracking-tight text-center">MindSpan</h1>
            <p className="text-[#A594FD] opacity-80 uppercase tracking-widest text-[10px] mt-1">WorkSpace</p>
          </div>

          {/* Слайдер контента */}
          <div className="flex-1 overflow-hidden relative">
            <div className="sections-wrapper" style={{ transform: `translate3d(-${currentIndex * (100 / 6)}%, 0, 0)` }}>
              {navItems.map((item, idx) => (
                <div key={item.id} className="section-page">
                  {loadedSections[idx] && (
                    <div className="w-full h-full flex items-center justify-center p-6 text-center">
                      {idx === 0 ? (
                        <div className="animate-in fade-in duration-700">
                          <p className="text-[#E6E1E5] text-xl font-medium mb-2">Привет, {user?.displayName?.split(' ')[0]}</p>
                          <p className="text-[#CAC4D0] text-sm opacity-60">Ваша рабочая среда готова</p>
                        </div>
                      ) : <NotFound />}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Навигация (показывается только авторизованным) */}
          {user && <Navigation navItems={navItems} currentIndex={currentIndex} handleNavClick={handleNavClick} />}
        </div>
      </div>
    </div>
  );
};

export default App;
