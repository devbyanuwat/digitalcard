import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";
import type {
  CardBlock,
  CardCustomization,
  CardDocument,
  BlockType,
} from "./types";
import { sampleCard } from "./sample";

/** Default block factory — used by "Add block". */
function createBlock(type: BlockType): CardBlock {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `b-${Date.now()}`;
  const base = { id, visible: true } as const;
  switch (type) {
    case "header":
      return { ...base, type, data: { name: "Your name", title: "", company: "" } };
    case "bio":
      return { ...base, type, data: { text: "" } };
    case "links":
      return { ...base, type, data: { items: [] } };
    case "social":
      return { ...base, type, data: { items: [] } };
    case "contact":
      return { ...base, type, data: {} };
    case "cta":
      return { ...base, type, data: { label: "Button", url: "", style: "solid" } };
    case "gallery":
      return { ...base, type, data: { images: [] } };
    case "map":
      return { ...base, type, data: { lat: 13.7563, lng: 100.5018, label: "" } };
    case "divider":
      return { ...base, type };
    case "spacer":
      return { ...base, type, data: { size: "md" } };
  }
}

export interface BuilderState {
  doc: CardDocument;
  selectedBlockId: string | null;
  /** The DB card being edited (null = local/anonymous draft). */
  cardId: string | null;

  /** Load a saved card from the DB into the editor. */
  setCard: (cardId: string | null, doc: CardDocument) => void;
  selectBlock: (id: string | null) => void;
  updateBlockData: (id: string, data: Record<string, unknown>) => void;
  addBlock: (type: BlockType) => void;
  removeBlock: (id: string) => void;
  toggleVisible: (id: string) => void;
  moveBlock: (activeId: string, overId: string) => void;

  setTheme: (themeId: string) => void;
  setCustomization: (c: Partial<CardCustomization>) => void;
  resetCustomization: () => void;
  setMeta: (meta: Partial<CardDocument["meta"]>) => void;
  setSlug: (slug: string) => void;

  reset: () => void;
}

const initialDoc: CardDocument = sampleCard;

export const useBuilder = create<BuilderState>()(
  persist(
    (set) => ({
      doc: initialDoc,
      selectedBlockId: initialDoc.blocks[0]?.id ?? null,
      cardId: null,

      setCard: (cardId, doc) =>
        set({ cardId, doc, selectedBlockId: doc.blocks[0]?.id ?? null }),
      selectBlock: (id) => set({ selectedBlockId: id }),

      updateBlockData: (id, data) =>
        set((s) => ({
          doc: {
            ...s.doc,
            blocks: s.doc.blocks.map((b) =>
              b.id === id && "data" in b
                ? ({ ...b, data: { ...b.data, ...data } } as CardBlock)
                : b,
            ),
          },
        })),

      addBlock: (type) =>
        set((s) => {
          const block = createBlock(type);
          return {
            doc: { ...s.doc, blocks: [...s.doc.blocks, block] },
            selectedBlockId: block.id,
          };
        }),

      removeBlock: (id) =>
        set((s) => ({
          doc: { ...s.doc, blocks: s.doc.blocks.filter((b) => b.id !== id) },
          selectedBlockId: s.selectedBlockId === id ? null : s.selectedBlockId,
        })),

      toggleVisible: (id) =>
        set((s) => ({
          doc: {
            ...s.doc,
            blocks: s.doc.blocks.map((b) =>
              b.id === id ? { ...b, visible: !b.visible } : b,
            ),
          },
        })),

      moveBlock: (activeId, overId) =>
        set((s) => {
          const from = s.doc.blocks.findIndex((b) => b.id === activeId);
          const to = s.doc.blocks.findIndex((b) => b.id === overId);
          if (from === -1 || to === -1 || from === to) return s;
          return { doc: { ...s.doc, blocks: arrayMove(s.doc.blocks, from, to) } };
        }),

      setTheme: (themeId) => set((s) => ({ doc: { ...s.doc, themeId } })),

      setCustomization: (c) =>
        set((s) => ({
          doc: { ...s.doc, customization: { ...s.doc.customization, ...c } },
        })),

      resetCustomization: () =>
        set((s) => ({ doc: { ...s.doc, customization: {} } })),

      setMeta: (meta) =>
        set((s) => ({ doc: { ...s.doc, meta: { ...s.doc.meta, ...meta } } })),

      setSlug: (slug) => set((s) => ({ doc: { ...s.doc, slug } })),

      reset: () => set({ doc: initialDoc, selectedBlockId: initialDoc.blocks[0]?.id ?? null }),
    }),
    {
      name: "digitalcard:doc",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ doc: s.doc }),
    },
  ),
);
