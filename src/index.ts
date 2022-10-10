#! /usr/bin/env node
import yargs from "yargs";

import {
  initCommand,
  installCommand,
  listCommand,
  useCommand,
} from "./commands";

// Set the script name to a fixed one
yargs.scriptName("govm");

// Implement the install command
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

// Implement the list command
yargs.command(
  "list",
  "List the Go versions that can be installed.",
  () => {},
  () => {
    listCommand();
  }
);

// Implement the use command
yargs.command(
  "use",
  "Use the specified version of Go.",
  () =>
    yargs.options({
      goVersion: { alias: "v", string: true, demandOption: true },
    }),
  async (args) => {
    await useCommand(args.goVersion);
  }
);

// Implement the init command
yargs.command(
  "init",
  "Prepare the shell in order to use the Go version that is installed by govm.",
  () => {},
  () => {
    initCommand();
  }
);

// Call the parse function
yargs.parse();
