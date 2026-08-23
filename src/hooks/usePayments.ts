import { useMutation, useQuery } from "@tanstack/react-query";
import {
  paymentsApi,
  type CheckoutPayload,
  type CheckoutResponse,
} from "@/lib/api/payments";

export function useCheckout() {
  return useMutation<CheckoutResponse, Error, CheckoutPayload>({
    mutationFn: (payload) => paymentsApi.checkout(payload),
  });
}

export function useVerifyPayment(txRef: string | null) {
  return useQuery({
    queryKey: ["payments", "verify", txRef],
    queryFn: () => paymentsApi.verify(txRef!),
    enabled: !!txRef,
  });
}
