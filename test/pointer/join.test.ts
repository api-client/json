import { assert } from '@open-wc/testing';
import { JsonPointer } from '../../src/index.js';

describe("join", () => {
  it("joins base path and tokens", () => {
    assert.strictEqual(JsonPointer.join("/foo", ["bar", "foo"]), "/foo/bar/foo");
    assert.strictEqual(JsonPointer.join("/foo", ["bar"]), "/foo/bar");
    assert.strictEqual(JsonPointer.join(["foo"], ["bar"]), "/foo/bar");
    assert.strictEqual(JsonPointer.join(["foo"], "bar"), "/foo/bar");
    assert.strictEqual(JsonPointer.join("/foo", "bar"), "/foo/bar");
    assert.strictEqual(JsonPointer.join("/foo", ["bar"]), "/foo/bar");
    assert.strictEqual(JsonPointer.join("/foo", []), "/foo");
    assert.strictEqual(JsonPointer.join("", ["foo"]), "/foo");

    assert.strictEqual(JsonPointer.join("", ["0"]), "/0");
    assert.strictEqual(JsonPointer.join("/0", ["foo"]), "/0/foo");

    assert.strictEqual(JsonPointer.join([], []), "");
    assert.strictEqual(JsonPointer.join("", []), "");
    assert.strictEqual(JsonPointer.join("", ""), "/");
    assert.strictEqual(JsonPointer.join([], ""), "/");
  });
});
