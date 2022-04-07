import { assert } from '@open-wc/testing';
import { JsonPointer } from '../../src/index.js';

describe("decode", () => {
  it("returns ['foo', 'bar']", () => {
    const r = JsonPointer.decode("/foo/bar");
    assert.deepEqual(r, ["foo", "bar"]);
  });

  it('returns [""]', () => {
    const r = JsonPointer.decode("/");
    assert.deepEqual(r, [""]);
  });

  it("returns []", () => {
    const r = JsonPointer.decode("");
    assert.deepEqual(r, []);
  });

  // https://github.com/HoLyVieR/prototype-pollution-nsec18
  it("prevents prototype pollution", () => {
    assert.throws(
      () => {
        JsonPointer.decode("/foo/constructor/bar");
      },
      Error,
      "Prototype pollution attempt"
    );

    assert.throws(
      () => {
        JsonPointer.decode("/foo/__proto__/bar");
      },
      Error,
      "Prototype pollution attempt"
    );
  });
});

describe("encode", () => {
  it("should return /foo/bar", () => {
    const s = JsonPointer.encode(["foo", "bar"]);
    assert.deepEqual(s, "/foo/bar");
  });

  it('should return ""', () => {
    const s = JsonPointer.encode([]);
    assert.deepEqual(s, "");
  });

  it("should return /", () => {
    const s = JsonPointer.encode([""]);
    assert.deepEqual(s, "/");
  });

  it("stringifies numbers", () => {
    assert.deepEqual(JsonPointer.encode(["foo", 0, "bar"]), "/foo/0/bar");
    assert.deepEqual(JsonPointer.encode([0, "foo", "bar"]), "/0/foo/bar");
    assert.deepEqual(JsonPointer.encode(["foo", "bar", 0]), "/foo/bar/0");
  });
});
