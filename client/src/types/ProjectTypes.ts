export interface ProjectImage {
    before: string; // The path/URL from the server, e.g., 'uploads/filename.jpg'
    cad: string;
    after: string;
}

export interface Project {
    showOnHome: any;
    _id: string;
    title: string;
    description: string;
    location: string;
    images: ProjectImage;
    dateCreated: string; // ISO date string
}