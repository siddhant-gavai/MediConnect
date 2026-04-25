import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex w-full mb-6 justify-start">
      <div className="flex items-end gap-3">
        <div className="w-8 h-8 rounded-full bg-[#1565C0] flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-sm mb-5">
          MA
        </div>
        <div className="bg-white border border-slate-100 px-5 py-4 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
          <div className="w-1.5 h-1.5 bg-[#1565C0] rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-1.5 h-1.5 bg-[#1565C0] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-1.5 h-1.5 bg-[#1565C0] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
