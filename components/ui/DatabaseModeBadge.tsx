import { getEnvironment } from "@/lib/config/env";
import { Badge } from "./Badge";

export function DatabaseModeBadge() {
  const env = getEnvironment();
  return (
    <Badge tone={env.databaseMode === "live" ? "live" : "demo"}>
      {env.databaseMode === "live" ? "Live AWS" : "Demo Adapter"}
    </Badge>
  );
}
