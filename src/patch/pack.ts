/* eslint-disable no-plusplus */
import { JsonPatch, AddOperation, MoveOperation } from "./types.js";

const ops = Object.create(null);
ops.add = 0;
ops.remove = 1;
ops.replace = 2;
ops.move = 3;
ops.copy = 4;
ops.test = 5;

/**
 * Per specification patches are pretty verbose. JSON8 provides the `pack()` and the `unpack()` methods
 * to reduce the size of patches and save memory / space / bandwidth.
 *
 * ```javascript
 * var patch = [
 *   { op: "add", path: "/a/b/c", value: ["foo", "bar"] },
 *   { op: "remove", path: "/a/b/c" },
 *   { op: "replace", path: "/a/b/c", value: 42 },
 *   { op: "move", from: "/a/b/c", path: "/a/b/d" },
 *   { op: "copy", from: "/a/b/c", path: "/a/b/e" },
 *   { op: "test", path: "/a/b/c", value: "foo" },
 * ];
 *
 * var packed = ooPatch.pack(patch);
 *
 * // [
 * //   [0, "/a/b/c", ["foo", "bar"]],
 * //   [1, "/a/b/c"],
 * //   [2, "/a/b/c", 42],
 * //   [3, "/a/b/d", "/a/b/c"],
 * //   [4, "/a/b/e", "/a/b/c"],
 * //   [5, "/a/b/c", "foo"]
 * // ]
 * ```
 */
export default function pack(patch: JsonPatch): any[] {
  const packed = [];

  for (let i = 0, l = patch.length; i < l; i++) {
    const p = patch[i];
    const a = ops[p.op];
    const op = [a, p.path];
    if (a === 0 || a === 2 || a === 5) {
      const typed = p as AddOperation;
      // add, replace, test
      op.push(typed.value);
    } else if (a !== 1) {
      // move copy
      const typed = p as MoveOperation;
      op.push(typed.from);
    }

    packed.push(op);
  }

  return packed;
};
