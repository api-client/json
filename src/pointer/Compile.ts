import { decode } from './Encoding.js';

export default function compile(pointer: any): Function {
  const tokens = Array.isArray(pointer) ? pointer : decode(pointer);

  let str = "return doc";
  for (const token of tokens) {
    str += `['${token.replace(/\\/g, "\\\\").replace(/'/, "\\'")}']`;
  }

  // eslint-disable-next-line no-new-func
  return Function("doc", str);
}
