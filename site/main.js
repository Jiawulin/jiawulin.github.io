const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const desktop = window.matchMedia("(min-width: 960px) and (min-height: 560px)");
const track = document.querySelector(".gallery-track");
const cards = [...document.querySelectorAll("[data-project]")];
let maximum = 0;
let active = 0;
let scheduled = false;
let enabled = false;

function currentProject() {
  return cards[active]?.dataset.project || "jigeqiu";
}

function remember() {
  const portfolio = { project: currentProject(), scroll: window.scrollY };
  history.replaceState({ ...history.state, portfolio }, "");
}

function update() {
  scheduled = false;
  if (!enabled) return;
  const position = Math.min(maximum, Math.max(0, window.scrollY));
  track.style.transform = `translate3d(${-position}px,0,0)`;
  active = Math.min(
    cards.length - 1,
    Math.max(0, Math.round(position / (maximum || 1))),
  );
  document.querySelector(".current-index").textContent = String(
    active + 1,
  ).padStart(2, "0");
  document.querySelector('[data-direction="-1"]').disabled = position < 2;
  document.querySelector('[data-direction="1"]').disabled =
    position >= maximum - 2;
}

function schedule() {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(update);
  }
}

function configure() {
  if (!track) return;
  enabled = desktop.matches && !reduced.matches;
  document.body.classList.toggle("gallery-enhanced", enabled);
  if (
    enabled &&
    document.querySelector(".gallery-controls").getBoundingClientRect().bottom >
      innerHeight - 8
  ) {
    enabled = false;
    document.body.classList.remove("gallery-enhanced");
  }
  if (enabled) {
    const width =
      cards.at(-1).offsetLeft + cards.at(-1).offsetWidth - cards[0].offsetLeft;
    maximum = Math.max(0, width - cards[0].offsetWidth);
    document.body.style.minHeight = `${window.innerHeight + maximum}px`;
    track.style.transform = "";
    update();
  } else {
    document.body.style.minHeight = "";
    track.style.transform = "";
  }
}

function go(direction) {
  if (!enabled) return;
  const target = direction < 0 ? 0 : maximum;
  window.scrollTo({
    top: target,
    behavior: reduced.matches ? "instant" : "smooth",
  });
}

if (track) {
  configure();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", configure);
  reduced.addEventListener("change", configure);
  desktop.addEventListener("change", configure);
  document.querySelectorAll("[data-direction]").forEach((button) => {
    button.addEventListener("click", () =>
      go(Number(button.dataset.direction)),
    );
  });
  document.querySelector(".home-main").addEventListener("keydown", (event) => {
    if (event.altKey || event.metaKey || event.ctrlKey || event.shiftKey)
      return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      if (!enabled) return;
      event.preventDefault();
      go(event.key === "ArrowRight" ? 1 : -1);
    }
  });
  // Vertical wheel input remains native. Only true horizontal gestures need translation.
  document.querySelector(".home-main").addEventListener(
    "wheel",
    (event) => {
      if (
        !enabled ||
        event.ctrlKey ||
        event.metaKey ||
        Math.abs(event.deltaX) <= Math.abs(event.deltaY)
      )
        return;
      const multiplier =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? window.innerHeight
            : 1;
      window.scrollBy({ top: event.deltaX * multiplier, behavior: "instant" });
    },
    { passive: true },
  );
  document.querySelectorAll("[data-project-link]").forEach((link) => {
    link.addEventListener("click", () => {
      active = cards.indexOf(link.closest("[data-project]"));
      remember();
    });
  });
  document
    .querySelector("[data-language]")
    .addEventListener("click", (event) => {
      remember();
      const url = new URL(event.currentTarget.href);
      url.searchParams.set("work", currentProject());
      event.currentTarget.href = url.href;
    });
  const requested = new URL(location.href).searchParams.get("work");
  if (requested) {
    const index = cards.findIndex((card) => card.dataset.project === requested);
    if (index >= 0) {
      active = index;
      window.scrollTo({
        top: enabled ? index * maximum : cards[index].offsetTop - 24,
        behavior: "instant",
      });
      remember();
    }
    const url = new URL(location.href);
    url.searchParams.delete("work");
    history.replaceState(history.state, "", url);
  }
  window.addEventListener("pageshow", () => {
    configure();
    const saved = history.state?.portfolio;
    if (!saved) return;
    const index = cards.findIndex(
      (card) => card.dataset.project === saved.project,
    );
    if (index < 0) return;
    window.scrollTo({
      top: enabled ? Math.min(maximum, saved.scroll) : saved.scroll,
      behavior: "instant",
    });
    cards[index]
      .querySelector("[data-project-link]")
      .focus({ preventScroll: true });
  });
}

const dialog = document.querySelector(".image-dialog");
if (dialog) {
  let trigger;
  document.querySelectorAll("[data-image]").forEach((button) => {
    button.addEventListener("click", () => {
      trigger = button;
      const image = button.querySelector("img");
      dialog.querySelector("img").src = image.src;
      dialog.querySelector("img").alt = image.alt;
      dialog.querySelector(".dialog-caption").textContent = image.alt;
      dialog.showModal();
    });
  });
  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () =>
    trigger?.focus({ preventScroll: true }),
  );
}

document.querySelectorAll("[data-return]").forEach((link) => {
  const id = location.pathname.match(/projects\/([^/]+)/)?.[1];
  if (id) link.href += `?work=${encodeURIComponent(id)}`;
});
