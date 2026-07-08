export type ExtractionStatus = "PENDING" | "PROCESSING" | "DONE" | "FAILED";

export interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
}

export interface ExperienceEntry {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface ProjectEntry {
  name: string;
  description: string;
}

export interface ParsedResumeData {
  name: string | null;
  email: string | null;
  phone: string | null;
  education: EducationEntry[];
  skills: string[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  certifications: string[];
  cgpa: string | null;
  languages: string[];
  frameworks: string[];
}

export interface Resume {
  id: number;
  original_filename: string;
  file_url: string | null;
  uploaded_at: string;
  extraction_status: ExtractionStatus;
  extraction_error: string;
  parsed_data: ParsedResumeData | null;
}
