import React, { useState, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Home, Terminal, Zap, Brain, Clock, Database, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import { useAICompletions } from '../hooks/useAICompletions';
import { useBugDetection } from '../hooks/useBugDetection';
import AISuggestionOverlay from '../components/IDE/AISuggestionOverlay';
import AIStatusBar from '../components/IDE/AIStatusBar';
import NL2CodeBar from '../components/IDE/NL2CodeBar';
import BugFixPanel from '../components/IDE/BugFixPanel';
import CodeVisualizer from '../components/IDE/CodeVisualizer';
import { executeCode, formatOutput, LANGUAGE_IDS, type SubmissionResponse } from '../services/judge0Service';
import type { Bug } from '../types/ide';

// Extended AI Analysis types
interface ComplexityAnalysis {
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
}

interface AIAnalysis {
  summary: string;
  suggestions: string[];
  errors: string[];
  optimizations: string[];
}

const IDEPage: React.FC = () => {
  // Editor state
  const [code, setCode] = useState<string>(`// Welcome to Breaking Code IDE
// Write your code here and click Run Code

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test the function
console.log(fibonacci(10));`);
  
  const [language, setLanguage] = useState<string>('javascript');
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [cursorLine, setCursorLine] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [dismissedBugIds, setDismissedBugIds] = useState<Set<string>>(new Set());
  const [previousCodeLength, setPreviousCodeLength] = useState<number>(code.length);
  
  // Execution metrics
  const [executionTime, setExecutionTime] = useState<string>('');
  const [memoryUsed, setMemoryUsed] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // AI Analysis
  const [showAIAnalysis, setShowAIAnalysis] = useState<boolean>(false);
  const [complexity, setComplexity] = useState<ComplexityAnalysis | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Right panel tab state
  type RightPanelTab = 'output' | 'visualizer' | 'analysis';
  const [rightTab, setRightTab] = useState<RightPanelTab>('output');
  const [lastStdout, setLastStdout] = useState<string>('');

  // Original AI features
  const { suggestion, isLoading, clearSuggestion } = useAICompletions(code, cursorLine, language);
  const { bugs, isScanning } = useBugDetection(code, language);
  const filteredBugs = bugs.filter(bug => !dismissedBugIds.has(bug.id));

  // Handle code change
  const handleEditorChange = useCallback((value: string | undefined) => {
    setCode(value || '');
    setStatus('idle');
  }, []);

  const handleEditorMount = useCallback((editor: any) => {
    editor.onDidChangeCursorPosition(() => {
      const position = editor.getPosition();
      if (position) {
        setCursorLine(position.lineNumber - 1);
      }
    });
  }, []);

  const handleAcceptSuggestion = useCallback(() => {
    if (suggestion) {
      setCode(prev => prev + suggestion);
      clearSuggestion();
    }
  }, [suggestion, clearSuggestion]);

  const handleNL2CodeGenerate = useCallback((generatedCode: string) => {
    setCode(prev => prev + '\n\n' + generatedCode);
  }, []);

  const handleApplyFix = useCallback((bug: Bug) => {
    if (code.includes(bug.originalSnippet)) {
      setCode(prev => prev.replace(bug.originalSnippet, bug.suggestedFix));
    } else {
      setCode(prev => prev + `\n// Fix for ${bug.message}: ${bug.suggestedFix}`);
    }
  }, [code]);

  const handleDismissBug = useCallback((bugId: string) => {
    setDismissedBugIds(prev => new Set(prev).add(bugId));
  }, []);

  // Reset dismissed bugs when code changes significantly
  useEffect(() => {
    if (Math.abs(code.length - previousCodeLength) > 50) {
      setDismissedBugIds(new Set());
      setPreviousCodeLength(code.length);
    }
  }, [code, previousCodeLength]);

  // Run code with Judge0
  const handleRunCode = useCallback(async () => {
    if (!LANGUAGE_IDS[language]) {
      setOutput(`Language '${language}' not supported`);
      setStatus('error');
      return;
    }

    setIsRunning(true);
    setOutput('Running...');
    setStatus('idle');
    
    try {
      const result: SubmissionResponse = await executeCode(
        code,
        language,
        input,
        (statusMsg) => setOutput(`Status: ${statusMsg}...`)
      );
      
      // Update metrics
      if (result.time) setExecutionTime(result.time);
      if (result.memory) setMemoryUsed(`${Math.round(result.memory / 1024)} KB`);
      
      // Format and display output
      const formatted = formatOutput(result);
      setOutput(formatted);
      
      // Save raw stdout for visualizer
      setLastStdout(result.stdout || '');
      
      // Set status based on result
      setStatus(result.status.id === 3 ? 'success' : 'error');
      
      // Switch to visualizer tab after execution
      setRightTab('visualizer');
      
      // Trigger AI analysis
      analyzeCode(code, language, result);
      
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setStatus('error');
    } finally {
      setIsRunning(false);
    }
  }, [code, language, input]);

  // AI Code Analysis (mock implementation)
  const analyzeCode = useCallback((sourceCode: string, lang: string, result: SubmissionResponse) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      // Detect patterns for complexity analysis
      const hasLoop = /for\s*\(|while\s*\(|forEach|map|filter|reduce/.test(sourceCode);
      const hasNestedLoop = /for\s*\([^)]*\)\s*{[^}]*for\s*\(/.test(sourceCode);
      const hasRecursion = /function\s+\w+\s*\([^)]*\)[^{]*\{[^}]*\w+\s*\([^)]*\)/.test(sourceCode);
      
      let timeComp = 'O(1)';
      let spaceComp = 'O(1)';
      
      if (hasNestedLoop) {
        timeComp = 'O(n²)';
        spaceComp = 'O(n)';
      } else if (hasRecursion) {
        timeComp = 'O(2ⁿ) or O(n!)';
        spaceComp = 'O(n) - call stack';
      } else if (hasLoop) {
        timeComp = 'O(n)';
        spaceComp = 'O(1)';
      }
      
      setComplexity({
        timeComplexity: timeComp,
        spaceComplexity: spaceComp,
        explanation: hasRecursion 
          ? 'Recursive algorithm detected. Time complexity grows exponentially with input size.'
          : hasNestedLoop 
            ? 'Nested loops detected. Quadratic time complexity.'
            : hasLoop 
              ? 'Linear iteration detected. Time grows proportionally with input.'
              : 'Constant time operations. No iteration or recursion detected.'
      });
      
      // Generate AI analysis
      const suggestions: string[] = [];
      const optimizations: string[] = [];
      const errors: string[] = [];
      
      if (result.status.id !== 3) {
        errors.push(`Execution failed with status: ${result.status.description}`);
      }
      
      if (hasRecursion) {
        suggestions.push('Consider memoization to optimize recursive calls');
        optimizations.push('Use dynamic programming to reduce time complexity');
      }
      
      if (hasNestedLoop && sourceCode.includes('Array')) {
        optimizations.push('Consider using hash maps for O(1) lookups');
      }
      
      if (!sourceCode.includes('//') && sourceCode.length > 200) {
        suggestions.push('Add comments to improve code readability');
      }
      
      if (!/const|let/.test(sourceCode) && lang === 'javascript') {
        suggestions.push('Use const/let instead of var for better scoping');
      }
      
      setAiAnalysis({
        summary: result.status.id === 3 
          ? 'Code executed successfully. Analysis complete.'
          : 'Code execution failed. Review errors below.',
        suggestions,
        errors: result.stderr ? [result.stderr, ...errors] : errors,
        optimizations
      });
      
      setIsAnalyzing(false);
      setShowAIAnalysis(true);
    }, 1500);
  }, []);

  // Reset
  const handleReset = useCallback(() => {
    setCode(`// Welcome to Breaking Code IDE
// Write your code here and click Run Code

function example() {
  console.log("Hello, World!");
}`);
    setInput('');
    setOutput('');
    setExecutionTime('');
    setMemoryUsed('');
    setStatus('idle');
    setComplexity(null);
    setAiAnalysis(null);
    setShowAIAnalysis(false);
  }, []);

  return (
    <div className="flex h-screen bg-[#0d1117] text-white overflow-hidden">
      {/* Left Panel - Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-14 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-[#58a6ff]" />
            <h1 className="font-semibold text-lg">Breaking Code IDE</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#21262d] border border-[#30363d] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#58a6ff]"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
            </select>
            
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded font-medium text-sm transition-colors"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
            
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] rounded text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] rounded text-sm transition-colors"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* NL2Code Bar */}
        <NL2CodeBar language={language} onGenerate={handleNL2CodeGenerate} />
        
        {/* Editor */}
        <div className="flex-1 relative">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16 },
            }}
          />
          
          {/* AI Suggestion Overlay */}
          <AISuggestionOverlay
            suggestion={suggestion}
            onAccept={handleAcceptSuggestion}
            onDismiss={clearSuggestion}
          />
        </div>
        
        {/* AI Status Bar */}
        <AIStatusBar isLoading={isLoading} characterCount={code.length} />
        
        {/* Bug Fix Panel */}
        <BugFixPanel
          bugs={filteredBugs}
          isScanning={isScanning}
          onApplyFix={handleApplyFix}
          onDismiss={handleDismissBug}
        />
        
        {/* Input Section */}
        <div className="h-32 bg-[#161b22] border-t border-[#30363d]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#30363d]">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Input (stdin)
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter input for your program here..."
            className="w-full h-[calc(100%-37px)] bg-transparent p-3 resize-none focus:outline-none font-mono text-sm"
          />
        </div>
      </div>
      
      {/* Right Panel - Tabbed Output / Visualizer / Analysis */}
      <div className="w-[450px] bg-[#161b22] border-l border-[#30363d] flex flex-col">
        {/* Tab bar */}
        <div className="flex border-b border-[#30363d] bg-[#0d1117]">
          {[
            { id: 'output' as RightPanelTab, label: 'Output', icon: <Terminal className="w-3.5 h-3.5" />, color: 'text-[#58a6ff]' },
            { id: 'visualizer' as RightPanelTab, label: 'Visualizer', icon: <Eye className="w-3.5 h-3.5" />, color: 'text-purple-400' },
            { id: 'analysis' as RightPanelTab, label: 'AI Analysis', icon: <Brain className="w-3.5 h-3.5" />, color: 'text-emerald-400' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setRightTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors relative ${
                rightTab === tab.id
                  ? `${tab.color} bg-[#161b22]`
                  : 'text-gray-500 hover:text-gray-300 hover:bg-[#161b22]/50'
              }`}
            >
              {tab.icon}
              {tab.label}
              {rightTab === tab.id && (
                <motion.div
                  layoutId="rightTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-current"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {tab.id === 'analysis' && isAnalyzing && (
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Output Tab */}
          {rightTab === 'output' && (
            <>
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#30363d]">
                <span className="text-xs text-gray-400">Console</span>
                {status !== 'idle' && (
                  <span className={`flex items-center gap-1 text-xs ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {status === 'success' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {status === 'success' ? 'Success' : 'Error'}
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-auto p-4 font-mono text-sm">
                {output ? (
                  <pre className="whitespace-pre-wrap text-gray-300">{output}</pre>
                ) : (
                  <span className="text-gray-500">Run code to see output...</span>
                )}
              </div>
              {/* Metrics */}
              <div className="flex items-center gap-4 px-4 py-2 border-t border-[#30363d] text-xs">
                {executionTime && (
                  <span className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-3 h-3" />
                    Time: {executionTime}s
                  </span>
                )}
                {memoryUsed && (
                  <span className="flex items-center gap-1 text-gray-400">
                    <Database className="w-3 h-3" />
                    Memory: {memoryUsed}
                  </span>
                )}
              </div>
            </>
          )}

          {/* Visualizer Tab */}
          {rightTab === 'visualizer' && (
            <CodeVisualizer
              code={code}
              language={language}
              stdout={lastStdout}
              isVisible={true}
            />
          )}

          {/* AI Analysis Tab */}
          {rightTab === 'analysis' && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#30363d]">
                <span className="text-xs text-gray-400 flex items-center gap-1.5">
                  {isAnalyzing && <span className="text-xs text-yellow-400 animate-pulse">analyzing...</span>}
                </span>
                {aiAnalysis && (
                  <button
                    onClick={() => setShowAIAnalysis(!showAIAnalysis)}
                    className="text-xs text-[#58a6ff] hover:underline"
                  >
                    {showAIAnalysis ? 'Hide' : 'Show'}
                  </button>
                )}
              </div>

              <AnimatePresence>
                {showAIAnalysis && complexity && aiAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex-1 overflow-auto p-4 space-y-3"
                  >
                    {/* Complexity Analysis */}
                    <div className="bg-[#21262d] rounded-lg p-3">
                      <div className="flex items-center gap-2 text-sm font-medium mb-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        Complexity Analysis
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-[#0d1117] rounded p-2">
                          <span className="text-gray-500">Time:</span>
                          <span className="ml-2 text-[#58a6ff] font-mono">{complexity.timeComplexity}</span>
                        </div>
                        <div className="bg-[#0d1117] rounded p-2">
                          <span className="text-gray-500">Space:</span>
                          <span className="ml-2 text-purple-400 font-mono">{complexity.spaceComplexity}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">{complexity.explanation}</p>
                    </div>

                    {/* AI Suggestions */}
                    {aiAnalysis.suggestions.length > 0 && (
                      <div className="bg-[#21262d] rounded-lg p-3">
                        <div className="text-sm font-medium text-yellow-400 mb-2">Suggestions</div>
                        <ul className="space-y-1">
                          {aiAnalysis.suggestions.map((s, i) => (
                            <li key={i} className="text-xs text-gray-400 flex items-start gap-1">
                              <span className="text-yellow-400">•</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Optimizations */}
                    {aiAnalysis.optimizations.length > 0 && (
                      <div className="bg-[#21262d] rounded-lg p-3">
                        <div className="text-sm font-medium text-green-400 mb-2">Optimizations</div>
                        <ul className="space-y-1">
                          {aiAnalysis.optimizations.map((o, i) => (
                            <li key={i} className="text-xs text-gray-400 flex items-start gap-1">
                              <span className="text-green-400">→</span> {o}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Errors */}
                    {aiAnalysis.errors.length > 0 && (
                      <div className="bg-[#21262d] rounded-lg p-3">
                        <div className="text-sm font-medium text-red-400 mb-2">Issues</div>
                        <ul className="space-y-1">
                          {aiAnalysis.errors.map((e, i) => (
                            <li key={i} className="text-xs text-gray-400 flex items-start gap-1">
                              <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                              <span className="text-red-300">{e}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {!showAIAnalysis && !isAnalyzing && (
                <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                  Run code to see AI analysis
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default IDEPage;
