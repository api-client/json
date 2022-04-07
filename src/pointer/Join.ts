import { encode, decode } from './Encoding.js';

/**
 * Joins pointers.
 *
 * @param pointer The base pointer
 * @param tokens The list of tokens
 * @param separator The separator to use, defaults to /
 * @returns JSON Pointer string
 */
export default function join(pointer: string[] | string, tokens: string[] | string, separator?: string): string {
  let parsedPointers: string[];
  let parsedTokens: string[];
  if (typeof pointer === "string") {
    parsedPointers = decode(pointer, separator);
  } else {
    parsedPointers = pointer;
  }
  if (typeof tokens === "string") {
    parsedTokens = [tokens];
  } else {
    parsedTokens = tokens;
  }
  return encode(parsedPointers.concat(parsedTokens), separator);
}
