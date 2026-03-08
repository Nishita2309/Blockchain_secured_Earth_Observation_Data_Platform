import { z } from "zod";
import { insertDatasetSchema, insertPurchaseSchema, datasets, purchases } from "./schema";

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  datasets: {
    list: {
      method: "GET" as const,
      path: "/api/datasets" as const,
      responses: {
        200: z.array(z.custom<typeof datasets.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/datasets/:id" as const,
      responses: {
        200: z.custom<typeof datasets.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/datasets" as const,
      input: insertDatasetSchema,
      responses: {
        201: z.custom<typeof datasets.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    analyze: {
      method: "POST" as const,
      path: "/api/datasets/:id/analyze" as const,
      responses: {
        200: z.custom<typeof datasets.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
        500: errorSchemas.internal,
      },
    }
  },
  purchases: {
    list: {
      method: "GET" as const,
      path: "/api/purchases" as const,
      responses: {
        200: z.array(z.custom<typeof purchases.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/purchases" as const,
      input: insertPurchaseSchema,
      responses: {
        201: z.custom<typeof purchases.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type DatasetResponse = z.infer<typeof api.datasets.get.responses[200]>;
export type PurchaseResponse = z.infer<typeof api.purchases.create.responses[201]>;
