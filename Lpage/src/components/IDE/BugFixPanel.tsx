import React from 'react';
import type { Bug } from '../../types/ide';

interface BugFixPanelProps {
  bugs: Bug[];
  isScanning: boolean;
  onApplyFix: (bug: Bug) => void;
  onDismiss: (bugId: string) => void;
}

const BugFixPanel: React.FC<BugFixPanelProps> = ({ 
  bugs, 
  isScanning, 
  onApplyFix, 
  onDismiss 
}) => {
  if (bugs.length === 0 && !isScanning) {
    return null;
  }

  const getSeverityBadge = (severity: Bug['severity']) => {
    const baseClasses = 'px-2 py-0.5 text-xs font-bold rounded';
    switch (severity) {
      case 'error':
        return `${baseClasses} bg-red-900 text-red-200`;
      case 'warning':
        return `${baseClasses} bg-amber-900 text-amber-200`;
      case 'info':
        return `${baseClasses} bg-blue-900 text-blue-200`;
      default:
        return baseClasses;
    }
  };

  const getSeverityText = (severity: Bug['severity']) => {
    switch (severity) {
      case 'error':
        return 'ERR';
      case 'warning':
        return 'WARN';
      case 'info':
        return 'INFO';
      default:
        return '';
    }
  };

  const truncateMessage = (message: string, maxLength: number = 70) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '\u2026' : message;
  };

  const handleClearAll = () => {
    bugs.forEach(bug => onDismiss(bug.id));
  };

  return (
    <div className="bg-gray-900 border-t border-gray-800 max-h-44 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
        <div className="text-sm font-medium text-gray-300">
          Issues ({bugs.length})
        </div>
        {bugs.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Bug list */}
      <div className="divide-y divide-gray-800">
        {isScanning && bugs.length === 0 ? (
          <div className="px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-sm text-gray-400">Scanning for issues\u2026</span>
          </div>
        ) : (
          bugs.map((bug) => (
            <div key={bug.id} className="px-4 py-2 flex items-center gap-3">
              {/* Severity badge */}
              <div className={getSeverityBadge(bug.severity)}>
                {getSeverityText(bug.severity)}
              </div>

              {/* Line number */}
              <div className="text-xs text-gray-500 font-mono min-w-8">
                L{bug.line}
              </div>

              {/* Message */}
              <div className="flex-1 text-sm text-gray-300">
                {truncateMessage(bug.message)}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onApplyFix(bug)}
                  className="px-2 py-1 text-xs bg-devmind-cyan text-black font-medium rounded hover:bg-opacity-80 transition-all"
                >
                  Apply Fix
                </button>
                <button
                  onClick={() => onDismiss(bug.id)}
                  className="px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600 transition-all"
                >
                  \u2715
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BugFixPanel;
