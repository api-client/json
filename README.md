# JSON Patch for API Client

This library is based on JSON8 library by Sonny Piers.

## Introduction

JSON Patch [RFC 6902](http://tools.ietf.org/html/rfc6902) (and diff) implementation for JavaScript as ESM.

See [jsonpatch.com](http://jsonpatch.com) for more information about JSON Patch.

## Getting started

`npm install @api-client/json`

---

```javascript
import { Patch } from '@api-client/json';
```

For performance concerns the Patch may mutate target document; if you want it to use its own copy use:

```javascript
import { Patch, Core } from '@api-client/json';

const myDocument = { foo: "bar" };
const doc = Core.clone(myDocument);
```

The Patch never mutates patches.

## Methods

### apply

```javascript
import { Patch } from '@api-client/json';

doc = Patch.apply(doc, patch).doc;
```

`Patch.apply` (and other Patch methods) returns an object with a doc property because per specification a patch can replace the original root document.

The operation is atomic, if any of the patch operation fails, the document will be restored to its original state and an error will be thrown.

### patch

Alias for `apply()` method.

## revert

If the `patch()` or `apply()` method is called with a third argument `{reversible: true}` it will return an additional value in the form of a `revert` property.

The revert object can be used to revert a patch on a document.

```javascript
import { Patch } from '@api-client/json';

// apply the patch with the reversible option
const applyResult = Patch.apply(doc, patch, { reversible: true });
doc = applyResult.doc;

// revert the patch
doc = Patch.revert(doc, applyResult.revert).doc;
// doc is strictly identical to the original
```

See also `buildRevertPatch()` which offers more flexibility.

### buildRevertPatch

Builds a valid JSON Patch from the result of a reversible apply operation.
You can then use this patch with `apply()` method to revert a previously applied patch.

```javascript
import { Patch } from '@api-client/json';

// apply the patch
const applyResult = Patch.apply(doc, patch, { reversible: true });
doc = applyResult.doc;

// revert the patch
const revertPatch = Patch.buildRevertPatch(applyResult.revert); // this is a valid JSON Patch
doc = Patch.apply(doc, revertPatch).doc;
// doc is strictly identical to the original
```

Because `buildRevertPatch() + apply()` offers more flexibility over `revert()` it is preferred.

- use `pack()`/`unpack()` with the result of `buildRevertPatch()` making it ideal for storage or transport
- reverse a revert (and so on...) with `{reversible: true}`
- `diff()` between reverts
- merge multiple reverts into one
- rebase reverts

### diff

Returns a diff in the form of a JSON Patch for 2 JSON values.

```javascript
import { Patch } from '@api-client/json';

Patch.diff(true, false);
// [{"op": "replace", "path": "", "value": "false"}]

Patch.diff([], []);
// []

Patch.diff({}, { foo: "bar" });
// [{"op": "add", "path": "/foo", "value": "bar"}]
```

### valid4

Returns `true` if the patch is valid, `false` otherwise.

This method _only_ check for JSON Patch semantic.
If you need to verify the patch is JSON valid, use `valid()`.

```javascript
import { Patch } from '@api-client/json';

Patch.valid({})  // false
Patch.valid([{}] // false
Patch.valid([{op: "foo", path: null, value: undefined}]) // false
Patch.valid([{op: "add", path: "/foo"}]) // false

Patch.valid([]) // true
Patch.valid([{op: "add", path: "/foo", value: "bar"}]) // true
```

### Operations

`add`, `copy`, `replace`, `move`, `remove`, `test` operations return an object of the form `{doc: document, previous: value}`

- `doc` is the patched document
- `previous` is the previous/replaced value

#### add

```javascript
doc = Patch.add(doc, "/foo", "foo").doc;
```

#### remove

```javascript
doc = Patch.remove(doc, "/foo").doc;
```

#### replace

```javascript
doc = Patch.replace(doc, "/foo", "foo").doc;
```

#### move

```javascript
doc = Patch.move(doc, "/foo", "/bar").doc;
```

#### copy

```javascript
doc = Patch.copy(doc, "/foo", "/bar").doc;
```

#### test

```javascript
doc = Patch.test(doc, "/foo", "bar").doc;
```

### Extra operations

Those are not part of the standard and are only provided for convenience.

#### get

```javascript
Patch.get(doc, "/foo");
// returns value at /foo
```

#### has

```javascript
Patch.has(doc, "/foo");
// returns true if there is a value at /foo
```

### Patch size

Per specification patches are pretty verbose. The library provides `pack()` and `unpack()` methods to reduce the size of patches and save memory/space/bandwidth.

Size (in bytes) comparison for the following patch file

```json
[
  { "op": "add", "path": "/a/b/c", "value": ["foo", "bar"] },
  { "op": "remove", "path": "/a/b/c" },
  { "op": "replace", "path": "/a/b/c", "value": 42 },
  { "op": "move", "from": "/a/b/c", "path": "/a/b/d" },
  { "op": "copy", "from": "/a/b/c", "path": "/a/b/e" },
  { "op": "test", "path": "/a/b/c", "value": "foo" }
]
```

|    format     | size (in bytes) |
| :-----------: | :-------------: |
|   unpacked    |       313       |
| unpacked gzip |       148       |
|    packed     |       151       |
|  packed gzip  |       99        |

In practice I'd recommand to use pack/unpack if

- data compression cannot be used on the transport of the patch
- keeping a large amount of patches in memory/on disk

#### pack

```javascript
const patch = [
  { op: "add", path: "/a/b/c", value: ["foo", "bar"] },
  { op: "remove", path: "/a/b/c" },
  { op: "replace", path: "/a/b/c", value: 42 },
  { op: "move", from: "/a/b/c", path: "/a/b/d" },
  { op: "copy", from: "/a/b/c", path: "/a/b/e" },
  { op: "test", path: "/a/b/c", value: "foo" },
];

const packed = Patch.pack(patch);
```

Here is what packed looks like

```json
[
  [0, "/a/b/c", ["foo", "bar"]],
  [1, "/a/b/c"],
  [2, "/a/b/c", 42],
  [3, "/a/b/d", "/a/b/c"],
  [4, "/a/b/e", "/a/b/c"],
  [5, "/a/b/c", "foo"]
]
```

### unpack

```javascript
const patch = Patch.unpack(packed);
// [{...}, {...}, ...]
```
