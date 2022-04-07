
export default function type(obj: any): string | undefined {
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
