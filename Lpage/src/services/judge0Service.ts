/**
 * Judge0 API Service
 * Handles code compilation and execution via Judge0 CE public API.
 * Uses the free public instance at ce.judge0.com — no API key required.
 */

const JUDGE0_API_URL = 'https://ce.judge0.com';

// Language IDs for Judge0
export const LANGUAGE_IDS: Record<string, number> = {
  'c': 50,           // C (GCC 9.2.0)
  'cpp': 54,         // C++ (GCC 9.2.0)
  'java': 62,        // Java (OpenJDK 13.0.1)
  'javascript': 63,  // JavaScript (Node.js 12.14.0)
  'typescript': 74,  // TypeScript (3.7.4)
  'python': 71,      // Python (3.8.1)
  'ruby': 72,        // Ruby (2.7.0)
  'go': 60,          // Go (1.13.5)
  'rust': 73,        // Rust (1.40.0)
  'php': 68,         // PHP (7.4.1)
  'swift': 83,       // Swift (5.2.3)
  'kotlin': 78,      // Kotlin (1.3.70)
  'csharp': 51,      // C# (Mono 6.6.0.161)
  'sql': 82,         // SQL (SQLite 3.27.2)
  'html': 79,        // HTML (Not supported by Judge0, will return message)
  'css': 79,         // CSS (Not supported by Judge0, will return message)
  'json': 79,        // JSON (Not supported by Judge0, will return message)
};

export interface SubmissionRequest {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number;
  memory_limit?: number;
}

export interface SubmissionResponse {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string;
  memory: number;
}

const STATUS_CODES: Record<number, string> = {
  1: 'In Queue',
  2: 'Processing',
  3: 'Accepted',
  4: 'Wrong Answer',
  5: 'Time Limit Exceeded',
  6: 'Compilation Error',
  7: 'Runtime Error (SIGSEGV)',
  8: 'Runtime Error (SIGXFSZ)',
  9: 'Runtime Error (SIGFPE)',
  10: 'Runtime Error (SIGABRT)',
  11: 'Runtime Error (NZEC)',
  12: 'Runtime Error (Other)',
  13: 'Internal Error',
  14: 'Exec Format Error',
};

/**
 * Execute code using Judge0 CE public API (synchronous mode).
 * Uses ?wait=true so we get results in a single request — no polling needed.
 */
export async function executeCode(
  sourceCode: string,
  language: string,
  stdin: string = '',
  onStatusUpdate?: (status: string) => void
): Promise<SubmissionResponse> {
  const languageId = LANGUAGE_IDS[language];

  if (!languageId) {
    throw new Error(`Language '${language}' is not supported`);
  }

  // HTML/CSS/JSON can't be executed
  if (['html', 'css', 'json'].includes(language)) {
    return {
      stdout: 'Preview mode: This content type cannot be executed. Use the preview instead.',
      stderr: null,
      compile_output: null,
      message: null,
      status: { id: 3, description: 'Accepted' },
      time: '0.00',
      memory: 0,
    };
  }

  if (onStatusUpdate) onStatusUpdate('Submitting...');

  const requestBody = {
    source_code: sourceCode,
    language_id: languageId,
    stdin: stdin || '',
    cpu_time_limit: 5,
    memory_limit: 256000,
  };

  if (onStatusUpdate) onStatusUpdate('Running...');

  const response = await fetch(
    `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Execution failed (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Format submission result for display
 */
export function formatOutput(result: SubmissionResponse): string {
  const parts: string[] = [];

  // Add output based on status
  if (result.status.id === 6 && result.compile_output) {
    // Compilation Error
    parts.push('=== Compilation Error ===');
    parts.push(result.compile_output);
  } else if (result.status.id >= 7 && result.status.id <= 12 && result.stderr) {
    // Runtime Error
    parts.push('=== Runtime Error ===');
    parts.push(result.stderr);
  } else if (result.status.id === 5) {
    // Time Limit Exceeded
    parts.push('=== Time Limit Exceeded ===');
    parts.push('Your code took too long to execute.');
  } else {
    // Normal output
    if (result.stdout) {
      parts.push(result.stdout);
    } else {
      parts.push('(no output)');
    }

    if (result.stderr) {
      parts.push('');
      parts.push('=== Standard Error ===');
      parts.push(result.stderr);
    }
  }

  if (result.message && result.status.id === 13) {
    // Internal Error
    parts.push('=== Internal Error ===');
    parts.push(result.message);
  }

  return parts.join('\n');
}
