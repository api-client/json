import Walk from './Walk.js';

export { default as context } from './Context.js';
export { decode, encode, escape, unescape } from './Encoding.js';
export { default as find } from './Find.js';
export { flatten, unflatten } from './Flat.js';
export { default as dict } from './Dict.js';
export { default as join } from './Join.js';
export { default as compile } from './Compile.js';
export * from './Validator.js';


export function index(json: any): any {
  const result = Object.create(null);
  Walk(json, (value, pointer) => {
    result[pointer] = value;
  });
  return result;
}
