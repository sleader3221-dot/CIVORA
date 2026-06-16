import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "demo"
}: {
  children: React.ReactNode;
  tone?: "demo" | "live" | "low" | "medium" | "high" | "critical";
}) {
  return (
    <span className={cn("badge", tone)}>
      <span className="dot" />
      {children}
    </span>
  );
}
