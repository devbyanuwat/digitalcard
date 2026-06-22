"use client";

import { Layers, Palette, Settings, SlidersHorizontal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentTab } from "./tabs/ContentTab";
import { ThemeTab } from "./tabs/ThemeTab";
import { StyleTab } from "./tabs/StyleTab";
import { SettingsTab } from "./tabs/SettingsTab";

const TRIGGER =
  "flex h-auto flex-col items-center gap-1 rounded-md py-1.5 text-[11px] font-medium text-muted-foreground data-[state=active]:bg-brand-subtle data-[state=active]:text-brand data-[state=active]:shadow-none";

export function LeftPanel() {
  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-border bg-background">
      <Tabs defaultValue="content" className="flex h-full min-h-0 flex-col gap-0">
        <div className="shrink-0 border-b border-border p-2">
          <TabsList className="grid h-auto w-full grid-cols-4 gap-1 bg-transparent p-0">
            <TabsTrigger value="content" className={TRIGGER}>
              <Layers className="size-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="theme" className={TRIGGER}>
              <Palette className="size-4" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="style" className={TRIGGER}>
              <SlidersHorizontal className="size-4" />
              Style
            </TabsTrigger>
            <TabsTrigger value="settings" className={TRIGGER}>
              <Settings className="size-4" />
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <TabsContent value="content" className="m-0 p-3">
            <ContentTab />
          </TabsContent>
          <TabsContent value="theme" className="m-0 p-3">
            <ThemeTab />
          </TabsContent>
          <TabsContent value="style" className="m-0 p-3">
            <StyleTab />
          </TabsContent>
          <TabsContent value="settings" className="m-0 p-3">
            <SettingsTab />
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
}
