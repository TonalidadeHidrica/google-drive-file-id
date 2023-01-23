import { readFileSync } from "node:fs";
import typescript from "@rollup/plugin-typescript";
import type { RollupOptions } from "rollup";
import cleanup from "rollup-plugin-cleanup";
import watch from "rollup-plugin-watch";
import { stringify } from "userscript-metadata";
import type { Metadata } from "userscript-metadata";
import * as toml from "toml";

const readMetadata = (path: string): Metadata =>
  toml.parse(readFileSync(path, "utf8"));
const rootDir = process.cwd();
const entryPath = "src/main.ts";
const manifestPath = "src/manifest.toml";
const mainScriptPath = "dist/google-drive-file-id.user.js";
const mainScriptUrl = `file://${rootDir}/${mainScriptPath}`;
const devScriptPath = "dist/google-drive-file-id.dev.user.js";
const devify = (metadata: Metadata): Metadata => {
  const requires: string[] = [];

  if (typeof metadata.require === "string") {
    requires.push(metadata.require);
  } else if (Array.isArray(metadata.require)) {
    requires.push(...metadata.require);
  }

  requires.push(mainScriptUrl);
  return {
    ...metadata,
    name: `[dev] ${String(metadata.name)}`,
    require: requires,
  };
};
const mainConfig: RollupOptions = {
  input: entryPath,
  output: {
    file: mainScriptPath,
    format: "iife",
    banner: () => `${stringify(readMetadata(manifestPath))}\n`,
  },
  plugins: [
    typescript(),
    cleanup({
      extensions: ["ts"],
    }),
    watch({
      dir: "src",
    }),
  ],
};
const devConfig: RollupOptions = {
  input: "src/dev.ts",
  output: {
    file: devScriptPath,
    banner: () => `${stringify(devify(readMetadata(manifestPath)))}\n`,
  },
  plugins: [
    typescript(),
    cleanup({
      extensions: ["ts"],
    }),
    watch({
      dir: "src",
    }),
  ],
};

export default [mainConfig, devConfig];
