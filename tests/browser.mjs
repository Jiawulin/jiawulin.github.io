import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

if (!process.env.PLAYWRIGHT_MODULE)
  throw new Error(
    "Set PLAYWRIGHT_MODULE to your installed playwright package.",
  );
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE);
const base = process.env.PREVIEW_URL || "http://127.0.0.1:4178";
const output = path.resolve("test-results");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];
const results = [];
try {
  for (const width of [320, 390, 1440]) {
    for (const lang of ["zh", "en"]) {
      const context = await browser.newContext({
        viewport: { width, height: width > 900 ? 960 : 844 },
      });
      const page = await context.newPage();
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("request", request => {
        if (new URL(request.url()).origin !== new URL(base).origin) {
          errors.push(`Unexpected remote asset request: ${request.url()}`);
        }
      });
      page.on("response", (response) => {
        if (response.status() >= 400)
          errors.push(`${response.status()} ${response.url()}`);
      });
      const prefix = lang === "zh" ? "/" : "/en/";
      const response = await page.goto(`${base}${prefix}`, {
        waitUntil: "networkidle",
      });
      assert.equal(response.status(), 200);
      assert.equal(await page.locator("[data-project]").count(), 2);
      await assertImages(page);
      if (width > 900) {
        const card = page.locator('[data-project="jigeqiu"]');
        const before = (await card.boundingBox()).x;
        await page.mouse.move(600, 450);
        await page.mouse.wheel(0, 600);
        await page.waitForFunction(() => scrollY > 500);
        await page.waitForTimeout(100);
        assert.ok(
          (await card.boundingBox()).x < before - 400,
          "Vertical mouse wheel must move works horizontally",
        );
        await page
          .getByRole("button", {
            name: lang === "zh" ? "下一个作品" : "Next project",
            exact: true,
          })
          .click();
        await page.waitForFunction(
          () => document.querySelector(".current-index").textContent === "02",
        );
        await page
          .locator('[data-project="tmviewer"] [data-project-link]')
          .first()
          .click();
        await page.waitForURL("**/projects/tmviewer/");
        await page.goBack({ waitUntil: "networkidle" });
        await page.waitForFunction(
          () => document.querySelector(".current-index").textContent === "02",
        );
        assert.ok(
          await page
            .locator('[data-project="tmviewer"] [data-project-link]')
            .first()
            .evaluate((el) => el === document.activeElement),
        );
        await page.screenshot({
          path: `${output}/home-${lang}-${width}-second.png`,
        });
        await page
          .getByRole("button", {
            name: lang === "zh" ? "上一个作品" : "Previous project",
            exact: true,
          })
          .click();
        await page.waitForFunction(() => scrollY < 2);
      } else {
        assert.ok(
          !(await page
            .locator("body")
            .evaluate((el) => el.classList.contains("gallery-enhanced"))),
        );
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        );
      }
      await page.screenshot({
        path: `${output}/home-${lang}-${width}.png`,
        fullPage: width < 900,
      });
      for (const id of ["jigeqiu", "tmviewer"]) {
        await page.goto(`${base}${prefix}projects/${id}/`, {
          waitUntil: "networkidle",
        });
        await assertImages(page);
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        );
        const triggers = id === "tmviewer"
          ? await page.locator("[data-image]").all()
          : [page.locator("[data-image]").first()];
        if (id === "tmviewer") assert.equal(triggers.length, 8);
        for (const trigger of triggers) {
          await trigger.click();
          assert.ok(await page.locator("dialog").evaluate((el) => el.open));
          await page.locator("dialog img").evaluate(img => img.decode());
          assert.equal(
            await page.locator("dialog img").getAttribute("alt"),
            await trigger.locator("img").getAttribute("alt"),
          );
          await page.keyboard.press("Escape");
          assert.ok(!(await page.locator("dialog").evaluate((el) => el.open)));
          assert.ok(await trigger.evaluate((el) => el === document.activeElement));
        }
        await page.reload({ waitUntil: "networkidle" });
        assert.equal(await page.locator("h1").count(), 1);
        if (id === "jigeqiu")
          await page.screenshot({
            path: `${output}/detail-${lang}-${width}.png`,
            fullPage: true,
          });
        if (id === "tmviewer" && lang === "zh" && width === 1440) {
          await page.locator("img[src$='stack.webp']").scrollIntoViewIfNeeded();
          await page.screenshot({ path: `${output}/tmviewer-gallery.png` });
        }
      }
      await context.close();
      results.push({ width, lang, status: "passed" });
    }
  }
  for (const options of [
    { javaScriptEnabled: false },
    { reducedMotion: "reduce" },
  ]) {
    const context = await browser.newContext({
      ...options,
      viewport: { width: 1440, height: 960 },
    });
    const page = await context.newPage();
    await page.goto(base, { waitUntil: "networkidle" });
    const first = await page.locator('[data-project="jigeqiu"]').boundingBox();
    const second = await page
      .locator('[data-project="tmviewer"]')
      .boundingBox();
    assert.ok(
      second.y > first.y + first.height,
      "Fallback uses ordinary vertical flow",
    );
    await page
      .locator('[data-project="tmviewer"] [data-project-link]')
      .first()
      .click();
    await page.waitForURL("**/projects/tmviewer/");
    await context.close();
    results.push({ ...options, status: "passed" });
  }
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 720 },
    });
    const page = await context.newPage();
    await page.goto(base, { waitUntil: "networkidle" });
    assert.ok(
      await page
        .locator("body")
        .evaluate((el) => el.classList.contains("gallery-enhanced")),
    );
    assert.ok((await page.locator(".gallery-footer").boundingBox()).y < 680);
    await page.mouse.move(650, 400);
    await page.mouse.wheel(800, 0);
    await page.waitForFunction(
      () => document.querySelector(".current-index").textContent === "02",
    );
    await page.locator('[data-project="tmviewer"] .project-name-link').focus();
    await page.keyboard.press("ArrowLeft");
    await page.waitForFunction(() => scrollY < 2);
    await page.keyboard.press("ArrowRight");
    await page.waitForFunction(
      () => document.querySelector(".current-index").textContent === "02",
    );
    await page.locator("[data-language]").click();
    await page.waitForURL("**/en/**");
    await page.waitForFunction(
      () => document.querySelector(".current-index").textContent === "02",
    );
    await page.locator('[data-project="tmviewer"] .project-name-link').click();
    await page.waitForURL("**/en/projects/tmviewer/");
    await page.locator("[data-return]").first().click();
    await page.waitForFunction(
      () => document.querySelector(".current-index").textContent === "02",
    );
    await context.close();
    results.push({
      viewport: "1440x720",
      horizontalGesture: true,
      keyboard: true,
      language: true,
      returnLink: true,
      status: "passed",
    });
  }
  assert.deepEqual(errors, []);
  await writeFile(
    `${output}/report.json`,
    JSON.stringify({ results, errors }, null, 2),
  );
  console.log(JSON.stringify({ results, errors }, null, 2));
} finally {
  await browser.close();
}

async function assertImages(page) {
  await page.locator("img[src]").evaluateAll(async (images) => {
    await Promise.all(
      images.map((img) => {
        img.loading = "eager";
        return img.decode().catch(() => {});
      }),
    );
  });
  const invalid = await page
    .locator("img[src]")
    .evaluateAll((images) =>
      images
        .filter((img) => !img.complete || !img.naturalWidth)
        .map((img) => img.src),
    );
  assert.deepEqual(invalid, []);
}
