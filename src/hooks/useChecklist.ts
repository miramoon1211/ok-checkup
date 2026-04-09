import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type CheckItem = {
  id: string;
  title: string;
  category: string;
  checked: boolean;
  memo: string;
  sort_order: number;
};

export function useChecklist() {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["checklist_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("checklist_items")
        .select("id, title, category, checked, memo, sort_order")
        .order("sort_order");
      if (error) throw error;
      return data as CheckItem[];
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, ...fields }: { id: string } & Partial<Pick<CheckItem, "checked" | "memo">>) => {
      const { error } = await supabase
        .from("checklist_items")
        .update(fields)
        .eq("id", id);
      if (error) throw error;
    },
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ["checklist_items"] });
      const prev = queryClient.getQueryData<CheckItem[]>(["checklist_items"]);
      queryClient.setQueryData<CheckItem[]>(["checklist_items"], (old) =>
        old?.map((i) => (i.id === vars.id ? { ...i, ...vars } : i)) ?? []
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["checklist_items"], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist_items"] });
    },
  });

  const addItem = useMutation({
    mutationFn: async (input: { title: string; category: string }) => {
      const maxSort = items.length > 0 ? Math.max(...items.map((i) => i.sort_order)) : 0;
      const { error } = await supabase
        .from("checklist_items")
        .insert({ title: input.title, category: input.category, sort_order: maxSort + 1 });
      if (error) throw error;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist_items"] });
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("checklist_items")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["checklist_items"] });
      const prev = queryClient.getQueryData<CheckItem[]>(["checklist_items"]);
      queryClient.setQueryData<CheckItem[]>(["checklist_items"], (old) =>
        old?.filter((i) => i.id !== id) ?? []
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["checklist_items"], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist_items"] });
    },
  });

  return { items, isLoading, updateItem, addItem, deleteItem };
}
