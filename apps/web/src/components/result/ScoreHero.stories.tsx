import type { Meta, StoryObj } from "@storybook/react";
import { ScoreHero } from "./ScoreHero";

const BASE = {
  fullName: "García López, Ana María",
  applicantCode: "100001",
  programName: "Medicina Humana",
  campus: "Lima",
  area: "A" as const,
  modality: { code: "A", name: "Educación Básica Regular (EBR)" },
  university: { acronym: "UNMSM", name: "Universidad Nacional Mayor de San Marcos" },
  process: { period: "2026-I", slug: "2026-1" },
};

const COMPUTED_BASE = {
  percentileInProgram: 0.985,
  percentileInArea: 0.97,
  totalApplicants: 2847,
  totalAdmitted: 60,
};

const meta: Meta<typeof ScoreHero> = {
  title: "Result/ScoreHero",
  component: ScoreHero,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof ScoreHero>;

export const Admitted: Story = {
  args: {
    ...BASE,
    score: 1398,
    status: "admitted",
    rank: 2,
    computed: { ...COMPUTED_BASE, pointsToAdmission: 143 },
  },
};

export const NotAdmitted: Story = {
  args: {
    ...BASE,
    fullName: "Quispe Mamani, Carlos Enrique",
    applicantCode: "100002",
    score: 1208,
    status: "not_admitted",
    rank: null,
    computed: { ...COMPUTED_BASE, pointsToAdmission: -47, percentileInProgram: 0.62 },
  },
};

export const Absent: Story = {
  args: {
    ...BASE,
    fullName: "Torres Vega, Diego Alejandro",
    applicantCode: "100003",
    score: 0,
    status: "absent",
    rank: null,
    computed: { ...COMPUTED_BASE, pointsToAdmission: -1255, percentileInProgram: 0, percentileInArea: 0 },
  },
};

export const Disqualified: Story = {
  args: {
    ...BASE,
    fullName: "López Herrera, Sofía Isabel",
    applicantCode: "100004",
    score: 1180,
    status: "disqualified",
    rank: null,
    computed: { ...COMPUTED_BASE, pointsToAdmission: -75, percentileInProgram: 0.55 },
  },
};
