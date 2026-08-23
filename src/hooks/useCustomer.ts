import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  customersApi,
  type CustomerProfileData,
  type UpdateCustomerProfilePayload,
} from "@/lib/api/customers";
import type { ReviewQuery } from "@/types";

export const useCustomerProfile = () => {
  return useQuery<CustomerProfileData, Error>({
    queryKey: ["customers", "me"],
    queryFn: () => customersApi.getMyProfile(),
  });
};

export const useUpdateCustomerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCustomerProfilePayload) =>
      customersApi.updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers", "me"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};

export const useCustomerById = (id?: string) => {
  return useQuery<CustomerProfileData, Error>({
    queryKey: ["customers", id],
    queryFn: () => customersApi.getCustomerById(id!),
    enabled: !!id,
  });
};

export const useCustomerReviews = (id?: string, params?: ReviewQuery) => {
  return useQuery({
    queryKey: ["customers", id, "reviews", params],
    queryFn: () => customersApi.getCustomerReviews(id!, params),
    enabled: !!id,
  });
};
