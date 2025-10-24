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
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const initChat = useCallback(async () => {
    try {
      setError(null);
      const chatSession = await initializeChat();
      setChat(chatSession);
      setChatHistory([
        {
          role: 'model',
          content: 'Worm GPT متصل. أنا هنا لإنشاء أقوى سكريبتات Roblox. ما الذي تريد إنجازه؟',
        },
      ]);
    } catch (e) {
      console.error("Error during chat initialization:", e);
      const defaultError = 'فشل في تهيئة الدردشة. الرجاء المحاولة مرة أخرى لاحقاً.';
      if (e instanceof Error) {
        if (e.message.includes("API_KEY")) {
          setError('فشل تهيئة الدردشة. يرجى التأكد من أنك قمت بإضافة `API_KEY` إلى متغيرات البيئة (Environment Variables) في إعدادات مشروع Vercel الخاص بك. بدون المفتاح، لا يمكن للتطبيق العمل.');
        } else {
          setError(`${defaultError} (${e.message})`);
        }
      } else {
        setError(defaultError);
      }
    } finally {
        setIsLoading(false);
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

    const userMessage: ChatMessageType = { role: 'user', content: message };
    setChatHistory((prevHistory) => [...prevHistory, userMessage]);
    
    try {
      const result = await chat.sendMessageStream({ message });
      let modelResponse = '';
      
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
      setChatHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        // If the last message was the streaming placeholder, remove it
        if(newHistory[newHistory.length -1].role === 'model' && newHistory[newHistory.length -1].content === ''){
            newHistory.pop();
        }
        return [...newHistory, { role: 'model', content: errorMessage }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !chatHistory.length) {
    return (
        <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans items-center justify-center">
            <svg className="animate-spin h-10 w-10 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg">جاري تهيئة Worm GPT...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans items-center justify-center text-center p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <h2 className="text-2xl font-bold text-red-400 mb-2">خطأ في الإعداد</h2>
            <p className="text-lg max-w-2xl">{error}</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-800">
        {chatHistory.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'user' && (
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