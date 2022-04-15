/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import { JsonPatch } from './types.js';
import Type, { isPrimitive } from '../core/Type.js';
import equal from '../core/Equal.js';
import { encode } from '../pointer/Encoding.js';

function getKeys(obj: any): string[] {
  if (Array.isArray(obj)) {
    // makes an array of indexes of the array as strings.
    return new Array(obj.length).fill(0).map((_, index) => `${index}`);
  }
  return Object.keys(obj);
}

/**
* Deeply clone the object.
* https://jsperf.com/deep-copy-vs-json-stringify-json-parse/25 (recursiveDeepCopy)
* @param obj value to clone
* @returns cloned obj
*/
function deepClone<T>(obj: T): T | null {
  switch (typeof obj) {
    case "object":
      return JSON.parse(JSON.stringify(obj)); // Faster than ES5 clone - http://jsperf.com/deep-cloning-of-objects/5
    case "undefined":
      return null; // this is how JSON.stringify behaves for array items
    default:
      return obj; // no need to clone primitives
  }
}

function _diff(a: any, b: any, patches: JsonPatch, tokens: string[] = [], invertible = false): void {
  if (a === b) {
    return;
  }

  if (typeof b.toJSON === "function") {
    b = b.toJSON();
  }

  const at = Type(a);
  const bt = Type(b);
  const aPrimitive = isPrimitive(at);
  const bPrimitive = isPrimitive(bt);

  // check for primitives first
  if (aPrimitive && bPrimitive) {
    if (!equal(a, b)) {
      patches.push({ op: "replace", path: encode(tokens), value: b });
    }
    return;
  }

  // with different types we can only have "add" or "replace"
  if (bt !== at) {
    if (at === undefined) {
      patches.push({ op: "add", path: encode(tokens), value: b });
    } else {
      patches.push({ op: "replace", path: encode(tokens), value: b });
    }
    return;
  }

  const newKeys = getKeys(b);
  const oldKeys = getKeys(a);
  let deleted = false;

  for (let t = oldKeys.length - 1; t >= 0; t--) {
    const key = oldKeys[t];
    const oldVal = a[key];

    if (Object.prototype.hasOwnProperty.call(b, key) && !(b[key] === undefined && oldVal !== undefined && Array.isArray(b) === false)) {
      const newVal = b[key];
      if (typeof oldVal === 'object' && oldVal != null && typeof newVal === 'object' && newVal !== null && Array.isArray(oldVal) === Array.isArray(newVal)) {
        _diff(oldVal, newVal, patches, [...tokens, key], invertible);
      } else if (oldVal !== newVal) {
        if (invertible) {
          patches.push({ op: "test", path: encode([...tokens, key]), value: deepClone(oldVal) });
        }
        patches.push({ op: "replace", path: encode([...tokens, key]), value: deepClone(newVal) });
      }
    } else if (Array.isArray(a) === Array.isArray(b)) {
      if (invertible) {
        patches.push({ op: "test", path: encode([...tokens, key]), value: deepClone(oldVal) });
      }
      patches.push({ op: "remove", path: encode([...tokens, key]) });
      deleted = true; // property has been deleted
    } else {
      if (invertible) {
        patches.push({ op: "test", path: encode(tokens), value: a });
      }
      patches.push({ op: "replace", path: encode(tokens), value: b });
    }
  }

  if (!deleted && newKeys.length === oldKeys.length) {
    return;
  }

  for (let t = 0; t < newKeys.length; t++) {
    const key = newKeys[t];
    if (!Object.prototype.hasOwnProperty.call(a, key) && b[key] !== undefined) {
      patches.push({ op: "add", path: encode([...tokens, key]), value: deepClone(b[key]) });
    }
  }
}

/**
 * ```javascript
 * ooPatch.diff(true, false);
 * // [{"op": "replace", "path": "", "value": "false"}]
 *
 * ooPatch.diff([], []);
 * // []
 *
 * ooPatch.diff({}, { foo: "bar" });
 * // [{"op": "add", "path": "/foo", "value": "bar"}]
 * ```
 *
 * @returns A diff in the form of a JSON Patch for 2 JSON values.
 */
export default function diff(a: any, b: any, invertible = false): JsonPatch {
  const changes: JsonPatch = [];
  _diff(a, b, changes, [], invertible);
  return changes;
}
