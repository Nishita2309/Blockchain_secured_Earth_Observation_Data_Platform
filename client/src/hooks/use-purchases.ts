import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertPurchase } from "@shared/schema";

export function usePurchases() {
  return useQuery({
    queryKey: [api.purchases.list.path],
    queryFn: async () => {
      const res = await fetch(api.purchases.list.path, { credentials: "include" });
      if (res.status === 401) return []; // Not logged in
      if (!res.ok) throw new Error("Failed to fetch purchases");
      const data = await res.json();
      return api.purchases.list.responses[200].parse(data);
    },
  });
}

export function useCreatePurchase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (purchase: InsertPurchase) => {
      const res = await fetch(api.purchases.create.path, {
        method: api.purchases.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(api.purchases.create.input.parse(purchase)),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to complete purchase");
      }
      return api.purchases.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.purchases.list.path] });
    },
  });
}
