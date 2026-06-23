import { ConvexReactClient } from "convex/react";
import { RouterProvider } from "@tanstack/react-router";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { router } from "@/router";
import { ConvexAuthProvider } from "@convex-dev/auth/react";

// Convex client
const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : undefined;

const convexQueryClient = convex ? new ConvexQueryClient(convex) : undefined;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient?.hashFn(),
      queryFn: convexQueryClient?.queryFn(),
    },
  },
});

convexQueryClient?.connect(queryClient);

function InnerApp() {
  return <RouterProvider router={router} context={{ queryClient }} />;
}

const helmetContext = {};

export default function App() {
  if (!convex) {
    return (
      <HelmetProvider context={helmetContext}>
        <main className="grid min-h-screen place-items-center bg-white px-6 text-center text-neutral-950">
          <div className="max-w-md">
            <p className="text-sm font-medium text-neutral-500">Configuration manquante</p>
            <h1 className="mt-3 text-2xl font-semibold">Connexion au dashboard indisponible</h1>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Ajoute `VITE_CONVEX_URL` a l'environnement pour ouvrir le dashboard Miso GTM.
            </p>
          </div>
        </main>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider context={helmetContext}>
      <ConvexAuthProvider client={convex}>
        <QueryClientProvider client={queryClient}>
          <InnerApp />
        </QueryClientProvider>
      </ConvexAuthProvider>
    </HelmetProvider>
  );
}
