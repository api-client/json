import { assert } from '@open-wc/testing';
import equal from '../../src/core/Equal.js';
import clone from '../../src/core/Clone.js';

describe("clone", () => {
  let doc = null;
  let cl = null;

  it("returns an array clone copy", () => {
    doc = ["foo", "bar"];
    cl = clone(doc);
    assert.deepEqual(cl, doc);
    assert.notStrictEqual(cl, doc);
    assert(equal(doc, cl));
  });

  it("returns a set clone copy", () => {
    doc = new Set(["foo", "bar"]);
    cl = clone(doc);
    assert(equal(doc, cl));
    assert.notStrictEqual(cl, doc);
  });

  it("returns an object clone copy", () => {
    doc = { foo: "bar", bar: "foo" };
    cl = clone(doc);
    assert.deepEqual(cl, doc);
    assert.notStrictEqual(cl, doc);
    assert(equal(doc, cl));
  });

  it("returns a map clone copy", () => {
    doc = { foo: "bar", bar: "foo" };
    cl = clone(doc);
    assert(equal(doc, cl));
    assert.notStrictEqual(cl, doc);
  });

  it("returns false for false", () => {
    assert.strictEqual(clone(false), false);
  });

  it("returns true for true", () => {
    assert.strictEqual(clone(true), true);
  });

  it("returns the string for string", () => {
    const str = "foobar";
    assert.strictEqual(clone(str), str);
  });

  it("returns the number for number", () => {
    assert.strictEqual(clone(10), 10);
  });

  it("returns null for null", () => {
    assert.strictEqual(clone(null), null);
  });

  it("returns -0 for -0", () => {
    cl = clone(-0);
    assert(cl === 0);
    assert(1 / cl === -Infinity);
  });

  it('clones recursive objects', () => {
    const parent = {
      items: [] as any[],
      prop: '1',
    };
    parent.items.push({
      prop: '2',
      parent,
    });
    const result = clone(parent);
    assert.equal(result.prop, '1');
    assert.lengthOf(result.items, 1);
    assert.equal(result.items[0].prop, '2');
    assert.typeOf(result.items[0].parent, 'object');
  });
});
