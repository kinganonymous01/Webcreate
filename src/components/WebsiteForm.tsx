import React, { useState } from "react";
import { planProject } from "../services/aiPlannerService.js";
import { generateFileCode } from "../services/aiCodeGeneratorService.js";
import pLimit from "p-limit";

export default function WebsiteForm({ setProject, setLoading, setError }: any) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    features: "",
    styling: "",
  });

  function handleChange(e: any) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    console.log("API Key being used:", process.env.GEMINI_API_KEY?.substring(0, 10) + "...");

    if (!formData.name) {
      alert("Project name is required");
      return;
    }
    if (!formData.type) {
      alert("Website type is required");
      return;
    }

    const featuresArray = formData.features
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f !== "");

    const requirements = {
      name: formData.name,
      type: formData.type,
      features: featuresArray,
      styling: formData.styling,
    };

    setLoading(true);
    setError(null);

    try {
      // 1. Plan Project
      const plan = await planProject(requirements);

      // 2. Generate Files
      const limit = pLimit(3);
      const generatedFiles = await Promise.all(
        plan.files.map((file: any) =>
          limit(async () => {
            const content = await generateFileCode(file.prompt);
            return { path: file.path, content };
          })
        )
      );

      const projectData = {
        name: requirements.name,
        requirements,
        structure: plan.structure,
        files: generatedFiles,
      };

      setProject(projectData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Build Your Website</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="My Portfolio"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="e-commerce, portfolio, blog..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
          <input
            type="text"
            name="features"
            value={formData.features}
            onChange={handleChange}
            placeholder="auth, payments, dashboard"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Styling Preference</label>
          <input
            type="text"
            name="styling"
            value={formData.styling}
            onChange={handleChange}
            placeholder="minimal, dark, colorful..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Build My Website
        </button>
      </form>
    </div>
  );
}
