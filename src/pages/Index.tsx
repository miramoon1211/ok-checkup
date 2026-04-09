import { useAuth } from "@/hooks/useAuth";
import { ChecklistApp } from "@/components/ChecklistApp";
import { LoginPage } from "@/components/LoginPage";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return <ChecklistApp />;
};

export default Index;
