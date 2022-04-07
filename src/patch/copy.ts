import get from './get.js';
import add from './add.js';
import { OperationResult } from './types.js';

/**
 * Copies the value at the specified JSON Pointer location to another location.
 *
 * @param doc JSON document to copy the value from and to
 * @param path JSON Pointer string or tokens path
 * @param dest JSON Pointer string destination of the value
 */
export default function copy(doc: any, path: string | string[], dest: string): OperationResult {
  const obj = get(doc, path);
  return add(doc, dest, obj);
};
