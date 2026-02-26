/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import WebsiteForm from "./components/WebsiteForm";
import ProjectViewer from "./components/ProjectViewer";

export default function App() {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Building your website...</h2>
        <p className="text-gray-500 text-center max-w-md">
          This may take 30-90 seconds as our AI generates the complete project structure and code.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl max-w-lg w-full shadow-sm text-center">
          <h2 className="text-xl font-semibold mb-4">Error Building Website</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setProject(null);
            }}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Website Builder</h1>
          <p className="text-lg text-gray-600">
            Describe the website you want to build, and our AI will generate a complete, runnable full-stack project in seconds.
          </p>
        </div>
        <WebsiteForm setProject={setProject} setLoading={setLoading} setError={setError} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <ProjectViewer project={project} />
    </div>
  );
}
