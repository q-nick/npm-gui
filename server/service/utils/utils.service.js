function buildArrayFromObject(sourceObject, destinationArray, keyName, valueName) {
  Object.keys(sourceObject).forEach((key) => {
    const obj = {};
    obj[keyName] = key;
    obj[valueName] = sourceObject[key];
    destinationArray.push(obj);
  });
}

function buildObjectFromArray(sourceArray, destinationObject, keyName) {
  for (let i = 0; i < sourceArray.length; i++) {
      destinationObject[sourceArray[i][keyName]] = sourceArray[i]; // eslint-disable-line
  }
}

function isDevDependencies(req) {
  return req.originalUrl.toUpperCase().indexOf('DEV') !== -1;
}

function isGlobalPackages(req) {
  return req.originalUrl.toUpperCase().indexOf('GLOBAL') !== -1;
}

function parseJSON(stringToParse) {
  let result = null;
  try {
    result = JSON.parse(stringToParse);
  } catch (e) {
    console.error('JSON error');
    return null;
  }
  return result;
}

function setInArrayByRepoAndKey(repo, keyToFind, valueToFind, keyToSet, valueToSet, arr) {
  const item = this.findInArrayByRepoAndKey(repo, keyToFind, valueToFind, arr);

  if (item) {
    item[keyToSet] = valueToSet;
  }
}

function findInArrayByRepoAndKey(repo, keyToFind, valueToFind, arr) {
  const index = arr
      .findIndex((item) => item.repo === repo && item[keyToFind] === valueToFind);

  return arr[index];
}

function extend(source, destination) {
  for (const key in source) { // eslint-disable-line
    destination[key] = source[key]; // eslint-disable-line
  }
}

export default {
  extend,
  findInArrayByRepoAndKey,
  setInArrayByRepoAndKey,
  parseJSON,
  isGlobalPackages,
  isDevDependencies,
  buildObjectFromArray,
  buildArrayFromObject,
};
