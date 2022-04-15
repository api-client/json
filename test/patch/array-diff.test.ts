import { assert } from '@open-wc/testing';
import diff from '../../src/patch/diff2.js';

describe('diff', () => {
  describe('Array diff', () => {
    it('makes a diff on an array', () => {
      const src = ['a', 'b', 'c'];
      const target = ['a', 'c'];
      const patch = diff(src, target);
      assert.deepEqual(patch, [
        { op: 'remove', path: '/2' },
        { op: 'replace', path: '/1', value: 'c' },
      ]);
    });

    it('moves an array item', () => {
      const src = ['a', 'b', 'c'];
      const target = ['a', 'c', 'b'];
      const patch = diff(src, target);
      assert.deepEqual(patch, [
        { op: 'replace', path: '/2', value: 'b' },
        { op: 'replace', path: '/1', value: 'c' },
      ]);
    });

    it('replace true with false', () => {
      const src = true;
      const target = false;
      const patch = diff(src, target);

      assert.deepEqual(patch, [{"op": "replace", "path": "", "value": false}]);
    });

    it('replace array with primitive', () => {
      const src: any = [];
      const target = 'foobar';
      const patch = diff(src, target);

      assert.deepEqual(patch, [{ "op": "replace", "path": "", "value": "foobar" }]);
    });

    it('makes a diff for an objects in an array', () => {
      const src = [{ p1: 'v1', p2: { p3: 'v3' } }];
      const target = [{ p1: 'v1', p2: { p3: 'v4' } }];
      const patch = diff(src, target);
      assert.deepEqual(patch, [{ "op": "replace", "path": "/0/p2/p3", "value": "v4" }]);
    });

    it('makes a diff in an object that has an array', () => {
      const src = { root: [{ p1: 'v1', p2: { p3: 'v3' } }] };
      const target = { root: [{ p1: 'v1', p2: { p3: 'v4' } }]};
      const patch = diff(src, target);
      assert.deepEqual(patch, [{ "op": "replace", "path": "/root/0/p2/p3", "value": "v4" }]);
    });
  });
});
