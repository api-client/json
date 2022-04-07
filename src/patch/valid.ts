/* eslint-disable no-plusplus */
import { JsonPatch } from './types.js';

/**
 * This method only check for JSON Patch semantic.
 *
 * ```javascript
 * ooPatch.valid({})  // false
 * ooPatch.valid([{}] // false
 * ooPatch.valid([{op: "foo", path: null, value: undefined}]) // false
 * ooPatch.valid([{op: "add", path: "/foo"}]) // false
 *
 * ooPatch.valid([]) // true
 * ooPatch.valid([{op: "add", path: "/foo", value: "bar"}]) // true
 * ```
 *
 * @returns `true` if the patch is valid, `false` otherwise.
 */
export default function valid(patch: JsonPatch): boolean {
  if (!Array.isArray(patch)) return false;

  for (let i = 0, l = patch.length; i < l; i++) {
    const op = patch[i];

    if (typeof op !== "object" || op === null || Array.isArray(op)) {
      return false;
    }

    if (typeof op.path !== "string") {
      return false;
    }

    const operation = op.op;
    if (typeof op.op !== "string") {
      return false;
    }

    switch (operation) {
      case "add":
      case "replace":
      case "test":
        if (op.value === undefined) {
          return false;
        }
        break;
      case "move":
      case "copy":
        if (typeof op.from !== "string") {
          return false;
        }
        break;
      case "remove":
        break;
      default:
        return false;
    }
  }

  return true;
};
