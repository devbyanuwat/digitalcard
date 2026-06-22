"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CardDocument } from "@/lib/card/types";
import { useBuilder } from "@/lib/card/store";
import { Topbar } from "./Topbar";
import { LeftPanel } from "./LeftPanel";
import { Playground } from "./Playground";
import { Inspector } from "./Inspector";
import { ShareDialog } from "./ShareDialog";
import { Toaster } from "@/components/ui/sonner";

const emptySubscribe = () => () => {};

/** False during SSR + the hydration pass, true once on the client — no mismatch. */
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export interface BuilderProps {
  isAuthed?: boolean;
  initialCardId?: string | null;
  initialDoc?: CardDocument | null;
}

export function Builder({ isAuthed = false, initialCardId = null, initialDoc = null }: BuilderProps) {
  const hydrated = useHydrated();
  const [shareOpen, setShareOpen] = useState(false);
  const setCard = useBuilder((s) => s.setCard);
  const loaded = useRef(false);

  // Load a saved DB card into the editor once on mount.
  useEffect(() => {
    if (!loaded.current && initialCardId && initialDoc) {
      loaded.current = true;
      setCard(initialCardId, initialDoc);
    }
  }, [initialCardId, initialDoc, setCard]);

  if (!hydrated) {
    return (
      <div className="grid h-dvh place-items-center text-sm text-muted-foreground">
        Loading editor…
      </div>
    );
  }

  return (
    <div className="grid h-dvh grid-rows-[49px_1fr] overflow-hidden">
      <Topbar isAuthed={isAuthed} onShare={() => setShareOpen(true)} />
      <div className="grid min-h-0 grid-cols-[320px_1fr_300px] max-lg:grid-cols-[300px_1fr]">
        <LeftPanel />
        <Playground onShare={() => setShareOpen(true)} />
        <div className="max-lg:hidden">
          <Inspector />
        </div>
      </div>
      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} />
      <Toaster position="bottom-center" />
    </div>
  );
}
