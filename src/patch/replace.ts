import { decode } from '../pointer/Encoding.js';
import walk from "./walk.js";
import { OperationResult } from './types.js';

/**
 * Replaces the value at the JSON Pointer location
 *
 * @param doc JSON document
 * @param path JSON Pointer string or tokens patch
 * @param value JSON object to replace with
 */
export default function replace(doc: any, path: string | string[], value: unknown): OperationResult {
  const tokens = decode(path);

  // replaces the document
  if (tokens.length === 0) {
    return { doc: value, previous: doc };
  }

  const { parent, token } = walk(doc, tokens);

  const previous = parent[token];
  if (previous === undefined) throw new Error("Location not found");

  parent[token] = value;

  return { 
    doc, 
    previous 
  };
};
