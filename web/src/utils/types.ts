export const isObject = (x: unknown): x is object =>
  typeof x === "object" && x !== null;

export const hasStringProp = <Prop extends string>(
  x: object,
  prop: Prop
): x is object & Record<Prop, string> =>
  typeof (x as Record<Prop, unknown>)[prop] === "string";

export const hasObjectProp = <Prop extends string>(
  x: object,
  prop: Prop
): x is object & Record<Prop, object> =>
  isObject((x as Record<Prop, unknown>)[prop]);
