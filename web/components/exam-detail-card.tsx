import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Calendar, Users, GraduationCap } from "lucide-react";
import type { Exam } from "@/types/exam";

interface ExamDetailCardProps {
  exam: Exam;
}

export function ExamDetailCard({ exam }: ExamDetailCardProps) {
  return (
    <Card className="w-full" shadow="sm">
      <CardBody className="gap-4 p-6">
        <div className="flex items-start gap-4">
          <Avatar
            src={exam.logo}
            name={exam.university.charAt(0)}
            size="lg"
            className="flex-shrink-0"
            color="primary"
          />
          <div className="flex flex-1 flex-col gap-2">
            <h2 className="text-xl font-bold sm:text-2xl">{exam.examName}</h2>
            <p className="text-base text-default-600">{exam.university}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-divider pt-4">
          <div className="flex items-center gap-2 text-default-600">
            <Calendar className="h-5 w-5" />
            <span className="text-sm">
              fecha:{" "}
              <strong className="text-foreground">{exam.examDate}</strong>
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <div className="flex items-center gap-2 text-default-600">
              <Users className="h-5 w-5" />
              <span className="text-sm">
                postulantes:{" "}
                <strong className="text-foreground">
                  {exam.applicants?.toLocaleString() || "N/A"}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2 text-default-600">
              <GraduationCap className="h-5 w-5" />
              <span className="text-sm">
                vacantes:{" "}
                <strong className="text-foreground">
                  {exam.seats?.toLocaleString() || "N/A"}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
