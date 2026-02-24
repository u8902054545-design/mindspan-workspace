import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const encodedEmail = user.email.replace(/\./g, ',');
      
      const snapshot = await get(ref(db, `whitelist/${encodedEmail}`));
      const data = snapshot.val();

      if (data && data.status === 'active') {
        const token = Math.random().toString(36).substring(2);
        localStorage.setItem('ms_token', token);
        // В SPA мы просто сменим состояние в App.jsx, но пока логика такая
        window.location.reload(); 
      } else {
        setError('Доступ запрещен или аккаунт не активен');
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
      <div className="w-full max-w-md backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-[32px] p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">MindSpan</h1>
          <p className="text-gray-400">Войдите в рабочее пространство</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Пароль"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0000FF] hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="mr-2 w-5 h-5" />
                Войти
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
