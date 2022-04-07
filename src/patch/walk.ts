/* eslint-disable no-plusplus */
import { validArrayToken } from '../pointer/index.js';

export interface IWalkResult {
  token: string;
  parent: any;
}

/**
 * Walks a JSON document with a tokens array
 *
 * @param doc The JSON document
 * @param tokens The list of tokens
 */
export default function walk(doc: any, tokens: string[]): IWalkResult {
  const { length } = tokens;

  let i = 0;
  let target = doc;
  let token: string;

  while (i < length - 1) {
    token = tokens[i++];

    if (Array.isArray(target)) {
      validArrayToken(token, target.length);
    } else if (typeof target !== 'object' || target === null) {
      throw new Error("Cannot be walked");
    }

    target = target[token];
  }

  token = tokens[i];

  if (Array.isArray(target)) {
    validArrayToken(token, target.length);
  } else if (typeof target !== 'object' || target === null) {
    throw new Error("Invalid target");
  }

  return {
    token,
    parent: target,
  };
};
