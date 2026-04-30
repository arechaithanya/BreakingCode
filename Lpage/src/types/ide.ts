export type Bug = {
  id: string
  line: number
  severity: 'error' | 'warning' | 'info'
  message: string
  suggestedFix: string
  originalSnippet: string
}
