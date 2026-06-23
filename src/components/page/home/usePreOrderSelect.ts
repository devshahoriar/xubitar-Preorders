import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

interface SelectState {
  selectedIds: Set<string>;
  toggleSelect: (id: string | string[]) => void;
}

const useSelectStore = create<SelectState>((set) => ({
  selectedIds: new Set<string>(),
  toggleSelect: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (Array.isArray(id)) {
        const allSelected = id.every((x) => next.has(x));
        if (allSelected) {
          id.forEach((x) => next.delete(x));
        } else {
          id.forEach((x) => next.add(x));
        }
      } else {
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
      }
      return { selectedIds: next };
    }),
}));

export function usePerOrderSelect() {
  const { selectedIds, toggleSelect } = useSelectStore(
    useShallow((state) => ({
      selectedIds: state.selectedIds,
      toggleSelect: state.toggleSelect,
    }))
  );

  const select = (id: string | string[]) => {
    toggleSelect(id);
  };

  const isSelect = (id: string) => {
    return selectedIds.has(id);
  };

  return { select, isSelect, selectedIds };
}