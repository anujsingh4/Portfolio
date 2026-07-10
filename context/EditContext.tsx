"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
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
  addProject: (init?: Partial<Omit<ProjectData, "id" | "pinned">>) => void;
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

function migrate(d: SiteData): SiteData {
  return {
    ...defaultData,
    ...d,
    resumeUrl: d.resumeUrl ?? "",
    projects: (d.projects ?? []).map((p: ProjectData, i: number) => ({
      ...p,
      id: p.id || `project-${Date.now()}-${i}`,
      pinned: p.pinned ?? i < 3,
    })),
  };
}

const LS_DATA_KEY = "portfolio-data";
const LS_TS_KEY = "portfolio-data-ts";

function saveLocal(data: SiteData) {
  try {
    localStorage.setItem(LS_DATA_KEY, JSON.stringify(data));
    localStorage.setItem(LS_TS_KEY, String(Date.now()));
  } catch {}
}

function loadLocal(): { data: SiteData; ts: number } | null {
  try {
    const raw = localStorage.getItem(LS_DATA_KEY);
    if (!raw) return null;
    const ts = parseInt(localStorage.getItem(LS_TS_KEY) || "0", 10);
    return { data: migrate(JSON.parse(raw)), ts };
  } catch {
    return null;
  }
}

async function saveRemote(data: SiteData) {
  try {
    const res = await fetch("/api/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      console.error("[portfolio] remote save failed", res.status, await res.text());
    }
  } catch (err) {
    console.error("[portfolio] remote save error", err);
  }
}

function uniqueId() {
  return `project-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function EditProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(defaultData);
  const [isEditing, setIsEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextSaveRef = useRef(false);

  useEffect(() => {
    async function load() {
      const local = loadLocal();

      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const json = await res.json();
          if (json && json.siteData && json.siteData.hero) {
            const remoteTs = json.updatedAt ? new Date(json.updatedAt).getTime() : 0;

            if (local && local.ts > remoteTs) {
              // localStorage is newer (e.g. unsaved changes before refresh) — use it
              skipNextSaveRef.current = true;
              setData(local.data);
              saveRemote(local.data); // push the newer local data up to Supabase
              setLoaded(true);
              return;
            }

            // Supabase is canonical
            const migrated = migrate(json.siteData);
            skipNextSaveRef.current = true;
            setData(migrated);
            saveLocal(migrated);
            setLoaded(true);
            return;
          }
        }
      } catch {}

      // Supabase unavailable — fall back to localStorage
      if (local) {
        skipNextSaveRef.current = true;
        setData(local.data);
        saveRemote(local.data);
      }
      setLoaded(true);
    }
    load();
  }, []);

  // All saves go through here after initial load
  useEffect(() => {
    if (!loaded) return;
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }
    saveLocal(data);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveRemote(data), 1200);
  }, [data, loaded]);

  const toggleEdit = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
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
      return next as SiteData;
    });
  }, []);

  const togglePin = useCallback((id: string) => {
    setData((prev) => {
      const next = structuredClone(prev);
      const project = next.projects.find((p) => p.id === id);
      if (!project) return prev;
      const pinnedCount = next.projects.filter((p) => p.pinned).length;
      if (!project.pinned && pinnedCount >= 3) return prev;
      project.pinned = !project.pinned;
      return next;
    });
  }, []);

  const addProject = useCallback((init?: Partial<Omit<ProjectData, "id" | "pinned">>) => {
    setData((prev) => {
      const next = structuredClone(prev);
      next.projects.push({
        id: uniqueId(),
        title: "New Project",
        description: "Describe what this project does and what makes it interesting.",
        tech: "Tech · Stack",
        live: "#",
        code: "#",
        pinned: false,
        ...init,
      });
      return next;
    });
  }, []);

  const removeProject = useCallback((id: string) => {
    setData((prev) => {
      const next = structuredClone(prev);
      next.projects = next.projects.filter((p) => p.id !== id);
      return next;
    });
  }, []);

  const addSkillRow = useCallback(() => {
    setData((prev) => {
      const next = structuredClone(prev);
      next.skills.push({ label: "New Category", items: "" });
      return next;
    });
  }, []);

  const removeSkillRow = useCallback((index: number) => {
    setData((prev) => {
      const next = structuredClone(prev);
      next.skills.splice(index, 1);
      return next;
    });
  }, []);

  const setResumeUrl = useCallback((url: string) => {
    setData((prev) => {
      const next = structuredClone(prev);
      next.resumeUrl = url;
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
