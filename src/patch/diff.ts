/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
import { encode } from '../pointer/Encoding.js';
import equal from '../core/Equal.js';
import Type from '../core/Type.js';
import { JsonPatch } from './types.js';

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
export default function diff(a: any, b: any, pre?: string[]): JsonPatch {
  let patches: JsonPatch = [];
  const prefix = pre || [];

  const at = Type(a);
  const bt = Type(b);

  if (bt !== at) {
    if (at === undefined) {
      patches.push({ op: "add", path: encode(prefix), value: b });
    } else {
      patches.push({ op: "replace", path: encode(prefix), value: b });
    }
    return patches;
  } 
    
  if (bt !== 'array' && bt !== 'object') {
    if (!equal(a, b)) {
      patches.push({ op: "replace", path: encode(prefix), value: b });
    }
    return patches;
  }

  if (a === b) {
    return patches;
  }
  
  if (Array.isArray(b)) { // both are arrays
    // FIXME let's be smarter about array diffing
    if (a.length === 0 && b.length === 0) {
      return patches;
    }
    if (equal(a, b)) {
      return patches;
    }
    patches.push({ op: "replace", path: encode(prefix), value: b });
  } else if (bt === 'object') { // both are objects
    let keys = Object.keys(b);
    for (const key of keys) {
      patches = patches.concat(diff(a[key], b[key], prefix.concat([key])));
    }
    
    keys = Object.keys(a);
    for (const key of keys) {
      if (b[key] !== undefined) {
        continue;
      }
      patches.push({ op: "remove", path: encode(prefix.concat([key])) });
    }
  }

  return patches;
};
