import { decode } from '../pointer/Encoding.js';
import walk from "./walk.js";
/**
 * Checks if the document has the property at the specified JSON Pointer location.
 *
 * @param doc JSON document
 * @param path JSON Pointer string or tokens path
 */
export default function has(doc: unknown, path: string | string[]): boolean {
  const tokens = decode(path);

  // returns the document
  if (tokens.length === 0) {
    return true;
  }

  const { parent, token } = walk(doc, tokens);
  
  return token in parent;
};
