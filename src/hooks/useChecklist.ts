import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useEffect, useRef } from "react";

export type CheckItem = {
  id: string;
  title: string;
  category: string;
  checked: boolean;
  memo: string;
  sort_order: number;
};

const SEED_DATA = [
  { title: "고객정보 접근권한 확인", category: "월간 점검", sort_order: 1 },
  { title: "비밀번호 변경 여부", category: "월간 점검", sort_order: 2 },
  { title: "문서 보관 상태", category: "월간 점검", sort_order: 3 },
  { title: "시스템 로그 점검", category: "분기 점검", sort_order: 4 },
  { title: "외부감사 자료 준비", category: "분기 점검", sort_order: 5 },
  { title: "규정 변경사항 반영", category: "분기 점검", sort_order: 6 },
];

export function useChecklist() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const seededRef = useRef(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["checklist_items", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("checklist_items")
        .select("id, title, category, checked, memo, sort_order")
        .order("sort_order");
      if (error) throw error;
      return data as CheckItem[];
    },
    enabled: !!user,
  });

  // Seed default items for new users
  useEffect(() => {
    if (!user || isLoading || seededRef.current) return;
    if (items.length === 0) {
      seededRef.current = true;
      const rows = SEED_DATA.map((d) => ({ ...d, user_id: user.id }));
      supabase
        .from("checklist_items")
        .insert(rows)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["checklist_items", user.id] });
        });
    }
  }, [user, items.length, isLoading, queryClient]);

  const updateItem = useMutation({
    mutationFn: async ({ id, ...fields }: { id: string } & Partial<Pick<CheckItem, "checked" | "memo">>) => {
      const { error } = await supabase.from("checklist_items").update(fields).eq("id", id);
      if (error) throw error;
    },
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ["checklist_items", user?.id] });
      const prev = queryClient.getQueryData<CheckItem[]>(["checklist_items", user?.id]);
      queryClient.setQueryData<CheckItem[]>(["checklist_items", user?.id], (old) =>
        old?.map((i) => (i.id === vars.id ? { ...i, ...vars } : i)) ?? []
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["checklist_items", user?.id], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["checklist_items", user?.id] }),
  });

  const addItem = useMutation({
    mutationFn: async (input: { title: string; category: string }) => {
      if (!user) throw new Error("Not authenticated");
      const maxSort = items.length > 0 ? Math.max(...items.map((i) => i.sort_order)) : 0;
      const { error } = await supabase
        .from("checklist_items")
        .insert({ title: input.title, category: input.category, sort_order: maxSort + 1, user_id: user.id });
      if (error) throw error;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["checklist_items", user?.id] }),
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("checklist_items").delete().eq("id", id);
      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["checklist_items", user?.id] });
      const prev = queryClient.getQueryData<CheckItem[]>(["checklist_items", user?.id]);
      queryClient.setQueryData<CheckItem[]>(["checklist_items", user?.id], (old) =>
        old?.filter((i) => i.id !== id) ?? []
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["checklist_items", user?.id], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["checklist_items", user?.id] }),
  });

  return { items, isLoading, updateItem, addItem, deleteItem };
}
