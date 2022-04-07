/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
import { decode } from './Encoding.js';
import Context from "./Context.js";
import Walk from "./Walk.js";

export function unflatten(indexes: any) {
  const keys = Object.keys(indexes);
  const json = indexes[""];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key === "") {
      continue;
    }
    const idx = decode(key);
    const res = Context(json, idx);
    const { parent, token } = res;
    if (parent instanceof Map) {
      parent.set(token, indexes[key]);
    } else if (parent instanceof Set) {
      parent.add(indexes[key]);
    } else if (Array.isArray(parent)) {
      parent.push(indexes[key]);
    } else {
      parent[token] = indexes[key];
    }
  }
  return json;
}


export function flatten(json: any): any {
  const result = Object.create(null);
  Walk(json, (value, pointer) => {
    let v;
    if (Array.isArray(value)) {
      v = [];
    } else if (value instanceof Map) {
      v = new Map();
    } else if (value instanceof Set) {
      v = new Set();
    } else if (typeof value === "object" && value !== null) {
      v = {};
    } else {
      v = value;
    }
    result[pointer] = v;
  });
  return result;
}
