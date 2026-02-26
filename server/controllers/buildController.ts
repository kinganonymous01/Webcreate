import { planProject } from "../services/aiPlannerService.js";
import { generateProject } from "../services/projectBuilderService.js";
import { ProjectModel } from "../models/Project.js";

export async function buildWebsite(req: any, res: any, next: any) {
  try {
    const { name, type, features, styling } = req.body;

    if (!name) return res.status(400).json({ success: false, message: "name is required" });
    if (!type) return res.status(400).json({ success: false, message: "type is required" });
    if (!features) return res.status(400).json({ success: false, message: "features is required" });
    if (!Array.isArray(features)) return res.status(400).json({ success: false, message: "features must be an array" });

    const requirements = { name, type, features, styling };
    const plan = await planProject(requirements);

    const projectId = Math.random().toString(36).substring(2, 15);
    const result = await generateProject(plan, projectId);

    const projectData = {
      id: projectId,
      name,
      requirements,
      structure: result.structure,
      files: result.files,
    };

    ProjectModel.save(projectData);

    res.status(200).json({
      success: true,
      projectId: projectData.id,
      structure: result.structure,
      files: result.files,
    });
  } catch (error) {
    next(error);
  }
}
