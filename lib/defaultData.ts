export interface ProjectData {
  id: string;
  title: string;
  description: string;
  tech: string;
  live: string;
  code: string;
  pinned: boolean;
}

export interface SkillRow {
  label: string;
  items: string;
}

export interface SiteData {
  resumeUrl: string;
  hero: {
    firstName: string;
    lastName: string;
    role: string;
    college: string;
    bio: string;
    githubHandle: string;
    linkedinHandle: string;
    email: string;
  };
  projects: ProjectData[];
  skills: SkillRow[];
  education: {
    text: string;
    year: string;
  };
  contact: {
    line1: string;
    line2: string;
    subtext: string;
  };
}

export const defaultData: SiteData = {
  resumeUrl: "",
  hero: {
    firstName: "Anuj",
    lastName: "Singh.",
    role: "Software Engineer",
    college: "IIIT Nagpur · B.Tech CSE",
    bio: "CS graduate from IIIT Nagpur. I build full-stack products, AI-powered tools, and clean systems that ship. I care about the details.",
    githubHandle: "github.com/anujswork1",
    linkedinHandle: "linkedin.com/in/anujsingh",
    email: "anujswork1@gmail.com",
  },
  projects: [
    {
      id: "splitease",
      title: "SplitEase",
      description:
        "Full-stack expense-sharing platform. Built a greedy settlement engine (O(n log n)) that minimises the number of transactions in a group. Integrated SplitBot — a Gemini-powered chatbot that reads live group balances and answers questions in plain English.",
      tech: "Django · Python · PostgreSQL · Gemini API",
      live: "#",
      code: "#",
      pinned: true,
    },
    {
      id: "paperchat",
      title: "PaperChat",
      description:
        "Production-grade RAG assistant for PDF/DOCX documents. Uses MD5 deduplication, Cohere Embed v3 embeddings in Pinecone, and MMR retrieval to cut redundant context. Real-time streaming via SSE. Custom LLM-as-judge eval scored 0.86.",
      tech: "FastAPI · React · Pinecone · Groq LLaMA 3.3 70B · Cohere",
      live: "#",
      code: "#",
      pinned: true,
    },
    {
      id: "ai-resume",
      title: "AI Resume Analyser",
      description:
        "Parses uploaded PDF resumes and returns structured, actionable feedback via GPT-4o-mini. Persists every analysis in PostgreSQL so users can diff improvements across versions. Deployed on Vercel + Render.",
      tech: "React · Node.js · PostgreSQL · OpenAI GPT-4o-mini",
      live: "#",
      code: "#",
      pinned: true,
    },
  ],
  skills: [
    { label: "Languages", items: "Java · Python · C++ · JavaScript (ES6+)" },
    {
      label: "Frameworks",
      items: "React · Next.js · Django · FastAPI · Node.js · Express · Celery",
    },
    { label: "Databases", items: "PostgreSQL · MySQL · MongoDB · Redis" },
    { label: "Tools", items: "Docker · Git · Postman · Tailwind CSS" },
  ],
  education: {
    text: "B.Tech Computer Science & Engineering — IIIT Nagpur",
    year: "Graduated May 2026",
  },
  contact: {
    line1: "Let's build",
    line2: "something good.",
    subtext:
      "Open to full-time roles and interesting projects. Drop me a line — I'll reply within a day.",
  },
};
