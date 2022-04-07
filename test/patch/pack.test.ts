import { assert } from '@open-wc/testing';
import pack from '../../src/patch/pack.js';
import unpack from '../../src/patch/unpack.js';
import { JsonPatch } from '../../src/patch/types.js';

const patch: JsonPatch = [
  { op: "add", path: "/a/b/c", value: ["foo", "bar"] },
  { op: "remove", path: "/a/b/c" },
  { op: "replace", path: "/a/b/c", value: 42 },
  { op: "move", from: "/a/b/c", path: "/a/b/d" },
  { op: "copy", from: "/a/b/c", path: "/a/b/e" },
  { op: "test", path: "/a/b/c", value: "foo" },
];

const packed = [
  [0, "/a/b/c", ["foo", "bar"]],
  [1, "/a/b/c"],
  [2, "/a/b/c", 42],
  [3, "/a/b/d", "/a/b/c"],
  [4, "/a/b/e", "/a/b/c"],
  [5, "/a/b/c", "foo"],
];

describe("pack", () => {
  it("packs correctly", () => {
    assert.deepEqual(pack(patch), packed);
  });
});

describe("unpack", () => {
  it("unpacks correctly", () => {
    assert.deepEqual(unpack(packed), patch);
  });
});
