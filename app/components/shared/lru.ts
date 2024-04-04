export class LRUCache<K, V> {
  private readonly capacity: number;
  private readonly cache: Map<string, V>;
  private readonly options: {
    key: (key: K) => string;
    onEvict: (key: string, value: V) => void;
  };

  private order: string[];

  constructor(
    capacity: number,
    options?: {
      key?: (key: K) => string;
      onEvict?: (key: string, value: V) => void;
    },
  ) {
    this.capacity = capacity;
    this.cache = new Map<string, V>();
    this.order = [];
    this.options = {
      key: (key: K) => String(key),
      onEvict: () => {},
      ...options,
    };
  }

  public get(key: K): V | undefined {
    const _key = this.options.key(key);
    if (this.cache.has(_key)) {
      const index = this.order.indexOf(_key);
      this.order.splice(index, 1);
      this.order.unshift(_key);
      return this.cache.get(_key);
    }
    return undefined;
  }

  public set(key: K, value: V) {
    const _key = this.options.key(key);
    if (this.cache.has(_key)) {
      const index = this.order.indexOf(_key);
      this.order.splice(index, 1);
    } else if (this.cache.size >= this.capacity) {
      const lastKey = this.order.pop();
      if (lastKey !== undefined) {
        this.options.onEvict(lastKey, this.cache.get(lastKey)!);
        this.cache.delete(lastKey);
      }
    }
    this.order.unshift(_key);
    this.cache.set(_key, value);

    return value;
  }

  public clear(): void {
    this.cache.clear();
    this.order = [];
  }
}
