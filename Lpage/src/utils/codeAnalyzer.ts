/**
 * Code Analyzer — parses source code to detect patterns and generate visualization steps.
 * Supports JavaScript and Python pattern detection.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type VisualizationType = 'array' | 'variable' | 'callstack' | 'loop' | 'output' | 'linkedlist';

export interface VisualizationStep {
  id: number;
  type: VisualizationType;
  label: string;
  description: string;
  timestamp: number; // ms offset for animation timing
  data: StepData;
}

export type StepData =
  | ArrayStepData
  | VariableStepData
  | CallStackStepData
  | LoopStepData
  | OutputStepData
  | LinkedListStepData;

export interface ArrayStepData {
  kind: 'array';
  name: string;
  values: number[];
  highlightIndices: number[];   // indices being accessed/compared
  swapIndices: [number, number] | null;  // indices being swapped
  action: 'init' | 'access' | 'swap' | 'push' | 'pop' | 'compare' | 'set';
}

export interface VariableStepData {
  kind: 'variable';
  variables: { name: string; value: string; changed: boolean }[];
}

export interface CallStackStepData {
  kind: 'callstack';
  frames: { name: string; args: string; depth: number; returning?: boolean }[];
  action: 'push' | 'pop' | 'idle';
}

export interface LoopStepData {
  kind: 'loop';
  loopType: 'for' | 'while' | 'forEach';
  variable: string;
  current: number;
  total: number;
  iterationValues: number[];
}

export interface OutputStepData {
  kind: 'output';
  line: string;
  allLines: string[];
}

export interface LinkedListStepData {
  kind: 'linkedlist';
  name: string;
  nodes: { id: string; val: number | string; nextId: string | null }[];
  headId: string | null;
  currId: string | null;
  action: 'init' | 'traverse' | 'insert' | 'delete';
}

export interface AnalysisResult {
  detected: VisualizationType[];
  steps: VisualizationStep[];
  summary: string;
}

// ─── Pattern Detectors ───────────────────────────────────────────────────────

interface DetectedPattern {
  type: VisualizationType;
  match: RegExpMatchArray;
  details: Record<string, unknown>;
}

function detectArrayPatterns(code: string, lang: string): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];

  // Array literal declarations
  const arrayLiteralRegex = lang === 'python'
    ? /(\w+)\s*=\s*\[([^\]]+)\]/g
    : /(?:let|const|var)\s+(\w+)\s*=\s*\[([^\]]+)\]/g;

  let m;
  while ((m = arrayLiteralRegex.exec(code)) !== null) {
    patterns.push({
      type: 'array',
      match: m,
      details: { name: m[1], values: m[2] },
    });
  }

  // Sorting detection
  const sortMatch = code.match(/bubble.?sort|selection.?sort|insertion.?sort|merge.?sort|quick.?sort|\.sort\(|sorted\(/i);
  if (sortMatch) {
    let sortAction = 'bubblesort'; // default
    const matchStr = sortMatch[0].toLowerCase();
    if (matchStr.includes('selection')) sortAction = 'selectionsort';
    else if (matchStr.includes('insertion')) sortAction = 'insertionsort';
    else if (matchStr.includes('merge')) sortAction = 'mergesort';
    else if (matchStr.includes('quick')) sortAction = 'quicksort';
    else if (matchStr.includes('bubble')) sortAction = 'bubblesort';

    patterns.push({
      type: 'array',
      match: sortMatch as any,
      details: { action: sortAction },
    });
  }

  return patterns;
}

function detectLoopPatterns(code: string, lang: string): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];

  // For loops
  const forRegex = lang === 'python'
    ? /for\s+(\w+)\s+in\s+range\((\d+)(?:\s*,\s*(\d+))?\)/g
    : /for\s*\(\s*(?:let|var|int)\s+(\w+)\s*=\s*(\d+);\s*\w+\s*[<>=!]+\s*(\d+)/g;

  let m;
  while ((m = forRegex.exec(code)) !== null) {
    patterns.push({
      type: 'loop',
      match: m,
      details: {
        variable: m[1],
        start: lang === 'python' ? (m[3] ? parseInt(m[2]) : 0) : parseInt(m[2]),
        end: lang === 'python' ? (m[3] ? parseInt(m[3]) : parseInt(m[2])) : parseInt(m[3]),
      },
    });
  }

  // While loops
  const whileRegex = /while\s*\(/g;
  while ((m = whileRegex.exec(code)) !== null) {
    patterns.push({
      type: 'loop',
      match: m,
      details: { variable: 'i', start: 0, end: 10 },
    });
  }

  return patterns;
}

function detectRecursionPatterns(code: string, lang: string): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];

  // Function that calls itself
  const funcRegex = lang === 'python'
    ? /def\s+(\w+)\s*\(([^)]*)\)/g
    : /function\s+(\w+)\s*\(([^)]*)\)/g;

  let m;
  while ((m = funcRegex.exec(code)) !== null) {
    const funcName = m[1];
    const argsStr = m[2];
    // Check if the function body contains a call to itself
    const bodyAfter = code.slice(m.index + m[0].length);
    const callRegex = new RegExp(`${funcName}\\s*\\(`, 'g');
    if (callRegex.test(bodyAfter)) {
      patterns.push({
        type: 'callstack',
        match: m,
        details: { funcName, args: argsStr },
      });
    }
  }

  return patterns;
}

function detectVariablePatterns(code: string, lang: string): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];

  const varRegex = lang === 'python'
    ? /^(\w+)\s*=\s*(.+)$/gm
    : /(?:let|const|var)\s+(\w+)\s*=\s*(.+?)(?:;|$)/gm;

  let m;
  while ((m = varRegex.exec(code)) !== null) {
    // Skip array declarations (handled separately)
    if (/^\s*\[/.test(m[2])) continue;
    patterns.push({
      type: 'variable',
      match: m,
      details: { name: m[1], value: m[2].trim() },
    });
  }

  return patterns;
}

function detectLinkedListPatterns(code: string, lang: string): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];
  
  // Look for ListNode class or function, or common variable names like head, curr
  const hasListNode = /class\s+ListNode|function\s+ListNode/.test(code);
  const hasCommonVars = /\b(?:head|curr|tail|next)\b/.test(code);
  const listCreation = /new\s+ListNode\(([^)]*)\)/g;

  if (hasListNode || hasCommonVars) {
    let m;
    let values: string[] = [];
    while ((m = listCreation.exec(code)) !== null) {
        if (m[1]) {
           const val = m[1].split(',')[0].trim();
           if (val && val !== '0') values.push(val);
        }
    }
    
    // If we didn't find specific creations but saw the pattern, mock some values
    if (values.length === 0) {
       values = ['1', '2', '3', '4'];
    }

    patterns.push({
      type: 'linkedlist',
      match: [] as any,
      details: { name: 'list', values },
    });
  }

  return patterns;
}

// ─── Step Generators ─────────────────────────────────────────────────────────

function generateArraySteps(
  patterns: DetectedPattern[],
  stdout: string,
  stepId: { current: number },
  time: { current: number }
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];

  for (const p of patterns) {
    const name = p.details.name as string | undefined;
    const valuesStr = p.details.values as string | undefined;

    if (name && valuesStr) {
      const values = valuesStr.split(',').map(v => {
        const n = parseFloat(v.trim());
        return isNaN(n) ? 0 : n;
      }).filter(v => !isNaN(v));

      if (values.length === 0) continue;

      // Initial state
      steps.push({
        id: stepId.current++,
        type: 'array',
        label: `Initialize ${name}`,
        description: `Array ${name} created with ${values.length} elements`,
        timestamp: time.current,
        data: { kind: 'array', name, values: [...values], highlightIndices: [], swapIndices: null, action: 'init' },
      });
      time.current += 600;

      // Check which sort is detected globally
      const sortPattern = patterns.find(pp => pp.details.action && String(pp.details.action).endsWith('sort'));
      const sortType = (p.details.action as string)?.endsWith('sort') ? p.details.action : sortPattern?.details.action;

      if (sortType) {
        const arr = [...values];
        
        if (sortType === 'bubblesort') {
          for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
              // Compare step
              steps.push({
                id: stepId.current++,
                type: 'array',
                label: `Compare ${name}[${j}] and ${name}[${j + 1}]`,
                description: `Comparing ${arr[j]} with ${arr[j + 1]}`,
                timestamp: time.current,
                data: { kind: 'array', name, values: [...arr], highlightIndices: [j, j + 1], swapIndices: null, action: 'compare' },
              });
              time.current += 400;

              if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                steps.push({
                  id: stepId.current++,
                  type: 'array',
                  label: `Swap ${name}[${j}] ↔ ${name}[${j + 1}]`,
                  description: `Swapping ${arr[j + 1]} and ${arr[j]}`,
                  timestamp: time.current,
                  data: { kind: 'array', name, values: [...arr], highlightIndices: [j, j + 1], swapIndices: [j, j + 1], action: 'swap' },
                });
                time.current += 500;
              }
            }
          }
        } else if (sortType === 'selectionsort') {
          for (let i = 0; i < arr.length - 1; i++) {
            let minIdx = i;
            for (let j = i + 1; j < arr.length; j++) {
              steps.push({
                id: stepId.current++,
                type: 'array',
                label: `Compare ${name}[${j}] and ${name}[${minIdx}]`,
                description: `Comparing ${arr[j]} with current min ${arr[minIdx]}`,
                timestamp: time.current,
                data: { kind: 'array', name, values: [...arr], highlightIndices: [j, minIdx], swapIndices: null, action: 'compare' },
              });
              time.current += 400;
              if (arr[j] < arr[minIdx]) {
                minIdx = j;
              }
            }
            if (minIdx !== i) {
              [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
              steps.push({
                id: stepId.current++,
                type: 'array',
                label: `Swap ${name}[${i}] ↔ ${name}[${minIdx}]`,
                description: `Swapping ${arr[i]} and ${arr[minIdx]}`,
                timestamp: time.current,
                data: { kind: 'array', name, values: [...arr], highlightIndices: [i, minIdx], swapIndices: [i, minIdx], action: 'swap' },
              });
              time.current += 500;
            }
          }
        } else if (sortType === 'insertionsort') {
          for (let i = 1; i < arr.length; i++) {
            let key = arr[i];
            let j = i - 1;
            while (j >= 0 && arr[j] > key) {
              steps.push({
                id: stepId.current++,
                type: 'array',
                label: `Compare ${name}[${j}] and key ${key}`,
                description: `Comparing ${arr[j]} with ${key}`,
                timestamp: time.current,
                data: { kind: 'array', name, values: [...arr], highlightIndices: [j, j + 1], swapIndices: null, action: 'compare' },
              });
              time.current += 400;

              arr[j + 1] = arr[j];
              steps.push({
                id: stepId.current++,
                type: 'array',
                label: `Move ${name}[${j}] to ${name}[${j + 1}]`,
                description: `Moving ${arr[j]} to index ${j + 1}`,
                timestamp: time.current,
                data: { kind: 'array', name, values: [...arr], highlightIndices: [j + 1], swapIndices: null, action: 'set' },
              });
              time.current += 400;
              j = j - 1;
            }
            arr[j + 1] = key;
            steps.push({
              id: stepId.current++,
              type: 'array',
              label: `Insert key ${key} at ${name}[${j + 1}]`,
              description: `Inserting ${key} at index ${j + 1}`,
              timestamp: time.current,
              data: { kind: 'array', name, values: [...arr], highlightIndices: [j + 1], swapIndices: null, action: 'set' },
            });
            time.current += 400;
          }
        } else if (sortType === 'mergesort') {
          const mergeSortHelper = (start: number, end: number) => {
            if (start >= end) return;
            const mid = Math.floor((start + end) / 2);
            mergeSortHelper(start, mid);
            mergeSortHelper(mid + 1, end);
            
            let left = start;
            let right = mid + 1;
            const temp: number[] = [];
            
            while (left <= mid && right <= end) {
              steps.push({
                id: stepId.current++,
                type: 'array',
                label: `Compare ${name}[${left}] and ${name}[${right}]`,
                description: `Merging: Comparing ${arr[left]} with ${arr[right]}`,
                timestamp: time.current,
                data: { kind: 'array', name, values: [...arr], highlightIndices: [left, right], swapIndices: null, action: 'compare' },
              });
              time.current += 400;
              
              if (arr[left] <= arr[right]) {
                temp.push(arr[left++]);
              } else {
                temp.push(arr[right++]);
              }
            }
            while (left <= mid) temp.push(arr[left++]);
            while (right <= end) temp.push(arr[right++]);
            
            for (let i = 0; i < temp.length; i++) {
              arr[start + i] = temp[i];
              steps.push({
                id: stepId.current++,
                type: 'array',
                label: `Update ${name}[${start + i}]`,
                description: `Setting value to ${temp[i]} from merged array`,
                timestamp: time.current,
                data: { kind: 'array', name, values: [...arr], highlightIndices: [start + i], swapIndices: null, action: 'set' },
              });
              time.current += 400;
            }
          };
          mergeSortHelper(0, arr.length - 1);
        } else if (sortType === 'quicksort') {
          const quickSortHelper = (low: number, high: number) => {
            if (low < high) {
              const pivot = arr[high];
              let i = low - 1;
              
              steps.push({
                id: stepId.current++,
                type: 'array',
                label: `Pivot chosen: ${pivot}`,
                description: `Partitioning with pivot ${pivot} at index ${high}`,
                timestamp: time.current,
                data: { kind: 'array', name, values: [...arr], highlightIndices: [high], swapIndices: null, action: 'access' },
              });
              time.current += 400;

              for (let j = low; j < high; j++) {
                steps.push({
                  id: stepId.current++,
                  type: 'array',
                  label: `Compare ${name}[${j}] with pivot ${pivot}`,
                  description: `Comparing ${arr[j]} with ${pivot}`,
                  timestamp: time.current,
                  data: { kind: 'array', name, values: [...arr], highlightIndices: [j, high], swapIndices: null, action: 'compare' },
                });
                time.current += 400;

                if (arr[j] < pivot) {
                  i++;
                  if (i !== j) {
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    steps.push({
                      id: stepId.current++,
                      type: 'array',
                      label: `Swap ${name}[${i}] ↔ ${name}[${j}]`,
                      description: `Swapping ${arr[j]} and ${arr[i]}`,
                      timestamp: time.current,
                      data: { kind: 'array', name, values: [...arr], highlightIndices: [i, j], swapIndices: [i, j], action: 'swap' },
                    });
                    time.current += 500;
                  }
                }
              }
              
              if (i + 1 !== high) {
                [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
                steps.push({
                  id: stepId.current++,
                  type: 'array',
                  label: `Swap pivot to ${name}[${i + 1}]`,
                  description: `Swapping pivot ${arr[i + 1]} and ${arr[high]}`,
                  timestamp: time.current,
                  data: { kind: 'array', name, values: [...arr], highlightIndices: [i + 1, high], swapIndices: [i + 1, high], action: 'swap' },
                });
                time.current += 500;
              }
              
              const pi = i + 1;
              quickSortHelper(low, pi - 1);
              quickSortHelper(pi + 1, high);
            }
          };
          quickSortHelper(0, arr.length - 1);
        }

        // Final sorted state
        steps.push({
          id: stepId.current++,
          type: 'array',
          label: `${name} sorted`,
          description: `Array is now sorted: [${arr.join(', ')}]`,
          timestamp: time.current,
          data: { kind: 'array', name, values: [...arr], highlightIndices: arr.map((_, i) => i), swapIndices: null, action: 'init' },
        });
        time.current += 600;
      } else {
        // Just show array access patterns
        for (let i = 0; i < Math.min(values.length, 8); i++) {
          steps.push({
            id: stepId.current++,
            type: 'array',
            label: `Access ${name}[${i}]`,
            description: `Reading value ${values[i]} at index ${i}`,
            timestamp: time.current,
            data: { kind: 'array', name, values: [...values], highlightIndices: [i], swapIndices: null, action: 'access' },
          });
          time.current += 350;
        }
      }
    }
  }

  return steps;
}

function generateRecursionSteps(
  patterns: DetectedPattern[],
  stdout: string,
  stepId: { current: number },
  time: { current: number }
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];

  for (const p of patterns) {
    const funcName = p.details.funcName as string;
    const args = p.details.args as string;
    const firstArg = args.split(',')[0]?.trim();

    // Try to parse the initial call from stdout or code
    const initialN = extractInitialArg(funcName, firstArg, stdout);
    const maxDepth = Math.min(initialN, 8); // cap for visual sanity

    const frames: { name: string; args: string; depth: number; returning?: boolean }[] = [];

    // Build up the call stack
    for (let d = 0; d <= maxDepth; d++) {
      const argVal = initialN - d;
      frames.push({ name: funcName, args: `${firstArg}=${argVal}`, depth: d });
      steps.push({
        id: stepId.current++,
        type: 'callstack',
        label: `Call ${funcName}(${argVal})`,
        description: `Pushing ${funcName}(${argVal}) onto call stack (depth ${d})`,
        timestamp: time.current,
        data: { kind: 'callstack', frames: frames.map(f => ({ ...f })), action: 'push' },
      });
      time.current += 450;
    }

    // Unwind the call stack
    for (let d = maxDepth; d >= 0; d--) {
      const frame = frames[frames.length - 1];
      frame.returning = true;
      steps.push({
        id: stepId.current++,
        type: 'callstack',
        label: `Return from ${frame.name}(${frame.args.split('=')[1]})`,
        description: `Popping ${frame.name} from call stack`,
        timestamp: time.current,
        data: { kind: 'callstack', frames: frames.map(f => ({ ...f })), action: 'pop' },
      });
      frames.pop();
      time.current += 400;
    }
  }

  return steps;
}

function extractInitialArg(funcName: string, _argName: string, stdout: string): number {
  // Try to infer from common patterns
  if (/fibonacci|fib/i.test(funcName)) return 5;
  if (/factorial/i.test(funcName)) return 5;
  // Try to parse from output
  const num = parseInt(stdout);
  if (!isNaN(num) && num > 0 && num < 20) return Math.min(num, 6);
  return 4;
}

function generateLoopSteps(
  patterns: DetectedPattern[],
  _stdout: string,
  stepId: { current: number },
  time: { current: number }
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];

  for (const p of patterns) {
    const variable = p.details.variable as string;
    const start = p.details.start as number;
    const end = p.details.end as number;
    const total = Math.min(end - start, 15); // cap iterations

    const iterationValues: number[] = [];

    for (let i = start; i < start + total; i++) {
      iterationValues.push(i);
      steps.push({
        id: stepId.current++,
        type: 'loop',
        label: `Iteration ${variable}=${i}`,
        description: `Loop iteration ${i - start + 1} of ${total}`,
        timestamp: time.current,
        data: {
          kind: 'loop',
          loopType: 'for',
          variable,
          current: i - start,
          total,
          iterationValues: [...iterationValues],
        },
      });
      time.current += 350;
    }
  }

  return steps;
}

function generateVariableSteps(
  patterns: DetectedPattern[],
  _stdout: string,
  stepId: { current: number },
  time: { current: number }
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  const currentVars: { name: string; value: string; changed: boolean }[] = [];

  for (const p of patterns) {
    const name = p.details.name as string;
    const value = p.details.value as string;

    // Skip function declarations and complex expressions
    if (/^function|^def |^\(/.test(value)) continue;

    const existing = currentVars.find(v => v.name === name);
    if (existing) {
      currentVars.forEach(v => (v.changed = false));
      existing.value = value;
      existing.changed = true;
    } else {
      currentVars.forEach(v => (v.changed = false));
      currentVars.push({ name, value, changed: true });
    }

    steps.push({
      id: stepId.current++,
      type: 'variable',
      label: `${name} = ${value}`,
      description: existing ? `Updated ${name} to ${value}` : `Declared ${name} = ${value}`,
      timestamp: time.current,
      data: { kind: 'variable', variables: currentVars.map(v => ({ ...v })) },
    });
    time.current += 400;
  }

  return steps;
}

function generateOutputSteps(
  stdout: string,
  stepId: { current: number },
  time: { current: number }
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];
  if (!stdout || !stdout.trim()) return steps;

  const lines = stdout.trim().split('\n');
  const allLines: string[] = [];

  for (const line of lines.slice(0, 20)) {
    allLines.push(line);
    steps.push({
      id: stepId.current++,
      type: 'output',
      label: `Output: ${line.slice(0, 30)}${line.length > 30 ? '...' : ''}`,
      description: `Program printed: ${line}`,
      timestamp: time.current,
      data: { kind: 'output', line, allLines: [...allLines] },
    });
    time.current += 300;
  }

  return steps;
}

function generateLinkedListSteps(
  patterns: DetectedPattern[],
  _stdout: string,
  stepId: { current: number },
  time: { current: number }
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];

  for (const p of patterns) {
    const name = p.details.name as string;
    const valuesStr = p.details.values as string[];
    
    const nodes = valuesStr.map((val, i) => ({
      id: `node-${i}`,
      val,
      nextId: i < valuesStr.length - 1 ? `node-${i + 1}` : null
    }));

    if (nodes.length === 0) continue;

    // Init state
    steps.push({
      id: stepId.current++,
      type: 'linkedlist',
      label: `Initialize Linked List`,
      description: `Created linked list with ${nodes.length} nodes`,
      timestamp: time.current,
      data: { kind: 'linkedlist', name, nodes: JSON.parse(JSON.stringify(nodes)), headId: nodes[0].id, currId: null, action: 'init' },
    });
    time.current += 600;

    // Traverse state
    for (let i = 0; i < nodes.length; i++) {
        steps.push({
          id: stepId.current++,
          type: 'linkedlist',
          label: `Traverse Node ${i}`,
          description: `Current pointer is at node with value ${nodes[i].val}`,
          timestamp: time.current,
          data: { kind: 'linkedlist', name, nodes: JSON.parse(JSON.stringify(nodes)), headId: nodes[0].id, currId: nodes[i].id, action: 'traverse' },
        });
        time.current += 400;
    }
  }

  return steps;
}

// ─── Main Analyzer ───────────────────────────────────────────────────────────

export function analyzeCode(
  code: string,
  language: string,
  stdout: string
): AnalysisResult {
  const lang = language === 'python' ? 'python' : 'javascript';

  // Detect patterns
  const arrayPatterns = detectArrayPatterns(code, lang);
  const loopPatterns = detectLoopPatterns(code, lang);
  const recursionPatterns = detectRecursionPatterns(code, lang);
  const variablePatterns = detectVariablePatterns(code, lang);
  const linkedListPatterns = detectLinkedListPatterns(code, lang);

  const detected: VisualizationType[] = [];
  if (arrayPatterns.length > 0) detected.push('array');
  if (loopPatterns.length > 0) detected.push('loop');
  if (recursionPatterns.length > 0) detected.push('callstack');
  if (variablePatterns.length > 0) detected.push('variable');
  if (linkedListPatterns.length > 0) detected.push('linkedlist');
  if (stdout && stdout.trim()) detected.push('output');

  // Generate steps
  const stepId = { current: 0 };
  const time = { current: 0 };

  const steps: VisualizationStep[] = [
    ...generateVariableSteps(variablePatterns, stdout, stepId, time),
    ...generateArraySteps(arrayPatterns, stdout, stepId, time),
    ...generateLinkedListSteps(linkedListPatterns, stdout, stepId, time),
    ...generateLoopSteps(loopPatterns, stdout, stepId, time),
    ...generateRecursionSteps(recursionPatterns, stdout, stepId, time),
    ...generateOutputSteps(stdout, stepId, time),
  ];

  // Generate summary
  const parts: string[] = [];
  if (arrayPatterns.length > 0) parts.push(`${arrayPatterns.length} array operation(s)`);
  if (loopPatterns.length > 0) parts.push(`${loopPatterns.length} loop(s)`);
  if (recursionPatterns.length > 0) parts.push(`${recursionPatterns.length} recursive function(s)`);
  if (variablePatterns.length > 0) parts.push(`${variablePatterns.length} variable(s)`);
  if (linkedListPatterns.length > 0) parts.push(`${linkedListPatterns.length} linked list(s)`);

  const summary = parts.length > 0
    ? `Detected: ${parts.join(', ')}`
    : 'No visualizable patterns detected';

  return { detected, steps, summary };
}
