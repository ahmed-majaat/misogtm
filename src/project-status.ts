export const projectStatuses = ["idea", "active", "paused", "done"] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export const projectStatusLabels: Record<ProjectStatus, string> = {
  idea: "Idee",
  active: "Actif",
  paused: "En pause",
  done: "Termine",
};

export const projectStatusStyles: Record<ProjectStatus, string> = {
  idea: "border-amber-200 bg-amber-50 text-amber-800",
  active: "border-emerald-200 bg-emerald-50 text-emerald-800",
  paused: "border-neutral-200 bg-neutral-100 text-neutral-700",
  done: "border-sky-200 bg-sky-50 text-sky-800",
};
