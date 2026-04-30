import React, { useState, useCallback, useRef } from 'react';

interface UseAICompletionsReturn {
  suggestion: string | null;
  isLoading: boolean;
  clearSuggestion: () => void;
}

const suggestionMap: Record<string, string> = {
  'for': 'for (let i = 0; i < arr.length; i++) {',
  'function': 'function name(params) {\n  \n}',
  'if': 'if (condition) {\n  \n}',
  'fetch': "fetch(url)\n  .then(res => res.json())\n  .then(data => console.log(data));",
  'class': 'class Name {\n  constructor() {}\n}',
  'arr': 'arr.map((item) => {\n  return item;\n});',
  'obj': 'Object.keys(obj).forEach(key => {\n  console.log(key, obj[key]);\n});',
  'try': 'try {\n  \n} catch (error) {\n  console.error(error);\n}',
  'import': "import { useState, useEffect } from 'react';",
  'console': 'console.log()',
  'while': 'while (condition) {\n  \n}',
  'switch': 'switch (value) {\n  case value1:\n    break;\n  default:\n    break;\n}',
  'const': 'const variable = value;',
  'let': 'let variable = value;',
  'var': 'var variable = value;',
  'async': 'async function functionName() {\n  \n}',
  'await': 'await somePromise();',
  'return': 'return value;',
  'throw': 'throw new Error("Error message");',
  'export': 'export default function() {\n  \n}',
  'require': 'const module = require("module-name");',
  'module': 'module.exports = {};',
  'process': 'process.exit();',
  'buffer': 'Buffer.from("string");',
  'array': 'const array = [1, 2, 3];',
  'string': 'const string = "text";',
  'number': 'const number = 42;',
  'boolean': 'const boolean = true;',
  'null': 'const value = null;',
  'undefined': 'const value = undefined;',
  'typeof': 'typeof variable',
  'instanceof': 'variable instanceof Constructor',
  'new': 'new Constructor()',
  'this': 'this.property',
  'super': 'super.method()',
  'static': 'static property = value;',
  'get': 'get property() {\n  return this._property;\n}',
  'set': 'set property(value) {\n  this._property = value;\n}',
  'delete': 'delete object.property;',
  'in': 'property in object',
  'of': 'for (const item of array) {',
  'break': 'break;',
  'continue': 'continue;',
  'do': 'do {\n  \n} while (condition);',
  'else': 'else {\n  \n}',
  'finally': 'finally {\n  \n}',
  'catch': 'catch (error) {\n  console.error(error);\n}',
  'default': 'default: break;',
  'case': 'case value: break;'
};

export const useAICompletions = (
  code: string,
  cursorLine: number,
  language: string
): UseAICompletionsReturn => {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const timeoutRef = useRef<number | null>(null);

  const clearSuggestion = useCallback(() => {
    setSuggestion(null);
  }, []);

  const generateSuggestion = useCallback(() => {
    if (!code.trim()) {
      setSuggestion(null);
      return;
    }

    const lines = code.split('\n');
    const currentLine = lines[cursorLine] || '';
    const lastTokenMatch = currentLine.match(/(\w+)$/);
    const lastToken = lastTokenMatch ? lastTokenMatch[1] : '';
    
    const foundSuggestion = suggestionMap[lastToken];
    if (foundSuggestion) {
      setSuggestion(foundSuggestion);
    } else {
      const words = currentLine.split(/\s+/);
      const lastWord = words[words.length - 1];
      const fallbackSuggestion = suggestionMap[lastWord];
      setSuggestion(fallbackSuggestion || null);
    }
  }, [code, cursorLine]);

  const debouncedSuggestion = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsLoading(true);
    
    timeoutRef.current = setTimeout(() => {
      generateSuggestion();
      setIsLoading(false);
    }, 700);
  }, [generateSuggestion]);

  React.useEffect(() => {
    debouncedSuggestion();
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [code, cursorLine, language, debouncedSuggestion]);

  return {
    suggestion,
    isLoading,
    clearSuggestion
  };
};
