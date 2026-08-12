/**
 * Ghost → GitHub deploy relay (AWS Lambda, Node.js 20, Function URL).
 *
 * Ghost fires a webhook on content change → this function validates a shared
 * secret and calls GitHub's `repository_dispatch` API, which triggers the
 * "Build & Deploy" workflow (repository_dispatch type: ghost-publish).
 *
 * Ghost webhooks can't send auth headers, so the secret travels in the URL
 * query string (?secret=...). The GitHub token lives only in Lambda env vars.
 *
 * Required environment variables:
 *   GITHUB_TOKEN    Fine-grained PAT with "Contents: Read and write" on the repo
 *   GITHUB_OWNER    e.g. cdemar
 *   GITHUB_REPO     e.g. Avenir_Admissions
 *   WEBHOOK_SECRET  Long random string; must match the ?secret= in the Ghost URL
 *   EVENT_TYPE      (optional) defaults to "ghost-publish"
 */

import crypto from "node:crypto";

const {
  GITHUB_TOKEN,
  GITHUB_OWNER,
  GITHUB_REPO,
  WEBHOOK_SECRET,
  EVENT_TYPE = "ghost-publish",
} = process.env;

/** Constant-time string comparison to avoid timing attacks on the secret. */
function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

export const handler = async (event) => {
  const method = event?.requestContext?.http?.method;
  if (method && method !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const provided = event?.queryStringParameters?.secret ?? "";
  if (!WEBHOOK_SECRET || !safeEqual(provided, WEBHOOK_SECRET)) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "ghost-webhook-relay",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event_type: EVENT_TYPE }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("GitHub dispatch failed:", res.status, text);
    return { statusCode: 502, body: "Failed to trigger deploy" };
  }

  console.log(`Triggered ${EVENT_TYPE} for ${GITHUB_OWNER}/${GITHUB_REPO}`);
  return { statusCode: 202, body: "Deploy triggered" };
};
