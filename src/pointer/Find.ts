import { decode } from './Encoding.js';
import Context, { IContext } from "./Context.js";

/**
 * Reads the value at the JSON Pointer location
 *
 * @param doc The JSON document
 * @param pointer The JSON Pointer string or tokens array
 * @returns value at the JSON Pointer location - undefined otherwise
 */
export default function find(doc: any, pointer: string | string[]): unknown | undefined {
  const tokens = Array.isArray(pointer) ? pointer : decode(pointer);

  // returns the document
  if (tokens.length === 0) {
    return doc;
  }

  let r: IContext;

  try {
    r = Context(doc, tokens);
  } catch (e) {
    return undefined;
  }

  const { token, parent } = r;
  return parent[token];
}
