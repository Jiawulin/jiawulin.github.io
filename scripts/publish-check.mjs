import { pathToFileURL } from "node:url";
import { publication } from "../content/projects.mjs";

export function assertPublishable(config) {
  let url;
  try {
    url = new URL(config.tmviewerDemo);
  } catch {
    /* Validated below. */
  }
  if (!url || !["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error(
      "A confirmed HTTP or HTTPS demo URL for TianMu Viewer is required before publication.",
    );
  }
  if (!config.screenshotsApproved) {
    throw new Error(
      "Public screenshot and media approval is required before publication.",
    );
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  assertPublishable(publication);
  console.log("Publication prerequisites confirmed.");
}
