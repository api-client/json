/* eslint-disable no-plusplus */

function _clone<T>(obj: T, visited: any[]): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  let current: any;

  if (Array.isArray(obj)) {
    current = [];
    for (let index = 0, len = obj.length; index < len; index++) {
      current[index] = _clone(obj[index], visited);
    }
  } else if (obj instanceof Set) {
    if (visited.includes(obj)) {
      return obj;
    }
    visited.push(obj);
    current = new Set();
    obj.forEach((item) => {
      current.add(_clone(item, visited));
    });
  } else if (obj instanceof Map) {
    if (visited.includes(obj)) {
      return obj;
    }
    visited.push(obj);
    current = new Map();
    obj.forEach((value, key) => {
      current.set(key, _clone(value, visited));
    });
  } else {
    if (visited.includes(obj)) {
      return obj;
    }
    visited.push(obj);
    current = {};
    const keys = Object.keys(obj);
    for (let index = 0, len = keys.length; index < len; index++) {
      const key = keys[index];
      // @ts-ignore
      current[key] = _clone(obj[key], visited);
    }
  }

  return current;
}

export default function clone<T>(obj: T): T {
  return _clone(obj, []);
};
