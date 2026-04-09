const tabs = ["전체", "완료", "미완료"] as const;

interface Props {
  current: string;
  onChange: (v: any) => void;
}

export function FilterTabs({ current, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            current === t
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-muted"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
