import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { profile, projects } from "../content/projects.mjs";

const root = fileURLToPath(new URL("../site/", import.meta.url));
const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const origin = "https://jiawulin.github.io";
const ui = {
  zh: {
    home: "作品集",
    work: "作品",
    next: "下一个作品",
    prev: "上一个作品",
    demo: "在线体验",
    source: "源代码",
    releases: "版本下载",
    about: "关于作品",
    features: "用起来，是这样",
    technical: "技术与平台",
    enlarge: "查看大图",
    close: "关闭",
    other: "继续浏览",
    skip: "跳到作品",
    github: "在 GitHub 上查看 Jiawulin",
    gallery: "作品浏览",
    detail: "查看作品",
    unavailable: "天幕看图",
    screenshot: "软件界面",
  },
  en: {
    home: "All work",
    work: "Selected work",
    next: "Next project",
    prev: "Previous project",
    demo: "Live demo",
    source: "Source code",
    releases: "Releases",
    about: "About the project",
    features: "Made for everyday use",
    technical: "Technology & platform",
    enlarge: "View full image",
    close: "Close",
    other: "Keep exploring",
    skip: "Skip to work",
    github: "Jiawulin on GitHub",
    gallery: "Selected projects",
    detail: "Explore project",
    unavailable: "TianMu Viewer",
    screenshot: "Application interface",
  },
};
const icon = async (name) =>
  readFile(
    new URL(`../site/assets/icons/${name}.svg`, import.meta.url),
    "utf8",
  );
const icons = Object.fromEntries(
  await Promise.all(
    [
      "arrow-up-right",
      "arrow-left",
      "arrow-right",
      "github",
      "x",
      "expand",
    ].map(async (name) => [name, await icon(name)]),
  ),
);
const svg = (name) => icons[name];
const prefix = (lang) => (lang === "zh" ? "/" : "/en/");
const route = (lang, id = "") =>
  `${prefix(lang)}${id ? `projects/${id}/` : ""}`;
const asset = (p, file) => `/assets/projects/${p.id}/${file}`;
const external = (url, label, className = "") =>
  `<a class="${className}" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${label}${svg("arrow-up-right")}</a>`;

function header(lang, id) {
  const t = ui[lang];
  return `<a class="skip-link" href="#main">${t.skip}</a>
  <header class="site-header">
    <a class="identity" href="${prefix(lang)}"><span class="identity-name">${profile.name}<span class="identity-dot" aria-hidden="true"></span></span><span class="identity-line">${profile[lang]}</span></a>
    <nav class="header-links" aria-label="${lang === "zh" ? "个人链接与语言" : "Profile and language"}">
      <a class="github-link" href="${profile.github}" target="_blank" rel="noopener noreferrer" aria-label="${t.github}">${svg("github")}<span>GitHub</span>${svg("arrow-up-right")}</a>
      <span class="header-divider" aria-hidden="true"></span>
      <a class="language-link" href="${route(lang === "zh" ? "en" : "zh", id)}" lang="${lang === "zh" ? "en" : "zh-CN"}" data-language>${lang === "zh" ? "EN" : "中文"}</a>
    </nav>
  </header>`;
}

function layout(lang, id, body) {
  const p = projects.find((p) => p.id === id);
  const title = p
    ? `${p.name[lang]} — Jiawulin`
    : `Jiawulin — ${lang === "zh" ? "创造实用、好用的软件" : "Thoughtful software"}`;
  const description = p ? p.description[lang] : profile[lang];
  const current = route(lang, id);
  const cover = p || projects[0];
  return `<!doctype html>
<html lang="${lang === "zh" ? "zh-CN" : "en"}">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escape(title)}</title><meta name="description" content="${escape(description)}">
  <meta name="theme-color" content="#f1f1ef">
  <link rel="canonical" href="${origin}${current}">
  <link rel="alternate" hreflang="zh-CN" href="${origin}${route("zh", id)}">
  <link rel="alternate" hreflang="en" href="${origin}${route("en", id)}">
  <link rel="alternate" hreflang="x-default" href="${origin}${route("zh", id)}">
  <meta property="og:type" content="website"><meta property="og:site_name" content="Jiawulin">
  <meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}">
  <meta property="og:url" content="${origin}${current}"><meta property="og:image" content="${origin}${asset(cover, cover.cover)}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css"><script type="module" src="/main.js"></script>
</head>
<body class="${id ? "detail-page" : "home-page"}">
${header(lang, id)}
${body}
</body></html>
`;
}

function card(p, index, lang) {
  const t = ui[lang];
  return `<article class="project-card" data-project="${p.id}" aria-labelledby="name-${p.id}">
    <a class="project-visual visual-${p.id}" href="${route(lang, p.id)}" aria-label="${t.detail}: ${p.name[lang]}" data-project-link>
      <span class="visual-topline"><span>${p.subtitle}</span><span>0${index + 1}</span></span>
      <img class="project-screenshot" src="${asset(p, p.cover)}" alt="${p.name[lang]} · ${p.captions[lang][0]}" width="1600" height="1000" ${index ? 'loading="lazy"' : 'fetchpriority="high"'}>
      <span class="project-open" aria-hidden="true">${svg("arrow-up-right")}</span>
    </a>
    <div class="project-information">
      <div class="project-heading"><a class="project-name-link" href="${route(lang, p.id)}" data-project-link><img class="project-logo" src="${asset(p, p.logo)}" alt="" width="40" height="40"><h2 id="name-${p.id}">${p.name[lang]}</h2></a>
      ${p.website ? external(p.website, escape(p.websiteLabel), "project-website") : `<span class="project-category">${p.category[lang]}</span>`}</div>
      <p class="project-summary">${p.summary[lang]}</p>
      <div class="project-bottom"><span class="project-stack">${p.stack.join(" · ")}</span><span class="project-kind">${p.category[lang]}</span></div>
    </div>
  </article>`;
}

function home(lang) {
  const t = ui[lang];
  return layout(
    lang,
    "",
    `<main id="main" class="home-main">
    <h1 class="sr-only">${profile.name} · ${t.work}</h1>
    <div class="gallery-stage"><div class="gallery-track" aria-label="${t.gallery}">${projects.map((p, i) => card(p, i, lang)).join("")}</div></div>
    <footer class="gallery-footer"><span class="work-label">${t.work}<span class="work-count">02</span></span>
      <div class="gallery-pagination"><span class="current-index" aria-live="polite">01</span><span class="pagination-line" aria-hidden="true"></span><span class="total-index">02</span></div>
      <div class="gallery-controls"><button type="button" data-direction="-1" aria-label="${t.prev}" title="${t.prev}">${svg("arrow-left")}</button><button type="button" data-direction="1" aria-label="${t.next}" title="${t.next}">${svg("arrow-right")}</button></div>
    </footer>
  </main>`,
  );
}

function detail(p, lang) {
  const t = ui[lang];
  const other = projects.find((other) => other.id !== p.id);
  const actions = `<div class="project-actions">${p.website ? external(p.website, t.demo, "primary-action") : ""}${p.source ? external(p.source, t.source) : ""}${p.releases ? external(p.releases, t.releases) : ""}</div>`;
  return layout(
    lang,
    p.id,
    `<main id="main" class="detail-main">
    <a class="back-link" href="${prefix(lang)}" data-return>${svg("arrow-left")}${t.home}</a>
    <section class="project-intro">
      <div class="detail-category">${p.category[lang]}</div>
      <div class="detail-title"><img src="${asset(p, p.logo)}" alt="" width="64" height="64"><h1>${p.name[lang]}</h1></div>
      <p class="detail-tagline">${p.summary[lang]}</p>
      ${actions}
    </section>
    <figure class="detail-cover"><button class="image-trigger" data-image aria-label="${t.enlarge}: ${p.captions[lang][0]}" type="button"><img src="${asset(p, p.cover)}" alt="${p.name[lang]} · ${p.captions[lang][0]}" width="1600" height="1000" fetchpriority="high"><span class="expand-icon" aria-hidden="true">${svg("expand")}</span></button><figcaption><span>${p.captions[lang][0]}</span><span>01 / 0${p.images.length}</span></figcaption></figure>
    <section class="editorial-section"><h2>${t.about}</h2><div class="editorial-content"><p class="large-copy">${p.description[lang]}</p><p>${p.intro[lang]}</p></div></section>
    <section class="editorial-section"><h2>${t.features}</h2><div class="feature-list">${p.features[lang].map(([title, text], i) => `<div class="feature"><span class="feature-number">0${i + 1}</span><div><h3>${title}</h3><p>${text}</p></div></div>`).join("")}</div></section>
    <section class="detail-gallery" aria-label="${t.screenshot}">${p.images
      .slice(1)
      .map(
        (file, i) =>
          `<figure><button class="image-trigger" data-image aria-label="${t.enlarge}: ${p.captions[lang][i + 1]}" type="button"><img src="${asset(p, file)}" alt="${p.name[lang]} · ${p.captions[lang][i + 1]}" width="1600" height="1000" loading="lazy"><span class="expand-icon" aria-hidden="true">${svg("expand")}</span></button><figcaption><span>${p.captions[lang][i + 1]}</span><span>0${i + 2} / 0${p.images.length}</span></figcaption>${p.imageDescriptions ? `<p class="gallery-description">${escape(p.imageDescriptions[lang][i + 1])}</p>` : ""}</figure>`,
      )
      .join("")}</section>
    <section class="editorial-section technical-section"><h2>${t.technical}</h2><div><p class="detail-stack">${p.stack.join(" · ")}</p><dl>${p.technical[lang].map(([key, value]) => `<div><dt>${key}</dt><dd>${value}</dd></div>`).join("")}</dl></div></section>
    ${actions}
    <nav class="next-project" aria-label="${t.other}"><a href="${prefix(lang)}" data-return>${svg("arrow-left")}${t.home}</a><a class="next-project-link" href="${route(lang, other.id)}"><span><small>${p.id === "jigeqiu" ? t.next : t.prev}</small><strong>${other.name[lang]}</strong></span>${svg("arrow-right")}</a></nav>
  </main>
  <dialog class="image-dialog" aria-label="${t.enlarge}"><button class="dialog-close" type="button" aria-label="${t.close}">${svg("x")}</button><img alt=""><p class="dialog-caption"></p></dialog>`,
  );
}

for (const lang of ["zh", "en"]) {
  for (const id of ["", ...projects.map((p) => p.id)]) {
    const directory = path.join(root, route(lang, id));
    await mkdir(directory, { recursive: true });
    await writeFile(
      path.join(directory, "index.html"),
      id
        ? detail(
            projects.find((p) => p.id === id),
            lang,
          )
        : home(lang),
    );
  }
}
const routes = ["zh", "en"].flatMap((lang) =>
  ["", ...projects.map((p) => p.id)].map((id) => route(lang, id)),
);
await writeFile(
  path.join(root, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((r) => `<url><loc>${origin}${r}</loc></url>`).join("")}</urlset>\n`,
);
await writeFile(
  path.join(root, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
);
console.log("Built six static pages, sitemap, and robots.txt.");
