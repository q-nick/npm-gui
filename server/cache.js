const cache = {};

export function getFromCache(name) {
  return cache[name];
}

export function putToCache(name, data) {
  cache[name] = data;
}

export function updateInCache(name, data, keyToCompare) {
  if (cache[name]) {
    const indexToUpdate = cache[name]
      .findIndex(item => data[keyToCompare] === item[keyToCompare]);

    if (indexToUpdate > -1) {
      cache[name][indexToUpdate] = data;
    } else {
      cache[name].push(data);
    }
  }
}

export function spliceFromCache(name, data, keyToCompare) {
  if (cache[name]) {
    const indexToSplice = cache[name]
      .findIndex(item => data[keyToCompare] === item[keyToCompare]);

    if (indexToSplice > -1) {
      cache[name].splice(indexToSplice, 1);
    }
  }
}

