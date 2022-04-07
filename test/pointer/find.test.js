import { assert } from '@open-wc/testing';
import { JsonPointer } from '../../src/index.js';

describe("trailing slash", () => {
  describe("/ with object", () => {
    it("returns the value with an empty key", () => {
      const doc = { "": "bar" };
      assert.equal(JsonPointer.find(doc, "/"), "bar");
    });

    it("returns undefined if the target does not have an empty key", () => {
      const doc = { foo: "bar" };
      assert.equal(JsonPointer.find(doc, "/"), undefined);
    });
  });

  describe("/ with array", () => {
    it("returns undefined", () => {
      const doc = [0, 1];
      assert.equal(JsonPointer.find(doc, "/"), undefined);
    });
  });

  describe("/foo/ with object", () => {
    it("returns the value with an empty key", () => {
      const doc = { foo: { "": "bar" } };
      assert.equal(JsonPointer.find(doc, "/foo/"), "bar");
    });

    it("returns undefined if the target does not have an empty key", () => {
      const doc = { foo: { foo: "bar" } };
      assert.equal(JsonPointer.find(doc, "/foo/"), undefined);
    });
  });

  describe("/foo/ with array", () => {
    it("returns undefined", () => {
      const doc = { foo: [0, 1] };
      assert.equal(JsonPointer.find(doc, "/foo/"), undefined);
    });
  });
});
