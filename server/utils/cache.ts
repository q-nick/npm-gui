import type * as Dependency from '../types/Dependency';
import { ONE, ZERO } from './utils';

type CacheValue = Dependency.Entire[] | undefined;

const cache: Record<string, CacheValue> = {};

export function getFromCache(name: string): CacheValue {
  return cache[name];
}

export function putToCache(name: string, data: CacheValue): void {
  console.log('put cache', cache, name, data);
  cache[name] = data;
}

export function updateInCache(
  name: string, dependency: Dependency.Entire,
): void {
  const myCache = cache[name];
  if (myCache) {
    const indexToUpdate = myCache.findIndex((item) => dependency.name === item.name);

    if (indexToUpdate >= ZERO) {
      myCache[indexToUpdate] = dependency;
    } else {
      myCache.push(dependency);
    }
  }
}

export function spliceFromCache(name: string, dependencyName: string): void {
  const myCache = cache[name];

  if (myCache) {
    const indexToSplice = myCache
      .findIndex((item) => dependencyName === item.name);

    if (indexToSplice >= ZERO) {
      myCache.splice(indexToSplice, ONE);
    }
  }
}

export function clearCache(name: string): void {
  putToCache(name, undefined);
}
