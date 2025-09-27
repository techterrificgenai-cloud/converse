import { Skeleton } from "@/components/ui/skeleton";

export default function SpeakerLoading() {
  return (
    <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
        <div>
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-64 w-full" />
        </div>
    </div>
  );
}
