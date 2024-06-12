export function warn(message: string) {
  const err = new Error(message);
  console.error(message);
  throw err;
}
