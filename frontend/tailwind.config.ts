import type { Config } from "tailwindcss";
import uiPreset from "./ui.preset.ts";
export default {
  darkMode: ["class", '[data-kb-theme="dark"]'],
  content: ["./src/**/*.{html,js,jsx,md,mdx,ts,tsx}"],
  presets: [uiPreset],
} satisfies Partial<Config>;
