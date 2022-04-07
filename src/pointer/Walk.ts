import Join from "./Join.js";

function each(obj: any, iterator: (v: any, k: any) => void): void {
  if (obj instanceof Set) {
    let c = 0;
    for (const value of obj) {
      iterator(value, (c += 1));
    }
  } else if (Array.isArray(obj) || obj instanceof Map) {
    obj.forEach(iterator);
  } else if (typeof obj === "object" && obj !== null) {
    Object.keys(obj).forEach((key) => {
      iterator(obj[key], key);
    });
  } else {
    throw new TypeError(`${obj} is not a structure`);
  }
}

function _walk(value: any, key: string | undefined, parent: any, fn: (v: any, k: any, p: any) => void): void {
  fn(value, key, parent);
  if (value === null || typeof value !== "object") {
    return
  }

  each(value, (v, k) => {
    _walk(v, k, value, fn);
  });
}

export default function walk(json: any, fn: (v: any, k: any, p?: any, parent?: any) => void) {
  const dic = Object.create(null);

  function get(obj: any): string | undefined {
    // eslint-disable-next-line no-restricted-syntax
    for (const p in dic) {
      if (dic[p] === obj) {
        return p;
      }
    }
    return undefined;
  }

  function set(obj: any, key: string[], parent?: any): void {
    const path = Join(parent ? get(parent) : parent, key);
    dic[path] = obj;
  }

  _walk(json, undefined, undefined, (v, k, p) => {
    if (v !== null && typeof v === "object") {
      if (p === undefined || k === undefined) set(v, [], "");
      else set(v, k.toString(), p);
    }

    if (k === undefined || p === undefined) {
      fn(v, "");
    } else {
      const parent = get(p);
      fn(v, Join(parent!, k.toString()), p, parent);
    }
  });
}
