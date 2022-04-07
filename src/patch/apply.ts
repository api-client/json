/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-redeclare */
import { decode } from '../pointer/Encoding.js';
import buildRevertPatch from "./buildRevertPatch.js";
import { OperationResult, JsonPatchOperation, ApplyResult, JsonPatch, ApplyResultWithRevert } from './types.js';

import add from './add.js';
import copy from './copy.js';
import move from './move.js';
import remove from './remove.js';
import replace from './replace.js';
import test from './test.js';

const operations = Object.freeze({
  add,
  copy,
  move,
  remove,
  replace,
  test,
});

/**
 * Applies a single JSON Patch operation object to a JSON document
 * @param doc The JSON document to apply the patch to
 * @param patch The JSON Patch operation object
 */
function run(doc: any, patch: JsonPatchOperation): ApplyResult {
  const pathTokens = typeof patch.path === "string" ? decode(patch.path) : null;
  // @ts-ignore
  const fromTokens = typeof patch.from === "string" ? decode(patch.from) : null;

  switch (patch.op) {
    case "add":
    case "replace":
    case "test":
      if (patch.value === undefined) {
        throw new Error("Missing value parameter");
      }
      // @ts-ignore
      return operations[patch.op](doc, pathTokens, patch.value);
    case "move":
    case "copy":
      // @ts-ignore
      return operations[patch.op](doc, fromTokens, pathTokens);
    case "remove":
      // @ts-ignore
      return operations[patch.op](doc, pathTokens);
    default:
      // @ts-ignore
      throw new Error(`${patch.op} isn't a valid operation`);
  }
}

/**
 * The operation is atomic, if any of the patch operation fails, the document will be restored to its original state and an error will be thrown.
 * @param doc The document to apply the patch operation to
 * @param patch The patch operations
 * @param options With `{reversible: false}` it will not return an additional value in the form of a `revert` property.
 * @returns An object with a doc property because per specification a patch can replace the original root document.
 */
function apply(doc: any, patch: JsonPatch, options?: { reversible: false }): ApplyResult;
/**
 * The operation is atomic, if any of the patch operation fails, the document will be restored to its original state and an error will be thrown.
 * @param doc The document to apply the patch operation to
 * @param patch The patch operations
 * @param options With `{reversible: true}` it will return an additional value in the form of a `revert` property.
 * @returns An object with a doc property because per specification a patch can replace the original root document.
 */
function apply(doc: any, patch: JsonPatch, options?: { reversible: true }): ApplyResultWithRevert;

/**
 * Applies a JSON Patch to a JSON document
 * @param doc The JSON document to apply the patch to
 * @param patch The JSON Patch array
 */
function apply(doc: any, patch: JsonPatch, options?: any): ApplyResult | ApplyResultWithRevert {
  if (!Array.isArray(patch))
    throw new Error("Invalid argument, patch must be an array");

  const done:any[] = [];

  for (let i = 0, len = patch.length; i < len; i++) {
    const p = patch[i];
    let r: OperationResult;

    try {
      r = run(doc, p);
    } catch (err) {
      // restore document
      // does not use ./revert.js because it is a circular dependency
      const revertPatch = buildRevertPatch(done);
      apply(doc, revertPatch);
      throw err;
    }

    doc = r.doc;
    done.push([p, r.previous, r.idx]);
  }

  const result: ApplyResult = { doc };

  if (options && typeof options === "object" && options.reversible === true) {
    const typed = result as ApplyResultWithRevert;
    typed.revert = done;
  }

  return result;
}

export default apply;
