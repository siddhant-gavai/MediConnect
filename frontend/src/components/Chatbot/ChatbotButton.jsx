import React from 'react';
import { MessageSquare, X } from 'lucide-react';

const ChatbotButton = ({ isOpen, onClick }) => {
  return (
    <div className="fixed bottom-[28px] right-[28px] z-[9999]">
      {/* Tooltip on hover */}
      <div className="group relative">
        <div className="absolute bottom-full right-0 mb-3 hidden group-hover:block whitespace-nowrap bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl animate-bounce-subtle">
          Chat with AI Assistant
          <div className="absolute top-full right-5 border-4 border-transparent border-t-slate-800" />
        </div>

        <button
          onClick={onClick}
          className={`w-[56px] h-[56px] rounded-full bg-[#1565C0] flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 relative overflow-hidden`}
        >
          {isOpen ? (
            <X size={24} className="animate-in fade-in zoom-in duration-300" />
          ) : (
            <MessageSquare size={24} className="animate-in fade-in zoom-in duration-300" />
          )}

          {/* Pulsing online indicator */}
          <div className="absolute top-3.5 right-3.5">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#1565C0] relative">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
            </div>
          </div>
        </button>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};

export default ChatbotButton;
