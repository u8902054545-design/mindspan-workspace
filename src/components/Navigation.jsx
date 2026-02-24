import React from 'react';
import { Home, LayoutGrid, FolderOpen, CreditCard, GraduationCap, MessageSquare } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'main', icon: Home, label: 'Главный' },
    { id: 'slots', icon: LayoutGrid, label: 'Слоты' },
    { id: 'files', icon: FolderOpen, label: 'Файлы' },
    { id: 'payments', icon: CreditCard, label: 'Выплаты' },
    { id: 'education', icon: GraduationCap, label: 'Обучение' },
    { id: 'chats', icon: MessageSquare, label: 'Чаты' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 bg-[#05050a]/80 backdrop-blur-lg border-t border-white/5">
      <div className="max-w-lg mx-auto flex justify-between items-center">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center transition-all duration-300 relative group"
            >
              <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'text-gray-500 hover:text-gray-300'}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] mt-1 font-medium transition-all ${isActive ? 'text-white opacity-100' : 'text-gray-500 opacity-0 group-hover:opacity-100'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
