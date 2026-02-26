import React, { useState } from "react";
import WebContainerRunner from "./WebContainerRunner.jsx";
import { FileCode, Play, Terminal } from "lucide-react";

export default function ProjectViewer({ project }: { project: any }) {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [showContainer, setShowContainer] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{project.structure.description || "Generated Project"}</h2>
          <p className="text-sm text-gray-500 mt-1">Files generated: {project.files.length}</p>
        </div>
        <button
          onClick={() => setShowContainer(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          <Play size={18} />
          Run Project
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - File Tree */}
        <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Files</h3>
          <ul className="space-y-1">
            {project.files.map((file: any, index: number) => (
              <li key={index}>
                <button
                  onClick={() => {
                    setSelectedFile(file);
                    setShowContainer(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors ${
                    selectedFile?.path === file.path
                      ? "bg-indigo-100 text-indigo-700 font-medium"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FileCode size={16} className={selectedFile?.path === file.path ? "text-indigo-600" : "text-gray-400"} />
                  <span className="truncate">{file.path}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Panel - Code Viewer or Runner */}
        <div className="flex-1 bg-[#1e1e1e] overflow-hidden flex flex-col">
          {showContainer ? (
            <div className="flex-1 p-4 bg-gray-50">
              <WebContainerRunner project={project} />
            </div>
          ) : selectedFile ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-[#404040]">
                <Terminal size={16} className="text-gray-400" />
                <span className="text-gray-300 text-sm font-mono">{selectedFile.path}</span>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <pre className="text-gray-300 font-mono text-sm leading-relaxed">
                  <code>{selectedFile.content}</code>
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FileCode size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a file to view its code</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
