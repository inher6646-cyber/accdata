import { createActor } from "@/backend";
import type {
  Id,
  NewCashflowEntry,
  NewProduct,
  NewRestock,
  NewTransaction,
  Status,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/** Shared query keys so every page invalidates the same cache entries. */
export const queryKeys = {
  dashboard: ["dashboard"] as const,
  products: ["products"] as const,
  transactions: ["transactions"] as const,
  restocks: ["restocks"] as const,
  cashflow: ["cashflow"] as const,
  cashBalance: ["cashBalance"] as const,
};

/** Dashboard summary, recent transactions, and low-stock products. */
export function useDashboard() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDashboard();
    },
    enabled: !!actor && !isFetching,
  });
}

/** Every product with its derived sold quantity. */
export function useProducts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

/** All transactions, newest first. */
export function useTransactions() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

/** All restocks, newest first. */
export function useRestocks() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.restocks,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listRestocks();
    },
    enabled: !!actor && !isFetching,
  });
}

/** Cash ledger rows ordered by date ascending with a running balance. */
export function useCashflow() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.cashflow,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCashflow();
    },
    enabled: !!actor && !isFetching,
  });
}

/** Current total cash balance. */
export function useCashBalance() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.cashBalance,
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getCashBalance();
    },
    enabled: !!actor && !isFetching,
  });
}

/** Invalidate every derived view after a write. */
function useInvalidateAll() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    void queryClient.invalidateQueries({ queryKey: queryKeys.products });
    void queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
    void queryClient.invalidateQueries({ queryKey: queryKeys.restocks });
    void queryClient.invalidateQueries({ queryKey: queryKeys.cashflow });
    void queryClient.invalidateQueries({ queryKey: queryKeys.cashBalance });
  };
}

/** Create a product. */
export function useCreateProduct() {
  const { actor } = useActor(createActor);
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: async (input: NewProduct) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.createProduct(input);
    },
    onSuccess: () => {
      invalidate();
    },
  });
}

/** Delete a product by id. */
export function useDeleteProduct() {
  const { actor } = useActor(createActor);
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: async (id: Id) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      invalidate();
    },
  });
}

/** Create a manual transaction. */
export function useCreateTransaction() {
  const { actor } = useActor(createActor);
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: async (input: NewTransaction) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.createTransaction(input);
    },
    onSuccess: () => {
      invalidate();
    },
  });
}

/** Change a transaction's status. */
export function useUpdateTransactionStatus() {
  const { actor } = useActor(createActor);
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: async (vars: { id: Id; status: Status }) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.updateTransactionStatus(vars.id, vars.status);
    },
    onSuccess: () => {
      invalidate();
    },
  });
}

/** Import transactions from a raw TAB-separated paste. */
export function useImportTransactions() {
  const { actor } = useActor(createActor);
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: async (raw: string) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.importTransactions(raw);
    },
    onSuccess: () => {
      invalidate();
    },
  });
}

/** Record a restock. */
export function useCreateRestock() {
  const { actor } = useActor(createActor);
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: async (input: NewRestock) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.createRestock(input);
    },
    onSuccess: () => {
      invalidate();
    },
  });
}

/** Record a manual cash entry. */
export function useCreateCashflowEntry() {
  const { actor } = useActor(createActor);
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: async (input: NewCashflowEntry) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.createCashflowEntry(input);
    },
    onSuccess: () => {
      invalidate();
    },
  });
}
