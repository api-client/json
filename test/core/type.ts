import { assert } from '@open-wc/testing';
import Type from '../../src/core/Type.js';

describe("type", () => {
  it("returns boolean for false", () => {
    assert.strictEqual(Type(false), "boolean");
  });

  it("returns boolean for true", () => {
    assert.strictEqual(Type(true), "boolean");
  });

  it("returns array for array", () => {
    assert.strictEqual(Type([]), "array");
  });

  it("returns array for set", () => {
    assert.strictEqual(Type(new Set()), "array");
  });

  it("returns null for null", () => {
    assert.strictEqual(Type(null), "null");
  });

  it("returns object for object", () => {
    assert.strictEqual(Type({}), "object");
  });

  it("returns object for map", () => {
    assert.strictEqual(Type(new Map()), "object");
  });

  it("returns number for integer", () => {
    assert.strictEqual(Type(1234), "number");
  });

  it("returns number for negative integer", () => {
    assert.strictEqual(Type(-1234), "number");
  });

  it("returns number for float", () => {
    assert.strictEqual(Type(12.34), "number");
  });

  it("returns number for negative float", () => {
    assert.strictEqual(Type(-12.34), "number");
  });

  it("returns undefined for undefined", () => {
    assert.strictEqual(Type(undefined), undefined);
  });

  it("returns undefined for NaN", () => {
    assert.strictEqual(Type(NaN), undefined);
  });

  it("returns undefined for Infinity", () => {
    assert.strictEqual(Type(Infinity), undefined);
  });

  it("returns undefined for -Infinity", () => {
    assert.strictEqual(Type(-Infinity), undefined);
  });

  it("returns undefined for function", () => {
    assert.strictEqual(
      Type(() => {}),
      undefined
    );
  });

  it("returns undefined for symbol", () => {
    assert.strictEqual(Type(Symbol('a')), undefined);
  });
});
