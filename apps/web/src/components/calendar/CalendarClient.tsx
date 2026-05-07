"use client";

import { useState } from "react";
import type {
  CalendarData,
  CalendarExam,
  CalendarNoDataCard,
  CalendarUniversity,
} from "@/features/calendar/getCalendarData";

function UniversityChip({
  u,
  isActive,
  onToggle,
}: {
  u: CalendarUniversity;
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={isActive}
      className="inline-flex flex-shrink-0 cursor-pointer select-none items-center gap-2.5 rounded-[14px] border-[1.5px] py-[7px] pl-[7px] pr-3.5 font-sans transition-all duration-[180ms]"
      style={
        isActive
          ? {
              background: u.color,
              borderColor: u.color,
              color: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            }
          : {
              background: "white",
              borderColor: "var(--border)",
              color: "var(--muted)",
            }
      }
    >
      <span
        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] font-serif text-[11px] font-bold leading-none tracking-[-0.01em] transition-all duration-[180ms] sm:h-9 sm:w-9"
        style={
          isActive
            ? {
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "white",
              }
            : {
                background: u.colorLight,
                border: `1px solid ${u.colorBorder}`,
                color: u.color,
              }
        }
      >
        {u.abbr}
      </span>
      <span className="flex flex-col gap-px">
        <span className="text-[12px] font-bold leading-snug sm:text-[13px]">{u.name}</span>
        <span
          className="text-[10px] font-medium leading-snug sm:text-[11px]"
          style={{ opacity: 0.65 }}
        >
          {u.city}
        </span>
      </span>
    </button>
  );
}

function ExamCard({
  exam,
  university,
}: {
  exam: CalendarExam;
  university: CalendarUniversity;
}) {
  return (
    <div className="relative mb-5 flex">
      <div className="relative z-10 flex w-11 shrink-0 flex-col items-center pt-4 sm:w-13 sm:pt-[18px]">
        <div
          className="h-3 w-3 shrink-0 rounded-full border-[2.5px] border-background sm:h-3.5 sm:w-3.5"
          style={{
            background: university.color,
            boxShadow: `0 0 0 2px ${university.color}`,
          }}
        />
        <div
          className="mt-1.5 whitespace-nowrap text-center font-serif text-[22px] font-bold leading-none tracking-[-0.03em] sm:text-[28px]"
          style={{ color: university.color }}
        >
          {exam.dayLabel}
        </div>
        <div className="mt-0.5 whitespace-nowrap text-center text-[9px] font-semibold uppercase tracking-[0.06em] text-muted sm:text-[10px]">
          {exam.monthLabel}
        </div>
      </div>

      <div
        className="ml-2.5 min-w-0 flex-1 overflow-hidden rounded-[14px] border border-border bg-white transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)] sm:ml-3.5 sm:rounded-[16px]"
        style={{ borderLeftWidth: 4, borderLeftColor: university.color }}
      >
        <div className="px-4 pb-3 pt-3.5 sm:px-5 sm:pb-3.5 sm:pt-4">
          <div
            className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.08em] sm:text-[11px]"
            style={{ color: university.color }}
          >
            {exam.universityLabel}
          </div>
          <div className="mb-0.5 text-[14px] font-bold leading-snug tracking-[-0.01em] text-foreground sm:text-[15px]">
            {exam.name}
          </div>
          <div className="text-[11px] leading-relaxed text-muted sm:text-[12px]">{exam.meta}</div>

          {exam.countdown && (
            <div
              className="mt-2.5 inline-flex items-baseline gap-1 rounded-[8px] px-[11px] py-[5px] sm:px-3.5 sm:py-1.5"
              style={{
                background: university.colorLight,
                border: `1px solid ${university.colorBorder}`,
              }}
            >
              <span
                className="font-serif text-[18px] font-bold leading-none tracking-[-0.02em] sm:text-[22px]"
                style={{ color: university.color }}
              >
                {exam.countdown.display}
              </span>
              <span className="text-[11px] font-medium text-muted sm:text-xs">
                {exam.countdown.label}
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-border px-4 pb-3 pt-2 sm:px-5 sm:pb-3.5 sm:pt-2.5">
          {exam.sessions.map((s, i) => (
            <div
              key={i}
              className="flex items-start gap-2 border-b border-border py-1.5 last:border-b-0"
            >
              <div
                className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: university.color, opacity: 0.5 }}
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold leading-snug text-foreground sm:text-[13px]">
                  {s.dateLabel}
                </div>
                <div className="mt-0.5 text-[11px] leading-snug text-muted sm:text-xs">
                  {s.description}
                </div>
              </div>
              <div className="mt-0.5 shrink-0 text-[11px] font-medium text-muted">{s.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NoDataCard({
  card,
  university,
}: {
  card: CalendarNoDataCard;
  university: CalendarUniversity;
}) {
  return (
    <div className="relative mb-5 flex">
      <div className="relative z-10 flex w-11 shrink-0 flex-col items-center pt-4 sm:w-13">
        <div
          className="h-3 w-3 shrink-0 rounded-full border-[2.5px] border-background sm:h-3.5 sm:w-3.5"
          style={{
            background: university.color,
            boxShadow: `0 0 0 2px ${university.color}`,
            opacity: 0.3,
          }}
        />
      </div>

      <div
        className="ml-2.5 min-w-0 flex-1 rounded-[14px] px-4 py-3.5 opacity-70 sm:ml-3.5 sm:rounded-[16px] sm:px-5 sm:py-4"
        style={{
          border: "1.5px dashed var(--border)",
          borderLeft: `4px solid ${university.color}`,
        }}
      >
        <div
          className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.08em]"
          style={{ color: university.color }}
        >
          {card.universityLabel}
        </div>
        <div className="mb-1.5 text-[14px] font-bold leading-snug tracking-[-0.01em] text-muted">
          {card.title}
        </div>
        <div className="text-[12px] leading-relaxed text-muted">{card.description}</div>
        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-[8px] border border-border bg-background px-2.5 py-1 text-[11px] text-muted">
          <svg
            width="11"
            height="11"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {card.badge}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] border border-border bg-white">
        <svg
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          className="text-muted"
          aria-hidden="true"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <h2 className="mb-1.5 text-[15px] font-bold text-foreground">¿A cuál vas a postular?</h2>
      <p className="mx-auto max-w-[280px] text-[13px] leading-relaxed text-muted">
        Selecciona arriba las universidades que te interesan para ver sus próximas fechas de examen
        y prepararte a tiempo.
      </p>
    </div>
  );
}

export function CalendarClient({ data }: { data: CalendarData }) {
  const [active, setActive] = useState<Set<string>>(
    () => new Set(data.universities.filter((u) => u.defaultActive).map((u) => u.id)),
  );

  const toggle = (id: string) =>
    setActive((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const uniMap = Object.fromEntries(data.universities.map((u) => [u.id, u]));
  const visibleExams = data.exams.filter((e) => active.has(e.universityId));
  const visibleNoData = data.noDataCards.filter((c) => active.has(c.universityId));
  const isEmpty = active.size === 0;

  return (
    <>
      <div
        className="sticky top-15 z-40 border-b border-border bg-background px-5 py-3.5 sm:px-8 sm:py-4 lg:px-12"
        role="group"
        aria-label="Filtrar por universidad"
      >
        <div className="mx-auto max-w-180">
          <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
            ¿A qué universidades postulas?
          </span>
          <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {data.universities.map((u) => (
              <UniversityChip
                key={u.id}
                u={u}
                isActive={active.has(u.id)}
                onToggle={() => toggle(u.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-180 px-5 pb-16 pt-7 sm:px-8 sm:pb-[72px] sm:pt-8 lg:px-12 lg:pb-20 lg:pt-9">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <div className="relative">
            <div className="absolute bottom-5 left-5 top-3.5 w-0.5 rounded-full bg-border sm:left-6" />
            {visibleExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} university={uniMap[exam.universityId]} />
            ))}
            {visibleNoData.map((card) => (
              <NoDataCard
                key={card.universityId}
                card={card}
                university={uniMap[card.universityId]}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
