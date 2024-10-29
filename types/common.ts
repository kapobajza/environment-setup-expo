export type CamelToPascalCase<TKey extends string> =
  TKey extends `${infer T}${infer U}` ? `${Capitalize<T>}${U}` : never;
