import React, { createContext, useContext, useCallback } from 'react';
import { DEFAULT_PROJECTS, ProjectCase } from '../data/projects';

interface ProjectsContextValue {
  projects: ProjectCase[];
  getProjectBySlug: (slug: string) => ProjectCase | undefined;
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const projects = DEFAULT_PROJECTS;

  const getProjectBySlug = useCallback(
    (slug: string) => projects.find((p) => p.slug === slug),
    [projects]
  );

  return (
    <ProjectsContext.Provider value={{ projects, getProjectBySlug }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error('useProjects must be used inside ProjectsProvider');
  return ctx;
}
