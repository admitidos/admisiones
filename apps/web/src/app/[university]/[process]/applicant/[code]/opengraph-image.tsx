import { ImageResponse } from "next/og";
import { getResultData } from "@/features/result/getResultData";
import { formatScore, formatPoints } from "@/lib/utils/formatters";

export const alt = "Resultado de admisión — admisiones";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CODE_RE = /^\d{6}$/;

const STATUS_CONFIG = {
  admitted: { label: "Ingresó ✓", bg: "#eef7f1", color: "#1c6b3a" },
  not_admitted: { label: "No ingresó", bg: "#faf4e8", color: "#a86b1a" },
  absent: { label: "Ausente", bg: "#f3f4f6", color: "#4b5563" },
  disqualified: { label: "Inhabilitado", bg: "#f3f4f6", color: "#4b5563" },
};

export default async function Image({
  params,
}: {
  params: { university: string; process: string; code: string };
}) {
  if (!CODE_RE.test(params.code)) return new Response("Not found", { status: 404 });

  const data = await getResultData({
    universityAcronym: params.university.toUpperCase(),
    processSlug: params.process,
    applicantCode: params.code,
  });

  if (!data) return new Response("Not found", { status: 404 });

  const { applicant, result, program, computed, university, process } = data;
  const statusConfig = STATUS_CONFIG[result.status];
  const admitted = result.status === "admitted";
  const pointsFormatted = formatPoints(computed.pointsToAdmission);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(145deg, #1e1b4b 0%, #0f766e 100%)",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: statusConfig.bg,
                color: statusConfig.color,
                borderRadius: "8px",
                padding: "6px 16px",
                fontSize: "18px",
                fontWeight: "800",
                width: "fit-content",
              }}
            >
              {statusConfig.label}
            </div>

            <div
              style={{
                fontSize: "40px",
                fontWeight: "700",
                color: "white",
                lineHeight: 1.1,
                maxWidth: "700px",
              }}
            >
              {applicant.fullName}
            </div>

            <div style={{ fontSize: "20px", color: "rgba(255,255,255,0.7)" }}>
              {program.name}
              {program.campus ? ` — ${program.campus}` : ""} · {university.acronym} {process.period}
            </div>

            <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  padding: "16px 24px",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  PUNTAJE
                </span>
                <span style={{ color: "white", fontSize: "48px", fontWeight: "900", lineHeight: 1 }}>
                  {formatScore(result.score)}
                </span>
              </div>

              {computed.cutoffScore !== null && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "rgba(255,255,255,0.12)",
                    borderRadius: "12px",
                    padding: "16px 24px",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {admitted ? "SOBRE EL CORTE" : "PARA EL CORTE"}
                  </span>
                  <span
                    style={{
                      fontSize: "48px",
                      fontWeight: "900",
                      lineHeight: 1,
                      color: admitted ? "#4ade80" : "#fbbf24",
                    }}
                  >
                    {pointsFormatted}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "40px", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "20px" }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", fontWeight: "600" }}>
            admisiones
          </span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
            Resultados con contexto · Universidades públicas del Perú
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
