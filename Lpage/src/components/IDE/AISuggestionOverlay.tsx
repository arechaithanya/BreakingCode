import React, { useEffect, useState } from 'react';

interface AISuggestionOverlayProps {
  suggestion: string | null;
  onAccept: () => void;
  onDismiss: () => void;
}

const AISuggestionOverlay: React.FC<AISuggestionOverlayProps> = ({
  suggestion,
  onAccept,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(!!suggestion);
  }, [suggestion]);

  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        onAccept();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onAccept, onDismiss]);

  if (!isVisible || !suggestion) {
    return null;
  }

  const truncatedSuggestion = suggestion.length > 60 
    ? suggestion.substring(0, 60) + '...' 
    : suggestion;

  return (
    <div className="absolute bottom-4 right-4 z-50">
      <div className="flex items-center gap-3 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 text-sm font-medium">AI suggestion</span>
          <span className="text-gray-300 font-mono text-sm">
            {truncatedSuggestion}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAccept}
            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs rounded transition-colors"
          >
            Tab to accept
          </button>
          <button
            onClick={onDismiss}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors"
          >
            Esc to dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISuggestionOverlay;
