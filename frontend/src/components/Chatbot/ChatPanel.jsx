import React, { useState, useEffect, useRef } from 'react';
import { Send, Minus, X, MoreVertical, Trash2, AlertCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import QuickReplies from './QuickReplies';
import DoctorMiniCard from './DoctorMiniCard';
import symptomMap from '../../data/symptomMap';
import doctorsData from '../../data/doctors';

const ChatPanel = ({ isOpen, onClose, onMinimize }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load chat history
  useEffect(() => {
    const savedChat = sessionStorage.getItem('mediconnect_chat');
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    } else {
      // Welcome message
      sendBotReply("👋 Hi! I'm your MediConnect Health Assistant. Tell me what symptoms you're experiencing and I'll help you find the right specialist.\n\nYou can type things like:\n• 'I have a headache'\n• 'My child has fever'\n• 'I have chest pain'", ["Headache", "Chest Pain", "Skin Problem", "Child's Health"]);
    }
  }, []);

  // Save chat history
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('mediconnect_chat', JSON.stringify(messages.slice(-50)));
    }
  }, [messages]);

  const sendBotReply = (text, replies = [], component = null) => {
    const botMessage = {
      id: Date.now() + 1,
      text,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      replies,
      component
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      setIsTyping(false);
      processMessage(text.toLowerCase());
    }, 1200);
  };

  const processMessage = (text) => {
    // 1. Special Commands
    if (text === 'hi' || text === 'hello' || text === 'hey') {
      return sendBotReply("Hello! How can I help you today? Please describe your symptoms.", ["Headache", "Fever", "Skin Issue"]);
    }

    if (text.includes('find doctors') || text.includes('show doctors')) {
      const topDoctors = [...doctorsData].sort((a, b) => b.rating - a.rating).slice(0, 3);
      return sendBotReply("Here are some of our top-rated doctors:", [], (
        <div className="space-y-2">
          {topDoctors.map(doc => <DoctorMiniCard key={doc.id} doctor={doc} />)}
        </div>
      ));
    }

    if (text.includes('book') || text.includes('appointment')) {
      return sendBotReply("I'll help you book! Which speciality are you looking for?", ["Cardiology", "Neurology", "Pediatrics", "Dermatology"]);
    }

    if (text.includes('talk to human') || text.includes('human')) {
      return sendBotReply("Our support team is available Mon–Sat 9AM–6PM.\n\n📞 1800-MED-CARE (toll free)\n📧 support@mediconnect.in", ["Main Menu"]);
    }

    // 2. Symptom Mapping
    let match = null;
    for (const item of symptomMap) {
      if (item.keywords.some(kw => text.includes(kw))) {
        match = item;
        break;
      }
    }

    if (match) {
      const urgentComponent = match.urgent ? (
        <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl space-y-2 my-2 animate-pulse">
          <div className="flex items-center gap-2 text-red-600 font-black uppercase tracking-widest text-[10px]">
            <AlertCircle size={16} /> 🚨 Emergency Alert
          </div>
          <p className="text-xs font-bold text-red-800 leading-tight">These symptoms may be serious. Please call 112 or go to the nearest emergency room.</p>
        </div>
      ) : null;

      const doctorsInSpec = doctorsData
        .filter(d => d.speciality === match.speciality)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 2);

      const doctorCards = (
        <div className="space-y-3 mt-4">
          {urgentComponent}
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Recommended Specialists:</p>
          {doctorsInSpec.map(doc => <DoctorMiniCard key={doc.id} doctor={doc} />)}
        </div>
      );

      sendBotReply(match.message, ["Find more doctors", "Different symptom", "Talk to human"], doctorCards);
    } else {
      sendBotReply("I couldn't identify a specific concern from that. Could you describe your symptoms in more detail?\n\nFor example: 'I have pain in my lower back' or 'My eyes feel dry and itchy'.", ["Headache", "Fever", "Skin Issue", "Eye Problem", "Chest Pain"]);
    }
  };

  const clearChat = () => {
    setMessages([]);
    sessionStorage.removeItem('mediconnect_chat');
    setShowMenu(false);
    sendBotReply("Chat cleared. How can I help you today?", ["Headache", "Fever", "Skin Issue"]);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-24 right-6 z-[9999] w-[360px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 mobile-full-screen`}>
      {/* Header */}
      <div className="bg-[#1565C0] p-4 flex items-center justify-between shadow-lg relative">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#1565C0] absolute -right-0.5 -bottom-0.5 z-10" />
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-xs">MA</div>
          </div>
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-tight">MediConnect Assistant</h3>
            <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-2 text-white/80 hover:text-white transition rounded-lg hover:bg-white/10">
              <MoreVertical size={18} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                <button onClick={clearChat} className="w-full px-4 py-2 text-left text-xs font-black text-red-500 uppercase tracking-widest hover:bg-slate-50 flex items-center gap-2">
                  <Trash2 size={14} /> Clear Chat
                </button>
              </div>
            )}
          </div>
          <button onClick={onMinimize} className="p-2 text-white/80 hover:text-white transition rounded-lg hover:bg-white/10">
            <Minus size={18} />
          </button>
          <button onClick={onClose} className="p-2 text-white/80 hover:text-white transition rounded-lg hover:bg-white/10">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id}>
            <MessageBubble message={msg} />
            {!isTyping && msg.replies && msg.replies.length > 0 && messages[messages.length - 1].id === msg.id && (
              <QuickReplies replies={msg.replies} onSelect={(reply) => handleSend(reply)} />
            )}
          </div>
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Describe your symptoms..."
            className="flex-1 px-4 py-3 bg-slate-100 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className={`p-3 rounded-xl transition-all ${input.trim() ? 'bg-[#1565C0] text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}
            disabled={!input.trim()}
          >
            <Send size={20} />
          </button>
        </form>
      </div>

      <style jsx>{`
        .mobile-full-screen {
          @media (max-width: 640px) {
            bottom: 0 !important;
            right: 0 !important;
            width: 100vw !important;
            height: 60vh !important;
            border-radius: 24px 24px 0 0 !important;
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default ChatPanel;
