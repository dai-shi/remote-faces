export const isObject = (x: unknown): x is object =>
  typeof x === "object" && x !== null;
