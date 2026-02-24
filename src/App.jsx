import React, { useState, useEffect, useCallback } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, onValue, off } from 'firebase/database';
import { Home, CalendarRange, FolderOpen, CreditCard, GraduationCap, MessageSquareMore } from 'lucide-react';
import Login from './components/Login';
import Navigation from './components/Navigation';
import NotFound from './pages/NotFound';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedSections, setLoadedSections] = useState({ 0: true });

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const encodedEmail = currentUser.email.replace(/\./g, ',');
      const userRef = ref(db, `whitelist/${encodedEmail}`);

      // Мгновенный слушатель всей ветки пользователя
      const unsubscribeDb = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        const localToken = localStorage.getItem('session_token');

        // ПРОВЕРКИ БЕЗОПАСНОСТИ:
        // 1. Аккаунт удален из БД (!data)
        // 2. Аккаунт заблокирован (status !== 'active')
        // 3. Сессия сброшена/изменена (currentToken !== localToken)
        if (!data || data.status !== 'active' || data.currentToken !== localToken) {
          localStorage.removeItem('session_token');
          signOut(auth);
          setUser(null);
        } else {
          setUser(currentUser);
        }
        setLoading(false);
      }, (error) => {
        console.error("Database error:", error);
        signOut(auth);
        setLoading(false);
      });

      return () => off(userRef);
    });

    return () => unsubscribeAuth();
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

  const navItems = [
    { id: 0, label: 'Главный', icon: Home },
    { id: 1, label: 'Слоты', icon: CalendarRange },
    { id: 2, label: 'Файлы', icon: FolderOpen },
    { id: 3, label: 'Выплаты', icon: CreditCard },
    { id: 4, label: 'Обучение', icon: GraduationCap },
    { id: 5, label: 'Чаты', icon: MessageSquareMore },
  ];

  return (
    <div className="fixed inset-0 w-full h-full bg-[#08070b] text-[#E6E1E5] font-sans overflow-hidden">
      <style>{`
        .background-wrapper { position: absolute; inset: 0; z-index: -2; overflow: hidden; background-color: #08070b; }
        .bg-orb { position: absolute; border-radius: 50%; filter: blur(80px); animation: float 20s infinite ease-in-out alternate; }
        .orb-1 { width: 70vw; height: 70vw; background: radial-gradient(circle, rgba(0, 0, 255, 0.25) 0%, rgba(0,0,0,0) 70%); top: -20%; left: -10%; }
        .orb-2 { width: 60vw; height: 60vw; background: radial-gradient(circle, rgba(127, 106, 245, 0.2) 0%, rgba(0,0,0,0) 70%); bottom: -10%; right: -20%; animation-delay: -5s; }
        .orb-3 { width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(0, 150, 255, 0.15) 0%, rgba(0,0,0,0) 70%); top: 40%; left: 40%; animation-delay: -10s; }
        @keyframes float { 0% { transform: translate(0, 0); } 50% { transform: translate(5%, 5%); } 100% { transform: translate(0, 0); } }
        .mindspan-title { background: linear-gradient(90deg, #FFFFFF 0%, #A594FD 50%, #FFFFFF 100%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: shine 8s linear infinite; }
        @keyframes shine { to { background-position: 200% center; } }
        .sections-wrapper { display: flex; width: 600%; height: calc(100% - 80px); transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .section-page { width: 16.6666%; height: 100%; flex-shrink: 0; }
      `}</style>

      <div className="background-wrapper"><div className="bg-orb orb-1"></div><div className="bg-orb orb-2"></div><div className="bg-orb orb-3"></div></div>

      {!user ? (
        <Login />
      ) : (
        <div className="w-full h-full flex flex-col pt-[8vh] animate-in fade-in duration-500">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-4xl font-semibold mindspan-title tracking-tight text-center">MindSpan</h1>
            <p className="text-[#A594FD] opacity-80 uppercase tracking-widest text-[10px] mt-1">WorkSpace</p>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <div className="sections-wrapper" style={{ transform: `translate3d(-${currentIndex * (16.6666)}%, 0, 0)` }}>
              {navItems.map((item, idx) => (
                <div key={item.id} className="section-page">
                  {loadedSections[idx] && (
                    <div className="w-full h-full flex items-center justify-center p-6">
                      {idx === 0 ? (
                        <div className="text-center">
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
