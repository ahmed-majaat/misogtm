import { GtmMatrix } from "@/gtm-matrix";
import { demoInitiatives } from "@/demo-data";

export function DemoApp() {
  return <GtmMatrix initiatives={demoInitiatives} />;
}
