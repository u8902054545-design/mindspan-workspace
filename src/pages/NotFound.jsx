import React, { useState, useEffect } from 'react';
import { Home, Construction } from 'lucide-react';

const NotFound = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const goToHome = () => {
    window.parent.postMessage('goToHome', '*');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#05050a] relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className={`relative z-10 w-full max-w-lg px-6 transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-[32px] p-10 md:p-16 text-center shadow-2xl overflow-hidden group">
          <div className="relative mb-8 flex justify-center">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 relative">
              <Construction size={48} className="text-blue-400 animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Раздел в <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">разработке</span>
          </h1>
          
          <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light">
            Мы создаем что-то особенное. Пожалуйста, вернитесь на главную страницу.
          </p>

          <button 
            onClick={goToHome}
            className="group/btn relative inline-flex items-center justify-center px-8 py-4 font-medium text-white transition-all duration-300 ease-in-out bg-[#0000FF] hover:bg-[#0000FF]/90 rounded-2xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,255,0.5)] active:scale-95"
          >
            <Home className="mr-2 w-5 h-5" />
            <span>На главную</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
