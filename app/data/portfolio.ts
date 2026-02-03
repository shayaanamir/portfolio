export interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    tech: string[];
    link?: string;
}

export interface PersonaData {
    name: string;
    title: string;
    level: number;
    arcana: string;
    about: string;
    projects: Project[];
    skills: { name: string; power: number }[];
}

export const PORTFOLIO_DATA: PersonaData = {
    name: "Shayaan Amir", // Replace with User's Name
    title: "Full Stack Developer",
    level: 99,
    arcana: "The Fool",
    about: "A developer who seeks to change the hearts of users through intuitive and stylish interfaces. Specializes in modern web technologies and 3D experiences.",
    projects: [
        {
            id: "p1",
            title: "Metaverse Navigator",
            category: "Web App",
            description: "A navigation app for the cognitive world using Next.js and Mapbox.",
            tech: ["Next.js", "React", "Mapbox"],
        },
        {
            id: "p2",
            title: "Phantom Thieves Site",
            category: "Social",
            description: "Fan site with anonymous polling features.",
            tech: ["Node.js", "Express", "MongoDB"],
        },
        {
            id: "p3",
            title: "LeBlanc Coffee",
            category: "E-commerce",
            description: "Ordering system for a local coffee shop.",
            tech: ["Shopify", "Liquid"],
        }
    ],
    skills: [
        { name: "React", power: 90 },
        { name: "TypeScript", power: 85 },
        { name: "Three.js", power: 70 },
        { name: "Node.js", power: 80 }
    ]
};
