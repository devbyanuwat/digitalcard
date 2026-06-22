"use client";

import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Plus, Trash2 } from "lucide-react";
import { useBuilder } from "@/lib/card/store";
import type { BlockType, CardBlock } from "@/lib/card/types";
import { ADDABLE, BLOCK_META, blockSummary } from "../block-meta";
import { cn } from "@/lib/utils";

export function ContentTab() {
  const blocks = useBuilder((s) => s.doc.blocks);
  const moveBlock = useBuilder((s) => s.moveBlock);
  const addBlock = useBuilder((s) => s.addBlock);
  const [adding, setAdding] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) moveBlock(String(active.id), String(over.id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Blocks
        </h3>
        <span className="rounded-full border border-border px-2 text-xs text-muted-foreground tabular-nums">
          {blocks.length}
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1">
            {blocks.map((b) => (
              <BlockRow key={b.id} block={b} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {adding ? (
        <AddPicker
          onPick={(t) => {
            addBlock(t);
            setAdding(false);
          }}
          onClose={() => setAdding(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-md border border-dashed border-border-strong text-[13px] font-medium text-muted-foreground transition-colors hover:border-brand hover:bg-brand-subtle hover:text-brand"
        >
          <Plus className="size-4" />
          Add block
        </button>
      )}
    </div>
  );
}

function BlockRow({ block }: { block: CardBlock }) {
  const selected = useBuilder((s) => s.selectedBlockId === block.id);
  const select = useBuilder((s) => s.selectBlock);
  const toggle = useBuilder((s) => s.toggleVisible);
  const remove = useBuilder((s) => s.removeBlock);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });
  const meta = BLOCK_META[block.type];
  const Icon = meta.icon;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group flex items-center gap-1.5 rounded-md border p-1.5 pl-1",
        selected
          ? "border-brand bg-background ring-[3px] ring-brand-subtle"
          : "border-transparent hover:bg-secondary",
        isDragging && "z-10 opacity-70 shadow-md",
        !block.visible && "opacity-55",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="cursor-grab touch-none text-fg-subtle hover:text-muted-foreground"
      >
        <GripVertical className="size-4" />
      </button>

      <button
        type="button"
        onClick={() => select(block.id)}
        className="flex min-w-0 flex-1 items-center gap-2 text-left"
      >
        <span
          className={cn(
            "grid size-7 place-items-center rounded-md border",
            selected
              ? "border-transparent bg-brand-subtle text-brand"
              : "border-border bg-secondary text-muted-foreground",
          )}
        >
          <Icon className="size-3.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium">{meta.label}</span>
          <span className="block truncate text-[11px] text-fg-subtle">{blockSummary(block)}</span>
        </span>
      </button>

      <button
        type="button"
        onClick={() => toggle(block.id)}
        aria-label={block.visible ? "Hide block" : "Show block"}
        className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        {block.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
      </button>
      <button
        type="button"
        onClick={() => remove(block.id)}
        aria-label="Remove block"
        className="grid size-7 place-items-center rounded-md text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}

function AddPicker({
  onPick,
  onClose,
}: {
  onPick: (t: BlockType) => void;
  onClose: () => void;
}) {
  return (
    <div className="rounded-md border border-border bg-background p-2">
      <div className="mb-1.5 flex items-center justify-between px-1">
        <span className="text-xs font-medium text-muted-foreground">Add a block</span>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-fg-subtle hover:text-foreground"
        >
          Close
        </button>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {ADDABLE.map((t) => {
          const M = BLOCK_META[t];
          const I = M.icon;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onPick(t)}
              className="flex flex-col items-center gap-1 rounded-md border border-border p-2 text-center transition-colors hover:border-brand hover:bg-brand-subtle"
            >
              <I className="size-4 text-muted-foreground" />
              <span className="text-[11px] font-medium">{M.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
