import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { promisify } from "util";

import axios, { AxiosResponse } from "axios";

const GO_DOWNLOAD_URL = "https://go.dev/dl";
const VERSIONS_DIR = path.join(__dirname, "../versions");
const CACHE_DIR = path.join(__dirname, "../cache");

// Promisify the exec command from the child_process module
const execCommand = promisify(exec);

export const downloadGoTarball = async (tarballName: string): Promise<void> => {
  // Set the response type to stream for more efficient memory usage during the download
  const res: AxiosResponse<Readable | string> = await axios.get(
    `${GO_DOWNLOAD_URL}/${tarballName}`,
    { responseType: "stream" }
  );
  // Check the status code of the response for errors
  if (res.status !== 200) {
    throw new Error(
      `Download failed with the following status code: ${res.status}`
    );
  }
  // Create the cache directory if it does not exist
  await createFolderIfMissing(CACHE_DIR);
  // Write the data received to a local cache
  await fs.writeFile(path.join(CACHE_DIR, tarballName), res.data);
};

export const extractGoTarball = async (
  tarballName: string,
  tarballVersion: string
): Promise<void> => {
  const extractDir = path.join(VERSIONS_DIR, tarballVersion);
  // Create the extract directory if it does not exist
  await createFolderIfMissing(extractDir);
  // Extract the tarball by spawning a child shell process
  const { stderr } = await execCommand(
    `tar -xf ${path.join(CACHE_DIR, tarballName)} --directory ${extractDir}`
  );
  // Check if any error is raised by the extract command
  if (stderr) {
    throw new Error(stderr);
  }
};

const createFolderIfMissing = async (folder: string): Promise<void> => {
  try {
    // Check if the directory exists
    await fs.access(folder);
  } catch {
    // If the directory does not exist, create it
    await fs.mkdir(folder, {
      recursive: true,
    });
  }
};
