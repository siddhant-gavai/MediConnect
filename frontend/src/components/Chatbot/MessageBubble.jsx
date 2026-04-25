import React from 'react';

const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-[#1565C0] flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-sm mb-5">
            MA
          </div>
        )}
        <div className="flex flex-col">
          <div
            className={`px-4 py-3 text-sm font-bold leading-relaxed shadow-sm ${
              isUser
                ? 'bg-[#1565C0] text-white rounded-2xl rounded-br-none'
                : 'bg-white text-slate-700 rounded-2xl rounded-bl-none border border-slate-100'
            }`}
          >
            {message.text.split('\n').map((line, i) => (
              <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
            ))}
            
            {message.component && (
              <div className="mt-4">
                {message.component}
              </div>
            )}
          </div>
          <span className={`text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1.5 ${isUser ? 'text-right' : 'text-left ml-1'}`}>
            {time}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
