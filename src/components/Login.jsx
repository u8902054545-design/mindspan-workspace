import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ref, get } from 'firebase/database';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const encodedEmail = user.email.replace(/\./g, ',');
      
      const snapshot = await get(ref(db, `whitelist/${encodedEmail}`));
      const data = snapshot.val();

      if (data && data.status === 'active') {
        // Успешный вход, App.jsx сам увидит смену состояния
      } else {
        setError('Вашего email нет в белом списке');
        await auth.signOut();
      }
    } catch (err) {
      setError('Ошибка входа: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05050a] px-4">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-[32px] p-10 text-center shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">MindSpan</h1>
        <p className="text-gray-400 mb-10">Войдите через рабочий аккаунт Google</p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full group relative flex items-center justify-center gap-3 bg-white text-black font-semibold py-4 rounded-2xl transition-all active:scale-95 hover:bg-gray-100 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" alt="G" className="w-5 h-5" />
              Войти через Google
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Login;
