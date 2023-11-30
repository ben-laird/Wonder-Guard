// deno-lint-ignore-file no-explicit-any ban-types
export type ThisLike<T> = T & ThisType<T>;

export type Potential<T> = T | Promise<T>;

export type PotentialThunk<T> = T | (() => Potential<T>);

export type MaybeEvaluate<T> = T | (() => T);

export type PotentialFunction<T, U extends unknown[] = []> = (
  ...params: U
) => Potential<T>;

export type Action<T, U, V extends unknown[] = []> = PotentialFunction<
  U,
  [resource: T, ...params: V]
>;

export type InferAction<T extends Action<unknown, unknown, unknown[]>> =
  T extends Action<any, infer U> ? U : never;

export type TupLike<T> = [T, ...T[]] | T[];

export type InferAllActions<
  T extends TupLike<Action<any, unknown, unknown[]>>,
  U extends "all" | "settled"
> = {
  all: {
    [I in keyof T]: InferAction<T[I]>;
  };
  settled: {
    [I in keyof T]: PromiseSettledResult<InferAction<T[I]>>;
  };
}[U];

type BatchQuery<T, V extends "all" | "settled"> = <
  U extends TupLike<Action<T, unknown>>
>(
  actions: U
) => Promise<InferAllActions<U, V>>;

export interface Query<T> {
  <U>(action: Action<T, U>): Promise<U>;
  all: BatchQuery<T, "all">;
  allSettled: BatchQuery<T, "settled">;
}

export type Discriminant = { [K in symbol]: never };

export type Base = [root: unknown[], params: Record<string, unknown[]>];

export type Loop = [root: Loop, params: Record<string, unknown[]>];

export type Append<
  T extends Base | Loop,
  U extends Record<string, unknown[]>
> = T extends [infer V extends Base, infer W]
  ? Append<V, W & U>
  : T extends Array<infer V> ? [Exclude<V, {}>, U] : never;
