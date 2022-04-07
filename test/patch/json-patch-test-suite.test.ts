import { assert } from '@open-wc/testing';
import clone from '../../src/core/Clone.js';
import { apply, revert, pack, unpack, valid, buildRevertPatch } from '../../src/patch/index.js';

describe("json-patch-test-suite", () => {
  before(async () => {
    const r1 = await fetch('/node_modules/json-patch-test-suite/tests.json');
    const r2 = await fetch('/node_modules/json-patch-test-suite/spec_tests.json');
    const t1 = await r1.json();
    const t2 = await r2.json();
    const tests: any[] = t1.concat(t2);

    tests.forEach((test) => {
      if (test.disabled) return;

      describe(test.comment ? test.comment : "no test description", () => {
        if (test.error) {
          it("throws an error", () => {
            const t = clone(test);
            assert.throws(() => {
              apply(t.doc, t.patch);
            });
          });
  
          it("reverts the document to its original state", () => {
            const t = clone(test);
            const original = clone(t.doc);
            assert.throws(() => {
              apply(t.doc, t.patch);
            });
            assert.deepEqual(t.doc, original);
          });
        } else if (test.expected) {
          it("applies the patch", () => {
            const t = clone(test);
            const r = apply(t.doc, t.patch);
            assert.deepEqual(r.doc, t.expected);
          });
  
          it("reverts the patch ok with revert", () => {
            const t = clone(test);
            const original = t.doc;
            const r = apply(t.doc, t.patch, { reversible: true }) as any;
            assert.deepEqual(revert(r.doc, r.revert).doc, original);
          });
  
          it("reverts the patch ok with buildRevertPatch and apply", () => {
            const t = clone(test);
            const original = t.doc;
            const r = apply(t.doc, t.patch, { reversible: true });
            const revertPatch = buildRevertPatch(r.revert);
            assert.deepEqual(apply(r.doc, revertPatch).doc, original);
          });
        } else {
          it("does not throw an error", () => {
            const t = clone(test);
            assert.doesNotThrow(() => {
              apply(t.doc, t.patch);
            });
          });
        }

        if (test.expected && !test.error) {
          it("validation returns true", () => {
            const t = clone(test);
            assert.strictEqual(valid(t.patch), true);
          });
        }
  
        if (
          test.patch &&
          !test.error &&
          JSON.stringify(test.patch).indexOf("spurious") === -1
        ) {
          const ignore = ["Ignoring Unrecognized Elements"];
          if (test.comment && test.comment.indexOf(ignore[0]) !== -1) return;
  
          it("packs and unpacks the patch ok", () => {
            const t = clone(test);
            const packed = pack(test.patch);
            assert.deepEqual(unpack(packed), t.patch);
          });
        }
      });
    });
  });

  it('empty', () => {
    // ...
  });
});
