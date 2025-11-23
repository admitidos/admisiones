"use client";

import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import Link from "next/link";
import type { Applicant } from "@/types/exam";
import { IdCard, CheckCircle, XCircle, UserX } from "lucide-react";

interface ApplicantCardProps {
  applicant: Applicant;
  examId: string;
  careerId: string;
}

export function ApplicantCard({
  applicant,
  examId,
  careerId,
}: ApplicantCardProps) {
  const getAdmissionStatus = () => {
    if (applicant.admitted === null || applicant.admitted === undefined) {
      return null;
    }

    if (applicant.score === 0) {
      return {
        label: "AUSENTE",
        color: "default" as const,
        icon: <UserX className="h-4 w-4" />,
      };
    }

    if (applicant.admitted) {
      return {
        label: "ALCANZÓ VACANTE",
        color: "success" as const,
        icon: <CheckCircle className="h-4 w-4" />,
      };
    }

    return {
      label: "NO ALCANZÓ VACANTE",
      color: "danger" as const,
      icon: <XCircle className="h-4 w-4" />,
    };
  };

  const status = getAdmissionStatus();

  return (
    <Link href={`/exam/${examId}/career/${careerId}/applicant/${applicant.id}`}>
      <Card
        isPressable
        className="w-full transition-transform hover:scale-[1.01]"
        shadow="sm"
      >
        <CardBody className="flex flex-col gap-3 p-4">
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="flex flex-1 flex-col gap-1">
              <h3 className="text-base font-semibold sm:text-lg">
                {applicant.firstName} {applicant.lastName}
              </h3>
              <p className="text-sm text-default-600 flex items-center gap-2">
                <IdCard className="h-4 w-4" />
                Código: {applicant.code}
              </p>
            </div>
            <div className="flex-shrink-0">
              <p className="text-lg font-bold text-primary sm:text-xl">
                {applicant.score.toFixed(4)}
              </p>
            </div>
          </div>

          {status && (
            <div className="flex items-center justify-end pt-2 border-t border-divider">
              <Chip
                color={status.color}
                variant="flat"
                startContent={status.icon}
                size="sm"
              >
                {status.label}
              </Chip>
            </div>
          )}
        </CardBody>
      </Card>
    </Link>
  );
}
