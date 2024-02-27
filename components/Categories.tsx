"use client";
import { RefreshCw, StepBack, StepForward, Loader } from "lucide-react";
import type { SimplifiedCategoryObject } from "@/types";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import ContentCard from "./ContentCard";
import useCategories from "@/hooks/useCategories";

export default function Categories() {
  const [pageNumber, setPageNumber] = useState(0);
  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useCategories(pageNumber);
  const { toast } = useToast();
  const [refetching, setRefetching] = useState(false);

  return (
    <div className="flex flex-col w-full gap-8 px-5">
      <div className="flex justify-between">
        <h1 className="text-4xl font-semibold">All Categories</h1>
        <RefreshCw
          size={40}
          onClick={async () => {
            if (refetching || isLoading) return;
            setRefetching(true);
            try {
              await refetch({ throwOnError: true });
            } catch (err: any) {
              toast({
                variant: "destructive",
                title: "Error refetching playlists",
                description: err?.message || "Unknown server error",
              });
            } finally {
              setRefetching(false);
            }
          }}
          className={`cursor-pointer ${refetching ? "animate-spin" : null}`}
        />
      </div>
      <div className="flex flex-wrap lg:justify-between gap-10">
        {!isLoading &&
          !error &&
          categories.map((category: SimplifiedCategoryObject) => (
            <ContentCard
              key={category.categoryId}
              infoObject={category}
              type="category"
              displayNames={true}
            />
          ))}
        {isLoading && <div className="w-full"><Loader className="animate-spin m-auto" /></div>}
        {error && <>Error fetching playlists</>}
      </div>
      <div className="flex justify-center items-center gap-4">
        <StepBack
          className="cursor-pointer"
          onClick={() =>
            !isLoading &&
            !error &&
            setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 0))
          }
        />
        <span>{pageNumber + 1}</span>
        <StepForward
          className="cursor-pointer"
          onClick={() =>
            !isLoading &&
            !error &&
            setPageNumber((prevPageNumber) => prevPageNumber + 1)
          }
        />
      </div>
    </div>
  );
}
