import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ChecklistHeader } from "./ChecklistHeader";
import { ProgressBar } from "./ProgressBar";
import { FilterTabs } from "./FilterTabs";
import { ChecklistCard } from "./ChecklistCard";
import { useChecklist } from "@/hooks/useChecklist";

type Filter = "전체" | "완료" | "미완료";

export function ChecklistApp() {
  const { items, isLoading, updateItem } = useChecklist();
  const [filter, setFilter] = useState<Filter>("전체");
  const [openCats, setOpenCats] = useState<Set<string>>(new Set());

  const completed = items.filter((i) => i.checked).length;

  const toggleCheck = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) updateItem.mutate({ id, checked: !item.checked });
  };

  const updateMemo = (id: string, memo: string) => {
    updateItem.mutate({ id, memo });
  };

  const toggleCat = (cat: string) => {
    setOpenCats((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const filtered = items.filter((i) => {
    if (filter === "완료") return i.checked;
    if (filter === "미완료") return !i.checked;
    return true;
  });

  const categories = [...new Set(filtered.map((i) => i.category))];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
        <ChecklistHeader />
        <ProgressBar completed={completed} total={items.length} />
        <FilterTabs current={filter} onChange={setFilter} />
        {isLoading ? (
          <p className="mt-12 text-center text-muted-foreground">불러오는 중...</p>
        ) : (
          <div className="mt-6 space-y-4">
            {categories.map((cat) => {
              const catItems = filtered.filter((i) => i.category === cat);
              const catCompleted = catItems.filter((i) => i.checked).length;
              const isOpen = openCats.has(cat);
              return (
                <div key={cat} className="overflow-hidden rounded-xl border bg-card">
                  <button
                    onClick={() => toggleCat(cat)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-foreground">{cat}</span>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {catCompleted}/{catItems.length}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t px-1 py-1">
                      {catItems.map((item) => (
                        <ChecklistCard
                          key={item.id}
                          item={item}
                          onToggle={toggleCheck}
                          onMemoChange={updateMemo}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="py-12 text-center text-muted-foreground">
                해당하는 항목이 없습니다.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
