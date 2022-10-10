import fs from "fs/promises";
import path from "path";

import { downloadGoTarball, extractGoTarball } from "./utils";
import { versions } from "./versions";

export const installCommand = async (goVersion: string): Promise<void> => {
  // Create the tarball name using the version and runtime info
  const filename = `go${goVersion}.${
    process.platform === "win32" ? "windows" : process.platform
  }-${process.arch === "x64" ? "amd64" : process.arch}.tar.gz`;
  console.log("Downloading the tarball.");
  // Download the tarball
  await downloadGoTarball(filename);
  console.log("Finished downloading the file.");
  console.log("Extracting the file contents now.");
  // Extract the tarball
  await extractGoTarball(filename, goVersion);
  console.log("Finished extracting the file contents.");
  // Cleanup the downloaded tarball
  await fs.rm(filename);
};

export const listCommand = () => {
  const versionsString = versions.join("\n");
  console.log(versionsString);
};

export const useCommand = async (goVersion: string) => {
  await fs.symlink(
    path.join(__dirname, `../versions/${goVersion}`),
    path.join(__dirname, `../default`),
    "dir"
  );
};

export const initCommand = () => {
  const initScript = `
export GOROOT="${path.join(__dirname, "../default/go")}"
export PATH="${path.join(__dirname, "../default/go/bin")}:$PATH"`;
  console.log(initScript);
}
