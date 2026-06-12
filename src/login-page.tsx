import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import {
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();
  const [pendingAction, setPendingAction] = useState<"google" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      void navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  async function signInWithGoogle() {
    setError(null);
    setPendingAction("google");

    try {
      const result = await signIn("google", { redirectTo: "/" });
      if (result.redirect) {
        window.location.href = result.redirect.toString();
      }
    } catch {
      setError("Connexion Google indisponible pour le moment.");
      setPendingAction(null);
    }
  }

  const isGooglePending = pendingAction === "google";

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
              <h2 className="text-2xl font-semibold text-neutral-950">Connexion</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Utilise ton compte Google pour ouvrir ton espace Miso GTM.
              </p>
            </div>

            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={isGooglePending}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-900 shadow-sm disabled:opacity-50"
            >
              {isGooglePending ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleMark />}
              Continuer avec Google
            </button>

            {error ? (
              <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function GoogleMark() {
  return (
    <span className="grid h-4 w-4 place-items-center rounded-full border border-neutral-200 text-[10px] font-semibold text-neutral-700">
      G
    </span>
  );
}

function LoginMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-neutral-200 px-4 py-4 last:border-r-0 max-sm:border-r-0 max-sm:border-b max-sm:last:border-b-0">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 font-semibold text-neutral-950">{value}</p>
    </div>
  );
}
