import React from 'react';

interface AIStatusBarProps {
  isLoading: boolean;
  characterCount: number;
}

const AIStatusBar: React.FC<AIStatusBarProps> = ({ isLoading, characterCount }) => {
  return (
    <div className="h-8 bg-gray-900 border-t border-gray-800 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-cyan-400 animate-pulse' : 'bg-green-400'}`} />
        <span className="text-gray-400 text-sm">AI assistance active</span>
      </div>
      <div className="text-gray-500 text-sm">
        {characterCount.toLocaleString()} characters
      </div>
    </div>
  );
};

export default AIStatusBar;
