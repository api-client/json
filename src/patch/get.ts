import { decode } from '../pointer/Encoding.js';
import walk from "./walk.js";

/**
 * Get the value at the JSON Pointer location.
 *
 * @param doc JSON document
 * @param path JSON Pointer string or tokens patch
 * @returns The value at the JSON Pointer location
 */
export default function get(doc: unknown, path: string | string[]): unknown {
  const tokens = decode(path);

  // returns the document
  if (tokens.length === 0) {
    return doc;
  }

  const { parent, token } = walk(doc, tokens);
  
  return parent[token];
};
