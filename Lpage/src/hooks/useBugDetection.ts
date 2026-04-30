import React, { useState, useCallback, useRef } from 'react';
import type { Bug } from '../types/ide';

interface UseBugDetectionReturn {
  bugs: Bug[];
  isScanning: boolean;
}

export const useBugDetection = (code: string, language: string): UseBugDetectionReturn => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const timeoutRef = useRef<number | null>(null);

  const detectBugs = useCallback(() => {
    const detectedBugs: Bug[] = [];
    const lines = code.split('\n');

    // Skip if code is too short
    if (lines.length < 3 || !code.trim()) {
      setBugs([]);
      return;
    }

    for (let i = 0; i < lines.length && detectedBugs.length < 8; i++) {
      const line = lines[i];
      const lineNumber = i + 1;

      // ERROR RULES
      // E1: Loose equality with null/undefined
      const e1Match = line.match(/(==\s*(null|undefined))/);
      if (e1Match) {
        detectedBugs.push({
          id: `bug-${lineNumber}-E1`,
          line: lineNumber,
          severity: 'error',
          message: 'Prefer strict equality (=== null). Loose == can cause unexpected coercion.',
          suggestedFix: line.replace(/==/, '==='),
          originalSnippet: e1Match[1]
        });
        continue;
      }

      // E2: Missing semicolon after console.log (JS/TS only)
      if ((language === 'javascript' || language === 'typescript') && 
          line.includes('console.log(') && !line.trim().endsWith(';')) {
        const e2Match = line.match(/console\.log\([^)]*\)/);
        if (e2Match) {
          detectedBugs.push({
            id: `bug-${lineNumber}-E2`,
            line: lineNumber,
            severity: 'error',
            message: 'Missing semicolon after console.log().',
            suggestedFix: line + ';',
            originalSnippet: e2Match[0]
          });
          continue;
        }
      }

      // E3: var declarations
      const e3Match = line.match(/\bvar\s+/);
      if (e3Match) {
        detectedBugs.push({
          id: `bug-${lineNumber}-E3`,
          line: lineNumber,
          severity: 'error',
          message: 'Avoid var \u2014 use const or let for block scoping.',
          suggestedFix: line.replace(/\bvar\s+/, 'const '),
          originalSnippet: 'var'
        });
        continue;
      }

      // WARNING RULES
      // W1: Empty catch block
      const w1Match = line.match(/catch\s*(\{\s*\}|\{\s*\})/);
      if (w1Match) {
        detectedBugs.push({
          id: `bug-${lineNumber}-W1`,
          line: lineNumber,
          severity: 'warning',
          message: 'Empty catch block silently swallows errors. Log or handle the error.',
          suggestedFix: line.replace(/\{\s*\}/, '{ console.error(error); }'),
          originalSnippet: w1Match[1]
        });
        continue;
      }

      // W2: Nested ternary (multiple ? on same line)
      const questionMarks = (line.match(/\?/g) || []).length;
      if (questionMarks >= 2) {
        detectedBugs.push({
          id: `bug-${lineNumber}-W2`,
          line: lineNumber,
          severity: 'warning',
          message: 'Nested ternary is hard to read. Consider if/else or a helper function.',
          suggestedFix: 'Refactor to if/else for clarity',
          originalSnippet: line.trim()
        });
        continue;
      }

      // W3: for...in on arrays
      const w3Match = line.match(/for\s*\([^)]*\s+in\s+(arr|list|items|array)\b/);
      if (w3Match) {
        detectedBugs.push({
          id: `bug-${lineNumber}-W3`,
          line: lineNumber,
          severity: 'warning',
          message: 'for...in on arrays iterates keys, not values. Use for...of or .forEach().',
          suggestedFix: 'Replace with for...of',
          originalSnippet: `for (... in ${w3Match[1]}`
        });
        continue;
      }

      // INFO RULES
      // I1: Function length check (simplified - just check if function spans many lines)
      // This is a simplified version - real implementation would need more sophisticated parsing
      const i1Match = line.match(/function\s+\w+|const\s+\w+\s*=|=>\s*\{/);
      if (i1Match && i + 25 < lines.length) {
        // Check if function body spans more than 25 lines
        let braceCount = 0;
        let functionEnd = i;
        for (let j = i; j < lines.length; j++) {
          const openBraces = (lines[j].match(/\{/g) || []).length;
          const closeBraces = (lines[j].match(/\}/g) || []).length;
          braceCount += openBraces - closeBraces;
          
          if (braceCount <= 0 && j > i) {
            functionEnd = j;
            break;
          }
        }
        
        if (functionEnd - i > 25) {
          detectedBugs.push({
            id: `bug-${lineNumber}-I1`,
            line: lineNumber,
            severity: 'info',
            message: 'Function exceeds 25 lines. Consider splitting into smaller functions.',
            suggestedFix: 'Extract sub-logic into named helper functions',
            originalSnippet: i1Match[0]
          });
          continue;
        }
      }

      // I2: Magic numbers (> 9, not in arrays or for loops)
      const i2Matches = line.match(/\b(1[0-9]|[2-9]\d|\d{3,})\b/g);
      if (i2Matches) {
        // Filter out numbers that are likely in array literals or for loops
        const magicNumbers = i2Matches.filter(num => {
          const context = line.substring(line.indexOf(num) - 5, line.indexOf(num) + num.length + 5);
          return !context.includes('[') && !context.includes(']') && 
                 !context.includes('for(') && !context.includes('for (');
        });
        
        if (magicNumbers.length > 0) {
          detectedBugs.push({
            id: `bug-${lineNumber}-I2`,
            line: lineNumber,
            severity: 'info',
            message: 'Magic number detected. Consider naming this constant.',
            suggestedFix: `Extract to a named const: const LIMIT = ${magicNumbers[0]}`,
            originalSnippet: magicNumbers[0]
          });
          continue;
        }
      }
    }

    setBugs(detectedBugs);
  }, [code, language]);

  const debouncedDetect = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsScanning(true);
    
    timeoutRef.current = setTimeout(() => {
      detectBugs();
      setIsScanning(false);
    }, 900);
  }, [detectBugs]);

  React.useEffect(() => {
    debouncedDetect();
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [code, language, debouncedDetect]);

  return {
    bugs,
    isScanning
  };
};
