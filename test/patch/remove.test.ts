import { assert } from '@open-wc/testing';
import _remove from '../../src/patch/remove.js';

describe("remove", () => {
  let doc: any;

  const remove = (path: string) => _remove(doc, path);

  describe("object location", () => {
    it("removes and returns the value if the location exists", () => {
      doc = { foo: "bar" };
      const r = remove("/foo");
      assert.strictEqual(Object.keys(r.doc as any).length, 0);
      assert.strictEqual(r.previous, "bar");
    });

    it("throws an error if the location does not exists", () => {
      doc = {};
      assert.throws(() => {
        remove("/foo");
      }, Error);
    });

    it("throws an error if the path cannot be walked", () => {
      doc = {};
      assert.throws(() => {
        remove("/foo/bar");
      }, Error);
    });
  });

  describe("array location", () => {
    it("removes and returns the value if the location exists", () => {
      doc = ["bar"];
      const r = remove("/0");
      assert.strictEqual((r.doc as any).length, 0);
      assert.strictEqual(r.previous, "bar");
    });

    it("throws an error if the location does not exists", () => {
      doc = [];
      assert.throws(() => {
        remove("/0");
      }, Error);
    });

    it("throws an error if the path cannot be walked", () => {
      doc = {};
      assert.throws(() => {
        remove("/foo/0");
      }, Error);
    });
  });
});
