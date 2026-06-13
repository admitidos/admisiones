import type { Meta, StoryObj } from "@storybook/react";
import { AreaFilter } from "./AreaFilter";

const meta: Meta<typeof AreaFilter> = {
  title: "Process/AreaFilter",
  component: AreaFilter,
  parameters: { layout: "padded" },
  args: {
    availableAreas: ["A", "B", "C", "D", "E"],
  },
};

export default meta;
type Story = StoryObj<typeof AreaFilter>;

export const AllSelected: Story = {
  args: { selectedArea: null },
};

export const AreaASelected: Story = {
  args: { selectedArea: "A" },
};

export const PartialAreas: Story = {
  args: { availableAreas: ["A", "C", "E"], selectedArea: null },
};
