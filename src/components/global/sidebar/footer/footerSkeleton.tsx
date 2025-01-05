import { SidebarFooter } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

const FooterSkeleton: React.FC = () => {
  return (
    <SidebarFooter className="m-3 p-3 flex flex-row items-start justify-start rounded-xl shadow-lg bg-white dark:bg-neutral-800">
      <Skeleton className="w-10 h-10 pt-1 rounded-lg" aria-hidden="true" />
      <div className="ml-2 flex flex-col flex-grow items-start justify-start space-y-2">
        <Skeleton className="w-3/4 h-5 rounded-lg" aria-hidden="true" />
        <Skeleton className="w-full h-10 rounded-lg" aria-hidden="true" />
      </div>
    </SidebarFooter>
  );
};

export default FooterSkeleton;
