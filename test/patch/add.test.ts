import { assert } from '@open-wc/testing';
import _add from '../../src/patch/add.js';

describe("add", () => {
  let doc: any;

  const add = (path: string, obj: any) => _add(doc, path, obj);

  describe("object location", () => {
    it("sets the value if the parent exists and is valid", () => {
      doc = {};
      const obj = { bar: "foo" };
      const r = add("/foo", { bar: "foo" });
      assert.deepEqual((r.doc as any).foo, obj);
    });

    it("throws an error if the parent does not exists", () => {
      doc = {};
      assert.throws(() => {
        add("/foo/bar", { bar: "foo" });
      }, Error);
    });

    it("throws an error if the parent is not valid", () => {
      doc = { foo: "bar" };
      assert.throws(() => {
        add("/foo/bar", { bar: "foo" });
      }, Error);
    });
  });

  describe("array location", () => {
    it("adds the value if the parent exists and is valid", () => {
      doc = { foo: ["bar"] };
      const r = add("/foo/0", "barfoo");
      assert.deepEqual(r.doc, { foo: ["barfoo", "bar"] });
    });

    it("throws an error if the parent does not exists", () => {
      doc = { foo: [] };
      assert.throws(() => {
        add("/foo/0/bar", "foobar");
      }, Error);
    });

    it("throws an error if the parent is not valid", () => {
      doc = { foo: true };
      assert.throws(() => {
        add("/foo/bar", { bar: "foo" });
      }, Error);
    });
  });
});
