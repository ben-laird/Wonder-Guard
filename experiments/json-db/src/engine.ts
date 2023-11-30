import { Potential, Deferrable } from "lib/resource/mod.ts";

type Result<T> = { success: true; data: T } | { success: false };

type Validator<T> = (data: unknown) => Potential<Result<T>>;

// class Schema<T> {
//   constructor(protected val: Validator<T>) {}

//   async test(data: unknown) {
//     return await this.val(data);
//   }
// }

export class DB<T> {
  protected db: { loaded: true; data: T } | { loaded: false } = {
    loaded: false,
  };

  constructor(
    protected schema: Validator<T>,
    protected loader: Deferrable<T, [schema: Validator<T>]>
  ) {}

  async init(): Promise<Result<T>> {
    const loadedRes = await this.schema(await this.loader.init(this.schema));

    if (loadedRes.success) {
      this.db = { loaded: true, data: loadedRes.data };
    }

    return loadedRes;
  }

  async deInit() {
    if (!this.db.loaded) {
      throw new Error("deInit() was called on an unloaded database!");
    }
    await this.loader.deInit(this.db.data);

    this.db = { loaded: false };
  }
}
