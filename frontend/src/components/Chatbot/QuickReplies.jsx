import React from 'react';

const QuickReplies = ({ replies, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {replies.map((reply, i) => (
        <button
          key={i}
          onClick={() => onSelect(reply)}
          className="px-4 py-2 bg-white border border-blue-100 text-[#1565C0] text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-50 transition-all shadow-sm active:scale-95"
        >
          {reply}
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;
