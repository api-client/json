/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
import { BaseOperation, Operation, AddOperation, MoveOperation, JsonPatch, JsonPatchOperation } from "./types.js";

const operations: Operation[] = ["add", "remove", "replace", "move", "copy", "test"]

/**
 * Reverses the `pack()` on a patch.
 *
 * @param packed Previously packed values.
 * @returns Restored patch value.
 */
export default function unpack(packed: any[]): JsonPatch {
  const unpacked: JsonPatch = [];

  for (let i = 0, l = packed.length; i < l; i++) {
    const p = packed[i];
    const ap = p[0] as number;
    const a = operations[ap];
    const op: BaseOperation = { 
      op: a, 
      path: p[1] 
    };

    if (ap === 0 || ap === 2 || ap === 5) {
      // add, replace, test
      const typed = op as AddOperation;
      typed.value = p[2];
    } else if (ap !== 1) {
      // move, copy
      const typed = op as MoveOperation;
      typed.from = p[2];
    }

    unpacked.push(op as JsonPatchOperation);
  }

  return unpacked;
};
