"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";
import type { ApplicantStatus } from "@/features/result/getResultData";

interface ResultViewedTrackerProps {
  status: ApplicantStatus;
  university: string;
  modalidad: string;
}

// Fires once per result view — the core signal for "does the contextualized
// result land?", split by the 4 distinct statuses. Renders nothing.
export function ResultViewedTracker({ status, university, modalidad }: ResultViewedTrackerProps) {
  useEffect(() => {
    track("result_viewed", { status, university, modalidad });
  }, [status, university, modalidad]);

  return null;
}
