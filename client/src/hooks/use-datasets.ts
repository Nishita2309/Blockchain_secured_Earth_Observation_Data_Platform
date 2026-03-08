import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type DatasetResponse } from "@shared/routes";
import { type InsertDataset } from "@shared/schema";

export function useDatasets() {
  return useQuery({
    queryKey: [api.datasets.list.path],
    queryFn: async () => {
      const res = await fetch(api.datasets.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch datasets");
      const data = await res.json();
      return api.datasets.list.responses[200].parse(data);
    },
  });
}

export function useDataset(id: number) {
  return useQuery({
    queryKey: [api.datasets.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.datasets.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch dataset");
      const data = await res.json();
      return api.datasets.get.responses[200].parse(data);
    },
    enabled: !!id && !isNaN(id),
  });
}

export function useCreateDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dataset: InsertDataset) => {
      const res = await fetch(api.datasets.create.path, {
        method: api.datasets.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(api.datasets.create.input.parse(dataset)),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400 || res.status === 401) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to create dataset");
        }
        throw new Error("Failed to create dataset");
      }
      return api.datasets.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.datasets.list.path] });
    },
  });
}

export function useAnalyzeDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.datasets.analyze.path, { id });
      const res = await fetch(url, {
        method: api.datasets.analyze.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Analysis failed");
      }
      return api.datasets.analyze.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.datasets.get.path, data.id] });
      queryClient.invalidateQueries({ queryKey: [api.datasets.list.path] });
    },
  });
}
