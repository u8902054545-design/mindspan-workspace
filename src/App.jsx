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
      if (currentUser) {
        const encodedEmail = currentUser.email.replace(/\./g, ',');
        const sessionRef = ref(db, `whitelist/${encodedEmail}/currentToken`);
        
        onValue(sessionRef, (snapshot) => {
          const remoteToken = snapshot.val();
          const localToken = localStorage.getItem('session_token');

          // Если токен в базе "revoked" или он явно не совпадает с локальным
          if (remoteToken === 'revoked' || (remoteToken && localToken && remoteToken !== localToken)) {
            localStorage.removeItem('session_token');
            signOut(auth);
            setUser(null);
          } else if (remoteToken) {
            // Если токен есть и он совпадает (или локального еще нет)
            setUser(currentUser);
          }
          setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
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
    <div className="fixed inset-0 bg-[#08070b] flex items-center justify-center">
       <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <Login />;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#08070b] overflow-hidden select-none">
      <style>{`
        .sections-container {
          display: flex; width: 600%; height: calc(100% - 80px);
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          will-change: transform;
          transform: translate3d(-${currentIndex * (100 / 6)}%, 0, 0);
        }
        .section-page { width: 16.666%; height: 100%; flex-shrink: 0; }
      `}</style>
      <div className="sections-container">
        {navItems.map((item, idx) => (
          <div key={item.id} className="section-page">
            {loadedSections[idx] && (
              <div className="w-full h-full flex flex-col items-center justify-center p-6">
                {idx === 0 ? (
                   <div className="text-center">
                     <h1 className="text-3xl font-bold text-white mb-2">WorkSpace</h1>
                     <div className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full">
                       <p className="text-blue-400 text-sm font-medium">Сессия: {user.displayName}</p>
                     </div>
                   </div>
                ) : <NotFound />}
              </div>
            )}
          </div>
        ))}
      </div>
      <Navigation navItems={navItems} currentIndex={currentIndex} handleNavClick={handleNavClick} />
    </div>
  );
};

export default App;
