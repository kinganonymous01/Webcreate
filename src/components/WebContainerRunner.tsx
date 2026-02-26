import React, { useState, useEffect, useRef } from "react";
import { startContainer } from "../services/webContainerService.js";

export default function WebContainerRunner({ project }: { project: any }) {
  const [status, setStatus] = useState("Booting WebContainer...");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const bootStarted = useRef(false);

  useEffect(() => {
    if (!window.crossOriginIsolated) {
      setError(
        <div className="text-center">
          <p className="mb-4">
            WebContainers require Cross-Origin Isolation to run. Because this app is currently being previewed inside an iframe without the required permissions, it cannot start the container.
          </p>
          <a
            href={window.location.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Open App in New Tab
          </a>
        </div>
      );
      return;
    }

    if (bootStarted.current) return;
    bootStarted.current = true;

    async function boot() {
      try {
        const url = await startContainer(project, setStatus);
        setPreviewUrl(url);
      } catch (err: any) {
        setError(<p className="font-medium">Error: {err.message}</p>);
      }
    }

    boot();
  }, [project]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50 text-red-600 p-6 rounded-lg">
        {error}
      </div>
    );
  }

  if (!previewUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-200">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">{status}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="ml-4 bg-white px-3 py-1 rounded text-xs text-gray-500 flex-1 truncate max-w-md border border-gray-200">
          {previewUrl}
        </div>
      </div>
      <iframe
        ref={iframeRef}
        src={previewUrl}
        className="w-full h-[calc(100%-40px)]"
        title="WebContainer Preview"
        allow="cross-origin-isolated"
      />
    </div>
  );
}
