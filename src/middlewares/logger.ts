export function withLogging<T extends (...args: any[]) => Promise<any>>(fn: T, name: string): T {
  return (async (...args: any[]) => {
    console.log(`➡️ ${name} start`, { args });
    const start = Date.now();
    try {
      const res = await fn(...args);
      console.log(`✅ ${name} success in ${Date.now() - start}ms`);
      return res;
    } catch (err) {
      console.error(`❌ ${name} error`, err);
      throw err;
    }
  }) as T;
}
