// Mock in-memory Redis implementation for zero-setup local development
class MockRedis {
  private store = new Map<string, string | number>();
  
  async incr(key: string) {
    const val = (this.store.get(key) as number) || 0;
    this.store.set(key, val + 1);
    return val + 1;
  }
  
  async expire(key: string, ttl: number) {
    setTimeout(() => this.store.delete(key), ttl * 1000);
    return 1;
  }
  
  async get(key: string) {
    return this.store.get(key) || null;
  }
  
  async set(key: string, value: string | number) {
    this.store.set(key, value);
    return 'OK';
  }
  
  on(event: string, callback: any) {
    if (event === 'connect') {
      callback();
    }
  }
}

export const redis = new MockRedis() as any;
