import type { Entire } from '../types/dependency.types';
import { ONE, ZERO } from './utils';

type CacheValue = Entire[] | undefined;

let cache: Record<string, CacheValue> = {};

export const getFromCache = (name: string): CacheValue => {
  return cache[name];
};

export const putToCache = (name: string, data?: CacheValue): void => {
  cache[name] = data;
};

export const updateInCache = (name: string, dependency: Entire): void => {
  const myCache = cache[name];
  if (myCache) {
    const indexToUpdate = myCache.findIndex(
      (item) => dependency.name === item.name,
    );

    if (indexToUpdate >= ZERO) {
      myCache[indexToUpdate] = dependency;
    } else {
      myCache.push(dependency);
    }
  }
};

export const spliceFromCache = (name: string, dependencyName: string): void => {
  const myCache = cache[name];

  if (myCache) {
    const indexToSplice = myCache.findIndex(
      (item) => dependencyName === item.name,
    );

    if (indexToSplice >= ZERO) {
      myCache.splice(indexToSplice, ONE);
    }
  }
};

export const clearCache = (name?: string): void => {
  if (name === undefined) {
    cache = {};
  } else {
    putToCache(name);
  }
};
