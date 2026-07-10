"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { defaultData, SiteData, ProjectData } from "@/lib/defaultData";

interface EditContextType {
  data: SiteData;
  isEditing: boolean;
  toggleEdit: () => void;
  updateField: (path: string, value: string) => void;
  togglePin: (id: string) => void;
  addProject: () => void;
  removeProject: (id: string) => void;
  addSkillRow: () => void;
  removeSkillRow: (index: number) => void;
  setResumeUrl: (url: string) => void;
}

const EditContext = createContext<EditContextType>({
  data: defaultData,
  isEditing: false,
  toggleEdit: () => {},
  updateField: () => {},
  togglePin: () => {},
  addProject: () => {},
  removeProject: () => {},
  addSkillRow: () => {},
  removeSkillRow: () => {},
  setResumeUrl: () => {},
});

function save(data: SiteData) {
  try {
    localStorage.setItem("portfolio-data", JSON.stringify(data));
  } catch {}
}

// Migrate old data that might be missing id/pinned fields
function migrate(data: SiteData): SiteData {
  return {
    ...data,
    projects: data.projects.map((p: ProjectData, i: number) => ({
      ...p,
      id: p.id || `project-${Date.now()}-${i}`,
      pinned: p.pinned ?? i < 3,
    })),
  };
}

export function EditProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(defaultData);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("portfolio-data");
      if (saved) setData(migrate(JSON.parse(saved)));
    } catch {}
  }, []);

  const toggleEdit = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setIsEditing((e) => !e);
  }, []);

  const updateField = useCallback((path: string, value: string) => {
    setData((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const next = structuredClone(prev) as any;
      const parts = path.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: any = next;
      for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
      obj[parts[parts.length - 1]] = value;
      save(next);
      return next as SiteData;
    });
  }, []);

  const togglePin = useCallback((id: string) => {
    setData((prev) => {
      const next = structuredClone(prev);
      const project = next.projects.find((p) => p.id === id);
      if (!project) return prev;
      const pinnedCount = next.projects.filter((p) => p.pinned).length;
      if (!project.pinned && pinnedCount >= 3) return prev; // max 3
      project.pinned = !project.pinned;
      save(next);
      return next;
    });
  }, []);

  const addProject = useCallback(() => {
    setData((prev) => {
      const next = structuredClone(prev);
      next.projects.push({
        id: `project-${Date.now()}`,
        title: "New Project",
        description: "Describe what this project does and what makes it interesting.",
        tech: "Tech · Stack",
        live: "#",
        code: "#",
        pinned: false,
      });
      save(next);
      return next;
    });
  }, []);

  const removeProject = useCallback((id: string) => {
    setData((prev) => {
      const next = structuredClone(prev);
      next.projects = next.projects.filter((p) => p.id !== id);
      save(next);
      return next;
    });
  }, []);

  const addSkillRow = useCallback(() => {
    setData((prev) => {
      const next = structuredClone(prev);
      next.skills.push({ label: "New Category", items: "" });
      save(next);
      return next;
    });
  }, []);

  const removeSkillRow = useCallback((index: number) => {
    setData((prev) => {
      const next = structuredClone(prev);
      next.skills.splice(index, 1);
      save(next);
      return next;
    });
  }, []);

  const setResumeUrl = useCallback((url: string) => {
    setData((prev) => {
      const next = structuredClone(prev);
      next.resumeUrl = url;
      save(next);
      return next;
    });
  }, []);

  return (
    <EditContext.Provider
      value={{ data, isEditing, toggleEdit, updateField, togglePin, addProject, removeProject, addSkillRow, removeSkillRow, setResumeUrl }}
    >
      {children}
    </EditContext.Provider>
  );
}

export const useEdit = () => useContext(EditContext);
