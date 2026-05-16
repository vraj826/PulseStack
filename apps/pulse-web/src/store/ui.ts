import { create } from 'zustand';

export const useUiStore = create<{ selectedExecutionId?: string; setSelectedExecutionId: (id: string) => void }>(
  (set) => ({
    selectedExecutionId: undefined,
    setSelectedExecutionId: (selectedExecutionId) => set({ selectedExecutionId }),
  }),
);
