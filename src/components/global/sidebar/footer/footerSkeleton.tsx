import { SidebarFooter } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function FooterSkeleton() {
  return (
    <SidebarFooter className="m-3 shadow-lg bg-white dark:bg-neutral-800 rounded-xl p-3 flex flex-row justify-start items-start">
      <Skeleton className="w-10 h-10 rounded-lg pt-1" aria-hidden="true" />
      <div className="flex flex-col justify-start items-start ml-2 space-y-2 flex-grow">
        <Skeleton className="w-3/4 h-5 rounded-lg" aria-hidden="true" />
        <Skeleton className="w-full h-10 rounded-lg" aria-hidden="true" />
      </div>
    </SidebarFooter>
  );
}
