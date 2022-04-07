import { OperationResult } from './types.js';
import remove from './remove.js';
import add from './add.js';

/**
 * Moves the value at the specified JSON Pointer location to another location.
 *
 * @param doc JSON document to move the value from and to
 * @param path JSON Pointer string or tokens path
 * @param dest JSON Pointer string destination of the value
 */
export default function move(doc: any, path: string | string[], dest: string): OperationResult {
  const r = remove(doc, path);
  return add(r.doc, dest, r.previous);
};
