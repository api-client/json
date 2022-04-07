import * as JsonPointer from '../pointer/index.js';
import walk from "./walk.js";
import { OperationResult } from './types.js';

/**
 * Adds the value to the specified JSON Pointer location
 * http://tools.ietf.org/html/rfc6902#section-4.1
 *
 * @param doc The JSON document to set the value to
 * @param path The JSON Pointer string or tokens path
 * @param  {Any}  value  - value to add
 * @return {OperationResult}
 */
export default function add(doc: any, path: string | string[], value: any): OperationResult {
  const tokens = JsonPointer.decode(path);

  // replaces the document
  if (tokens.length === 0) {
    return {
      doc: value,
      previous: doc,
    };
  }

  const { token, parent } = walk(doc, tokens);

  let previous: any;
  let idx: number | undefined;

  if (Array.isArray(parent)) {
    if (token === "-") {
      parent.push(value);
      idx = parent.length - 1;
    } else {
      // @ts-ignore
      parent.splice(token, 0, value);
    }
  } else {
    previous = parent[token];
    parent[token] = value;
  }

  return {
    doc,
    previous,
    idx,
  };
};
