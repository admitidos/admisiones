import type { Meta, StoryObj } from "@storybook/react";
import { PositionBar } from "./PositionBar";

const meta: Meta<typeof PositionBar> = {
  title: "Result/PositionBar",
  component: PositionBar,
  parameters: { layout: "padded" },
  args: {
    minScore: 900,
    maxScore: 1598,
    universityColor: "#1c6b3a",
    cutoffScore: 1255,
  },
};

export default meta;
type Story = StoryObj<typeof PositionBar>;

export const AboveCutoff: Story = {
  args: { score: 1398, percentile: 0.985 },
};

export const JustBelow: Story = {
  args: { score: 1208, percentile: 0.62 },
};

export const FarBelow: Story = {
  args: { score: 980, percentile: 0.1 },
};

export const NoCutoffData: Story = {
  args: { score: 1200, percentile: 0.55, cutoffScore: null },
};
