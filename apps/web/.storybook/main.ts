import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["../public"],
  async viteFinal(config) {
    config.resolve ??= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../src"),
      "next/link": path.resolve(__dirname, "../src/__mocks__/next-link.tsx"),
      "next/navigation": path.resolve(__dirname, "../src/__mocks__/next-navigation.ts"),
      "next/image": path.resolve(__dirname, "../src/__mocks__/next-image.tsx"),
    };
    return config;
  },
};

export default config;
