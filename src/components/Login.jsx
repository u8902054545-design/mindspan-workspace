import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ref, get } from 'firebase/database';

const Login = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleGoogleSignIn = async () => {
    setIsAuthLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const encodedEmail = user.email.replace(/\./g, ',');
      
      const snapshot = await get(ref(db, `whitelist/${encodedEmail}`));
      const data = snapshot.val();

      if (!(data && data.status === 'active')) {
        setError('Доступ запрещен: ваш email не в белом списке');
        await auth.signOut();
      }
      // Если всё ок, App.jsx сам переключит экран благодаря onAuthStateChanged
    } catch (err) {
      setError('Ошибка: ' + err.message);
      console.error(err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#08070b] text-[#E6E1E5] font-sans m-0 p-0 overflow-hidden fixed inset-0">
      <style>{`
        :root {
            --md-sys-color-background: #08070b;
            --md-sys-color-surface: #141218;
            --md-sys-color-primary: #0000FF; 
        }
        .background-wrapper { position: absolute; inset: 0; z-index: -2; overflow: hidden; background-color: var(--md-sys-color-background); }
        .bg-orb { position: absolute; border-radius: 50%; filter: blur(80px); animation: float 20s infinite ease-in-out alternate; will-change: transform; }
        .orb-1 { width: 70vw; height: 70vw; background: radial-gradient(circle, rgba(0, 0, 255, 0.25) 0%, rgba(0,0,0,0) 70%); top: -20%; left: -10%; }
        .orb-2 { width: 60vw; height: 60vw; background: radial-gradient(circle, rgba(127, 106, 245, 0.2) 0%, rgba(0,0,0,0) 70%); bottom: -10%; right: -20%; animation-delay: -5s; }
        .orb-3 { width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(0, 150, 255, 0.15) 0%, rgba(0,0,0,0) 70%); top: 40%; left: 40%; animation-delay: -10s; }
        @keyframes float { 0% { transform: translate(0, 0) scale(1); } 33% { transform: translate(5%, 15%) scale(1.1); } 66% { transform: translate(-10%, 5%) scale(0.9); } 100% { transform: translate(0, 0) scale(1); } }
        .bg-noise { position: absolute; inset: 0; z-index: -1; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); opacity: 0.05; mix-blend-mode: overlay; pointer-events: none; }
        .mindspan-title { background: linear-gradient(90deg, #FFFFFF 0%, #A594FD 50%, #FFFFFF 100%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: shine 8s linear infinite; text-shadow: 0 4px 24px rgba(127, 106, 245, 0.3); }
        @keyframes shine { to { background-position: 200% center; } }
        .spinner-container { width: 48px; height: 48px; animation: rotate-container 2.4s linear infinite; }
        .spinner-container circle { fill: none; stroke: #7F6AF5; stroke-width: 4; stroke-linecap: round; animation: dash-sync 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        @keyframes rotate-container { 100% { transform: rotate(360deg); } }
        @keyframes dash-sync { 0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; } 50% { stroke-dasharray: 100, 150; stroke-dashoffset: -15; } 100% { stroke-dasharray: 1, 150; stroke-dashoffset: -125; } }
        .glass-icon-container { display: inline-flex; align-items: center; justify-content: center; width: 72px; height: 72px; border-radius: 50%; background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 8px 32px rgba(0, 0, 255, 0.2); margin-bottom: 20px; }
        .gsi-material-button { appearance: none; background-color: rgba(19, 19, 20, 0.95); backdrop-filter: blur(10px); color: #e3e3e3; cursor: pointer; border: 1px solid rgba(142, 145, 143, 0.5); border-radius: 28px; display: flex; align-items: center; justify-content: center; width: 100%; max-width: 320px; height: 56px; padding: 0 16px; transition: all 0.2s; font-family: 'Roboto', sans-serif; font-size: 16px; font-weight: 500; position: relative; overflow: hidden; }
        .gsi-material-button:hover { background-color: #1e1f20; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); border-color: rgba(255,255,255,0.3); }
        .gsi-material-button:active { transform: scale(0.98); }
      `}</style>

      <div className="background-wrapper"><div className="bg-orb orb-1"></div><div className="bg-orb orb-2"></div><div className="bg-orb orb-3"></div></div>
      <div className="bg-noise"></div>

      {isInitialLoading && (
        <div className="fixed inset-0 z-[10000] bg-[#08070b] flex items-center justify-center transition-opacity duration-500">
          <div className="spinner-container"><svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="20"></circle></svg></div>
        </div>
      )}

      <div className={`fixed inset-0 z-[9999] bg-[#08070b]/60 backdrop-blur-[8px] flex items-center justify-center transition-all duration-500 ${isAuthLoading ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="spinner-container"><svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="20"></circle></svg></div>
      </div>

      <div className="w-full h-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full px-6 py-12 flex flex-col justify-between box-border">
          <div className="flex flex-col items-center pt-[8vh] w-full relative z-10">
            <div className="glass-icon-container">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#A594FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/></svg>
            </div>
            <h1 className="text-4xl font-semibold mindspan-title tracking-tight text-center">MindSpan</h1>
            <h2 className="text-lg font-light text-[#CAC4D0] mt-2 opacity-80">WorkSpace</h2>
          </div>

          <div className="flex flex-col justify-center items-center flex-grow w-full max-w-[400px] mx-auto gap-8">
            <div className="text-center">
              <p className="text-[#E6E1E5] text-xl font-medium mb-2 drop-shadow-md">Добро пожаловать</p>
              <p className="text-[#CAC4D0] text-sm max-w-[280px] mx-auto opacity-80 leading-relaxed">Используйте ваш аккаунт Google для безопасного входа в систему</p>
              {error && <p className="mt-4 text-red-400 text-sm bg-red-500/10 py-2 px-4 rounded-xl border border-red-500/20">{error}</p>}
            </div>

            <button className="gsi-material-button" onClick={handleGoogleSignIn} disabled={isAuthLoading}>
              <div className="mr-3 w-6 h-6 flex items-center justify-center">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{display: 'block', width: '100%', height: '100%'}}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
              </div>
              <span>Войти через Google</span>
            </button>
          </div>

          <div className="w-full max-w-[400px] mx-auto pb-6 flex flex-col items-center text-center">
            <p className="text-[10px] sm:text-xs text-[#938F99] px-4 opacity-70">Продолжая, вы принимаете <a href="#" className="text-[#A594FD] hover:text-white transition-colors underline-offset-2 hover:underline">Условия использования</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
