export function structurePromptTemplate(requirements: any) {
  return `You are an expert software architect.

The user wants to build: ${requirements.type}
Project name:            ${requirements.name}
Features required:       ${requirements.features.join(", ")}
Styling preference:      ${requirements.styling}

Return ONLY a valid raw JSON object.
No explanation. No markdown. No code fences.
Response must start with { and end with }

The JSON must follow this EXACT shape:
{
  "structure": {
    "folders": [ "array of all folder path strings" ],
    "description": "string"
  },
  "files": [
    {
      "path": "relative file path string",
      "prompt": "detailed code generation prompt for this file"
    }
  ]
}

Rules:
- Use React + Vite for frontend
- Use Tailwind CSS for styling
- Every file must have a clear specific prompt
- files array MUST include a package.json at root
- package.json prompt MUST instruct to include:
  scripts: { "dev": "vite" }
- Return nothing except the raw JSON object`;
}
