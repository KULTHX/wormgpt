
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Regex to find code blocks with optional 'lua' language specifier
  const codeBlockRegex = /```(lua)?\n([\s\S]*?)\n```/g;
  const parts = content.split(codeBlockRegex);

  return (
    <div className="max-w-none" style={{ direction: 'rtl' }}>
      {parts.map((part, index) => {
        // Even indices are regular text, odd are language specifier, and the next one is the code
        if (index % 3 === 0) {
          // Regular text parts
          return part.split('\n').map((line, i) => (
            <p key={`${index}-${i}`} className="my-1">{line}</p>
          ));
        } else if (index % 3 === 2) {
          // Code parts
          return (
            <div key={index} className="my-4 rounded-lg bg-gray-900 text-left" style={{ direction: 'ltr' }}>
                <div className="flex justify-between items-center px-4 py-2 bg-black bg-opacity-30 text-gray-300 text-xs rounded-t-lg">
                    <span>Luau Script</span>
                    <button 
                        onClick={() => navigator.clipboard.writeText(part)}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Copy code"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                </div>
                <pre className="p-4 overflow-x-auto">
                <code className="font-mono text-sm text-white whitespace-pre">
                    {part}
                </code>
              </pre>
            </div>
          );
        }
        return null; // This will be the language specifier or undefined, so we skip it.
      })}
    </div>
  );
};

export default MarkdownRenderer;
