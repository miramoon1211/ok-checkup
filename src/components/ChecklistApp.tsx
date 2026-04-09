import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ChecklistHeader } from "./ChecklistHeader";
import { ProgressBar } from "./ProgressBar";
import { FilterTabs } from "./FilterTabs";
import { ChecklistCard } from "./ChecklistCard";

export interface CheckItem {
  id: string;
  category: string;
  title: string;
  checked: boolean;
  memo: string;
}

const initialItems: CheckItem[] = [
  { id: "1", category: "월간 점검", title: "고객정보 접근권한 확인", checked: false, memo: "" },
  { id: "2", category: "월간 점검", title: "비밀번호 변경 여부", checked: false, memo: "" },
  { id: "3", category: "월간 점검", title: "문서 보관 상태", checked: false, memo: "" },
  { id: "4", category: "분기 점검", title: "시스템 로그 점검", checked: false, memo: "" },
  { id: "5", category: "분기 점검", title: "외부감사 자료 준비", checked: false, memo: "" },
  { id: "6", category: "분기 점검", title: "규정 변경사항 반영", checked: false, memo: "" },
];

type Filter = "전체" | "완료" | "미완료";

export function ChecklistApp() {
  const [items, setItems] = useState<CheckItem[]>(initialItems);
  const [filter, setFilter] = useState<Filter>("전체");
  const allCategories = [...new Set(initialItems.map((i) => i.category))];
  const [openCats, setOpenCats] = useState<Set<string>>(new Set());

  const completed = items.filter((i) => i.checked).length;

  const toggleCheck = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  };

  const updateMemo = (id: string, memo: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, memo } : i))
    );
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
      </div>
    </div>
  );
}
