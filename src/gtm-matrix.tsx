import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  CircleDot,
  FileCheck2,
  FileText,
  Filter,
  Grid2X2,
  ListChecks,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { cn } from "@/utils/misc";

export type Health = "On Track" | "At Risk" | "Off Track";
export type DeliverableStatus = "A faire" | "En cours" | "En validation" | "Termine";
export type TaskStatus = "A faire" | "En cours" | "Bloquee" | "Terminee";
export type BusinessRole = "Produit" | "Operations" | "Marketing" | "Ventes" | "Formation";

export type GtmDeliverable = {
  title: string;
  status: DeliverableStatus;
  businessRole: BusinessRole;
  responsible: string;
  approver?: string;
  channels: string[];
  dueDate?: string;
};

export type GtmTask = {
  title: string;
  status: TaskStatus;
  businessRole?: BusinessRole;
  owner?: string;
  deliverableTitle?: string;
};

export type GtmDecision = {
  title: string;
  summary: string;
  decidedAt: string;
};

export type GtmActivity = {
  action: string;
  actor: string;
  createdAt: string;
};

export type BusinessChannel = {
  name: string;
  businessRole: BusinessRole;
};

export type BusinessOwner = {
  businessRole: BusinessRole;
  owner: string;
};

export type GtmMatrixInitiative = {
  name: string;
  initiativeType: string;
  targetAudience: string;
  health: Health;
  stage: string;
  rolloutMode: string;
  businessChannels: string[];
  businessOwners: BusinessOwner[];
  deliverables: GtmDeliverable[];
  tasks: GtmTask[];
  decisions: GtmDecision[];
  activities: GtmActivity[];
  gtmOwner: string;
  productionDate?: string;
  gtmStartDate: string;
  gtmEndDate?: string;
  goal: string;
  archived?: boolean;
};

type Screen =
  | "Matrice GTM"
  | "Detail Initiative"
  | "Livrables"
  | "Taches"
  | "Canaux metiers"
  | "Decisions & Activites"
  | "Parametres GTM";

type GtmMatrixProps = {
  initiatives: GtmMatrixInitiative[];
  showSeedButton?: boolean;
  isSeeding?: boolean;
  onSeedDemo?: () => void;
};

const screens: Array<{ id: Screen; icon: ReactNode }> = [
  { id: "Matrice GTM", icon: <Grid2X2 className="h-4 w-4" /> },
  { id: "Detail Initiative", icon: <Target className="h-4 w-4" /> },
  { id: "Livrables", icon: <FileCheck2 className="h-4 w-4" /> },
  { id: "Taches", icon: <ListChecks className="h-4 w-4" /> },
  { id: "Canaux metiers", icon: <UsersRound className="h-4 w-4" /> },
  { id: "Decisions & Activites", icon: <MessageSquareText className="h-4 w-4" /> },
  { id: "Parametres GTM", icon: <Settings2 className="h-4 w-4" /> },
];

const roles: BusinessRole[] = ["Produit", "Operations", "Marketing", "Ventes", "Formation"];

const toneByHealth: Record<Health, string> = {
  "On Track": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "At Risk": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Off Track": "bg-red-50 text-red-700 ring-red-600/20",
};

const progressToneByHealth: Record<Health, string> = {
  "On Track": "bg-emerald-500",
  "At Risk": "bg-amber-500",
  "Off Track": "bg-red-500",
};

const taskStatusTone: Record<TaskStatus, string> = {
  "A faire": "bg-neutral-100 text-neutral-700",
  "En cours": "bg-blue-50 text-blue-700",
  Bloquee: "bg-red-50 text-red-700",
  Terminee: "bg-emerald-50 text-emerald-700",
};

export function GtmMatrix({
  initiatives,
  showSeedButton,
  isSeeding,
  onSeedDemo,
}: GtmMatrixProps) {
  const [workspaceInitiatives, setWorkspaceInitiatives] = useState(initiatives);
  const [screen, setScreen] = useState<Screen>("Matrice GTM");
  const [activeTab, setActiveTab] = useState<Health | "All">("All");
  const [query, setQuery] = useState("");
  const [selectedName, setSelectedName] = useState(initiatives[0]?.name ?? "");

  useEffect(() => {
    setWorkspaceInitiatives(initiatives);
    setSelectedName((current) => current || initiatives[0]?.name || "");
  }, [initiatives]);

  const activeInitiatives = workspaceInitiatives.filter((initiative) => !initiative.archived);

  const selected =
    activeInitiatives.find((initiative) => initiative.name === selectedName) ??
    activeInitiatives[0];

  const allChannels = useMemo(
    () => dedupeChannels(activeInitiatives.flatMap((initiative) => inferChannels(initiative))),
    [activeInitiatives],
  );

  const counts = useMemo(
    () => ({
      All: activeInitiatives.length,
      "On Track": activeInitiatives.filter((item) => item.health === "On Track").length,
      "At Risk": activeInitiatives.filter((item) => item.health === "At Risk").length,
      "Off Track": activeInitiatives.filter((item) => item.health === "Off Track").length,
    }),
    [activeInitiatives],
  );

  const filtered = useMemo(
    () =>
      activeInitiatives.filter((initiative) => {
        const matchesTab = activeTab === "All" || initiative.health === activeTab;
        const haystack = [
          initiative.name,
          initiative.initiativeType,
          initiative.targetAudience,
          initiative.gtmOwner,
          initiative.businessChannels.join(" "),
          initiative.deliverables.map((deliverable) => deliverable.title).join(" "),
          initiative.businessOwners.map((owner) => owner.owner).join(" "),
        ]
          .join(" ")
          .toLowerCase();

        return matchesTab && haystack.includes(query.toLowerCase());
      }),
    [activeInitiatives, activeTab, query],
  );

  return (
    <main className="min-h-screen bg-white text-neutral-950 [color-scheme:light]">
      <div className="grid min-h-screen grid-cols-[232px_minmax(0,1fr)_372px] max-xl:grid-cols-[220px_minmax(0,1fr)] max-lg:grid-cols-1">
        <Sidebar active={screen} onSelect={setScreen} />
        <section className="min-w-0 border-r border-neutral-200 bg-white max-xl:border-r-0">
          <WorkspaceHeader
            query={query}
            setQuery={setQuery}
            showSeedButton={showSeedButton}
            isSeeding={isSeeding}
            onSeedDemo={onSeedDemo}
            onCreateInitiative={() => {
              const initiative = createDraftInitiative(workspaceInitiatives.length + 1);
              setWorkspaceInitiatives((items) => [initiative, ...items]);
              setSelectedName(initiative.name);
              setScreen("Detail Initiative");
            }}
          />

          {screen === "Matrice GTM" ? (
            <MatrixScreen
              counts={counts}
              filtered={filtered}
              initiatives={activeInitiatives}
              selected={selected}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setSelectedName={setSelectedName}
              setScreen={setScreen}
            />
          ) : null}

          {screen === "Detail Initiative" && selected ? (
            <DetailScreen selected={selected} />
          ) : null}

          {screen === "Livrables" ? (
            <DeliverablesScreen
              initiatives={activeInitiatives}
              selected={selected}
              onAddDeliverable={selected ? () => setWorkspaceInitiatives((items) => updateInitiative(items, selected.name, addDraftDeliverable)) : undefined}
              onEditDeliverable={(initiativeName, deliverableIndex, patch) =>
                setWorkspaceInitiatives((items) =>
                  updateInitiative(items, initiativeName, (initiative) =>
                    updateDeliverable(initiative, deliverableIndex, patch),
                  ),
                )
              }
              onRenameInitiative={(initiativeName, nextName) => {
                setWorkspaceInitiatives((items) =>
                  updateInitiative(items, initiativeName, (initiative) => ({
                    ...initiative,
                    name: nextName,
                  })),
                );
                setSelectedName(nextName);
              }}
              onCycleStatus={(initiativeName, deliverableIndex) => setWorkspaceInitiatives((items) => updateInitiative(items, initiativeName, (initiative) => cycleDeliverableStatus(initiative, deliverableIndex)))}
            />
          ) : null}

          {screen === "Taches" ? (
            <TasksScreen
              initiatives={activeInitiatives}
              selected={selected}
              onAddBlockedTask={selected ? () => setWorkspaceInitiatives((items) => updateInitiative(items, selected.name, addBlockedTask)) : undefined}
              onCycleStatus={(initiativeName, title) => setWorkspaceInitiatives((items) => updateInitiative(items, initiativeName, (initiative) => cycleTaskStatus(initiative, title)))}
            />
          ) : null}

          {screen === "Canaux metiers" ? (
            <ChannelsScreen channels={allChannels} initiatives={activeInitiatives} onAddChannel={selected ? () => setWorkspaceInitiatives((items) => updateInitiative(items, selected.name, addDraftChannel)) : undefined} />
          ) : null}

          {screen === "Decisions & Activites" ? (
            <DecisionsScreen selected={selected} onRecordDecision={selected ? () => setWorkspaceInitiatives((items) => updateInitiative(items, selected.name, addDraftDecision)) : undefined} />
          ) : null}

          {screen === "Parametres GTM" ? <SettingsScreen channels={allChannels} /> : null}
        </section>

        {selected ? (
          <Inspector
            selected={selected}
            setScreen={setScreen}
            onArchive={() => {
              setWorkspaceInitiatives((items) => updateInitiative(items, selected.name, (initiative) => ({ ...initiative, archived: true })));
              setSelectedName(activeInitiatives.find((initiative) => initiative.name !== selected.name)?.name ?? "");
            }}
            onHealthChange={(health) => setWorkspaceInitiatives((items) => updateInitiative(items, selected.name, (initiative) => ({ ...initiative, health })))}
          />
        ) : null}
      </div>
    </main>
  );
}

function WorkspaceHeader({
  query,
  setQuery,
  showSeedButton,
  isSeeding,
  onSeedDemo,
  onCreateInitiative,
}: {
  query: string;
  setQuery: (query: string) => void;
  showSeedButton?: boolean;
  isSeeding?: boolean;
  onSeedDemo?: () => void;
  onCreateInitiative: () => void;
}) {
  return (
    <div className="flex min-h-16 items-center justify-between border-b border-neutral-200 px-6 max-md:flex-col max-md:items-stretch max-md:gap-3 max-md:py-4">
      <label className="flex h-9 w-full max-w-[560px] items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-500 shadow-sm">
        <Search className="h-4 w-4 shrink-0" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full bg-transparent text-neutral-950 outline-none placeholder:text-neutral-400"
          placeholder="Rechercher initiative, livrable, responsable, canal..."
        />
      </label>
      <div className="ml-4 flex items-center gap-2 max-md:ml-0">
        {showSeedButton ? (
          <button
            onClick={onSeedDemo}
            disabled={isSeeding}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-900 shadow-sm disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {isSeeding ? "Chargement..." : "Charger la demo"}
          </button>
        ) : null}
        <button onClick={onCreateInitiative} className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-900 shadow-sm">
          <Plus className="h-4 w-4" />
          Nouvelle initiative
        </button>
        <button className="relative grid h-9 w-9 place-items-center rounded-md border border-neutral-200 bg-white shadow-sm">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>
      </div>
    </div>
  );
}

function MatrixScreen({
  counts,
  filtered,
  initiatives,
  selected,
  activeTab,
  setActiveTab,
  setSelectedName,
  setScreen,
}: {
  counts: Record<Health | "All", number>;
  filtered: GtmMatrixInitiative[];
  initiatives: GtmMatrixInitiative[];
  selected?: GtmMatrixInitiative;
  activeTab: Health | "All";
  setActiveTab: (tab: Health | "All") => void;
  setSelectedName: (name: string) => void;
  setScreen: (screen: Screen) => void;
}) {
  return (
    <>
      <ScreenTitle
        title="Matrice GTM"
        description="Suivre les initiatives, livrables, responsables et dates GTM."
        actions={
          <>
            <button className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-700 shadow-sm">
              <Grid2X2 className="h-4 w-4" />
              Vues
            </button>
            <button className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-700 shadow-sm">
              <Filter className="h-4 w-4" />
              Filtres
            </button>
          </>
        }
      />

      <div className="mx-6 grid grid-cols-5 border-y border-neutral-200 max-lg:grid-cols-3 max-sm:grid-cols-2">
        <Metric icon={<Sparkles className="h-4 w-4" />} label="Initiatives actives" value={String(counts.All)} note="GTM en cours" />
        <Metric dot="bg-emerald-500" label="On Track" value={String(counts["On Track"])} note="Sous controle" />
        <Metric dot="bg-amber-500" label="At Risk" value={String(counts["At Risk"])} note="A surveiller" />
        <Metric dot="bg-red-500" label="Off Track" value={String(counts["Off Track"])} note="A reprendre" />
        <Metric icon={<ShieldCheck className="h-4 w-4" />} label="Livrables termines" value={deliverableRatio(initiatives)} note="Calcul de progression" />
      </div>

      <div className="mt-8 flex overflow-x-auto border-b border-neutral-200 px-6">
        {[
          { label: "Toutes", value: "All" as const, count: counts.All },
          { label: "On Track", value: "On Track" as const, count: counts["On Track"] },
          { label: "At Risk", value: "At Risk" as const, count: counts["At Risk"] },
          { label: "Off Track", value: "Off Track" as const, count: counts["Off Track"] },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "inline-flex h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-sm text-neutral-500",
              activeTab === tab.value ? "border-neutral-950 text-neutral-950" : "border-transparent",
            )}
          >
            {tab.label}
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs text-neutral-500">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1320px] border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-xs font-medium text-neutral-500">
              <th className="w-[260px] px-6 py-3">Initiative</th>
              <th className="w-[150px] px-4 py-3">Audience cible</th>
              <th className="w-[112px] px-4 py-3">Sante GTM</th>
              <th className="w-[132px] px-4 py-3">Etape GTM</th>
              <th className="w-[150px] px-4 py-3">Canaux metiers</th>
              <th className="w-[110px] px-4 py-3">Livrables</th>
              <th className="w-[150px] px-4 py-3">Responsable GTM</th>
              <th className="w-[130px] px-4 py-3">Production</th>
              <th className="w-[130px] px-4 py-3">Debut GTM</th>
              <th className="w-[130px] px-4 py-3">Progression</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((initiative) => {
              const progress = calculateProgress(initiative);
              const deliverablesDone = initiative.deliverables.filter((item) => item.status === "Termine").length;
              const blockedTasks = initiative.tasks.filter((task) => task.status === "Bloquee").length;

              return (
                <tr
                  key={initiative.name}
                  onClick={() => setSelectedName(initiative.name)}
                  className={cn(
                    "cursor-pointer border-b border-neutral-200 text-sm transition hover:bg-neutral-50",
                    selected?.name === initiative.name && "bg-neutral-100",
                  )}
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-neutral-950 text-white">
                        {selected?.name === initiative.name ? <Sparkles className="h-3.5 w-3.5" /> : <Target className="h-3.5 w-3.5" />}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-neutral-950">{initiative.name}</p>
                        <p className="truncate text-xs text-neutral-500">{initiative.initiativeType}</p>
                      </div>
                      {blockedTasks > 0 ? <AlertTriangle className="h-4 w-4 text-red-500" /> : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-700">{initiative.targetAudience}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1", toneByHealth[initiative.health])}>
                      {initiative.health}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-700">{initiative.stage}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {initiative.businessChannels.slice(0, 3).map((channel) => (
                        <span key={channel} className="grid h-6 min-w-6 place-items-center rounded-md bg-neutral-100 px-1.5 text-xs text-neutral-600" title={channel}>
                          {channel[0]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-700">{deliverablesDone}/{initiative.deliverables.length}</td>
                  <td className="px-4 py-3 text-neutral-700">{initiative.gtmOwner}</td>
                  <td className="px-4 py-3 text-neutral-700">{initiative.productionDate ?? "Non definie"}</td>
                  <td className="px-4 py-3 text-neutral-700">{initiative.gtmStartDate}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setScreen("Detail Initiative")} className="w-24 text-left">
                      <p className="mb-1 text-xs font-medium text-neutral-950">{progress}%</p>
                      <div className="h-1 overflow-hidden rounded-full bg-neutral-200">
                        <span className={cn("block h-full", progressToneByHealth[initiative.health])} style={{ width: `${progress}%` }} />
                      </div>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <MoreHorizontal className="h-4 w-4 text-neutral-400" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function DetailScreen({ selected }: { selected: GtmMatrixInitiative }) {
  const blockedTasks = selected.tasks.filter((task) => task.status === "Bloquee");
  const involvedRoles = inferRoles(selected);

  return (
    <>
      <ScreenTitle title={selected.name} description={selected.goal} />
      <div className="grid gap-5 px-6 pb-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.8fr)]">
        <section className="space-y-5">
          <div className="grid grid-cols-4 border-y border-neutral-200 max-lg:grid-cols-2">
            <Metric label="Sante GTM" value={selected.health} note="Jugee par le responsable GTM" dot={healthDot(selected.health)} />
            <Metric label="Etape GTM" value={selected.stage} note="Workflow produit" icon={<CircleDot className="h-4 w-4" />} />
            <Metric label="Progression" value={`${calculateProgress(selected)}%`} note="Livrables termines seulement" icon={<ShieldCheck className="h-4 w-4" />} />
            <Metric label="Signaux d'alerte" value={String(blockedTasks.length)} note="Taches bloquees" icon={<AlertTriangle className="h-4 w-4" />} />
          </div>
          <Panel title="Calendrier GTM">
            <InfoRow label="Date de mise en production" value={selected.productionDate ?? "Non definie"} />
            <InfoRow label="Date de debut GTM" value={selected.gtmStartDate} />
            <InfoRow label="Date de fin GTM" value={selected.gtmEndDate ?? "A definir"} />
            <InfoRow label="Mode de deploiement" value={selected.rolloutMode} />
          </Panel>
          <Panel title="Responsabilites">
            <InfoRow label="Responsable GTM" value={selected.gtmOwner} />
            {roles.map((role) => (
              <InfoRow key={role} label={`Responsable ${role}`} value={selected.businessOwners.find((owner) => owner.businessRole === role)?.owner ?? "Non assigne"} />
            ))}
          </Panel>
        </section>
        <section className="space-y-5">
          <Panel title="Metiers impliques">
            <div className="flex flex-wrap gap-2">
              {involvedRoles.map((role) => (
                <span key={role} className="rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">{role}</span>
              ))}
            </div>
          </Panel>
          <Panel title="Signaux d'alerte">
            {blockedTasks.length ? blockedTasks.map((task) => <AlertRow key={task.title} task={task} />) : <EmptyLine text="Aucune tache bloquee." />}
          </Panel>
          <Panel title="Decisions recentes">
            {selected.decisions.map((decision) => <Decision key={decision.title} title={decision.title} meta={decision.summary} />)}
          </Panel>
        </section>
      </div>
    </>
  );
}

function DeliverablesScreen({
  initiatives,
  selected,
  onAddDeliverable,
  onEditDeliverable,
  onRenameInitiative,
  onCycleStatus,
}: {
  initiatives: GtmMatrixInitiative[];
  selected?: GtmMatrixInitiative;
  onAddDeliverable?: () => void;
  onEditDeliverable: (
    initiativeName: string,
    deliverableIndex: number,
    patch: Partial<GtmDeliverable>,
  ) => void;
  onRenameInitiative: (initiativeName: string, nextName: string) => void;
  onCycleStatus: (initiativeName: string, deliverableIndex: number) => void;
}) {
  const deliverables = initiatives.flatMap((initiative) =>
    initiative.deliverables.map((deliverable, deliverableIndex) => ({
      initiative: initiative.name,
      deliverableIndex,
      ...deliverable,
    })),
  );

  return (
    <>
      <ScreenTitle
        title="Livrables GTM"
        description="Suivre les sorties tangibles, leurs responsables, approbateurs et canaux metiers."
        actions={onAddDeliverable ? (
          <button onClick={onAddDeliverable} className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-700 shadow-sm">
            <Plus className="h-4 w-4" />
            Ajouter livrable
          </button>
        ) : undefined}
      />
      <div className="px-6 pb-8">
        <DataTable
          headers={["Livrable", "Initiative", "Statut", "Metier", "Responsable", "Approbateur", "Canaux", "Action"]}
          rows={deliverables.map((deliverable) => [
            <EditableText
              key="title"
              value={deliverable.title}
              ariaLabel="Nom du livrable"
              onChange={(value) => onEditDeliverable(deliverable.initiative, deliverable.deliverableIndex, { title: value })}
            />,
            <EditableText
              key="initiative"
              value={deliverable.initiative}
              ariaLabel="Nom de l'initiative"
              onChange={(value) => onRenameInitiative(deliverable.initiative, value)}
            />,
            <EditableSelect
              key="status"
              value={deliverable.status}
              options={["A faire", "En cours", "En validation", "Termine"]}
              ariaLabel="Statut du livrable"
              onChange={(value) => onEditDeliverable(deliverable.initiative, deliverable.deliverableIndex, { status: value as DeliverableStatus })}
            />,
            <EditableSelect
              key="role"
              value={deliverable.businessRole}
              options={roles}
              ariaLabel="Metier du livrable"
              onChange={(value) => onEditDeliverable(deliverable.initiative, deliverable.deliverableIndex, { businessRole: value as BusinessRole })}
            />,
            <EditableText
              key="responsible"
              value={deliverable.responsible}
              ariaLabel="Responsable du livrable"
              onChange={(value) => onEditDeliverable(deliverable.initiative, deliverable.deliverableIndex, { responsible: value })}
            />,
            <EditableText
              key="approver"
              value={deliverable.approver ?? ""}
              placeholder="Information non requise"
              ariaLabel="Approbateur du livrable"
              onChange={(value) => onEditDeliverable(deliverable.initiative, deliverable.deliverableIndex, { approver: value || undefined })}
            />,
            <EditableText
              key="channels"
              value={deliverable.channels.join(", ")}
              placeholder="Aucun canal"
              ariaLabel="Canaux du livrable"
              onChange={(value) => onEditDeliverable(deliverable.initiative, deliverable.deliverableIndex, { channels: splitChannels(value) })}
            />,
            <button key="action" onClick={() => onCycleStatus(deliverable.initiative, deliverable.deliverableIndex)} className="text-sm font-medium text-neutral-950">Changer statut</button>,
          ])}
        />
        {selected ? (
          <p className="mt-4 text-sm text-neutral-500">
            Progression de {selected.name}: {calculateProgress(selected)}%, calculee sur {selected.deliverables.filter((item) => item.status === "Termine").length} livrables termines sur {selected.deliverables.length}.
          </p>
        ) : null}
      </div>
    </>
  );
}

function TasksScreen({
  initiatives,
  selected,
  onAddBlockedTask,
  onCycleStatus,
}: {
  initiatives: GtmMatrixInitiative[];
  selected?: GtmMatrixInitiative;
  onAddBlockedTask?: () => void;
  onCycleStatus: (initiativeName: string, title: string) => void;
}) {
  const tasks = initiatives.flatMap((initiative) =>
    initiative.tasks.map((task) => ({ initiative: initiative.name, health: initiative.health, ...task })),
  );

  return (
    <>
      <ScreenTitle
        title="Taches GTM"
        description="Suivre le travail operationnel sans gonfler la progression GTM."
        actions={onAddBlockedTask ? (
          <button onClick={onAddBlockedTask} className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-700 shadow-sm">
            <AlertTriangle className="h-4 w-4" />
            Ajouter tache bloquee
          </button>
        ) : undefined}
      />
      <div className="px-6 pb-8">
        <DataTable
          headers={["Tache", "Initiative", "Statut", "Metier", "Responsable", "Livrable lie", "Signal d'alerte", "Action"]}
          rows={tasks.map((task) => [
            task.title,
            task.initiative,
            <Badge key="status" className={taskStatusTone[task.status]}>{task.status}</Badge>,
            task.businessRole ?? "Transverse",
            task.owner ?? "Non assigne",
            task.deliverableTitle ?? "Initiative",
            task.status === "Bloquee" ? "Oui, sans changement automatique de Sante GTM" : "Non",
            <button key="action" onClick={() => onCycleStatus(task.initiative, task.title)} className="text-sm font-medium text-neutral-950">Changer statut</button>,
          ])}
        />
        {selected ? (
          <p className="mt-4 text-sm text-neutral-500">
            {selected.tasks.filter((task) => task.status === "Terminee").length} taches terminees sur {selected.tasks.length}; la progression reste {calculateProgress(selected)}% car elle vient des livrables.
          </p>
        ) : null}
      </div>
    </>
  );
}

function ChannelsScreen({ channels, initiatives, onAddChannel }: { channels: BusinessChannel[]; initiatives: GtmMatrixInitiative[]; onAddChannel?: () => void }) {
  return (
    <>
      <ScreenTitle
        title="Canaux metiers"
        description="Configurer les points d'activation par metier, chaque canal appartenant a un seul metier."
        actions={onAddChannel ? (
          <button onClick={onAddChannel} className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-700 shadow-sm">
            <Plus className="h-4 w-4" />
            Ajouter canal
          </button>
        ) : undefined}
      />
      <div className="grid gap-5 px-6 pb-8 lg:grid-cols-2">
        {roles.map((role) => {
          const roleChannels = channels.filter((channel) => channel.businessRole === role);
          return (
            <Panel key={role} title={role}>
              {roleChannels.length ? roleChannels.map((channel) => (
                <InfoRow key={channel.name} label={channel.name} value={`${usageCount(channel.name, initiatives)} initiatives`} />
              )) : <EmptyLine text="Aucun canal configure." />}
            </Panel>
          );
        })}
      </div>
    </>
  );
}

function DecisionsScreen({ selected, onRecordDecision }: { selected?: GtmMatrixInitiative; onRecordDecision?: () => void }) {
  if (!selected) {
    return null;
  }

  return (
    <>
      <ScreenTitle
        title="Decisions & Activites"
        description={`Historique distinct pour ${selected.name}.`}
        actions={onRecordDecision ? (
          <button onClick={onRecordDecision} className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-700 shadow-sm">
            <Plus className="h-4 w-4" />
            Enregistrer decision
          </button>
        ) : undefined}
      />
      <div className="grid gap-5 px-6 pb-8 lg:grid-cols-2">
        <Panel title="Decisions">
          {selected.decisions.map((decision) => (
            <div key={decision.title} className="mb-4 rounded-md border border-neutral-200 p-3">
              <p className="text-sm font-medium text-neutral-900">{decision.title}</p>
              <p className="mt-1 text-sm text-neutral-600">{decision.summary}</p>
              <p className="mt-2 text-xs text-neutral-400">{decision.decidedAt}</p>
            </div>
          ))}
        </Panel>
        <Panel title="Activites">
          {selected.activities.map((activity) => (
            <div key={`${activity.actor}-${activity.action}`} className="mb-4 flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-neutral-300" />
              <div>
                <p className="text-sm text-neutral-800">{activity.action}</p>
                <p className="text-xs text-neutral-500">{activity.actor} - {activity.createdAt}</p>
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </>
  );
}

function SettingsScreen({ channels }: { channels: BusinessChannel[] }) {
  return (
    <>
      <ScreenTitle title="Parametres GTM" description="Garder les etapes GTM produit-definies et administrer les canaux par metier." />
      <div className="grid gap-5 px-6 pb-8 lg:grid-cols-2">
        <Panel title="Etapes GTM">
          {["Idee", "Planification", "Preparation", "En lancement", "Lance", "Archive"].map((stage) => (
            <CheckItem key={stage} text={`${stage} - non configurable pour cette phase`} />
          ))}
        </Panel>
        <Panel title="Canaux metiers">
          <InfoRow label="Canaux configures" value={String(channels.length)} />
          <InfoRow label="Regle de responsabilite" value="Un canal appartient a un seul metier" />
          <InfoRow label="Metiers initiaux" value={roles.join(", ")} />
        </Panel>
      </div>
    </>
  );
}

function Sidebar({ active, onSelect }: { active: Screen; onSelect: (screen: Screen) => void }) {
  return (
    <aside className="border-r border-neutral-200 bg-neutral-50 p-4 max-lg:hidden">
      <div className="mb-8 flex items-center gap-2 text-sm font-semibold text-neutral-950">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-neutral-950 text-white">M</span>
        Miso GTM
      </div>
      {screens.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={cn(
            "mb-1 flex h-9 w-full items-center gap-2 rounded-md px-3 text-left text-sm text-neutral-600",
            active === item.id && "bg-white text-neutral-950 shadow-sm",
          )}
        >
          {item.icon}
          {item.id}
        </button>
      ))}
    </aside>
  );
}

function ScreenTitle({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return (
    <div className="flex items-start justify-between px-6 py-6 max-md:flex-col max-md:gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-950">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-neutral-500">{description}</p>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

function Metric({ label, value, note, icon, dot }: { label: string; value: string; note: string; icon?: ReactNode; dot?: string }) {
  return (
    <div className="border-r border-neutral-200 px-4 py-4 last:border-r-0">
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        {icon ? <span className="grid h-7 w-7 place-items-center rounded-md bg-neutral-100 text-neutral-950">{icon}</span> : <span className={cn("h-2 w-2 rounded-full", dot)} />}
        {label}
      </div>
      <strong className="mt-2 block truncate text-2xl font-semibold text-neutral-950">{value}</strong>
      <p className="mt-1 text-xs text-neutral-500">{note}</p>
    </div>
  );
}

function Inspector({
  selected,
  setScreen,
  onArchive,
  onHealthChange,
}: {
  selected: GtmMatrixInitiative;
  setScreen: (screen: Screen) => void;
  onArchive: () => void;
  onHealthChange: (health: Health) => void;
}) {
  const deliverablesDone = selected.deliverables.filter((item) => item.status === "Termine").length;

  return (
    <aside className="bg-white max-xl:hidden">
      <div className="flex min-h-20 items-center justify-between border-b border-neutral-200 px-5">
        <div>
          <h2 className="text-base font-semibold text-neutral-950">{selected.name}</h2>
          <p className="mt-1 text-xs text-neutral-500">{selected.initiativeType}</p>
        </div>
        <button onClick={() => setScreen("Detail Initiative")} className="rounded-md border border-neutral-200 px-2 py-1 text-xs text-neutral-600">
          Ouvrir
        </button>
      </div>
      <div className="grid grid-cols-4 border-b border-neutral-200 px-4">
        {[
          ["Vue", "Detail Initiative"],
          ["Livrables", "Livrables"],
          ["Taches", "Taches"],
          ["Activite", "Decisions & Activites"],
        ].map(([tab, target], index) => (
          <button
            key={tab}
            onClick={() => setScreen(target as Screen)}
            className={cn("h-11 border-b-2 text-xs", index === 0 ? "border-neutral-950 text-neutral-950" : "border-transparent text-neutral-500")}
          >
            {tab}
          </button>
        ))}
      </div>
      <Panel title="Calendrier GTM">
        <InfoRow label="Production" value={selected.productionDate ?? "Non definie"} />
        <InfoRow label="Debut GTM" value={selected.gtmStartDate} />
        <InfoRow label="Fin GTM" value={selected.gtmEndDate ?? "A definir"} />
        <InfoRow label="Deploiement" value={selected.rolloutMode} />
      </Panel>
      <Panel title="Responsabilites">
        <InfoRow label="Responsable GTM" value={selected.gtmOwner} />
        <InfoRow label="Audience cible" value={selected.targetAudience} />
        <div className="mb-3 flex items-center justify-between gap-3 text-sm">
          <span className="text-neutral-500">Sante GTM</span>
          <select value={selected.health} onChange={(event) => onHealthChange(event.target.value as Health)} className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm font-medium text-neutral-800">
            <option>On Track</option>
            <option>At Risk</option>
            <option>Off Track</option>
          </select>
        </div>
        <button onClick={onArchive} className="mt-2 inline-flex h-8 items-center rounded-md border border-neutral-200 px-2 text-xs font-medium text-neutral-700">
          Archiver initiative
        </button>
      </Panel>
      <Panel title="Livrables GTM">
        <CheckItem text={`${deliverablesDone} livrables termines`} />
        <CheckItem text={`${selected.deliverables.length - deliverablesDone} livrables ouverts`} />
        <CheckItem text="Progression calculee sur les livrables termines" />
      </Panel>
      <Panel title="Decisions recentes">
        {selected.decisions.slice(0, 3).map((decision) => <Decision key={decision.title} title={decision.title} meta={decision.summary} />)}
      </Panel>
    </aside>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-neutral-200 px-5 py-5">
      <div className="mb-4 flex items-center">
        <h3 className="flex-1 text-sm font-semibold text-neutral-950">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function EditableText({
  value,
  onChange,
  ariaLabel,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      aria-label={ariaLabel}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-9 w-full min-w-[130px] rounded-md border border-transparent bg-transparent px-2 py-1 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 hover:border-neutral-200 hover:bg-white focus:border-neutral-900 focus:bg-white focus:shadow-sm"
    />
  );
}

function EditableSelect({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  ariaLabel: string;
}) {
  return (
    <select
      value={value}
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-9 w-full min-w-[130px] rounded-md border border-transparent bg-transparent px-2 py-1 text-sm text-neutral-900 outline-none transition hover:border-neutral-200 hover:bg-white focus:border-neutral-900 focus:bg-white focus:shadow-sm"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: Array<Array<ReactNode>> }) {
  return (
    <div className="overflow-x-auto border-y border-neutral-200">
      <table className="w-full min-w-[980px] border-collapse">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-xs font-medium text-neutral-500">
            {headers.map((header) => <th key={header} className="px-4 py-3">{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-neutral-200 text-sm last:border-b-0">
              {row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3 text-neutral-700">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Badge({ className, children }: { className: string; children: ReactNode }) {
  return <span className={cn("inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium", className)}>{children}</span>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3 text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="text-right font-medium text-neutral-800">{value}</span>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="mb-3 flex items-start gap-2 text-sm text-neutral-700">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
      <span>{text}</span>
    </div>
  );
}

function AlertRow({ task }: { task: GtmTask }) {
  return (
    <div className="mb-3 flex gap-3 rounded-md bg-red-50 p-3 text-sm text-red-800">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <p className="font-medium">{task.title}</p>
        <p className="text-red-700">Signal visible; la Sante GTM reste une decision du Responsable GTM.</p>
      </div>
    </div>
  );
}

function EmptyLine({ text }: { text: string }) {
  return <p className="text-sm text-neutral-500">{text}</p>;
}

function Decision({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="mb-3 flex gap-3">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-neutral-200 text-neutral-400">
        <FileText className="h-3.5 w-3.5" />
      </span>
      <div>
        <p className="text-sm font-medium text-neutral-800">{title}</p>
        <p className="text-xs text-neutral-500">{meta}</p>
      </div>
    </div>
  );
}

function calculateProgress(initiative: GtmMatrixInitiative) {
  if (initiative.deliverables.length === 0) {
    return 0;
  }

  const done = initiative.deliverables.filter((item) => item.status === "Termine").length;
  return Math.round((done / initiative.deliverables.length) * 100);
}

function deliverableRatio(initiatives: GtmMatrixInitiative[]) {
  const done = initiatives.reduce((sum, item) => sum + item.deliverables.filter((deliverable) => deliverable.status === "Termine").length, 0);
  const total = initiatives.reduce((sum, item) => sum + item.deliverables.length, 0);
  return `${done}/${total}`;
}

function inferRoles(initiative: GtmMatrixInitiative): BusinessRole[] {
  return Array.from(
    new Set([
      ...initiative.businessOwners.map((owner) => owner.businessRole),
      ...initiative.deliverables.map((deliverable) => deliverable.businessRole),
      ...initiative.tasks.flatMap((task) => (task.businessRole ? [task.businessRole] : [])),
      ...inferChannels(initiative).map((channel) => channel.businessRole),
    ]),
  );
}

function inferChannels(initiative: GtmMatrixInitiative): BusinessChannel[] {
  return initiative.businessChannels.map((name) => {
    const deliverable = initiative.deliverables.find((item) => item.channels.includes(name));
    return {
      name,
      businessRole: deliverable?.businessRole ?? initiative.businessOwners[0]?.businessRole ?? "Marketing",
    };
  });
}

function dedupeChannels(channels: BusinessChannel[]) {
  const byName = new Map<string, BusinessChannel>();
  for (const channel of channels) {
    if (!byName.has(channel.name)) {
      byName.set(channel.name, channel);
    }
  }
  return Array.from(byName.values()).sort((a, b) => a.businessRole.localeCompare(b.businessRole) || a.name.localeCompare(b.name));
}

function usageCount(channelName: string, initiatives: GtmMatrixInitiative[]) {
  return initiatives.filter((initiative) => initiative.businessChannels.includes(channelName)).length;
}

function healthDot(health: Health) {
  return health === "On Track" ? "bg-emerald-500" : health === "At Risk" ? "bg-amber-500" : "bg-red-500";
}

function updateInitiative(
  initiatives: GtmMatrixInitiative[],
  initiativeName: string,
  updater: (initiative: GtmMatrixInitiative) => GtmMatrixInitiative,
) {
  return initiatives.map((initiative) => initiative.name === initiativeName ? updater(initiative) : initiative);
}

function createDraftInitiative(index: number): GtmMatrixInitiative {
  return {
    name: `Nouvelle initiative GTM ${index}`,
    initiativeType: "Product Launch",
    targetAudience: "Audience cible",
    health: "On Track",
    stage: "Idee",
    rolloutMode: "Progressif",
    gtmOwner: "Responsable GTM",
    productionDate: "A definir",
    gtmStartDate: "A definir",
    gtmEndDate: "A definir",
    goal: "Structurer l'initiative avec les dates, livrables, taches, canaux et decisions necessaires.",
    businessChannels: ["Canal metier demo"],
    businessOwners: [{ businessRole: "Produit", owner: "Responsable Produit" }],
    deliverables: [
      {
        title: "Premier livrable GTM",
        status: "A faire",
        businessRole: "Produit",
        responsible: "Responsable Produit",
        channels: ["Canal metier demo"],
      },
    ],
    tasks: [
      {
        title: "Qualifier le scope GTM",
        status: "A faire",
        businessRole: "Produit",
        owner: "Responsable Produit",
      },
    ],
    decisions: [
      {
        title: "Creation initiative",
        summary: "Initiative creee avec les champs GTM canoniques.",
        decidedAt: "Aujourd'hui",
      },
    ],
    activities: [
      {
        actor: "Miso GTM",
        action: "Initiative creee",
        createdAt: "Maintenant",
      },
    ],
  };
}

function addDraftDeliverable(initiative: GtmMatrixInitiative): GtmMatrixInitiative {
  const nextNumber = initiative.deliverables.length + 1;
  return {
    ...initiative,
    deliverables: [
      ...initiative.deliverables,
      {
        title: `Livrable GTM ${nextNumber}`,
        status: "A faire",
        businessRole: inferRoles(initiative)[0] ?? "Marketing",
        responsible: initiative.gtmOwner,
        approver: "Approbateur informatif",
        channels: initiative.businessChannels.slice(0, 1),
      },
    ],
    activities: addActivity(initiative, `Livrable GTM ${nextNumber} ajoute`),
  };
}

function updateDeliverable(
  initiative: GtmMatrixInitiative,
  deliverableIndex: number,
  patch: Partial<GtmDeliverable>,
): GtmMatrixInitiative {
  return {
    ...initiative,
    businessChannels: patch.channels
      ? Array.from(new Set([...initiative.businessChannels, ...patch.channels]))
      : initiative.businessChannels,
    deliverables: initiative.deliverables.map((item, index) =>
      index === deliverableIndex ? { ...item, ...patch } : item,
    ),
  };
}

function cycleDeliverableStatus(initiative: GtmMatrixInitiative, deliverableIndex: number): GtmMatrixInitiative {
  const deliverable = initiative.deliverables[deliverableIndex];
  return {
    ...initiative,
    deliverables: initiative.deliverables.map((item, index) =>
      index === deliverableIndex
        ? { ...item, status: nextDeliverableStatus(item.status) }
        : item,
    ),
    activities: deliverable
      ? addActivity(initiative, `Statut du livrable ${deliverable.title} mis a jour`)
      : initiative.activities,
  };
}

function addBlockedTask(initiative: GtmMatrixInitiative): GtmMatrixInitiative {
  const nextNumber = initiative.tasks.length + 1;
  return {
    ...initiative,
    tasks: [
      ...initiative.tasks,
      {
        title: `Tache bloquee ${nextNumber}`,
        status: "Bloquee",
        businessRole: inferRoles(initiative)[0] ?? "Operations",
        owner: initiative.gtmOwner,
      },
    ],
    activities: addActivity(initiative, `Signal d'alerte cree pour Tache bloquee ${nextNumber}`),
  };
}

function cycleTaskStatus(initiative: GtmMatrixInitiative, title: string): GtmMatrixInitiative {
  return {
    ...initiative,
    tasks: initiative.tasks.map((task) =>
      task.title === title ? { ...task, status: nextTaskStatus(task.status) } : task,
    ),
    activities: addActivity(initiative, `Statut de la tache ${title} mis a jour`),
  };
}

function addDraftChannel(initiative: GtmMatrixInitiative): GtmMatrixInitiative {
  const nextChannel = `Canal metier ${initiative.businessChannels.length + 1}`;
  return {
    ...initiative,
    businessChannels: [...initiative.businessChannels, nextChannel],
    deliverables: initiative.deliverables.map((deliverable, index) =>
      index === 0 ? { ...deliverable, channels: Array.from(new Set([...deliverable.channels, nextChannel])) } : deliverable,
    ),
    activities: addActivity(initiative, `${nextChannel} ajoute au metier ${inferRoles(initiative)[0] ?? "Marketing"}`),
  };
}

function addDraftDecision(initiative: GtmMatrixInitiative): GtmMatrixInitiative {
  const nextNumber = initiative.decisions.length + 1;
  return {
    ...initiative,
    decisions: [
      {
        title: `Decision GTM ${nextNumber}`,
        summary: "Decision enregistree separement de l'activite operationnelle.",
        decidedAt: "Maintenant",
      },
      ...initiative.decisions,
    ],
    activities: addActivity(initiative, `Decision GTM ${nextNumber} enregistree`),
  };
}

function addActivity(initiative: GtmMatrixInitiative, action: string): GtmActivity[] {
  return [
    {
      actor: "Miso GTM",
      action,
      createdAt: "Maintenant",
    },
    ...initiative.activities,
  ];
}

function nextDeliverableStatus(status: DeliverableStatus): DeliverableStatus {
  const order: DeliverableStatus[] = ["A faire", "En cours", "En validation", "Termine"];
  return order[(order.indexOf(status) + 1) % order.length];
}

function nextTaskStatus(status: TaskStatus): TaskStatus {
  const order: TaskStatus[] = ["A faire", "En cours", "Bloquee", "Terminee"];
  return order[(order.indexOf(status) + 1) % order.length];
}

function splitChannels(value: string) {
  return value
    .split(",")
    .map((channel) => channel.trim())
    .filter(Boolean);
}
