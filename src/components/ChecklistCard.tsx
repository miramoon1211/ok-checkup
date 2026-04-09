import { useState, useEffect, useRef, useCallback } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import type { CheckItem } from "@/hooks/useChecklist";

interface Props {
  item: CheckItem;
  onToggle: (id: string) => void;
  onMemoChange: (id: string, memo: string) => void;
  onDelete: (id: string) => void;
}

export function ChecklistCard({ item, onToggle, onMemoChange, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [localMemo, setLocalMemo] = useState(item.memo);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setLocalMemo(item.memo);
  }, [item.memo]);

  const debouncedSave = useCallback(
    (value: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onMemoChange(item.id, value);
      }, 600);
    },
    [item.id, onMemoChange]
  );

  const handleMemoChange = (value: string) => {
    setLocalMemo(value);
    debouncedSave(value);
  };

  return (
    <div
      className={`rounded-lg px-3 py-3 transition-colors ${
        item.checked ? "bg-muted/30" : "hover:bg-secondary/40"
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
            item.checked ? "text-muted-foreground line-through" : "text-card-foreground"
          }`}
        >
          {item.title}
        </span>
        <button
          onClick={() => onDelete(item.id)}
          className="shrink-0 text-muted-foreground/50 transition-colors hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
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
            value={localMemo}
            onChange={(e) => handleMemoChange(e.target.value)}
            placeholder="메모를 입력하세요..."
            className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            rows={2}
          />
        </div>
      )}
    </div>
  );
}
