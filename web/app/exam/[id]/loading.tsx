import { Card, CardBody } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 py-6">
      <Card shadow="sm">
        <CardBody className="gap-4 p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-col gap-4">
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  );
}
