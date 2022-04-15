const primitives = ['boolean', 'string', 'number', 'null'];

export default function Type(obj: any): string | undefined {
  const t = typeof obj;

  if (t === 'boolean' || t === 'string') {
    return t;
  } 
  if (t === 'number' && Number.isFinite(obj)) {
    return 'number';
  } 
  if (t === 'object') {
    if (Array.isArray(obj)) {
      return 'array';
    }
    if (obj instanceof Set) {
      return 'array';
    }
    if (obj instanceof Map) {
      return 'object';
    }
    if (obj === null) {
      return 'null';
    }
    if (t === 'object') {
      return 'object';
    }
  }
  return undefined;
};

export function isPrimitive(type: string | undefined): boolean {
  if (type === undefined) {
    return true;
  }
  return primitives.includes(type);
}
