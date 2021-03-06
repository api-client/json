import { assert } from '@open-wc/testing';
import diff from '../../src/patch/diff2.js';

describe("diff", () => {
  [
    {
      description: "equal booleans, empty patch",
      a: true,
      b: true,
      patch: []
    },

    {
      description: "equal strings, empty patch",
      a: "foo",
      b: "foo",
      patch: []
    },

    {
      description: "equal null, empty patch",
      a: null,
      b: null,
      patch: []
    },

    {
      description: "equal empty arrays, empty patch",
      a: [],
      b: [],
      patch: []
    },

    {
      description: "equal non empty arrays, empty patch",
      a: ["foo"],
      b: ["foo"],
      patch: []
    },

    {
      description: "equal empty objects, empty patch",
      a: {},
      b: {},
      patch: []
    },

    {
      description: "equal non empty objects, empty patch",
      a: { "foo": "bar" },
      b: { "foo": "bar" },
      patch: []
    },

    {
      description: "equal numbers, empty patch",
      a: 42,
      b: 42,
      patch: []
    },

    {
      description: "replace true with false",
      a: true,
      b: false,
      patch: [{ "op": "replace", "path": "", "value": false }]
    },

    {
      description: "replace false with true",
      a: false,
      b: true,
      patch: [{ "op": "replace", "path": "", "value": true }]
    },

    {
      description: "replace string with string",
      a: "foo",
      b: "bar",
      patch: [{ "op": "replace", "path": "", "value": "bar" }]
    },

    {
      description: "replace number with number",
      a: -2,
      b: 2,
      patch: [{ "op": "replace", "path": "", "value": 2 }]
    },

    {
      description: "replace array with array",
      a: [],
      b: ["foo"],
      patch: [{ "op": "add", "path": "/0", "value": "foo" }]
    },

    {
      description: "replace primitive with array",
      a: null,
      b: [],
      patch: [{ "op": "replace", "path": "", "value": [] }]
    },

    {
      description: "replace primitive with object",
      a: null,
      b: {},
      patch: [{ "op": "replace", "path": "", "value": {} }]
    },

    {
      description: "replace object with primitive",
      a: {},
      b: 42,
      patch: [{ "op": "replace", "path": "", "value": 42 }]
    },

    {
      description: "replace array with primitive",
      a: [],
      b: "foobar",
      patch: [{ "op": "replace", "path": "", "value": "foobar" }]
    },

    {
      description: "object - 2 new properties",
      a: {},
      b: { "foo": "bar", "bar": "foo" },
      patch: [
        { "op": "add", "path": "/foo", "value": "bar" },
        { "op": "add", "path": "/bar", "value": "foo" }
      ]
    },

    {
      description: "object - 2 removed properties",
      a: { "foo": "bar", "bar": "foo" },
      b: {},
      patch: [
        { "op": "remove", "path": "/bar" },
        { "op": "remove", "path": "/foo" },
      ]
    },

    {
      description: "object - 1 property added 1 property removed",
      a: { "foo": "bar" },
      b: { "bar": "foo" },
      patch: [
        { "op": "remove", "path": "/foo" },
        { "op": "add", "path": "/bar", "value": "foo" }
      ]
    },

    {
      description: "object - 1 property replaced",
      a: { "foo": "bar" },
      b: { "foo": "foo" },
      patch: [
        { "op": "replace", "path": "/foo", "value": "foo" }
      ]
    },

    {
      description: "object - 1 nested property replaced",
      a: { "foo": { "foo": "bar" } },
      b: { "foo": { "foo": "foo" } },
      patch: [
        { "op": "replace", "path": "/foo/foo", "value": "foo" }
      ]
    },

    {
      description: "object - 1 nested property added",
      a: { "foo": {} },
      b: { "foo": { "foo": "foo" } },
      patch: [
        { "op": "add", "path": "/foo/foo", "value": "foo" }
      ]
    },

    {
      description: "object - 1 nested property removed",
      a: { "foo": { "foo": "foo" } },
      b: { "foo": {} },
      patch: [
        { "op": "remove", "path": "/foo/foo" }
      ]
    },

    {
      description: "object - 1 nested (2) property added",
      a: {},
      b: { "foo": { "foo": "foo" } },
      patch: [
        { "op": "add", "path": "/foo", "value": { "foo": "foo" } }
      ]
    }
  ].forEach((test) => {
    it(test.description, () => {
      const patch = diff(test.a, test.b);
      // @ts-ignore
      assert.deepEqual(patch, test.patch);
    });
  });
});
