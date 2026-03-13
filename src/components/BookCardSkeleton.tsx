import { Skeleton } from "@/components/ui/skeleton";

export const BookCardSkeleton = () => (
  <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
    <Skeleton className="aspect-[2/3] w-full rounded-lg mb-4" />
    <Skeleton className="h-4 w-16 rounded-full mb-3" />
    <Skeleton className="h-5 w-full rounded mb-2" />
    <Skeleton className="h-4 w-3/4 rounded mb-3" />
    <div className="flex items-center gap-1 mb-3">
      <Skeleton className="h-3 w-3 rounded-full" />
      <Skeleton className="h-3 w-8 rounded" />
    </div>
    <Skeleton className="h-8 w-full rounded-full" />
  </div>
);

export const BookGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <BookCardSkeleton key={i} />
    ))}
  </div>
);