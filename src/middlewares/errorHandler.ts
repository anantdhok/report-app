export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(fn: T): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (err) {
      console.error("Unhandled worker error:", err);
      throw err;
    }
  }) as T;
}
