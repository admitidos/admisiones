import type { Meta, StoryObj } from "@storybook/react";
import { ScoreDistributionBar } from "./ScoreDistributionBar";

const SCORES = Array.from({ length: 200 }, (_, i) => {
  const base = 900 + i * 3.5;
  const noise = (Math.sin(i) * 20 + Math.cos(i * 2) * 10);
  return Math.round(base + noise);
});

const meta: Meta<typeof ScoreDistributionBar> = {
  title: "Result/ScoreDistributionBar",
  component: ScoreDistributionBar,
  parameters: { layout: "padded" },
  args: {
    scores: SCORES,
    cutoffScore: 1255,
    universityColor: "#1c6b3a",
    totalApplicants: 2847,
  },
};

export default meta;
type Story = StoryObj<typeof ScoreDistributionBar>;

export const ApplicantAboveCutoff: Story = {
  args: { applicantScore: 1398 },
};

export const ApplicantBelowCutoff: Story = {
  args: { applicantScore: 1208 },
};

export const NoCutoff: Story = {
  args: { applicantScore: 1200, cutoffScore: null },
};
