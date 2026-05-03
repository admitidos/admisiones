import type { Meta, StoryObj } from "@storybook/react";
import { StatusBadge } from "./StatusBadge";

const meta: Meta<typeof StatusBadge> = {
  title: "UI/StatusBadge",
  component: StatusBadge,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const New: Story = { args: { status: "new" } };
export const Published: Story = { args: { status: "published" } };
export const Upcoming: Story = { args: { status: "upcoming" } };

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <StatusBadge status="new" />
      <StatusBadge status="published" />
      <StatusBadge status="upcoming" />
    </div>
  ),
};
