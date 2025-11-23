import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import type { Career } from "@/types/exam";

interface CareerListItemProps {
  career: Career;
  examId: string;
}

export function CareerListItem({ career, examId }: CareerListItemProps) {
  return (
    <Link href={`/exam/${examId}/career/${career.id}`}>
      <Card
        isPressable
        className="w-full transition-transform hover:scale-[1.01]"
        shadow="sm"
      >
        <CardBody className="gap-4 p-4">
          <div className="flex items-start gap-4">
            <Avatar
              icon={<GraduationCap className="h-6 w-6" />}
              classNames={{
                base: "bg-primary-100 dark:bg-primary-900/20",
                icon: "text-primary",
              }}
              size="lg"
              className="flex-shrink-0"
            />
            <div className="flex flex-1 flex-col gap-3">
              <h3 className="text-lg font-semibold text-foreground">
                {career.name}
              </h3>

              <div className="flex flex-col gap-2 border-t border-divider pt-3 sm:flex-row sm:gap-8">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-default-600">Postulantes:</span>
                  <strong className="text-base text-foreground">
                    {career.applicants?.toLocaleString() || "N/A"}
                  </strong>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-default-600">Vacantes:</span>
                  <strong className="text-base text-foreground">
                    {career.seats?.toLocaleString() || "N/A"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
