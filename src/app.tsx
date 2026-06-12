import { ConvexReactClient } from "convex/react";
import { RouterProvider } from "@tanstack/react-router";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { router } from "@/router";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { DemoApp } from "@/demo-app";

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
        <DemoApp />
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
