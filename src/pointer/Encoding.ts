/* eslint-disable no-plusplus */

/**
 * Un-escapes previously escaped JSON Pointer token
 *
 * @param token The escaped token
 * @param separator The separator to use. Defaults to '/'.
 * @returns Unescaped token
 */
export function unescape(token: string, separator = '/') {
  return token.replace(/~0/g, "~").replace(/~1/g, separator);
}

/**
 * Escapes a token for use in JSON Pointer
 *
 * @param token array of tokens
 * @param separator separator to use. Defaults to `/`.
 * @returns escaped token
 */
export function escape(token: string, separator = '/'): string {
  let escaped = "";
  let t = token;
  if (typeof t === "number") {
    t = String(t);
  }
  for (let i = 0, len = t.length; i < len; i++) {
    const l = t.charAt(i);
    if (l === "~") {
      escaped += "~0";
    } else if (l === separator) {
      escaped += "~1";
    } else {
      escaped += l;
    }
  }
  return escaped;
}


/**
 * Encodes a JSON tokens list
 *
 * @param tokens The of tokens to encode
 * @param separator The separator to use. Defaults to `/`.
 * @returns The JSON Pointer string
 */
export function encode(tokens: string[] | any[], separator = '/'): string {
  let result = "";
  for (let i = 0, len = tokens.length; i < len; i++) {
    result += separator + escape(tokens[i], separator);
  }
  return result;
}

/**
 * Decodes a JSON Pointer string
 *
 * @param pointer JSON Pointer string to decode
 * @param separator separator to use. Defaults to `/`.
 * @returns List of tokens
 */
export function decode(pointer: string | string[], separator = '/'): string[] {
  if (Array.isArray(pointer)) {
    return pointer;
  }
  if (pointer.length === 0) {
    return [];
  }
  if (pointer.charAt(0) !== separator) {
    throw new Error(`Invalid pointer: ${pointer}`)
  }

  const tokens: string[] = [""];
  let c = 0;
  for (let i = 1, len = pointer.length; i < len; i++) {
    const l = pointer.charAt(i);
    if (l === separator) {
      const token = tokens[tokens.length - 1];
      if (token === "constructor" || token === "__proto__") {
        throw new Error("Prototype pollution attempt");
      }
      tokens.push('');
      c++;
    } else if (l === "~") {
      if (pointer.charAt(i + 1) === "1") {
        tokens[c] += separator;
        i++;
      } else if (pointer.charAt(i + 1) === "0") {
        tokens[c] += "~";
        i++;
      } else {
        tokens[c] += l;
      }
    } else {
      tokens[c] += l;
    }
  }
  return tokens;
}
