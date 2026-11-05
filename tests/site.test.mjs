import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const pages = [
  "/",
  "/projects/jigeqiu/",
  "/projects/tmviewer/",
  "/en/",
  "/en/projects/jigeqiu/",
  "/en/projects/tmviewer/",
];

for (const route of pages) {
  test(`${route} is an independently accessible, complete static document`, async () => {
    const html = await readFile(
      path.join(root, "site", route, "index.html"),
      "utf8",
    );
    assert.match(html, /<!doctype html>/i);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, /name="description" content="[^"]+"/);
    assert.ok(
      html.includes(
        `rel="canonical" href="https://jiawulin.github.io${route}"`,
      ),
    );
    assert.match(html, /property="og:image"/);
    assert.match(html, /hreflang="en"/);
    assert.match(html, /hreflang="zh-CN"/);
    assert.match(html, /<h1/);
    const githubIcon = await readFile(
      path.join(root, "site/assets/icons/github.svg"),
      "utf8",
    );
    assert.ok(html.includes(githubIcon.trim()));
    assert.match(githubIcon, /M15 22v-4/);
    assert.doesNotMatch(githubIcon, /m18 16 4-4-4-4/);
    assert.doesNotMatch(html, /TODO|TBD|placeholder|待补充|尚未完成/);
    const images = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)];
    assert.ok(images.length >= 2);
    for (const [, src] of images) {
      assert.ok(src.startsWith("/assets/"));
      assert.ok((await stat(path.join(root, "site", src))).isFile());
    }
    for (const [, href] of html.matchAll(/href="(\/[^"#]*)"/g)) {
      const target = path.join(
        root,
        "site",
        href,
        href.endsWith("/") ? "index.html" : "",
      );
      assert.ok((await stat(target)).isFile(), `Missing local target: ${href}`);
    }
    assert.doesNotMatch(html, /<iframe|<form|google-analytics|hm\.baidu/);
    assert.equal((html.match(/<h1(?: |>)/g) || []).length, 1);
  });
}

test("home contains both works and exposes separate project and external links", async () => {
  const html = await readFile(path.join(root, "site/index.html"), "utf8");
  assert.match(html, /创造实用、好用的软件。/);
  assert.match(html, /data-project="jigeqiu"/);
  assert.match(html, /data-project="tmviewer"/);
  assert.match(html, /href="\/projects\/jigeqiu\/"/);
  assert.match(html, /href="\/projects\/tmviewer\/"/);
  assert.match(html, /href="https:\/\/jiawulin.github.io\/jigeqiu\/"/);
  assert.doesNotMatch(html, /<a\b[^>]*>(?:(?!<\/a>)[\s\S])*<a\b/);
});

test("TianMu gallery introduces six additional views in both languages using local images", async () => {
  const { projects } = await import("../content/projects.mjs");
  const project = projects.find((project) => project.id === "tmviewer");
  const additions = [
    "classic-canvas",
    "filmstrip",
    "stack",
    "short-video",
    "honeycomb",
    "details",
  ];
  for (const name of additions) {
    const index = project.images.indexOf(`${name}.webp`);
    assert.ok(index >= 0, `Missing ${name}`);
    for (const lang of ["zh", "en"]) {
      assert.ok(project.captions[lang][index]);
      assert.ok(project.imageDescriptions[lang][index]);
      const html = await readFile(
        path.join(
          root,
          "site",
          lang === "en" ? "en" : "",
          "projects/tmviewer/index.html",
        ),
        "utf8",
      );
      assert.ok(html.includes(project.imageDescriptions[lang][index]));
    }
  }
});

test("details repeat identical project actions below the content in both languages", async () => {
  const { projects } = await import("../content/projects.mjs");
  for (const lang of ["zh", "en"]) {
    for (const project of projects) {
      const html = await readFile(path.join(root, "site", lang === "en" ? "en" : "", "projects", project.id, "index.html"), "utf8");
      const actions = [...html.matchAll(/<div class="project-actions">([\s\S]*?)<\/div>/g)];
      assert.equal(actions.length, 2);
      assert.equal(actions[0][1], actions[1][1]);
      assert.ok(actions[1].index > html.indexOf('class="editorial-section technical-section"'));
      assert.ok(actions[1].index < html.indexOf('class="next-project"'));
      if (project.id === "tmviewer") {
        assert.match(actions[0][1], /href="http:\/\/tmviewer.com\/"/);
        assert.equal((actions[0][1].match(/<a /g) || []).length, 1);
      }
    }
  }
});

test("runtime uses no product storage and has no wheel cancellation", async () => {
  const js = await readFile(path.join(root, "site/main.js"), "utf8");
  assert.doesNotMatch(js, /localStorage|sessionStorage|indexedDB|cookie/);
  assert.doesNotMatch(
    js,
    /jipage_library_v2|jigeqiu_assets_v1|preventDefault\(\).*wheel/,
  );
  assert.match(js, /prefers-reduced-motion/);
  assert.match(js, /pageshow/);
});

test("Pages deployment is gated and only uploads the static site", async () => {
  const workflow = await readFile(path.join(root, ".github/workflows/pages.yml"), "utf8");
  assert.match(workflow, /pull_request:\s+branches: \[master\]/);
  assert.match(workflow, /push:\s+branches: \[master\]/);
  assert.match(workflow, /needs: check/);
  assert.match(workflow, /github.event_name != 'pull_request' && github.ref == 'refs\/heads\/master'/);
  assert.match(workflow, /npm run publish:check/);
  assert.match(workflow, /path: site\s/);
  assert.match(workflow, /needs: prepare/);
  assert.doesNotMatch(workflow, /secrets\.|pull_request_target/);
  for (const [, action] of workflow.matchAll(/uses: (\S+)/g)) {
    assert.match(action, /^actions\/[a-z-]+@[a-f0-9]{40}$/);
  }
});

test("publication is blocked until required external URL and asset approval are supplied", async () => {
  const { assertPublishable } = await import("../scripts/publish-check.mjs");
  assert.throws(
    () => assertPublishable({ tmviewerDemo: "", screenshotsApproved: false }),
    /HTTP or HTTPS demo URL/,
  );
  assert.throws(
    () =>
      assertPublishable({
        tmviewerDemo: "https://tmviewer.com/viewer/",
        screenshotsApproved: false,
      }),
    /screenshot/,
  );
  assert.doesNotThrow(() =>
    assertPublishable({
      tmviewerDemo: "http://tmviewer.com/",
      screenshotsApproved: true,
    }),
  );
  assert.throws(() =>
    assertPublishable({
      tmviewerDemo: "javascript:alert(1)",
      screenshotsApproved: true,
    }), /HTTP or HTTPS demo URL/,
  );
  assert.doesNotThrow(() =>
    assertPublishable({
      tmviewerDemo: "https://tmviewer.com/viewer/",
      screenshotsApproved: true,
    }),
  );
});
