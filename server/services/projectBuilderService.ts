import { generateFileCode } from "./aiCodeGeneratorService.js";
import { createFolderStructure, createFile } from "./fileSystemService.js";
import pLimit from "p-limit";

export async function generateProject(plan: any, projectId: string) {
  // Prefix folders and files with projectId to isolate projects
  const folders = plan.structure.folders.map((f: string) => `${projectId}/${f}`);
  await createFolderStructure(folders);

  const limit = pLimit(3);

  const generatedFiles = await Promise.all(
    plan.files.map((file: any) =>
      limit(async () => {
        const content = await generateFileCode(file.prompt);
        await createFile(`${projectId}/${file.path}`, content);
        return { path: file.path, content };
      })
    )
  );

  return {
    structure: plan.structure,
    files: generatedFiles,
  };
}
