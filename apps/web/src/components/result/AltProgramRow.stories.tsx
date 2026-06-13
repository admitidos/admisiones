import type { Meta, StoryObj } from "@storybook/react";
import { AltProgramRow } from "./AltProgramRow";

const BASE = {
  universityAcronym: "UNMSM",
  processSlug: "2026-1",
  campus: "Lima",
  area: "A" as const,
};

const meta: Meta<typeof AltProgramRow> = {
  title: "Result/AltProgramRow",
  component: AltProgramRow,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-md rounded-lg border border-border bg-white">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AltProgramRow>;

export const WouldAdmit: Story = {
  args: {
    ...BASE,
    id: "prog-enfermeria",
    name: "Enfermería",
    cutoffScore: 1290,
    pointsDiff: 108,
    crossArea: false,
  },
};

export const WouldNotAdmit: Story = {
  args: {
    ...BASE,
    id: "prog-medicina",
    name: "Medicina Humana",
    cutoffScore: 1255,
    pointsDiff: -47,
    crossArea: false,
  },
};

export const CrossArea: Story = {
  args: {
    ...BASE,
    id: "prog-civil",
    name: "Ingeniería Civil",
    campus: "Lima",
    cutoffScore: 1180,
    pointsDiff: 28,
    crossArea: true,
  },
};
