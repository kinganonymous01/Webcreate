import fs from "fs/promises";
import path from "path";

const BASE_OUTPUT_DIR = path.resolve(process.cwd(), "generated-projects");

function sanitizePath(filePath: string) {
  const resolved = path.join(BASE_OUTPUT_DIR, filePath);
  if (!resolved.startsWith(BASE_OUTPUT_DIR)) {
    throw new Error("Invalid file path detected: " + filePath);
  }
  return resolved;
}

export async function createFolderStructure(folders: string[]) {
  for (const folder of folders) {
    const safePath = sanitizePath(folder);
    await fs.mkdir(safePath, { recursive: true });
  }
}

export async function createFile(filePath: string, content: string) {
  const safePath = sanitizePath(filePath);
  await fs.mkdir(path.dirname(safePath), { recursive: true });
  await fs.writeFile(safePath, content, "utf-8");
}
