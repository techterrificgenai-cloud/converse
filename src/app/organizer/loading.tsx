import { Skeleton } from "@/components/ui/skeleton";

export default function OrganizerLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div>
        <Skeleton className="h-10 w-full rounded-t-lg rounded-b-none" />
        <div className="border border-t-0 p-6 rounded-b-lg">
          <div className="space-y-4">
             <Skeleton className="h-12 w-full" />
             <Skeleton className="h-12 w-full" />
             <Skeleton className="h-12 w-full" />
             <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
