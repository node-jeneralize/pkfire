declare module 'pkfire' {
  export type ResolvedPromiseType<T extends Promise<unknown>> =
    T extends Promise<infer P> ? P : never;
}
