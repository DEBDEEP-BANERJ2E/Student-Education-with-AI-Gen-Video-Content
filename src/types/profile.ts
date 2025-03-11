export interface Education {
  degree: string;
  institution: string;
  year: string;
  specialization: string;
  gpa?: number;
  certifications?: string[];
}

export interface WorkExperience {
  title: string;
  company: string;
  industry: string;
  duration: string;
  description: string;
  responsibilities: string[];
  type: 'full-time' | 'part-time' | 'freelance' | 'remote';
}

export interface Project {
  title: string;
  type: 'individual' | 'team';
  description: string;
  outcome: string;
  technologies: string[];
  url?: string;
  verified: boolean;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  url?: string;
  verified: boolean;
}

export interface Skills {
  technical: string[];
  soft: string[];
  languages: string[];
}

export interface ProfileData {
  id: string;
  name: string | null;
  points: number;
  title: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  about: string | null;
  verified: boolean;
  age: number | null;
  gender: string | null;
  work_environment: 'remote' | 'hybrid' | 'in-office';
  education: Education[];
  experience: WorkExperience[];
  skills: Skills;
  projects: Project[];
  certifications: Certification[];
  created_at: string;
  updated_at: string;
}