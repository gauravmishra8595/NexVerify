"use client";

import { useEffect, useRef, useState } from "react";
import { uploadResume, fetchMyResume } from "@/services/resume";
import type { Resume } from "@/types/resume";
import { UploadCloud, FileText, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Starfield from "@/components/ui-custom/Starfield";

const ACCEPTED_EXTENSIONS = [".pdf", ".docx"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

function validateFileClientSide(file: File): string | null {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();

  if (!ACCEPTED_EXTENSIONS.includes(ext)) {
    return "Only PDF and DOCX files are supported.";
  }

  if (file.size > MAX_SIZE_BYTES) {
    return "File is too large. Maximum size is 5MB.";
  }

  return null;
}

function Tag({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "purple" }) {
  const toneClass =
    tone === "purple"
      ? "bg-purple-500/10 text-purple-300"
      : "bg-blue-500/10 text-blue-300";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${toneClass}`}>{children}</span>
  );
}

function FieldCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-200">{value}</p>
    </div>
  );
}

function ParsedDataView({ resume }: { resume: Resume }) {
  const data = resume.parsed_data;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <FieldCard label="Name" value={data.name || "Not found"} />
        <FieldCard label="CGPA" value={data.cgpa || "Not found"} />
      </div>

      {data.skills.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Skills</p>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </div>
        </div>
      )}

      {data.frameworks.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Frameworks</p>
          <div className="flex flex-wrap gap-2">
            {data.frameworks.map((fw) => (
              <Tag key={fw} tone="purple">{fw}</Tag>
            ))}
          </div>
        </div>
      )}

      {data.education.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Education</p>
          <div className="space-y-2">
            {data.education.map((edu, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-[#111827] p-4 text-sm">
                <p className="font-medium text-slate-100">{edu.degree}</p>
                <p className="text-slate-500">
                  {edu.institution} {edu.year && `· ${edu.year}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.experience.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Experience</p>
          <div className="space-y-2">
            {data.experience.map((exp, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-[#111827] p-4 text-sm">
                <p className="font-medium text-slate-100">
                  {exp.title} {exp.company && `· ${exp.company}`}
                </p>
                {exp.duration && (
                  <p className="font-[family-name:--font-geist-mono] text-xs text-slate-500">{exp.duration}</p>
                )}
                {exp.description && <p className="mt-1.5 text-slate-400">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.projects.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Projects</p>
          <div className="space-y-2">
            {data.projects.map((proj, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-[#111827] p-4 text-sm">
                <p className="font-medium text-slate-100">{proj.name}</p>
                {proj.description && <p className="mt-1.5 text-slate-400">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.certifications.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Certifications</p>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
            {data.certifications.map((cert, i) => (
              <li key={i}>{cert}</li>
            ))}
          </ul>
        </div>
      )}

      {data.languages.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Languages</p>
          <p className="text-sm text-slate-300">{data.languages.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

export default function ResumeUpload() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMyResume()
      .then(setResume)
      .catch(() => {
        // 404 just means no resume yet - not an error state to show.
      })
      .finally(() => setCheckingExisting(false));
  }, []);

  const handleFile = async (file: File) => {
    const clientError = validateFileClientSide(file);
    if (clientError) {
      setError(clientError);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const result = await uploadResume(file);
      setResume(result);
    } catch (err: any) {
      const backendError = err?.response?.data?.error;
      setError(backendError || "Couldn't upload your resume. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  if (checkingExisting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111827]">
        <p className="text-sm text-slate-400">Checking for an existing resume...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#111827] p-6">
      <Starfield density="sparse" />
      <div className="relative mx-auto max-w-2xl py-12">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white">Resume upload</h1>
          <p className="mt-2 text-sm text-slate-400">
            Upload your resume as PDF or DOCX. We&apos;ll extract your skills,
            education, experience, and projects automatically.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mb-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition ${
            dragOver
              ? "border-amber-500/50 bg-amber-500/5"
              : "border-white/10 bg-[#1E2640] hover:border-white/20"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-amber-400" />
              <p className="text-sm text-slate-300">Extracting and analyzing your resume...</p>
              <p className="mt-1 text-xs text-slate-500">This can take a few seconds.</p>
            </>
          ) : (
            <>
              <UploadCloud className="mb-3 h-8 w-8 text-slate-500" />
              <p className="text-sm font-medium text-slate-200">
                Drag and drop your resume, or click to browse
              </p>
              <p className="mt-1 text-xs text-slate-500">PDF or DOCX, up to 5MB</p>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
        </div>

        {resume && (
          <div className="rounded-2xl border border-white/10 bg-[#1E2640] p-6">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-200">{resume.original_filename}</span>
              </div>

              {resume.extraction_status === "DONE" && (
                <span className="flex items-center gap-1 text-xs font-medium text-amber-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Analyzed
                </span>
              )}
              {resume.extraction_status === "FAILED" && (
                <span className="flex items-center gap-1 text-xs font-medium text-red-400">
                  <XCircle className="h-3.5 w-3.5" /> Failed
                </span>
              )}
              {(resume.extraction_status === "PENDING" || resume.extraction_status === "PROCESSING") && (
                <span className="flex items-center gap-1 text-xs font-medium text-amber-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing
                </span>
              )}
            </div>

            {resume.extraction_status === "FAILED" && (
              <p className="text-sm text-red-300">{resume.extraction_error}</p>
            )}

            {resume.extraction_status === "DONE" && <ParsedDataView resume={resume} />}
          </div>
        )}

        {resume?.extraction_status === "DONE" && (
          <div className="mt-6 flex justify-center">
            <a
              href="/analysis"
              className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-medium text-[#111827] hover:bg-amber-400"
            >
              Continue to AI Analysis
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
