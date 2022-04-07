/* eslint-disable no-plusplus */
import { validArrayToken } from './Validator.js';

export interface IContext {
  token: string;
  parent: any;
}

/**
 * Reads the last token and its parent
 *
 * @param doc The JSON document
 * @param tokens The list of tokens
 */
export default function context(doc: any, tokens: string[]): IContext {
  const { length } = tokens;

  let i = 0;
  let target = doc;
  let token: string;

  while (i < length - 1) {
    token = tokens[i++];

    if (Array.isArray(target)) {
      validArrayToken(token, target.length);
    } else if (typeof target !== 'object' || target === null) {
      throw new Error('Cannot be walked');
    }
    
    if (target instanceof Map) {
      target = target.get(token);
    } else if (target instanceof Set) {
      let c = 0;
      for (const item of target) {
        if (c === +token) {
          target = item;
        } else {
          c++;
        }
      }
    } else {
      target = target[token];
    }
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
  }
}
