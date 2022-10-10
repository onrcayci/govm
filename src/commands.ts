import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { promisify } from "util";

import axios, { AxiosResponse } from "axios";

const execCommand = promisify(exec);

export const installCommand = async (goVersion: string): Promise<void> => {
  const filename = `go${goVersion}.${
    process.platform === "win32" ? "windows" : process.platform
  }-${process.arch === "x64" ? "amd64" : process.arch}.tar.gz`;
  console.log("Downloading the tarball.");
  const response: AxiosResponse<Readable> = await axios.get(
    `https://go.dev/dl/${filename}`,
    {
      responseType: "stream",
    }
  );
  await fs.writeFile(filename, response.data);
  console.log("Finished downloading the file.");
  console.log("Extracting the file contents now.");
  await fs.mkdir(path.join(__dirname, `../versions/${goVersion}`), {
    recursive: true,
  });
  const { stderr } = await execCommand(
    `tar -xf ${filename} --directory ${path.join(
      __dirname,
      `../versions/${goVersion}`
    )}`
  );
  if (stderr) {
    throw new Error(stderr);
  }
  console.log("Finished extracting the file contents.");
};
