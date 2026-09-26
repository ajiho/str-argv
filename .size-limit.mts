import type { SizeLimitConfig } from "size-limit";

export default [
  {
    limit: "0.6KB",
    path: "./dist/index.mjs",
  },
] satisfies SizeLimitConfig;
