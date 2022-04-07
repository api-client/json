/* eslint-disable no-plusplus */
export default function clone<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  let current: any;

  if (Array.isArray(obj)) {
    current = [];
    for (let index = 0, len = obj.length; index < len; index++) {
      current[index] = clone(obj[index]);
    }
  } else if (obj instanceof Set) {
    current = new Set();
    obj.forEach((item) => {
      current.add(clone(item));
    });
  } else if (obj instanceof Map) {
    current = new Map();
    obj.forEach((value, key) => {
      current.set(key, clone(value));
    });
  } else {
    current = {};
    const keys = Object.keys(obj);
    for (let index = 0, len = keys.length; index < len; index++) {
      const key = keys[index];
      // @ts-ignore
      current[key] = clone(obj[key]);
    }
  }

  return current;
};
