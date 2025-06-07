"use client";
import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/atoms/tabs";
import { StageResultsTable } from "@/components/organisms/StageResultsTable";
import { Card } from "@/components/molecules/basic/card";
import { Separator } from "../atoms/separator";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE = "/api";

interface StageResult {
  vehicleId: number;
  vehicleName: string;
  driverName: string;
  categoryId: number;
  categoryName: string;
  stageTimes: any[];
  totalTime: number;
}

interface ResultsTabsProps {
  results: StageResult[];
  stagesCount: number;
  categories: string[];
  eventId: number;
}

export const ResultsTabs: React.FC<
  ResultsTabsProps & { stages: { id: number; name: string }[] }
> = ({ results, stagesCount, categories, stages, eventId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Leer stage y category de la URL
  const initialStage = searchParams.get("stage");
  const initialCategory = searchParams.get("category");

  const [selectedStage, setSelectedStage] = useState<number | "all">(
    initialStage && initialStage !== "all" ? Number(initialStage) : "all"
  );
  const [stageResults, setStageResults] = useState(results);
  const [loading, setLoading] = useState(false);
  const [categoryTabs, setCategoryTabs] = useState<string[]>(categories);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || "general"
  );

  // Actualizar la URL al cambiar de stage o categoría
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("stage", selectedStage.toString());
    params.set("category", selectedCategory);
    router.replace(`?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStage, selectedCategory]);

  // Obtener categorías reales desde la API
  useEffect(() => {
    fetch(`${API_BASE}/event-categories/byevent/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategoryTabs(data.map((c: any) => c.category.name));
        }
      });
  }, [eventId]);

  // Fetch de resultados desde la API real
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        let url = "";
        if (selectedStage === "all") {
          url = `${API_BASE}/stageresults/clasificacion?eventId=${eventId}`;
        } else {
          url = `${API_BASE}/stageresults/clasificacionbystage?eventId=${eventId}&stageNumber=${selectedStage}`;
        }
        const res = await fetch(url);
        if (!res.ok) {
          setStageResults([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setStageResults(Array.isArray(data) ? data : []);
      } catch (e) {
        setStageResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStage, eventId]);

  // Filtrado de resultados por stage y categoría
  const filterByStageAndCategory = (r: any) => {
    if (selectedStage === "all") {
      if (selectedCategory === "general") return true;
      return r.categoryName === selectedCategory;
    }
    return (
      r.stageTimes &&
      r.stageTimes.length > 0 &&
      r.stageTimes[0]?.adjustedTimeSeconds >= 0
    );
  };

  return (
    <Card className="w-full p-4 rounded-none">
      {/* Botones de stages tipo "All Maps" */}
      <div className="flex w-full gap-2 mb-4">
        <button
          className={`flex-1 px-2 py-6 font-semibold text-sm transition-colors border ${
            selectedStage === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
          onClick={() => setSelectedStage("all")}
        >
          General
        </button>
        {stages.map((stage, idx) => (
          <button
            key={stage.id}
            className={`flex-1 px-2 py-2 rounded font-semibold text-sm transition-colors border ${
              selectedStage === idx
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
            onClick={() => setSelectedStage(idx)}
          >
            {`Etapa ${idx}`}
          </button>
        ))}
      </div>
      <Separator className="mb-4" />
      {/* Tabs de categorías */}
      {loading ? (
        <div className="flex items-center justify-center w-full h-32 text-muted-foreground">
          Cargando resultados...
        </div>
      ) : (
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-full"
        >
          <div className="flex items-center justify-end w-full">
            <TabsList className="ml-auto">
              <TabsTrigger value="general">General</TabsTrigger>
              {categoryTabs.map((cat) => (
                <TabsTrigger key={cat} value={cat}>
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <TabsContent value="general" className="p-0 border-none outline-none">
            <StageResultsTable
              results={stageResults.filter(filterByStageAndCategory)}
              stagesCount={stagesCount}
              showCategory
              selectedStage={selectedStage}
            />
          </TabsContent>
          {categoryTabs.map((cat) => (
            <TabsContent
              key={cat}
              value={cat}
              className="p-0 border-none outline-none"
            >
              <StageResultsTable
                results={stageResults.filter(
                  (r) => r.categoryName === cat && filterByStageAndCategory(r)
                )}
                stagesCount={stagesCount}
                selectedStage={selectedStage}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </Card>
  );
};
