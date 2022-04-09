export type Operation = 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';

export interface BaseOperation {
  op: string;
  path: string;
}

export interface AddOperation extends BaseOperation {
  op: "add";
  value: any;
}

export interface RemoveOperation extends BaseOperation {
  op: "remove";
}

/**
* The JSON patch replace operation
*/
export interface ReplaceOperation extends BaseOperation {
  op: "replace";
  value: any;
}

/**
* The JSON patch move operation
*/
export interface MoveOperation extends BaseOperation {
  op: "move";
  from: any;
}

/**
* The JSON patch copy operation.
*/
export interface CopyOperation extends BaseOperation {
  op: "copy";
  from: any;
}

/**
* The JSON patch test operation
*/
export interface TestOperation extends BaseOperation {
  op: "test";
  value: any;
}

/**
* All possible JSON patch operations
*/
export type JsonPatchOperation = AddOperation | RemoveOperation | ReplaceOperation | MoveOperation | CopyOperation | TestOperation;

/**
 * A JSON patch as specified in RFC 6902
 */
export type JsonPatch = JsonPatchOperation[];

export interface ApplyResult<T = unknown> {
  doc: T;
}

export interface ApplyResultWithRevert extends ApplyResult {
  revert: JsonPatch;
}

export type PatchResult = ApplyResult;
export type PatchResultWithRevert = ApplyResultWithRevert;

export interface OperationResult<T = unknown> {
  /**
   * The patched document
   */
  doc: T;
  /**
   * The previous/replaced value if any
   */
  previous?: any;
  idx?: number;
}
