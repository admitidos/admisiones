import type { Meta, StoryObj } from "@storybook/react";
import { RecentProcesses } from "./RecentProcesses";
import type { HomeProcess } from "@/features/home/getHomeData";

const meta: Meta<typeof RecentProcesses> = {
  title: "Home/RecentProcesses",
  component: RecentProcesses,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof RecentProcesses>;

const UNMSM_NEW: HomeProcess = {
  id: "unmsm-2026-1",
  name: "2026-I",
  status: "new",
  date: "27 abr 2026",
  university: { acronym: "UNMSM", color: "#1c6b3a" },
};

const UNI_PUBLISHED: HomeProcess = {
  id: "uni-2026-1",
  name: "2026-I",
  status: "published",
  date: "15 mar 2026",
  university: { acronym: "UNI", color: "#1e40af" },
};

const UNMSM_PUBLISHED: HomeProcess = {
  id: "unmsm-2025-2",
  name: "2025-II",
  status: "published",
  date: "12 ene 2026",
  university: { acronym: "UNMSM", color: "#1c6b3a" },
};

const UNI_UPCOMING: HomeProcess = {
  id: "uni-2026-2",
  name: "2026-II",
  status: "upcoming",
  date: "Oct 2026",
  university: { acronym: "UNI", color: "#1e40af" },
};

export const Default: Story = {
  args: {
    processes: [UNMSM_NEW, UNI_PUBLISHED, UNMSM_PUBLISHED],
  },
};

export const WithUpcoming: Story = {
  args: {
    processes: [UNI_UPCOMING, UNMSM_NEW, UNI_PUBLISHED, UNMSM_PUBLISHED],
  },
};

export const AllPublished: Story = {
  args: {
    processes: [
      UNMSM_PUBLISHED,
      UNI_PUBLISHED,
      { ...UNMSM_PUBLISHED, id: "unmsm-2025-1", name: "2025-I", date: "5 ago 2025" },
    ],
  },
};

export const SingleProcess: Story = {
  args: {
    processes: [UNMSM_NEW],
  },
};
