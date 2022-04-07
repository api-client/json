/* eslint-disable no-prototype-builtins */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import Type from "./Type.js";

function toArray(set: Set<any>): any[] {
  const array: any[] = [];
  set.forEach((item) => {
    array.push(item);
  });
  return array;
}

function toObject(map: Map<any, any>): any {
  const object = Object.create(null);
  map.forEach((value, key) => {
    object[key] = value;
  });
  return object;
}

export default function equal(a: any, b: any): boolean {
  const ta = Type(a);
  const tb = Type(b);
  if (ta !== tb) {
    return false;
  }

  switch (ta) {
    case 'number':
      if (a === 0 && 1 / a === -Infinity) {
        return b === 0 && 1 / b === -Infinity;
      }
      
      return a === b;
    case 'string':
    case 'null':
    case 'boolean':
      return a === b;
    default:
  }

  let i; 
  let l;
  if (ta === 'array') {
    if (a instanceof Set) {
      a = toArray(a)
    };
    if (b instanceof Set) {
      b = toArray(b);
    }
    if (a.length !== b.length) {
      return false;
    }
    for (i = 0, l = a.length; i < l; i++) {
      if (!equal(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }

  if (ta === 'object') {
    if (a instanceof Map) {
      a = toObject(a);
    }
    if (b instanceof Map) {
      b = toObject(b);
    }
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) {
      return false;
    }
    for (i = 0, l = keys.length; i < l; i++) {
      const key = keys[i];
      if (b.hasOwnProperty && !b.hasOwnProperty(key)) {
        return false;
      }
      if (!equal(b[key], a[key])) {
        return false;
      }
    }
    return true;
  }

  return true;
};
