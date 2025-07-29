/**
 * Returns a shallow copy of the object with the specified fields omitted.
 * @param obj The source object
 * @param fields Array of field names to omit
 */
export function omitFields<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  fields: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const field of fields) {
    delete result[field];
  }
  return result;
}
