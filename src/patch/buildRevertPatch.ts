/* eslint-disable no-plusplus */
import { encode, decode } from '../pointer/Encoding.js';
import { JsonPatchOperation } from './types.js';

/**
 * Returns the reverse operation to a JSON Patch operation
 * @param patch The JSON Patch operation object
 * @param previous The previous value for add, replace and move operations
 * @param idx The index of the item for array
 */
function reverse(patch: JsonPatchOperation, previous: any, idx: number): JsonPatchOperation[] {
  const { op, path } = patch;

  if (op === "copy" || (op === "add" && previous === undefined)) {
    if (idx === undefined) {
      return [{ op: "remove", path }];
    }

    // for item pushed to array with -
    const tokens = decode(path);
    tokens[tokens.length - 1] = idx.toString();
    return [{ op: "remove", path: encode(tokens) }];
  }
  if (op === "replace") {
    return [{ op: "replace", path, value: previous }];
  }
  if (op === "move") {
    const patches: JsonPatchOperation[] = [{ op: "move", path: patch.from, from: path }];

    if (previous) {
      patches.push({ op: "add", path, value: previous });
    }

    return patches;
  }
  if (op === "add" || op === "remove") {
    return [{ op: "add", path, value: previous }];
  }
  if (op === "test") {
    return [{ op: "test", path, value: patch.value }];
  }
  throw new Error(`Unknown operation.`);
}

/**
 * Builds and returns a valid JSON Patch from a revert value
 * @param revert revert value from the apply or patch method with {reversible: true}
 * @returns The JSON Patch
 */
export default function buildRevertPatch(revert: any[]): JsonPatchOperation[] {
  const patch: JsonPatchOperation[] = [];

  for (let i = 0, len = revert.length; i < len; i++) {
    const item = revert[i];
    patch.unshift(...reverse(item[0], item[1], item[2]));
  }

  return patch;
};
