import type { Meta, StoryObj } from "@storybook/react";
import { CutoffHistoryChart } from "./CutoffHistoryChart";

const meta: Meta<typeof CutoffHistoryChart> = {
  title: "Result/CutoffHistoryChart",
  component: CutoffHistoryChart,
  parameters: { layout: "padded" },
  args: {
    programName: "Medicina Humana",
    universityColor: "#1c6b3a",
  },
};

export default meta;
type Story = StoryObj<typeof CutoffHistoryChart>;

export const Rising: Story = {
  args: {
    currentScore: 1398,
    tendency: "rising",
    historicalCutoffs: [
      { period: "2023-II", cutoffScore: 1210, admissionRate: 0.1 },
      { period: "2024-I", cutoffScore: 1228, admissionRate: 0.095 },
      { period: "2025-I", cutoffScore: 1242, admissionRate: 0.091 },
      { period: "2026-I", cutoffScore: 1255, admissionRate: 0.097 },
    ],
  },
};

export const Falling: Story = {
  args: {
    currentScore: 1208,
    tendency: "falling",
    historicalCutoffs: [
      { period: "2023-II", cutoffScore: 1290, admissionRate: 0.08 },
      { period: "2024-I", cutoffScore: 1275, admissionRate: 0.085 },
      { period: "2025-I", cutoffScore: 1262, admissionRate: 0.09 },
      { period: "2026-I", cutoffScore: 1255, admissionRate: 0.097 },
    ],
  },
};

export const Stable: Story = {
  args: {
    currentScore: 1250,
    tendency: "stable",
    historicalCutoffs: [
      { period: "2023-II", cutoffScore: 1248, admissionRate: 0.095 },
      { period: "2024-I", cutoffScore: 1252, admissionRate: 0.093 },
      { period: "2025-I", cutoffScore: 1250, admissionRate: 0.094 },
      { period: "2026-I", cutoffScore: 1255, admissionRate: 0.097 },
    ],
  },
};
