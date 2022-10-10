#! /usr/bin/env node
import yargs from "yargs";

import { installCommand } from "./commands";

yargs.scriptName("govm");

yargs.command(
  "install",
  "Install the specified version of Go.",
  () =>
    yargs.options({
      "go-version": { alias: "v", string: true, demandOption: true },
    }),
  async (args) => {
    try {
      await installCommand(args.goVersion);
    } catch (err) {
      if (err instanceof Error) {
        yargs.exit(1, err);
      }
    }
  }
);

yargs.parse();
