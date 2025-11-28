import type { ReactNode } from "react";

export interface ProjectImage {
    length: ReactNode;
    before: string; // The path/URL from the server, e.g., 'uploads/filename.jpg'
    cad: string;
    after: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  location: string;
  showOnHome: boolean;
  images: string[]; // ✅ MUST be array
  dateCreated: string;
}
