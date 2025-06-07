"use client";
import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/atoms/tabs";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface EventTabsProps {
  info: React.ReactNode;
  results: React.ReactNode;
  categoryTabs?: { name: string; content: React.ReactNode }[];
}

export function EventTabs({ info, results, categoryTabs }: EventTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tabParam = searchParams.get("tab");
  const tab = tabParam === "results" ? "results" : "info";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs
      value={tab}
      onValueChange={handleTabChange}
      className="w-full h-full space-y-6"
    >
      <div className="flex items-center space-between">
        <TabsList>
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="info" className="p-0 border-none outline-none">
        {info}
      </TabsContent>
      <TabsContent value="results" className="p-0 border-none outline-none">
        {results}
      </TabsContent>
    </Tabs>
  );
}
