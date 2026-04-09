import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

export function UserHeader() {
  const { user, signOut } = useAuth();
  if (!user) return null;

  const meta = user.user_metadata;
  const name = meta?.full_name || meta?.name || user.email || "사용자";
  const avatar = meta?.avatar_url || meta?.picture;

  return (
    <div className="mb-6 flex items-center justify-between rounded-xl border bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        {avatar ? (
          <img src={avatar} alt={name} className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {name.charAt(0)}
          </div>
        )}
        <span className="text-sm font-medium text-foreground">{name}</span>
      </div>
      <button
        onClick={signOut}
        className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted"
      >
        <LogOut className="h-3.5 w-3.5" />
        로그아웃
      </button>
    </div>
  );
}
