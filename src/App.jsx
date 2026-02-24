import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import Login from './components/Login';
import NotFound from './pages/NotFound';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWhitelisted, setIsWhitelisted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const encodedEmail = currentUser.email.replace(/\./g, ',');
        const userRef = ref(db, `whitelist/${encodedEmail}`);
        
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data && data.status === 'active') {
            setUser(currentUser);
            setIsWhitelisted(true);
          } else {
            setUser(null);
            setIsWhitelisted(false);
          }
          setLoading(false);
        });
      } else {
        setUser(null);
        setIsWhitelisted(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05050a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05050a]">
      {user && isWhitelisted ? (
        /* Сюда мы позже добавим полноценную навигацию */
        <NotFound /> 
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;
