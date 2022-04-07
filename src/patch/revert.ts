import buildRevertPatch from "./buildRevertPatch.js";
import apply from "./apply.js";
import { JsonPatch, ApplyResult } from './types.js';

/**
 * If the patch or apply method is called with a third argument `{reversible: true}` it will return an additional value in the form of a revert property.
 *
 * The revert object can be used to revert a patch on a document.
 *
 * ```javascript
 * // apply the patch with the reversible option
 * var applyResult = ooPatch.apply(doc, patch, { reversible: true });
 * doc = applyResult.doc;
 *
 * // revert the patch
 * doc = ooPatch.revert(doc, applyResult.revert).doc;
 * // doc is strictly identical to the original
 * ```
 *
 * See also the `buildRevertPatch()` function which offers more flexibility.
 */
export default function revert(doc: any, revertPatch: JsonPatch): ApplyResult {
  const patch = buildRevertPatch(revertPatch);
  return apply(doc, patch);
};
