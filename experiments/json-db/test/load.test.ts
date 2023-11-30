import { Resource } from "lib/resource/mod.ts";

Deno.test({
  name: "Load JSON",
  async fn() {
    const url = new URL("../db/dev.json", import.meta.url);

    const Re = new Resource({
      async init({ filePath }: { filePath: string | URL }) {
        return {
          filePath,
          data: JSON.parse(await Deno.readTextFile(url)),
        };
      },
      async deInit({ filePath, data }) {
        await Deno.writeTextFile(filePath, JSON.stringify(data));
      },
    });

    const querier = Re.query({ init: [{ filePath: url }], deInit: [] });

    const res = await querier(({ filePath, data }) => {
      console.log(`Loaded file at path ${filePath}`);
      data.memes = "hola";
      return data;
    });

    console.log(res);
  },
});
