import { assert } from '@open-wc/testing';
import _has from '../../src/patch/has.js';

describe("has", () => {
  let doc: any;

  const has = (path: string) => _has(doc, path);

  describe("object location", () => {
    it("returns true if there is a value at the specified location", () => {
      doc = { foo: "bar" };
      const r = has("/foo");
      assert.strictEqual(r, true);
    });

    it("returns false if there is no value at the specified location", () => {
      doc = {};
      const r = has("/foo");
      assert.strictEqual(r, false);
    });

    it("throws an error if the path cannot be walked", () => {
      doc = {};
      assert.throws(() => {
        has("/foo/bar");
      }, Error);
    });
  });

  describe("array location", () => {
    it("returns true if there is a value at the specified location", () => {
      doc = { foo: ["bar"] };
      const r = has("/foo/0");
      assert.strictEqual(r, true);
    });

    it("returns false if there is no value at the specified location", () => {
      doc = { foo: [] };
      const r = has("/foo/0");
      assert.strictEqual(r, false);
    });

    it("throws an error if the path cannot be walked", () => {
      doc = { foo: [] };
      assert.throws(() => {
        has("/foo/0/bar");
      }, Error);
    });
  });
});
