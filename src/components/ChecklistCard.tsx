import { useState } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react";
import type { CheckItem } from "@/hooks/useChecklist";

interface Props {
  item: CheckItem;
  onToggle: (id: string) => void;
  onMemoChange: (id: string, memo: string) => void;
}

export function ChecklistCard({ item, onToggle, onMemoChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`rounded-lg px-3 py-3 transition-colors ${
        item.checked
          ? "bg-muted/30"
          : "hover:bg-secondary/40"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(item.id)}
          className="shrink-0 text-primary transition-transform hover:scale-110"
        >
          {item.checked ? (
            <CheckCircle2 className="h-6 w-6" />
          ) : (
            <Circle className="h-6 w-6 text-muted-foreground" />
          )}
        </button>
        <span
          className={`flex-1 text-sm font-medium sm:text-base ${
            item.checked
              ? "text-muted-foreground line-through"
              : "text-card-foreground"
          }`}
        >
          {item.title}
        </span>
        <button
          onClick={() => setOpen(!open)}
          className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
        >
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
      {open && (
        <div className="mt-3 pl-9">
          <textarea
            value={item.memo}
            onChange={(e) => onMemoChange(item.id, e.target.value)}
            placeholder="메모를 입력하세요..."
            className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            rows={2}
          />
        </div>
      )}
    </div>
  );
}
