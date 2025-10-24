
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage as ChatMessageType } from './types';
import { initializeChat } from './services/geminiService';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { Chat } from '@google/genai';

const App: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const initChat = useCallback(async () => {
    try {
      const chatSession = await initializeChat();
      setChat(chatSession);
      setChatHistory([
        {
          role: 'model',
          content: 'Worm GPT متصل. أنا هنا لإنشاء أقوى سكريبتات Roblox. ما الذي تريد إنجازه؟',
        },
      ]);
    } catch (e) {
      console.error(e);
      setError('Failed to initialize chat. Please check your API key and configuration.');
    }
  }, []);

  useEffect(() => {
    initChat();
  }, [initChat]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async (message: string) => {
    if (!chat || isLoading || !message.trim()) return;

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessageType = { role: 'user', content: message };
    setChatHistory((prevHistory) => [...prevHistory, userMessage]);
    
    try {
      const result = await chat.sendMessageStream({ message });
      let modelResponse = '';
      
      // Use a temporary message to hold streaming response
      const streamingMessage: ChatMessageType = { role: 'model', content: '' };
      setChatHistory(prev => [...prev, streamingMessage]);

      for await (const chunk of result) {
        modelResponse += chunk.text;
        setChatHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1].content = modelResponse;
            return newHistory;
        });
      }

    } catch (e) {
      console.error(e);
      const errorMessage = 'عذراً، حدث خطأ أثناء التواصل مع الذكاء الاصطناعي. الرجاء المحاولة مرة أخرى.';
      setError(errorMessage);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: 'model', content: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-800">
        {chatHistory.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && chatHistory[chatHistory.length - 1].role === 'user' && (
           <div className="flex justify-start">
             <div className="bg-gray-700 rounded-2xl p-4 max-w-2xl">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                </div>
             </div>
           </div>
        )}
      </main>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
