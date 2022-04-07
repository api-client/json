import { assert } from '@open-wc/testing';
import { JsonPointer } from '../../src/index.js';

const primitives = {
  null: null,
  string: "hello",
  boolean: true,
  number: -42,
};

const structures = {
  array: [],
  object: {},
  map: new Map(),
  set: new Set(),
};

describe("index", () => {
  describe("primitives", () => {
    Object.keys(primitives).forEach((name) => {
      // @ts-ignore
      const value = structures[name];

      it(`indexes ${name} primitive correctly`, () => {
        const expect = { "": value };
        assert.deepEqual(JsonPointer.index(value), expect);
      });
    });
  });

  describe("empty structures", () => {
    Object.keys(structures).forEach((name) => {
      // @ts-ignore
      const value = structures[name];
      it(`indexes empty ${name} structure correctly`, () => {
        const expect = { "": value };
        assert.deepEqual(JsonPointer.index(value), expect);
      });
    });
  });
});
