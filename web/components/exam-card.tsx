import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import Link from "next/link";
import type { Exam } from "@/types/exam";

interface ExamCardProps {
  exam: Exam;
}

export function ExamCard({ exam }: ExamCardProps) {
  return (
    <Link href={`/exam/${exam.id}`}>
      <Card
        isPressable
        className="w-full transition-transform hover:scale-[1.01]"
        shadow="sm"
      >
        <CardBody className="flex flex-row items-center gap-4 p-4">
          <Avatar
            src={exam.logo}
            name={exam.university.charAt(0)}
            size="lg"
            className="flex-shrink-0"
            color="primary"
          />
          <div className="flex flex-1 flex-col gap-1">
            <h3 className="text-base font-semibold sm:text-lg">
              {exam.university}
            </h3>
            <p className="text-sm text-default-600">{exam.examName}</p>
            <p className="text-xs text-default-500 sm:text-sm">
              {exam.examDate}
            </p>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
