import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "projects.db");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    requirements TEXT NOT NULL,
    structure TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS project_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id TEXT NOT NULL,
    path TEXT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY(project_id) REFERENCES projects(id)
  );
`);

export interface ProjectData {
  id: string;
  name: string;
  requirements: any;
  structure: any;
  files: { path: string; content: string }[];
}

export const ProjectModel = {
  save: (project: ProjectData) => {
    const insertProject = db.prepare(
      "INSERT INTO projects (id, name, requirements, structure) VALUES (?, ?, ?, ?)"
    );
    const insertFile = db.prepare(
      "INSERT INTO project_files (project_id, path, content) VALUES (?, ?, ?)"
    );

    const transaction = db.transaction((p: ProjectData) => {
      insertProject.run(
        p.id,
        p.name,
        JSON.stringify(p.requirements),
        JSON.stringify(p.structure)
      );
      for (const file of p.files) {
        insertFile.run(p.id, file.path, file.content);
      }
    });

    transaction(project);
  },
  getById: (id: string): ProjectData | null => {
    const projectRow = db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as any;
    if (!projectRow) return null;

    const fileRows = db.prepare("SELECT path, content FROM project_files WHERE project_id = ?").all(id) as any[];

    return {
      id: projectRow.id,
      name: projectRow.name,
      requirements: JSON.parse(projectRow.requirements),
      structure: JSON.parse(projectRow.structure),
      files: fileRows,
    };
  }
};
