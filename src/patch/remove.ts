import { decode } from '../pointer/Encoding.js';
import walk from "./walk.js";
import { OperationResult } from './types.js';

/**
 * Removes the value at the JSON Pointer location.
 *
 * @param doc JSON document to search into
 * @param path JSON Pointer string or tokens patch
 */
export default function remove(doc: any, path: string | string[]): OperationResult {
  const tokens = decode(path);

  // removes the document
  if (tokens.length === 0) {
    return { doc: undefined, previous: doc };
  }

  const { parent, token } = walk(doc, tokens);

  const previous = parent[token];
  if (previous === undefined) throw new Error("Location not found");

  if (Array.isArray(parent)) {
    // @ts-ignore
    parent.splice(token, 1);
  }
  else delete parent[token];

  return { doc, previous };
};
