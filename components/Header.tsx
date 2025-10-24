
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex-shrink-0 bg-gray-950 shadow-md p-4 border-b border-gray-700">
      <div className="max-w-5xl mx-auto flex items-center justify-center">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 1-9.5 5.5v11L12 23l9.5-5.5v-11L12 1z"/>
            <path d="m12 1-9.5 5.5v11L12 23l9.5-5.5v-11L12 1z" transform="rotate(60 12 12)"/>
            <path d="m12 1-9.5 5.5v11L12 23l9.5-5.5v-11L12 1z" transform="rotate(120 12 12)"/>
        </svg>
        <h1 className="text-xl font-bold text-green-400 tracking-tight">
          Worm GPT
        </h1>
      </div>
    </header>
  );
};

export default Header;
