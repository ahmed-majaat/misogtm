import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useConvexAuth } from "convex/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import {
  projectStatuses,
  projectStatusLabels,
  projectStatusStyles,
  type ProjectStatus,
} from "@/project-status";

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectDetail,
  beforeLoad: () => ({
    title: "Projet - Miso GTM",
  }),
});

function ProjectDetail() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const typedProjectId = projectId as Id<"projects">;
  const { data: project, isLoading: isProjectLoading } = useQuery({
    ...convexQuery(api.projects.getProject, { projectId: typedProjectId }),
    enabled: isAuthenticated,
  });
  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: useConvexMutation(api.projects.updateProjectStatus),
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void navigate({ to: "/login" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !isAuthenticated || isProjectLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-neutral-50 text-neutral-950">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="grid min-h-screen place-items-center bg-neutral-50 px-6 text-neutral-950">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold">Projet introuvable</h1>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Il a peut-etre ete supprime ou il appartient a un autre utilisateur.
          </p>
          <Link
            to="/projects"
            className="mt-5 inline-flex h-10 items-center rounded-md bg-neutral-950 px-4 text-sm font-medium text-white"
          >
            Retour aux projets
          </Link>
        </div>
      </main>
    );
  }

  const status = project.status as ProjectStatus;

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-950 [color-scheme:light]">
      <section className="mx-auto w-full max-w-4xl px-6 py-8">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux projets
        </Link>

        <header className="mt-8 border-b border-neutral-200 pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-normal">{project.name}</h1>
            <span
              className={`rounded-full border px-2.5 py-1 text-xs font-medium ${projectStatusStyles[status]}`}
            >
              {projectStatusLabels[status]}
            </span>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">
            {project.description || "Aucune description ajoutee."}
          </p>
        </header>

        <section className="mt-6 grid gap-6 md:grid-cols-[1fr_280px]">
          <div className="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold">Prochaines briques</h2>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-neutral-600">
              <p>1. Ajouter des objectifs mesurables.</p>
              <p>2. Ajouter les livrables GTM relies au projet.</p>
              <p>3. Ajouter les taches et responsables.</p>
            </div>
          </div>

          <aside className="rounded-md border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold">Statut</h2>
            <div className="mt-4 grid gap-2">
              {projectStatuses.map((item) => (
                <button
                  key={item}
                  type="button"
                  disabled={isPending || item === status}
                  onClick={() =>
                    updateStatus({
                      projectId: typedProjectId,
                      status: item,
                    })
                  }
                  className={`h-10 rounded-md border px-3 text-left text-sm font-medium disabled:cursor-default ${
                    item === status
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {projectStatusLabels[item]}
                </button>
              ))}
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
