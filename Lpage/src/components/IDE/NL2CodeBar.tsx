import React, { useState, useCallback } from 'react';
import { generateCodeFromDescription } from '../../utils/nl2codeTemplates';

interface NL2CodeBarProps {
  language: string;
  onGenerate: (code: string) => void;
}

const NL2CodeBar: React.FC<NL2CodeBarProps> = ({ language, onGenerate }) => {
  const [input, setInput] = useState<string>('');
  const [status, setStatus] = useState<{ type: 'success' | 'warning' | null; message: string | null }>({
    type: null,
    message: null
  });

  const handleGenerate = useCallback(() => {
    if (!input.trim()) return;

    const generatedCode = generateCodeFromDescription(input, language);
    
    if (generatedCode.includes('Could not match your description')) {
      setStatus({ type: 'warning', message: 'No template found - try different keywords' });
    } else {
      onGenerate(generatedCode);
      setStatus({ type: 'success', message: 'Code inserted \u2713' });
      setInput(''); // Clear input after successful generation
    }

    // Auto-clear status after 2 seconds
    setTimeout(() => {
      setStatus({ type: null, message: null });
    }, 2000);
  }, [input, language, onGenerate]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleGenerate();
    }
  }, [handleGenerate]);

  const handleClear = useCallback(() => {
    setInput('');
    setStatus({ type: null, message: null });
  }, []);

  return (
    <div className="h-12 bg-gray-800 border-b-2 border-devmind-cyan flex items-center px-4 gap-3 shadow-lg">
      {/* Sparkle icon */}
      <div className="w-3 h-3 flex items-center justify-center text-devmind-cyan text-sm">
        {'\u2726'}
      </div>
      
      {/* Label */}
      <div className="text-xs font-medium text-devmind-cyan">
        AI Code Generator:
      </div>
      
      {/* Input field */}
      <div className="flex-1 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type 'fibonacci', 'API call', 'bubble sort'..."
          className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-devmind-cyan focus:ring-1 focus:ring-devmind-cyan"
        />
        
        {/* Status message */}
        {status.message && (
          <div className={`absolute top-full left-0 mt-1 text-xs ${
            status.type === 'success' ? 'text-green-400' : 'text-amber-400'
          }`}>
            {status.message}
          </div>
        )}
      </div>
      
      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          disabled={!input.trim()}
          className="px-4 py-2 bg-devmind-cyan text-black text-sm font-bold rounded hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          Generate Code
        </button>
        <button
          onClick={handleClear}
          disabled={!input.trim()}
          className="px-3 py-2 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default NL2CodeBar;
