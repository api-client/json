import { assert } from '@open-wc/testing';
import apply from '../../src/patch/apply.js';
import buildRevertPatch from '../../src/patch/buildRevertPatch.js';
import clone from '../../src/core/Clone.js';
import { JsonPatch } from '../../src/patch/types.js';

describe("revert", () => {
  let doc;

  describe("move", () => {
    it("destination of a move operation gets its previous value back", () => {
      doc = { foo: "hello", bar: "world" };
      const patch: JsonPatch = [
        {
          op: "move",
          path: "/bar",
          from: "/foo",
        },
      ];

      const applyResult = apply(clone(doc), patch, { reversible: true });

      assert.deepEqual(applyResult.doc, { bar: "hello" });

      const revertPatch = buildRevertPatch(applyResult.revert);

      assert.deepEqual(apply(applyResult.doc, revertPatch).doc, {
        foo: "hello",
        bar: "world",
      });
    });
  });
});
