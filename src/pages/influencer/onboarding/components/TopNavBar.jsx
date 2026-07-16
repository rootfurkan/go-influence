import React from 'react';
import { HelpCircle, User } from 'lucide-react';

export default function TopNavBar({ onReset, onHelpClick }) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-16 h-20 bg-white/70 backdrop-blur-md shadow-[0px_10px_30px_rgba(176,38,255,0.06)] border-b border-white/20">
      <div 
        onClick={onReset}
        className="font-sans font-extrabold text-2xl tracking-tighter text-primary cursor-pointer hover:scale-[1.01] transition-transform select-none"
      >
        Go Influence
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={onHelpClick}
          className="flex items-center justify-center w-10 h-10 rounded-full text-primary hover:scale-105 transition-transform duration-200"
          title="Yardım"
        >
          <HelpCircle size={24} />
        </button>
        <button 
          onClick={onReset}
          className="flex items-center justify-center w-10 h-10 rounded-full text-primary hover:scale-105 transition-transform duration-200"
          title="Hesap"
        >
          <User size={24} />
        </button>
      </div>
    </header>
  );
}
