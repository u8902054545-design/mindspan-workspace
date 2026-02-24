import React, { useState, useEffect, useCallback } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { Home, CalendarRange, FolderOpen, CreditCard, GraduationCap, MessageSquareMore } from 'lucide-round';
import Login from './components/Login';
import Navigation from './components/Navigation';
import NotFound from './pages/NotFound';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedSections, setLoadedSections] = useState({ 0: true });

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

  if (loading) return (
    <div className="fixed inset-0 bg-[#08070b] flex items-center justify-center z-[10001]">
       <div className="w-10 h-10 border-2 border-[#A594FD] border-t-transparent rounded-full animate-spin"></div>
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
    <div className="fixed inset-0 w-full h-full bg-[#08070b] overflow-hidden select-none">
      <style>{`
        .main-stage {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          transition: transform 0.8s cubic-bezier(0.7, 0, 0.3, 1);
          will-change: transform;
        }
        .workspace-view {
          position: absolute;
          top: 0; left: 100%; /* Изначально за правым краем */
          width: 100%; height: 100%;
        }
        .login-view {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
        }
        .sections-wrapper {
          display: flex;
          width: 600%; height: calc(100% - 80px);
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
          will-change: transform;
        }
        .section-page { width: 16.666%; height: 100%; flex-shrink: 0; }
      `}</style>

      {/* Главная сцена: сдвигается на -100% когда юзер вошел */}
      <div className="main-stage" style={{ transform: `translate3d(${user ? '-100%' : '0'}, 0, 0)` }}>
        
        {/* Вид логина */}
        <div className="login-view">
          <Login />
        </div>

        {/* Вид рабочего пространства */}
        <div className="workspace-view">
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 overflow-hidden relative">
              <div className="sections-wrapper" style={{ transform: `translate3d(-${currentIndex * (100 / 6)}%, 0, 0)` }}>
                {navItems.map((item, idx) => (
                  <div key={item.id} className="section-page">
                    {loadedSections[idx] && (
                      <div className="w-full h-full flex items-center justify-center p-6">
                        {idx === 0 ? (
                           <div className="text-center">
                             <h1 className="text-4xl font-semibold mindspan-title tracking-tight mb-2">MindSpan</h1>
                             <p className="text-[#A594FD] opacity-80 uppercase tracking-widest text-[10px]">WorkSpace Active</p>
                           </div>
                        ) : <NotFound />}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {user && <Navigation navItems={navItems} currentIndex={currentIndex} handleNavClick={handleNavClick} />}
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
