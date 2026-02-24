import React from 'react';
import { Construction, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="w-full flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] bg-[#141218]/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 flex flex-col items-center text-center shadow-2xl">
        <div className="w-20 h-20 bg-[#A594FD]/10 rounded-3xl flex items-center justify-center mb-8">
          <Construction className="text-[#A594FD]" size={40} />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">Раздел в<br /><span className="text-[#A594FD]">разработке</span></h2>
        
        <p className="text-[#938F99] text-sm leading-relaxed mb-10">
          Мы создаем что-то особенное. Пожалуйста, вернитесь на главную страницу.
        </p>

        <button 
          onClick={() => window.location.reload()}
          className="w-full py-4 bg-[#0000FF] hover:bg-[#0000DD] text-white rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-900/20"
        >
          <Home size={20} />
          На главную
        </button>
      </div>
    </div>
  );
};

export default NotFound;
