
import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const userAvatar = (
    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
  );

  const modelAvatar = (
     <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold flex-shrink-0">
       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 1-9.5 5.5v11L12 23l9.5-5.5v-11L12 1z"/>
            <path d="m12 1-9.5 5.5v11L12 23l9.5-5.5v-11L12 1z" transform="rotate(60 12 12)"/>
            <path d="m12 1-9.5 5.5v11L12 23l9.5-5.5v-11L12 1z" transform="rotate(120 12 12)"/>
        </svg>
    </div>
  );

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && modelAvatar}
      <div
        className={`rounded-2xl p-4 max-w-2xl text-base ${
          isUser
            ? 'bg-green-600 text-white rounded-br-none'
            : 'bg-gray-700 text-gray-200 rounded-bl-none'
        }`}
        style={{ direction: 'rtl' }}
      >
        <MarkdownRenderer content={message.content} />
      </div>
      {isUser && userAvatar}
    </div>
  );
};

export default ChatMessage;
