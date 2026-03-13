import { Skeleton } from "@/components/ui/skeleton";

export const BookCardSkeleton = () => (
  <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
    <Skeleton className="aspect-[2/3] w-full" />
    <div className="p-4">
      <Skeleton className="h-4 w-16 rounded-full mb-3" />
      <Skeleton className="h-5 w-full rounded mb-2" />
      <Skeleton className="h-4 w-3/4 rounded mb-3" />
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <Skeleton className="h-3 w-12 rounded" />
        <Skeleton className="h-3 w-8 rounded" />
      </div>
    </div>
  </div>
);

export const BookGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <BookCardSkeleton key={i} />
    ))}
  </div>
);