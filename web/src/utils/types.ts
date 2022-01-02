export const isObject = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null;

export const hasStringProp = <
  Obj extends Record<string, unknown>,
  Prop extends string
>(
  x: Obj,
  prop: Prop
): x is Obj & Record<Prop, string> =>
  typeof (x as Record<Prop, unknown>)[prop] === "string";

export const hasObjectProp = <
  Obj extends Record<string, unknown>,
  Prop extends string
>(
  x: Obj,
  prop: Prop
): x is Obj & Record<Prop, Record<string, unknown>> =>
  isObject((x as Record<Prop, unknown>)[prop]);

export type ReturnPromiseType<F extends (...args: any) => any> =
  ReturnType<F> extends Promise<infer T> ? T : never;
