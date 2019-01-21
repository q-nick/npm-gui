const cache: {
  [key: string]: any,
} = {};

export function getFromCache(name: string): any {
  return cache[name];
}

export function putToCache(name: string, data: any): void {
  cache[name] = data;
}

export function updateInCache(name: string, data: any, keyToCompare: string): void {
  if (cache[name]) {
    const indexToUpdate = cache[name]
      .findIndex((item: any) => data[keyToCompare] === item[keyToCompare]);

    if (indexToUpdate > -1) {
      cache[name][indexToUpdate] = data;
    } else {
      cache[name].push(data);
    }
  }
}

export function spliceFromCache(name: string, data: any, keyToCompare: string): void {
  if (cache[name]) {
    const indexToSplice = cache[name]
      .findIndex((item: any) => data[keyToCompare] === item[keyToCompare]);

    if (indexToSplice > -1) {
      cache[name].splice(indexToSplice, 1);
    }
  }
}

export function clearCache(name: string): void {
  putToCache(name, null);
}

// API v2
export async function withCachePut<T extends (...args: any[]) => any>(
  method: T, cacheName: string, ...args: Parameters<T>): Promise<ReturnType<T>> {
  let result = getFromCache(cacheName);

  if (!result) {
    result = await method.apply(null, args);
    putToCache(cacheName, result);
  }

  return result;
}

export async function withCacheUpdate<T extends (...args: any[]) => any>(
  method: T, cacheName: string, keyToCompare: string, ...args: Parameters<T>)
  : Promise<ReturnType<T>> {
  const result = await method(...args);
  updateInCache(cacheName, result, keyToCompare);

  return result;
}

export async function withCacheInvalidate<T extends (...args: any[]) => any>(
  method: T, cacheName: string, ...args: Parameters<T>)
  : Promise<ReturnType<T>> {
  const result = await method.apply(null, args);
  putToCache(cacheName, null);

  return result;
}

export async function withCacheSplice<T extends (...args: any[]) => any>(
  method: T, cacheName: string, keyToCompare: string, ...args: Parameters<T>)
  : Promise<ReturnType<T>> {
  const result = await method.apply(null, args);
  spliceFromCache(cacheName, { [keyToCompare]: result }, keyToCompare);

  return result;
}
