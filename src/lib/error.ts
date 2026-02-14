export function logError(context: string, error: unknown): void {
  console.error(`[error] ${context}`, error);
}
