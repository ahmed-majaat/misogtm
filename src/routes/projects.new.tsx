import { useConvexMutation } from "@convex-dev/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useConvexAuth } from "convex/react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { api } from "~/convex/_generated/api";
import {
  projectStatuses,
  projectStatusLabels,
  type ProjectStatus,
} from "@/project-status";

export const Route = createFileRoute("/projects/new")({
  component: NewProject,
  beforeLoad: () => ({
    title: "Nouveau projet - Miso GTM",
  }),
});

function NewProject() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("idea");
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: createProject, isPending } = useMutation({
    mutationFn: useConvexMutation(api.projects.createProject),
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void navigate({ to: "/login" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    if (!trimmedName) {
      setError("Donne un nom au projet.");
      return;
    }

    const projectId = await createProject({
      name: trimmedName,
      description: trimmedDescription || undefined,
      status,
    });

    void navigate({ to: "/projects/$projectId", params: { projectId } });
  }

  if (isLoading || !isAuthenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-neutral-50 text-neutral-950">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-950 [color-scheme:light]">
      <section className="mx-auto w-full max-w-3xl px-6 py-8">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux projets
        </Link>

        <div className="mt-8 border-b border-neutral-200 pb-6">
          <h1 className="text-3xl font-semibold tracking-normal">Nouveau projet</h1>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Cree le plus petit objet utile. Le detail viendra apres.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-neutral-800">Nom</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm outline-none ring-neutral-950 transition focus:ring-2"
              placeholder="Ex. Refonte onboarding client"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-neutral-800">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-2 min-h-32 w-full resize-y rounded-md border border-neutral-200 bg-white px-3 py-3 text-sm leading-6 outline-none ring-neutral-950 transition focus:ring-2"
              placeholder="Pourquoi ce projet existe, pour qui, et ce qu'on veut apprendre."
            />
          </label>

          <fieldset>
            <legend className="text-sm font-medium text-neutral-800">Statut initial</legend>
            <div className="mt-2 grid grid-cols-4 gap-2 max-sm:grid-cols-2">
              {projectStatuses.map((item) => (
                <label
                  key={item}
                  className={`flex h-10 items-center justify-center rounded-md border px-3 text-sm font-medium ${
                    status === item
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-neutral-200 bg-white text-neutral-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={item}
                    checked={status === item}
                    onChange={() => setStatus(item)}
                    className="sr-only"
                  />
                  {projectStatusLabels[item]}
                </label>
              ))}
            </div>
          </fieldset>

          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-3 border-t border-neutral-200 pt-5">
            <Link
              to="/projects"
              className="inline-flex h-10 items-center rounded-md border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-neutral-950 px-4 text-sm font-medium text-white shadow-sm disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Creer
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
