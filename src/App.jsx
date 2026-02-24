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

  if (loading) return (
    <div className="fixed inset-0 bg-[#08070b] flex items-center justify-center z-[10001]">
       <div className="w-10 h-10 border-2 border-[#A594FD] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#08070b] overflow-hidden select-none text-[#E6E1E5]">
      <style>{`
        /* Слайдер между Логином и Контентом */
        .auth-slider {
          display: flex;
          width: 200vw;
          height: 100vh;
          transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);
          will-change: transform;
        }
        .auth-page { width: 100vw; height: 100vh; flex-shrink: 0; position: relative; }
        
        /* Внутренний слайдер разделов (Workspace) */
        .workspace-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .sections-viewport {
          flex: 1;
          overflow: hidden;
          position: relative;
        }
        .sections-wrapper {
          display: flex;
          width: 600%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          will-change: transform;
        }
        .section-page { width: 16.666%; height: 100%; flex-shrink: 0; }
      `}</style>

      <div className="auth-slider" style={{ transform: `translate3d(${user ? '-100vw' : '0'}, 0, 0)` }}>
        {/* СТРАНИЦА 1: ЛОГИН */}
        <div className="auth-page">
          <Login />
        </div>

        {/* СТРАНИЦА 2: WORKSPACE */}
        <div className="auth-page">
          <div className="workspace-container">
            <div className="sections-viewport">
              <div className="sections-wrapper" style={{ transform: `translate3d(-${currentIndex * (100 / 6)}%, 0, 0)` }}>
                {navItems.map((item, idx) => (
                  <div key={item.id} className="section-page">
                    {loadedSections[idx] && (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6">
                        {idx === 0 ? (
                           <div className="text-center">
                             <h1 className="text-4xl font-semibold mindspan-title tracking-tight mb-2">MindSpan</h1>
                             <p className="text-[#A594FD] opacity-80 uppercase tracking-widest text-xs">WorkSpace Active</p>
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
