import React, { useState, useEffect, useCallback } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { Home, CalendarRange, FolderOpen, CreditCard, GraduationCap, MessageSquareMore } from 'lucide-react';
import Login from './components/Login';
import Navigation from './components/Navigation';
import NotFound from './pages/NotFound';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
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
        onValue(ref(db, `whitelist/${encodedEmail}`), (snapshot) => {
          const data = snapshot.val();
          if (data && data.status === 'active') {
            setUser(currentUser);
            setIsWhitelisted(true);
          } else {
            auth.signOut();
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

  if (loading) return null; // Или твой спиннер

  if (!user) return <Login />;

  return (
    <div className="relative w-full h-screen bg-[#0F0F0F] overflow-hidden select-none">
      <style>{`
        .sections-wrapper { position: absolute; top: 0; left: 0; width: 100%; height: calc(100% - 80px); overflow: hidden; z-index: 10; }
        .section { position: absolute; top: 0; left: 0; width: 100%; height: 100%; transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); will-change: transform; }
      `}</style>

      <div className="sections-wrapper">
        {navItems.map((item, idx) => (
          <div 
            key={item.id} 
            className="section" 
            style={{ transform: `translateX(${(idx - currentIndex) * 100}%)` }}
          >
            {loadedSections[idx] && (
              <div className="w-full h-full flex items-center justify-center p-6 text-center">
                {idx === 0 ? (
                  <div>
                    <h1 className="text-3xl font-bold mb-4">Привет, {user.displayName}!</h1>
                    <p className="text-gray-400">Это твой новый React Workspace.</p>
                  </div>
                ) : <NotFound />}
              </div>
            )}
          </div>
        ))}
      </div>

      <Navigation 
        navItems={navItems} 
        currentIndex={currentIndex} 
        handleNavClick={handleNavClick} 
      />
    </div>
  );
};

export default App;
