"use client";

import React, { useState } from "react";

export default function LeafletGeneratorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setPdfUrl(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPdfUrl(null);

    if (!file) {
      setError("Please select a Word (.docx) file.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/image/generate-leaflet-from-docx", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to generate leaflet.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Generate Patient Leaflet from Word File</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          className="block"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Leaflet"}
        </button>
      </form>
      {error && <div className="mt-4 text-red-600">{error}</div>}
      {pdfUrl && (
        <div className="mt-6">
          <a
            href={pdfUrl}
            download="leaflet.pdf"
            className="text-blue-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Leaflet PDF
          </a>
          <div className="mt-4">
            <iframe src={pdfUrl} width="100%" height="600px" title="Leaflet PDF Preview" />
          </div>
        </div>
      )}
    </div>
  );
}