import get from "./get.js";
import equal from '../core/Equal.js';
import { OperationResult } from './types.js';

/**
 * Tests that the value at the specified JSON Pointer location is equal to the specified value.
 *
 * @param doc JSON document
 * @param path JSON Pointer string or tokens patch
 * @param value The value to compare with
 */
export default function test(doc: any, path: string | string[], value: any): OperationResult {
  const obj = get(doc, path);
  if (!equal(obj, value)) {
    throw new Error("Test failed");
  }

  return { doc };
};
