import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import {
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/utils/misc";

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();
  const [authMode, setAuthMode] = useState<"signIn" | "signUp">("signIn");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      void navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  async function handlePasswordAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      formData.set("flow", authMode);
      const result = await signIn("password", formData);

      if (!result.signingIn) {
        setError(getAuthErrorMessage(null, authMode));
        return;
      }

      void navigate({ to: "/" });
    } catch (error) {
      console.error("Password sign-in failed", error);
      setError(getAuthErrorMessage(error, authMode));
    } finally {
      setIsSubmitting(false);
    }
  }

  const isSignUp = authMode === "signUp";

  if (isLoading || isAuthenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-white text-neutral-950">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-950 [color-scheme:light]">
      <div className="grid min-h-screen grid-cols-[minmax(0,1fr)_520px] max-lg:grid-cols-1">
        <section className="flex min-h-screen flex-col justify-between border-r border-neutral-200 bg-white px-10 py-8 max-lg:min-h-0 max-lg:border-r-0 max-lg:px-6">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-neutral-950 text-white">
              M
            </span>
            Miso GTM
          </div>

          <div className="max-w-3xl py-20 max-lg:py-14">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              Workspace GTM securise
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-neutral-950 max-sm:text-3xl">
              Pilote tes initiatives, livrables et decisions GTM depuis un espace protege.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-neutral-600">
              Connecte-toi pour retrouver la matrice GTM, les responsables metiers,
              les canaux, les taches et les signaux d'alerte de ton workspace.
            </p>
          </div>

          <div className="grid max-w-3xl grid-cols-3 border-y border-neutral-200 text-sm max-sm:grid-cols-1">
            <LoginMetric label="Initiatives" value="Actives" />
            <LoginMetric label="Sante GTM" value="Suivie" />
            <LoginMetric label="Livrables" value="Coordonnes" />
          </div>
        </section>

        <section className="flex items-center justify-center px-8 py-10 max-sm:px-4">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-md border border-neutral-200 bg-white shadow-sm">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-neutral-950">
                {isSignUp ? "Creation du compte" : "Connexion"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                {isSignUp
                  ? "Choisis un courriel et un mot de passe pour creer ton espace Miso GTM."
                  : "Utilise le courriel et le mot de passe d'un compte deja cree."}
              </p>
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-md border border-neutral-200 bg-white p-1 text-sm font-medium shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setAuthMode("signIn");
                }}
                className={cn(
                  "h-9 rounded px-3 text-neutral-600",
                  !isSignUp && "bg-neutral-950 text-white",
                )}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setAuthMode("signUp");
                }}
                className={cn(
                  "h-9 rounded px-3 text-neutral-600",
                  isSignUp && "bg-neutral-950 text-white",
                )}
              >
                Nouveau compte
              </button>
            </div>

            <form onSubmit={handlePasswordAuth} className="space-y-4">
              <label className="block text-sm font-medium text-neutral-700">
                Courriel
                <span className="mt-1.5 flex h-11 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 shadow-sm focus-within:border-neutral-900">
                  <Mail className="h-4 w-4 text-neutral-400" />
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full bg-transparent text-sm text-neutral-950 outline-none placeholder:text-neutral-400"
                    placeholder="toi@entreprise.com"
                  />
                </span>
              </label>

              <label className="block text-sm font-medium text-neutral-700">
                Mot de passe
                <span className="mt-1.5 flex h-11 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 shadow-sm focus-within:border-neutral-900">
                  <KeyRound className="h-4 w-4 text-neutral-400" />
                  <input
                    name="password"
                    type="password"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    required
                    minLength={8}
                    className="w-full bg-transparent text-sm text-neutral-950 outline-none placeholder:text-neutral-400"
                    placeholder="8 caracteres minimum"
                  />
                </span>
              </label>

              <input name="flow" type="hidden" value={authMode} />

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-neutral-950 px-4 text-sm font-medium text-white shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isSignUp ? (
                  <UserPlus className="h-4 w-4" />
                ) : (
                  <LockKeyhole className="h-4 w-4" />
                )}
                {isSignUp ? "Creer le compte" : "Se connecter"}
              </button>
            </form>

            {error ? (
              <p
                role="alert"
                className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {error}
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => {
                setError(null);
                setAuthMode(isSignUp ? "signIn" : "signUp");
              }}
              className="mt-5 text-sm font-medium text-neutral-700 underline-offset-4 hover:underline"
            >
              {isSignUp
                ? "J'ai deja un compte"
                : "Je n'ai pas encore de compte"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function getAuthErrorMessage(error: unknown, authMode: "signIn" | "signUp") {
  if (error === null) {
    return authMode === "signIn"
      ? "La connexion n'a pas abouti. Verifie le courriel et le mot de passe."
      : "Le compte a peut-etre deja ete cree. Essaie de te connecter.";
  }

  const message = error instanceof Error ? error.message : String(error);

  if (message.toLowerCase().includes("already")) {
    return "Un compte existe deja avec ce courriel. Utilise la connexion.";
  }

  if (message.toLowerCase().includes("password")) {
    return "Utilise un mot de passe d'au moins 8 caracteres.";
  }

  return authMode === "signIn"
    ? "Courriel ou mot de passe invalide. Si tu n'as pas encore cree ce compte, utilise Nouveau compte."
    : "Impossible de creer le compte avec ces informations.";
}

function LoginMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-neutral-200 px-4 py-4 last:border-r-0 max-sm:border-r-0 max-sm:border-b max-sm:last:border-b-0">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 font-semibold text-neutral-950">{value}</p>
    </div>
  );
}
