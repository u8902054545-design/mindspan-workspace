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
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedSections, setLoadedSections] = useState({ 0: true });

  // Оригинальная логика загрузки сессии и Firebase
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

  // Пока идет первичная проверка Firebase, показываем пустой экран с твоим фоном
  if (loading) return (
    <div className="fixed inset-0 bg-[#08070b]">
      <div className="background-wrapper">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>
    </div>
  );

  const navItems = [
    { id: 0, label: 'Главный', icon: Home },
    { id: 1, label: 'Слоты', icon: CalendarRange },
    { id: 2, label: 'Файлы', icon: FolderOpen },
    { id: 3, label: 'Выплаты', icon: CreditCard },
    { id: 4, label: 'Обучение', icon: GraduationCap },
    { id: 5, label: 'Чаты', icon: MessageSquareMore },
  ];

  return (
    <div className="min-h-screen w-full bg-[#08070b] text-[#E6E1E5] font-sans m-0 p-0 overflow-hidden fixed inset-0 select-none">
      {/* --- СТИЛИ ИЗ ТВОЕГО ОРИГИНАЛА --- */}
      <style>{`
        :root {
            --md-sys-color-background: #08070b;
            --md-sys-color-primary: #0000FF; 
        }
        .background-wrapper { position: absolute; inset: 0; z-index: -2; overflow: hidden; background-color: var(--md-sys-color-background); }
        .bg-orb { position: absolute; border-radius: 50%; filter: blur(80px); animation: float 20s infinite ease-in-out alternate; will-change: transform; }
        .orb-1 { width: 70vw; height: 70vw; background: radial-gradient(circle, rgba(0, 0, 255, 0.25) 0%, rgba(0,0,0,0) 70%); top: -20%; left: -10%; }
        .orb-2 { width: 60vw; height: 60vw; background: radial-gradient(circle, rgba(127, 106, 245, 0.2) 0%, rgba(0,0,0,0) 70%); bottom: -10%; right: -20%; animation-delay: -5s; animation-duration: 25s; }
        .orb-3 { width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(0, 150, 255, 0.15) 0%, rgba(0,0,0,0) 70%); top: 40%; left: 40%; animation-delay: -10s; animation-duration: 22s; }
        @keyframes float { 0% { transform: translate(0, 0) scale(1); } 33% { transform: translate(5%, 15%) scale(1.1); } 66% { transform: translate(-10%, 5%) scale(0.9); } 100% { transform: translate(0, 0) scale(1); } }
        .bg-noise { position: absolute; inset: 0; z-index: -1; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); opacity: 0.05; mix-blend-mode: overlay; pointer-events: none; }
        .mindspan-title { background: linear-gradient(90deg, #FFFFFF 0%, #A594FD 50%, #FFFFFF 100%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: shine 8s linear infinite; text-shadow: 0 4px 24px rgba(127, 106, 245, 0.3); }
        @keyframes shine { to { background-position: 200% center; } }
        
        .sections-wrapper {
          display: flex; width: 600%; height: calc(100% - 80px);
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
          will-change: transform;
        }
        .section-page { width: 16.6666%; height: 100%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
      `}</style>

      {/* Многослойный фон */}
      <div className="background-wrapper">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>
      <div className="bg-noise"></div>

      {!user ? (
        /* ОРИГИНАЛЬНАЯ СТРАНИЦА АВТОРИЗАЦИИ */
        <Login setIsAuthLoading={setIsAuthLoading} />
      ) : (
        /* РАБОЧЕЕ ПРОСТРАНСТВО */
        <div className="w-full h-full flex flex-col pt-[8vh] animate-in fade-in duration-500">
          <div className="flex flex-col items-center mb-8 relative z-10">
            <h1 className="text-4xl font-semibold mindspan-title tracking-tight text-center">MindSpan</h1>
            <h2 className="text-lg font-light text-[#CAC4D0] mt-2 opacity-80">WorkSpace</h2>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <div className="sections-wrapper" style={{ transform: `translate3d(-${currentIndex * (100 / 6)}%, 0, 0)` }}>
              {navItems.map((item, idx) => (
                <div key={item.id} className="section-page">
                  {loadedSections[idx] && (
                    <div className="w-full h-full px-4">
                      {idx === 0 ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center">
                          <p className="text-[#E6E1E5] text-xl font-medium mb-2">Добро пожаловать</p>
                          <p className="text-[#CAC4D0] text-sm opacity-60">{user.displayName}</p>
                        </div>
                      ) : <NotFound />}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Navigation navItems={navItems} currentIndex={currentIndex} handleNavClick={handleNavClick} />
        </div>
      )}
    </div>
  );
};

export default App;
