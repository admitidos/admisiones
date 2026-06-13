import type { Meta, StoryObj } from "@storybook/react";
import { AreaChip } from "./AreaChip";

const meta: Meta<typeof AreaChip> = {
  title: "UI/AreaChip",
  component: AreaChip,
  parameters: { layout: "centered" },
  argTypes: {
    area: { control: "select", options: ["A", "B", "C", "D", "E"] },
    size: { control: "radio", options: ["sm", "md"] },
  },
};

export default meta;
type Story = StoryObj<typeof AreaChip>;

export const AreaA: Story = { args: { area: "A" } };
export const AreaB: Story = { args: { area: "B" } };
export const AreaC: Story = { args: { area: "C" } };
export const AreaD: Story = { args: { area: "D" } };
export const AreaE: Story = { args: { area: "E" } };

export const AllAreas: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["A", "B", "C", "D", "E"] as const).map((area) => (
        <AreaChip key={area} area={area} />
      ))}
    </div>
  ),
};

export const MediumSize: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["A", "B", "C", "D", "E"] as const).map((area) => (
        <AreaChip key={area} area={area} size="md" />
      ))}
    </div>
  ),
};
