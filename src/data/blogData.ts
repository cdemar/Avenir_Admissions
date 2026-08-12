import type { BlogPost } from "../types";
import data from "./blogData.json";

/**
 * Blog content is sourced from Ghost (headless CMS) at build time by
 * `scripts/fetch-ghost.mjs`, which regenerates `./blogData.json`.
 *
 * Do NOT edit `blogData.json` by hand — it is overwritten on every build.
 * To change posts, edit them in Ghost and redeploy.
 */
export const blogData: BlogPost[] = data as BlogPost[];
