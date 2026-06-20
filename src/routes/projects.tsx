import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useConvexAuth } from "convex/react";
import { ArrowRight, FolderKanban, Loader2, Plus } from "lucide-react";
import { useEffect } from "react";
import { api } from "~/convex/_generated/api";
import type { Doc } from "~/convex/_generated/dataModel";
import {
  projectStatusLabels,
  projectStatusStyles,
  type ProjectStatus,
} from "@/project-status";

export const Route = createFileRoute("/projects")({
  component: ProjectsIndex,
  beforeLoad: () => ({
    title: "Projets - Miso GTM",
  }),
});

function ProjectsIndex() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    ...convexQuery(api.projects.listProjects, {}),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void navigate({ to: "/login" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !isAuthenticated || isProjectsLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-neutral-50 text-neutral-950">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
      </main>
    );
  }

  const projectList = (projects ?? []) as Array<Doc<"projects">>;

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-950 [color-scheme:light]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
        <header className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-6 max-sm:flex-col">
          <div>
            <Link to="/" className="text-sm font-medium text-neutral-500 hover:text-neutral-950">
              Miso GTM
            </Link>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-neutral-950">
              Projets
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Ton premier socle: creer un projet, suivre son statut, puis le faire
              evoluer vers de vrais livrables GTM.
            </p>
          </div>
          <Link
            to="/projects/new"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-neutral-950 px-4 text-sm font-medium text-white shadow-sm hover:bg-neutral-800"
          >
            <Plus className="h-4 w-4" />
            Nouveau projet
          </Link>
        </header>

        {projectList.length === 0 ? (
          <div className="grid flex-1 place-items-center py-20">
            <div className="w-full max-w-md text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-md border border-neutral-200 bg-white shadow-sm">
                <FolderKanban className="h-5 w-5 text-neutral-700" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-neutral-950">
                Aucun projet pour le moment
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Commence simple: un nom, une description courte et un statut.
              </p>
              <Link
                to="/projects/new"
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-neutral-950 px-4 text-sm font-medium text-white shadow-sm hover:bg-neutral-800"
              >
                <Plus className="h-4 w-4" />
                Creer le premier projet
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 py-6">
            {projectList.map((project) => (
              <Link
                key={project._id}
                to="/projects/$projectId"
                params={{ projectId: project._id }}
                className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-md border border-neutral-200 bg-white p-4 shadow-sm hover:border-neutral-300 max-sm:grid-cols-1"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-base font-semibold text-neutral-950">
                      {project.name}
                    </h2>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${projectStatusStyles[project.status as ProjectStatus]}`}
                    >
                      {projectStatusLabels[project.status as ProjectStatus]}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
                    {project.description || "Aucune description ajoutee."}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-400" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
