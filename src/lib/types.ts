export type CamelCase<S extends string> =
  S extends `${infer P1}_${infer P2}${infer P3}`
    ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
    : Lowercase<S>

export type CamelCaseKeys<T extends Record<string, any>> = {
  // for each key in T, if the key is a string, convert it to camelCase
  [K in keyof T as CamelCase<K & string>]: T[K]
}
