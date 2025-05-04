export type CnabRowProperties = [number, number, object?];

type RecursiveCnabStructure<
  T extends Record<K, unknown>,
  K extends keyof T,
> = T[K] extends object
  ? {
      [key in keyof T[K]]: T[K] extends object
        ? RecursiveCnabStructure<T[K], key>
        : CnabRowProperties;
    }
  : CnabRowProperties;

export type CnabRegisterStructure<T extends object | string = object> = {
  [key in keyof T]: RecursiveCnabStructure<T, key>;
};
