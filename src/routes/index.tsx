import { useAuthActions } from "@convex-dev/auth/react";
import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useConvexAuth } from "convex/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "~/convex/_generated/api";
import type { User } from "~/types";
import siteConfig from "~/site.config";
import { GtmMatrix } from "@/gtm-matrix";

export const Route = createFileRoute("/")({
  component: MisoWorkspace,
  beforeLoad: () => ({
    title: `${siteConfig.siteTitle} - Matrice GTM`,
  }),
});

function MisoWorkspace() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { data: initiatives } = useQuery({
    ...convexQuery(api.gtm.listInitiatives, {}),
    enabled: isAuthenticated,
  });
  const { data: currentUser } = useQuery({
    ...convexQuery(api.app.getCurrentUser, {}),
    enabled: isAuthenticated,
  });
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void navigate({ to: "/login" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !isAuthenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-white text-neutral-950">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
      </main>
    );
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
      void navigate({ to: "/login" });
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <GtmMatrix
      initiatives={initiatives ?? []}
      currentUser={currentUser as User | undefined}
      isSigningOut={isSigningOut}
      onSignOut={() => {
        void handleSignOut();
      }}
    />
  );
}
