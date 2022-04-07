import { assert } from '@open-wc/testing';
import { JsonPointer, Core } from '../../src/index.js';

const tests: any[] = [
  {
    foo: ["bar", "baz"],
    "": 0,
    "a/b": 1,
    "c%d": 2,
    "e^f": 3,
    "g|h": 4,
    "i\\j": 5,
    'k"l': 6,
    " ": 7,
    "m~n": 8,
  },
  "foo",
  true,
  null,
  ["foo", "bar"],
  new Set(["foo", "bar"]),
];

const map = new Map();
map.set("object", { foo: "bar" });
map.set("array", ["foo", "bar"]);
tests.push(map);

describe("unflatten", () => {
  it("returns an equal value of the original", () => {
    tests.forEach((test) => {
      const json = Core.clone(test);
      assert.deepEqual(JsonPointer.unflatten(JsonPointer.flatten(json)), test);
    });
  });

  // https://github.com/HoLyVieR/prototype-pollution-nsec18
  it("prevents prototype pollution", () => {
    assert.throws(
      () => {
        JsonPointer.unflatten({
          "": {},
          "/firstName": "John",
          "/__proto__/polluted": "Yes! Its Polluted",
        });
      },
      Error,
      "Prototype pollution attempt"
    );

    assert.throws(
      () => {
        JsonPointer.unflatten({
          "": {},
          "/firstName": "John",
          "/constructor/polluted": "Yes! Its Polluted",
        });
      },
      Error,
      "Prototype pollution attempt"
    );
  });
});
