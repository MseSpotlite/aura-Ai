
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { SendIcon } from '../constants';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isThinking: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isThinking }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isThinking) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex-shrink-0"></div>
            )}
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl text-white ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 rounded-br-none'
                  : 'bg-gray-700 rounded-bl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              {isThinking && msg.sender === 'ai' && index === messages.length -1 && <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse-fast ml-1 inline-block"></div>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700/50">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Aura anything..."
            disabled={isThinking}
            className="flex-1 bg-gray-800 border border-gray-600 rounded-full py-2 px-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition"
          />
          <button
            type="submit"
            disabled={isThinking || !input.trim()}
            className="bg-indigo-600 text-white rounded-full p-2.5 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
            aria-label="Send message"
          >
            <SendIcon className="h-5 w-5"/>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
