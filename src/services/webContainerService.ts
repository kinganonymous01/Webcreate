import { WebContainer, WebContainerProcess } from "@webcontainer/api";

let bootPromise: Promise<WebContainer> | null = null;
let devProcess: WebContainerProcess | null = null;
let isStarting = false;

export async function startContainer(project: any, setStatus: (status: string) => void): Promise<string> {
  if (isStarting) {
    throw new Error("Container is already starting. Please wait.");
  }
  isStarting = true;

  try {
    if (!bootPromise) {
      setStatus("Booting WebContainer...");
      bootPromise = WebContainer.boot();
    }

    const webcontainerInstance = await bootPromise;

    if (devProcess) {
      devProcess.kill();
      devProcess = null;
    }

    setStatus("Mounting files...");

    const mountStructure: any = {};

    for (const file of project.files) {
      const parts = file.path.split("/");
      const fileName = parts[parts.length - 1];
      const folders = parts.slice(0, -1);

      let current = mountStructure;

      for (const folder of folders) {
        if (!current[folder]) {
          current[folder] = { directory: {} };
        }
        current = current[folder].directory;
      }

      current[fileName] = { file: { contents: file.content } };
    }

    await webcontainerInstance.mount(mountStructure);

    setStatus("Validating package.json...");

    const pkgRaw = await webcontainerInstance.fs.readFile("package.json", "utf-8");
    const pkg = JSON.parse(pkgRaw);

    if (!pkg.scripts || !pkg.scripts.dev) {
      throw new Error("Generated package.json is missing dev script. Cannot start server.");
    }

    setStatus("Installing dependencies...");

    const installProcess = await webcontainerInstance.spawn("npm", ["install"]);
    const exitCode = await installProcess.exit;

    if (exitCode !== 0) {
      throw new Error("npm install failed inside WebContainer");
    }

    setStatus("Starting dev server...");

    devProcess = await webcontainerInstance.spawn("npm", ["run", "dev"]);

    return await new Promise((resolve, reject) => {
      const unsubscribe = webcontainerInstance!.on("server-ready", (port, url) => {
        unsubscribe();
        resolve(url);
      });

      setTimeout(() => {
        unsubscribe();
        reject(new Error("Server did not start within 30 seconds"));
      }, 30000);
    });
  } finally {
    isStarting = false;
  }
}
