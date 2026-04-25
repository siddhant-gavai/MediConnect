import React, { useState } from 'react';
import ChatbotButton from './ChatbotButton';
import ChatPanel from './ChatPanel';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleMinimize = () => {
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <ChatbotButton isOpen={isOpen} onClick={toggleChat} />
      <ChatPanel 
        isOpen={isOpen} 
        onClose={handleClose} 
        onMinimize={handleMinimize} 
      />
    </>
  );
};

export default Chatbot;
export { ChatbotButton, ChatPanel };
