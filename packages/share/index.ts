export function isObject(target: unknown): boolean {
  return target !== null && typeof target === "object";
}
