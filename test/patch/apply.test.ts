import { assert } from '@open-wc/testing';
import apply from '../../src/patch/apply.js';

describe("apply", () => {
  // https://github.com/HoLyVieR/prototype-pollution-nsec18
  it("prevents prototype pollution", () => {
    let doc = {};

    assert.throws(
      () => {
        doc = apply(doc, [
          {
            op: "add",
            path: "/__proto__/polluted",
            value: "Yes! Its Polluted",
          },
        ]);
      },
      Error,
      "Prototype pollution attempt"
    );
    
    // @ts-ignore
    assert.equal({}.polluted, undefined);
    // @ts-ignore
    assert.equal(doc.polluted, undefined);

    assert.throws(
      () => {
        doc = apply(doc, [
          {
            op: "add",
            path: "/constructor/polluted",
            value: "Yes! Its Polluted",
          },
        ]);
      },
      Error,
      "Prototype pollution attempt"
    );

    // @ts-ignore
    assert.equal({}.polluted, undefined);
    // @ts-ignore
    assert.equal(doc.polluted, undefined);
  });
});
