import { createFileRoute } from "@tanstack/react-router";
import siteConfig from "~/site.config";
import { LoginPage } from "@/login-page";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  beforeLoad: () => ({
    title: `${siteConfig.siteTitle} - Connexion`,
  }),
});
