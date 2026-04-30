import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Eye } from 'lucide-react';
import { analyzeCode, type AnalysisResult, type VisualizationStep } from '../../utils/codeAnalyzer';
import ArrayVisualizer from './visualizers/ArrayVisualizer';
import CallStackVisualizer from './visualizers/CallStackVisualizer';
import VariableTracker from './visualizers/VariableTracker';
import LoopVisualizer from './visualizers/LoopVisualizer';
import LinkedListVisualizer from './visualizers/LinkedListVisualizer';

interface Props {
  code: string;
  language: string;
  stdout: string;
  isVisible: boolean;
}

const CodeVisualizer: React.FC<Props> = ({ code, language, stdout, isVisible }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Analyze code when it changes
  useEffect(() => {
    if (code && stdout) {
      const result = analyzeCode(code, language, stdout);
      setAnalysis(result);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [code, language, stdout]);

  // Auto-play animation
  useEffect(() => {
    if (isPlaying && analysis && analysis.steps.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= analysis.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800 / speed);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, analysis, speed]);

  const handlePlay = useCallback(() => {
    if (analysis && currentStep >= analysis.steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(prev => !prev);
  }, [analysis, currentStep]);

  const handleStepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(prev => {
      if (!analysis) return prev;
      return Math.min(prev + 1, analysis.steps.length - 1);
    });
  }, [analysis]);

  const handleStepBack = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  if (!isVisible) return null;

  if (!analysis || analysis.steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3 p-6">
        <Eye className="w-8 h-8 text-gray-600" />
        <span className="text-sm text-center">
          Run code to see visualizations.<br />
          <span className="text-xs text-gray-600">
            Supports arrays, loops, recursion, and variables.
          </span>
        </span>
      </div>
    );
  }

  const step = analysis.steps[currentStep];
  const totalSteps = analysis.steps.length;

  return (
    <div className="flex flex-col h-full">
      {/* Summary bar */}
      <div className="px-3 py-2 bg-[#21262d]/50 border-b border-[#30363d]">
        <div className="flex items-center gap-1.5 flex-wrap">
          {analysis.detected.map(type => (
            <span
              key={type}
              className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                type === 'array' ? 'bg-[#58a6ff]/15 text-[#58a6ff]' :
                type === 'callstack' ? 'bg-purple-500/15 text-purple-400' :
                type === 'loop' ? 'bg-sky-500/15 text-sky-400' :
                type === 'variable' ? 'bg-emerald-500/15 text-emerald-400' :
                type === 'linkedlist' ? 'bg-[#ff7b72]/15 text-[#ff7b72]' :
                'bg-gray-500/15 text-gray-400'
              }`}
            >
              {type === 'callstack' ? 'recursion' : type}
            </span>
          ))}
          <span className="text-[9px] text-gray-500 ml-auto">{totalSteps} steps</span>
        </div>
      </div>

      {/* Step label */}
      <div className="px-3 py-2 border-b border-[#30363d]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            <div className="text-xs font-medium text-white">{step.label}</div>
            <div className="text-[10px] text-gray-500">{step.description}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Visualization area */}
      <div className="flex-1 p-3 overflow-auto min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${step.type}-${step.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {step.data.kind === 'array' && <ArrayVisualizer data={step.data} />}
            {step.data.kind === 'callstack' && <CallStackVisualizer data={step.data} />}
            {step.data.kind === 'variable' && <VariableTracker data={step.data} />}
            {step.data.kind === 'loop' && <LoopVisualizer data={step.data} />}
            {step.data.kind === 'linkedlist' && <LinkedListVisualizer data={step.data} />}
            {step.data.kind === 'output' && (
              <div className="flex flex-col h-full">
                <span className="text-xs font-mono text-gray-400 mb-2">Console Output</span>
                <div className="flex-1 bg-[#0d1117] rounded-lg p-3 font-mono text-xs overflow-auto">
                  {step.data.allLines.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`${i === step.data.allLines.length - 1 ? 'text-green-400' : 'text-gray-400'}`}
                    >
                      <span className="text-gray-600 select-none mr-2">{i + 1}</span>
                      {line}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Timeline scrubber */}
      <div className="px-3 py-1 border-t border-[#30363d]">
        <div className="flex items-center gap-1">
          {analysis.steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => { setIsPlaying(false); setCurrentStep(idx); }}
              className="flex-1 h-1.5 rounded-full transition-colors"
              style={{
                backgroundColor: idx < currentStep
                  ? s.type === 'array' ? '#58a6ff' :
                    s.type === 'callstack' ? '#a855f7' :
                    s.type === 'loop' ? '#38bdf8' :
                    s.type === 'variable' ? '#10b981' :
                    s.type === 'linkedlist' ? '#ff7b72' :
                    '#6b7280'
                  : idx === currentStep
                  ? '#ffffff'
                  : '#21262d',
                minWidth: '3px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-[#30363d] bg-[#161b22]">
        <div className="flex items-center gap-1">
          <button
            onClick={handleReset}
            className="p-1 hover:bg-[#21262d] rounded text-gray-400 hover:text-white transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleStepBack}
            disabled={currentStep === 0}
            className="p-1 hover:bg-[#21262d] rounded text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            title="Step back"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handlePlay}
            className={`p-1.5 rounded-full transition-colors ${
              isPlaying
                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            }`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleStepForward}
            disabled={currentStep >= totalSteps - 1}
            className="p-1 hover:bg-[#21262d] rounded text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            title="Step forward"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step counter */}
        <span className="text-[10px] font-mono text-gray-500">
          {currentStep + 1} / {totalSteps}
        </span>

        {/* Speed control */}
        <div className="flex items-center gap-1">
          {[0.5, 1, 2].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`text-[9px] px-1.5 py-0.5 rounded font-mono transition-colors ${
                speed === s
                  ? 'bg-[#58a6ff]/20 text-[#58a6ff]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeVisualizer;
