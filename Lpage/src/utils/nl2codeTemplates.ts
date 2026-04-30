export const generateCodeFromDescription = (description: string, language: string): string => {
  const lowerDesc = description.toLowerCase();
  
  // Hello world templates
  if (lowerDesc.includes('hello world') || lowerDesc.includes('print hello')) {
    switch (language) {
      case 'python':
        return '\nprint("Hello, World!")';
      case 'javascript':
      case 'typescript':
        return '\nconsole.log("Hello, World!");';
      case 'java':
        return '\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}';
      case 'cpp':
        return '\n#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}';
      default:
        return '\nconsole.log("Hello, World!");';
    }
  }
  
  // Fibonacci
  if (lowerDesc.includes('fibonacci') || lowerDesc.includes('fib')) {
    if (language === 'python') {
      return '\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b';
    } else {
      return '\nfunction fibonacci(n) {\n    if (n <= 1) return n;\n    let a = 0, b = 1;\n    for (let i = 2; i <= n; i++) {\n        [a, b] = [b, a + b];\n    }\n    return b;\n}';
    }
  }
  
  // Factorial
  if (lowerDesc.includes('factorial')) {
    if (language === 'python') {
      return '\ndef factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)';
    } else {
      return '\nfunction factorial(n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}';
    }
  }
  
  // Reverse string
  if (lowerDesc.includes('reverse string') || lowerDesc.includes('reverse')) {
    if (language === 'python') {
      return '\ndef reverse_string(s):\n    return s[::-1]';
    } else {
      return '\nfunction reverseString(str) {\n    return str.split(\'\').reverse().join(\'\');\n}';
    }
  }
  
  // Palindrome
  if (lowerDesc.includes('palindrome')) {
    if (language === 'python') {
      return '\ndef is_palindrome(s):\n    s = s.lower().replace(\' \', \'\')\n    return s == s[::-1]';
    } else {
      return '\nfunction isPalindrome(str) {\n    const clean = str.toLowerCase().replace(/\\s/g, \'\');\n    return clean === clean.split(\'\').reverse().join(\'\');\n}';
    }
  }
  
  // Bubble sort
  if (lowerDesc.includes('bubble sort') || lowerDesc.includes('sort')) {
    if (language === 'python') {
      return '\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr';
    } else {
      return '\nfunction bubbleSort(arr) {\n    const n = arr.length;\n    for (let i = 0; i < n; i++) {\n        for (let j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n            }\n        }\n    }\n    return arr;\n}';
    }
  }
  
  // Binary search
  if (lowerDesc.includes('binary search')) {
    if (language === 'python') {
      return '\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1';
    } else {
      return '\nfunction binarySearch(arr, target) {\n    let left = 0, right = arr.length - 1;\n    while (left <= right) {\n        const mid = Math.floor((left + right) / 2);\n        if (arr[mid] === target) return mid;\n        if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}';
    }
  }
  
  // Linked list
  if (lowerDesc.includes('linked list')) {
    if (language === 'python') {
      return '\nclass Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n    \n    def append(self, data):\n        new_node = Node(data)\n        if not self.head:\n            self.head = new_node\n            return\n        last = self.head\n        while last.next:\n            last = last.next\n        last.next = new_node';
    } else {
      return '\nclass Node {\n    constructor(data) {\n        this.data = data;\n        this.next = null;\n    }\n}\n\nclass LinkedList {\n    constructor() {\n        this.head = null;\n    }\n    \n    append(data) {\n        const newNode = new Node(data);\n        if (!this.head) {\n            this.head = newNode;\n            return;\n        }\n        let current = this.head;\n        while (current.next) {\n            current = current.next;\n        }\n        current.next = newNode;\n    }\n}';
    }
  }
  
  // Stack
  if (lowerDesc.includes('stack')) {
    if (language === 'python') {
      return '\nclass Stack:\n    def __init__(self):\n        self.items = []\n    \n    def push(self, item):\n        self.items.append(item)\n    \n    def pop(self):\n        if not self.is_empty():\n            return self.items.pop()\n    \n    def peek(self):\n        if not self.is_empty():\n            return self.items[-1]\n    \n    def is_empty(self):\n        return len(self.items) == 0';
    } else {
      return '\nclass Stack {\n    constructor() {\n        this.items = [];\n    }\n    \n    push(item) {\n        this.items.push(item);\n    }\n    \n    pop() {\n        if (this.isEmpty()) return undefined;\n        return this.items.pop();\n    }\n    \n    peek() {\n        if (this.isEmpty()) return undefined;\n        return this.items[this.items.length - 1];\n    }\n    \n    isEmpty() {\n        return this.items.length === 0;\n    }\n}';
    }
  }
  
  // Queue
  if (lowerDesc.includes('queue')) {
    if (language === 'python') {
      return '\nclass Queue:\n    def __init__(self):\n        self.items = []\n    \n    def enqueue(self, item):\n        self.items.append(item)\n    \n    def dequeue(self):\n        if not self.is_empty():\n            return self.items.pop(0)\n    \n    def is_empty(self):\n        return len(self.items) == 0';
    } else {
      return '\nclass Queue {\n    constructor() {\n        this.items = [];\n    }\n    \n    enqueue(item) {\n        this.items.push(item);\n    }\n    \n    dequeue() {\n        if (this.isEmpty()) return undefined;\n        return this.items.shift();\n    }\n    \n    isEmpty() {\n        return this.items.length === 0;\n    }\n}';
    }
  }
  
  // Fetch data / API call
  if (lowerDesc.includes('fetch data') || lowerDesc.includes('api call')) {
    if (language === 'python') {
      return '\nimport requests\n\ndef fetch_data(url):\n    try:\n        response = requests.get(url)\n        response.raise_for_status()\n        return response.json()\n    except requests.RequestException as e:\n        print(f"Error fetching data: {e}")\n        return None';
    } else {
      return '\nasync function fetchData(url) {\n    try {\n        const response = await fetch(url);\n        if (!response.ok) {\n            throw new Error(`HTTP error! status: ${response.status}`);\n        }\n        return await response.json();\n    } catch (error) {\n        console.error("Error fetching data:", error);\n        return null;\n    }\n}';
    }
  }
  
  // Countdown / Timer
  if (lowerDesc.includes('countdown') || lowerDesc.includes('timer')) {
    if (language === 'python') {
      return '\nimport time\n\ndef countdown(seconds):\n    for i in range(seconds, 0, -1):\n        print(f"{i}...")\n        time.sleep(1)\n    print("Times up!")';
    } else {
      return '\nfunction countdown(seconds) {\n    let count = seconds;\n    const timer = setInterval(() => {\n        console.log(`${count}...`);\n        count--;\n        if (count < 0) {\n            clearInterval(timer);\n            console.log("Times up!");\n        }\n    }, 1000);\n}';
    }
  }
  
  // Debounce
  if (lowerDesc.includes('debounce')) {
    if (language === 'python') {
      return '\nimport time\n\ndef debounce(func, delay):\n    def wrapper(*args, **kwargs):\n        time.sleep(delay / 1000)\n        return func(*args, **kwargs)\n    return wrapper';
    } else {
      return '\nfunction debounce(func, delay) {\n    let timeoutId;\n    return function(...args) {\n        clearTimeout(timeoutId);\n        timeoutId = setTimeout(() => func.apply(this, args), delay);\n    };\n}';
    }
  }
  
  // Throttle
  if (lowerDesc.includes('throttle')) {
    if (language === 'python') {
      return '\nimport time\n\ndef throttle(func, delay):\n    last_called = [0]\n    def wrapper(*args, **kwargs):\n        current = time.time() * 1000\n        if current - last_called[0] >= delay:\n            last_called[0] = current\n            return func(*args, **kwargs)\n    return wrapper';
    } else {
      return '\nfunction throttle(func, delay) {\n    let lastCall = 0;\n    return function(...args) {\n        const now = Date.now();\n        if (now - lastCall >= delay) {\n            lastCall = now;\n            return func.apply(this, args);\n        }\n    };\n}';
    }
  }
  
  // Deep clone / Deep copy
  if (lowerDesc.includes('deep clone') || lowerDesc.includes('deep copy')) {
    if (language === 'python') {
      return '\nimport copy\n\ndef deep_clone(obj):\n    return copy.deepcopy(obj)';
    } else {
      return '\nfunction deepClone(obj) {\n    if (obj === null || typeof obj !== "object") return obj;\n    if (obj instanceof Date) return new Date(obj.getTime());\n    if (obj instanceof Array) return obj.map(item => deepClone(item));\n    if (typeof obj === "object") {\n        const cloned = {};\n        for (const key in obj) {\n            if (obj.hasOwnProperty(key)) {\n                cloned[key] = deepClone(obj[key]);\n            }\n        }\n        return cloned;\n    }\n}';
    }
  }
  
  // Flatten array
  if (lowerDesc.includes('flatten array') || lowerDesc.includes('flatten')) {
    if (language === 'python') {
      return '\ndef flatten(arr):\n    result = []\n    for item in arr:\n        if isinstance(item, list):\n            result.extend(flatten(item))\n        else:\n            result.append(item)\n    return result';
    } else {
      return '\nfunction flatten(arr) {\n    const result = [];\n    for (const item of arr) {\n        if (Array.isArray(item)) {\n            result.push(...flatten(item));\n        } else {\n            result.push(item);\n        }\n    }\n    return result;\n}';
    }
  }
  
  // Unique array / Remove duplicates
  if (lowerDesc.includes('unique array') || lowerDesc.includes('remove duplicates')) {
    if (language === 'python') {
      return '\ndef unique_array(arr):\n    return list(set(arr))';
    } else {
      return '\nfunction uniqueArray(arr) {\n    return [...new Set(arr)];\n}';
    }
  }
  
  // Event emitter
  if (lowerDesc.includes('event emitter')) {
    if (language === 'python') {
      return '\nclass EventEmitter:\n    def __init__(self):\n        self.events = {}\n    \n    def on(self, event, callback):\n        if event not in self.events:\n            self.events[event] = []\n        self.events[event].append(callback)\n    \n    def emit(self, event, *args):\n        if event in self.events:\n            for callback in self.events[event]:\n                callback(*args)';
    } else {
      return '\nclass EventEmitter {\n    constructor() {\n        this.events = {};\n    }\n    \n    on(event, callback) {\n        if (!this.events[event]) {\n            this.events[event] = [];\n        }\n        this.events[event].push(callback);\n    }\n    \n    emit(event, ...args) {\n        if (this.events[event]) {\n            this.events[event].forEach(callback => callback(...args));\n        }\n    }\n}';
    }
  }
  
  // Fallback
  return '\n// Could not match your description. Try keywords like: fibonacci, bubble sort, fetch data, palindrome, reverse string, binary search, linked list, stack, queue, countdown, debounce, throttle, deep clone, flatten array, unique array, event emitter';
};
