import { useState } from "react";
import { Plus } from "lucide-react";

interface Props {
  categories: string[];
  onAdd: (title: string, category: string) => void;
}

export function AddItemForm({ categories, onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0] ?? "");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), category);
    setTitle("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => {
          setCategory(categories[0] ?? "");
          setOpen(true);
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="h-4 w-4" />
        항목 추가
      </button>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="점검 항목명을 입력하세요"
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          저장
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded-lg bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted"
        >
          취소
        </button>
      </div>
    </div>
  );
}
