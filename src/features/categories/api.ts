import { apiClient } from "@/lib/api";
import type { Category } from "./types";

export const getCategories = async (): Promise<Category[]> => {
  return apiClient.get<Category[]>("/api/v1/categories");
};
