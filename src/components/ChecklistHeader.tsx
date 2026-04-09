import { ShieldCheck } from "lucide-react";

export function ChecklistHeader() {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
        <ShieldCheck className="h-5 w-5 text-primary-foreground" />
      </div>
      <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        OK금융 업무 점검
      </h1>
    </div>
  );
}
