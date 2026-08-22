import { useMutation } from "@tanstack/react-query";
import { paymentsApi, type CheckoutPayload, type CheckoutResponse } from "@/lib/api/payments";

export function useCheckout() {
  return useMutation<CheckoutResponse, Error, CheckoutPayload>({
    mutationFn: (payload) => paymentsApi.checkout(payload),
  });
}
