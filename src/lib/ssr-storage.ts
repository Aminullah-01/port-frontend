const isBrowser = typeof window !== 'undefined';

export const ssrStorage = {
  getItem(key: string): string | null {
    if (!isBrowser) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
  removeItem(key: string): void {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};
