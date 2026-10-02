/* FACT at VCU : behaviour. Content lives in data.js. */
(() => {
  "use strict";

  const D = window.FACT;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const link = (key) => D.links[key] || key;
  /* the single-file build (tools/bundle.py) swaps asset paths for embedded copies */
  const asset = (path) => (window.FACT_ASSETS && window.FACT_ASSETS[path]) || path;

  /* same "random" on every load, so the torn edges and tilts never jump around */
  let seed = 1995;
  const rand = () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  /* ---------- clock (add ?now=2026-10-20T12:00 to the URL to preview another day) ---------- */
  const TZ = "America/New_York";
  const nowParam = new URLSearchParams(location.search).get("now");
  const clockOffset = nowParam && !isNaN(Date.parse(nowParam)) ? Date.parse(nowParam) - Date.now() : 0;
  const now = () => new Date(Date.now() + clockOffset);
  const fmt = (d, opts) => new Intl.DateTimeFormat("en-US", { timeZone: TZ, ...opts }).format(new Date(d));
  const ymd = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(d));
  const dayDiff = (a, b) => Math.round((Date.parse(ymd(a) + "T00:00:00Z") - Date.parse(ymd(b) + "T00:00:00Z")) / 864e5);

  function status(ev) {
    const n = now(), s = new Date(ev.start), e = new Date(ev.end);
    const deadline = ev.kind === "deadline";
    if (n > e) return { past: true, label: deadline ? "closed" : "wrapped" };
    if (!deadline && n >= s) return { live: true, hot: true, label: "happening now" };
    const d = dayDiff(s, n);
    if (deadline) return { hot: d <= 3, label: d === 0 ? "closes today" : d === 1 ? "closes tomorrow" : `${d} days left` };
    return { hot: d <= 1, label: d === 0 ? "today" : d === 1 ? "tomorrow" : `in ${d} days` };
  }

  /* ---------- links from data.js ---------- */
  $$("[data-link]").forEach((a) => (a.href = link(a.dataset.link)));

  /* ---------- the logo: a big ring linked through a small ring, plus the dot ---------- */
  let logoCount = 0;
  function logoSVG() {
    const k = ++logoCount, box = 'maskUnits="userSpaceOnUse" x="-140" y="-140" width="300" height="470"';
    const white = '<rect x="-140" y="-140" width="300" height="470" fill="#fff"/>';
    return `<svg viewBox="-132 -132 284 454" aria-hidden="true"><defs>
      <mask id="lgA${k}" ${box}>${white}<path d="M-40.3 121.5A81 81 0 0 1-11.1 74.3" fill="none" stroke="#000" stroke-width="36"/></mask>
      <mask id="lgB${k}" ${box}>${white}<path d="M93.4 35.8A100 100 0 0 1 48.5 87.5" fill="none" stroke="#000" stroke-width="38"/></mask>
      <mask id="lgC${k}" ${box}>${white}<circle cx="39" cy="138" r="99" fill="#000"/></mask></defs>
      <circle r="100" fill="none" stroke="currentColor" stroke-width="24" mask="url(#lgA${k})"/>
      <circle cx="39" cy="138" r="81" fill="none" stroke="currentColor" stroke-width="22" mask="url(#lgB${k})"/>
      <circle cx="-20" cy="229" r="72" fill="currentColor" mask="url(#lgC${k})"/></svg>`;
  }
  $$("[data-logo]").forEach((el) => (el.innerHTML = logoSVG()));

  /* ---------- cut-out letters ---------- */
  const PAPERS = [
    { bg: "#F4B8C9", fg: "#4B2B3A", ff: '"Abril Fatface", serif' },
    { bg: "#1F5560", fg: "#F8F0DD", ff: '"Bowlby One", sans-serif' },
    { bg: "repeating-linear-gradient(135deg, #F26FB0 0 3px, transparent 3px 11px), #8FDCE3", fg: "#2B1810", ff: '"Rye", serif' },
    { bg: "#E8762B", fg: "#1F5560", ff: '"Bowlby One", sans-serif' },
    { bg: "#F8F0DD", fg: "#8A2233", ff: '"Sancreek", serif' },
    { bg: "#FCD116", fg: "#2B1810", ff: '"Abril Fatface", serif' },
    { bg: "#8A2233", fg: "#F6D2DE", ff: '"Rye", serif' },
    { bg: "#8E9647", fg: "#2B1810", ff: '"Bowlby One", sans-serif' }
  ];
  const SNIPS = [
    "polygon(3% 5%, 98% 0, 100% 96%, 0 100%)",
    "polygon(0 0, 96% 4%, 100% 100%, 5% 95%)",
    "polygon(4% 0, 100% 6%, 95% 100%, 0 94%)",
    "polygon(0 6%, 100% 0, 97% 94%, 3% 100%)"
  ];
  $$("[data-ransom]").forEach((el, n) => {
    const offset = n === 0 ? 0 : 4;
    el.innerHTML = [...el.dataset.ransom].map((ch, i) => {
      const p = PAPERS[(i + offset) % PAPERS.length];
      const r = (rand() * 12 - 6).toFixed(1), y = (rand() * 0.08 - 0.04).toFixed(3);
      return `<span class="rl" style="--i:${i};--r:${r}deg;--y:${y}em;--bg:${p.bg};--fg:${p.fg};--ff:${p.ff};clip-path:${SNIPS[i % SNIPS.length]}">${esc(ch)}</span>`;
    }).join("");
  });
  $(".hero-title .ransom").classList.add("slap");

  /* ---------- torn paper edges ---------- */
  function tear(el) {
    const mode = el.dataset.torn, all = mode === "all";
    const step = all ? 4 : el.offsetWidth > 900 ? 1.4 : 3;
    const j = (max) => (rand() * max).toFixed(1);
    const pts = [];
    if (mode === "top" || all) for (let x = 0; x <= 100; x += step) pts.push(`${x.toFixed(1)}% ${j(13)}px`);
    else pts.push("0 0", "100% 0");
    if (all) for (let y = 6; y <= 94; y += 6) pts.push(`calc(100% - ${j(10)}px) ${y}%`);
    if (mode === "bottom" || all) for (let x = 100; x >= 0; x -= step) pts.push(`${x.toFixed(1)}% calc(100% - ${j(13)}px)`);
    else pts.push("100% 100%", "0 100%");
    if (all) for (let y = 94; y >= 6; y -= 6) pts.push(`${j(10)}px ${y}%`);
    el.style.clipPath = `polygon(${pts.join(",")})`;
  }
  $$("[data-torn]").forEach(tear);

  /* ---------- washi strip ---------- */
  (() => {
    const words = [
      ["Mabuhay", "welcome"], ["Kain tayo", "let's eat"], ["Tara na", "let's go"],
      ["Sayaw", "dance"], ["Kapamilya", "family"], ["Salamat", "thank you"]
    ];
    const set = words.map(([tl, en]) =>
      `<span class="washi-item">${tl} <small>${en}</small> <svg><use href="#sparkle"/></svg></span>`).join("");
    $("#washi").innerHTML = set + set + set + set;
  })();

  /* ---------- nav + drawer ---------- */
  const nav = $("#nav"), burger = $("#burger"), drawer = $("#drawer");
  function setDrawer(open) {
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.documentElement.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", () => setDrawer(!drawer.classList.contains("open")));
  $$("a", drawer).forEach((a) => a.addEventListener("click", () => setDrawer(false)));
  addEventListener("keydown", (e) => e.key === "Escape" && setDrawer(false));

  const navLinks = $$(".nav-links a");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => spy.observe(s));

  /* ---------- reveal ---------- */
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      if (en.target.matches(".foot-big")) $(".ransom", en.target).classList.add("slap");
      revealer.unobserve(en.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -7% 0px" });
  const observeReveals = (root = document) => $$("[data-reveal]:not(.in)", root).forEach((el) => revealer.observe(el));
  revealer.observe($(".foot-big"));

  /* ---------- hero: typewriter line ---------- */
  (() => {
    const el = $("#heroTyped"), text = el.dataset.type;
    if (reduce) { el.textContent = text; el.classList.add("done"); return; }
    let i = 0;
    const type = () => {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(type, 38 + rand() * 50);
      else setTimeout(() => el.classList.add("done"), 1800);
    };
    setTimeout(type, 1300);
  })();

  /* ---------- manifesto: ink darkens as you read down ---------- */
  const manifesto = $("#manifesto");
  const words = [];
  (() => {
    const wrap = (node) => {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part.trim()) return frag.append(part);
        const s = document.createElement("span");
        s.className = "w";
        s.textContent = part;
        frag.append(s);
        words.push(s);
      });
      node.replaceWith(frag);
    };
    const walk = (el) => [...el.childNodes].forEach((n) => (n.nodeType === 3 ? wrap(n) : walk(n)));
    walk(manifesto);
  })();
  let litCount = -1;

  /* ---------- count-up stats ---------- */
  (() => {
    const run = (el) => {
      const target = +el.dataset.count;
      const from = target > 1000 ? target - 60 : 0;
      if (reduce) return;
      const t0 = performance.now(), dur = 1500;
      const step = (t) => {
        const k = clamp((t - t0) / dur);
        el.textContent = Math.round(from + (target - from) * (1 - Math.pow(1 - k, 4)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        $$("[data-count]", en.target).forEach(run);
        io.disconnect();
      });
    }, { threshold: 0.4 });
    io.observe($("#stats"));
  })();

  /* ============================================================
     COUNCIL DATA HELPERS
     ============================================================ */
  const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const photo = (name) => asset(D.photoDir + slug(name) + D.photoExt);
  const initials = (name) => {
    const p = name.trim().split(/\s+/);
    return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
  };
  /* photo sits over the initials; if the file is missing the initials show */
  const face = (name, cls) => `<img class="${cls}" src="${photo(name)}" alt="" loading="lazy" onerror="this.remove()">`;

  /* hero polaroids: the five e-board members */
  $("#heroPolaroids").innerHTML = D.council.map((c, i) => `
    <button class="polaroid" type="button" style="--i:${i}" data-i="${i}" aria-label="Meet ${esc(c.lead.name)}, ${esc(c.lead.role)}">
      <img src="${photo(c.lead.name)}" alt="">
      <span>${esc(c.lead.name.split(" ")[0])}</span>
    </button>`).join("");

  /* ============================================================
     EVENTS
     ============================================================ */
  const stars = '<svg><use href="#sparkle"/></svg>'.repeat(4);

  let countdownTimer;
  function renderFeature() {
    const host = $("#feature");
    const upcoming = D.events
      .filter((e) => e.kind === "event" && !status(e).past)
      .sort((a, b) => new Date(a.start) - new Date(b.start));
    const ev = upcoming.find((e) => e.featured) || upcoming[0];
    clearInterval(countdownTimer);

    if (!ev) {
      host.innerHTML = `<div class="ticket"><p class="ticket-kicker">next up</p>
        <h3 class="ticket-title">More soon</h3>
        <p class="ticket-theme">New events drop on Instagram first.</p>
        <div class="ticket-foot"><div class="ticket-btns">
        <a class="btn btn-ink btn-sm" href="${link("instagram")}" target="_blank" rel="noopener">Follow @factatvcu</a></div></div></div>`;
      return;
    }

    host.innerHTML = `
      <div class="ticket look-${esc(ev.look || "plain")}">
        ${ev.art ? `<img class="ticket-art" src="${asset(ev.art)}" alt="">` : ""}
        <p class="ticket-kicker">the next big one</p>
        <h3 class="ticket-title">${esc(ev.title)}</h3>
        ${ev.theme ? `<p class="ticket-theme">${esc(ev.theme)}</p>` : ""}
        <div class="ticket-stub">
          ${stars}
          <span>${fmt(ev.start, { weekday: "long", month: "long", day: "numeric" })}</span>
          <span>${esc(ev.time)}</span>
          <span>@ ${esc(ev.where)}</span>
        </div>
        <div id="count"></div>
        <div class="ticket-foot">
          ${ev.stub ? `<p><i class="ph-fill ph-warning-circle" aria-hidden="true"></i>${esc(ev.stub)}</p>` : ""}
          <div class="ticket-btns">
            ${ev.cta ? `<a class="btn btn-sun btn-sm" href="${link(ev.cta.href)}" target="_blank" rel="noopener">${esc(ev.cta.label)}</a>` : ""}
            <button class="btn btn-line btn-sm" id="addCal" type="button"><i class="ph-bold ph-calendar-plus" aria-hidden="true"></i> Add to calendar</button>
          </div>
        </div>
      </div>`;

    $("#addCal").addEventListener("click", () => downloadIcs(ev));

    const box = $("#count");
    const pad = (n) => String(n).padStart(2, "0");
    const tick = () => {
      const ms = new Date(ev.start) - now();
      if (ms <= 0) {
        box.innerHTML = `<div class="count-live">${now() <= new Date(ev.end) ? "Happening now" : "That's a wrap"}</div>`;
        clearInterval(countdownTimer);
        return;
      }
      const s = Math.floor(ms / 1000);
      const parts = [[Math.floor(s / 86400), "days"], [Math.floor(s / 3600) % 24, "hrs"], [Math.floor(s / 60) % 60, "min"], [s % 60, "sec"]];
      box.innerHTML = `<div class="count" role="timer" aria-label="Countdown to ${esc(ev.title)}">` +
        parts.map(([v, l]) => `<div><b>${pad(v)}</b><span>${l}</span></div>`).join("") + "</div>";
    };
    tick();
    countdownTimer = setInterval(tick, 1000);
  }

  function downloadIcs(ev) {
    const stamp = (d) => new Date(d).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const text = (s) => String(s).replace(/([,;\\])/g, "\\$1");
    const lines = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//FACT at VCU//Site//EN", "BEGIN:VEVENT",
      `UID:${ev.id}@factatvcu`, `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(ev.start)}`, `DTEND:${stamp(ev.end)}`,
      `SUMMARY:${text("FACT " + ev.title + (ev.theme ? ": " + ev.theme : ""))}`,
      `LOCATION:${text(ev.where)}`, `DESCRIPTION:${text(ev.note)}`,
      "END:VEVENT", "END:VCALENDAR"
    ];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/calendar" }));
    a.download = `fact-${ev.id}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  /* Kuya/Ate Week scrapbook page */
  function renderWeek() {
    const n = now(), wk = D.week;
    const before = n < new Date(wk.start), after = n > new Date(wk.end);
    $("#weekRange").textContent = wk.range.toLowerCase();
    $("#weekNote").textContent = before
      ? "five days, one big reveal."
      : after
        ? "that's a wrap. welcome to the family, littles!"
        : "happening right now. littles, stay alert!";

    $("#scrap").innerHTML = wk.days.map((d) => {
      const s = new Date(d.start), e = new Date(d.end);
      const past = n > e, diff = dayDiff(s, n);
      const stamp = past ? "done" : n >= s ? "now" : diff === 0 ? "today" : diff === 1 ? "tomorrow" : "";
      return `<article class="day ${past ? "past" : ""} ${!past && diff === 0 ? "today" : ""}">
        ${stamp ? `<span class="stamp-ink">${stamp}</span>` : ""}
        <span class="day-when">${fmt(s, { weekday: "short" }).toLowerCase()} ${fmt(s, { month: "numeric", day: "numeric" })}</span>
        <div class="day-card">
          <h4>${esc(d.title)}</h4>
          <div class="day-meta">
            <span><i class="ph-bold ph-clock" aria-hidden="true"></i>${esc(d.time)}</span>
            <span><i class="ph-bold ph-map-pin" aria-hidden="true"></i>${esc(d.where)}</span>
          </div>
          <p>${esc(d.note)}</p>
        </div>
      </article>`;
    }).join("");
    return !before && !after;
  }

  function renderRows() {
    const list = D.events.map((e) => ({ e, st: status(e) }))
      .sort((a, b) => (!!a.st.past - !!b.st.past) || (new Date(a.e.start) - new Date(b.e.start)) * (a.st.past ? -1 : 1));
    $("#rows").innerHTML = list.map(({ e, st }) => `
      <li class="row ${st.past ? "past" : ""}">
        <div class="row-date look-${esc(e.look || "plain")}"><span>${fmt(e.start, { month: "short" })}</span><b>${fmt(e.start, { day: "numeric" })}</b></div>
        <div>
          <h4>${esc(e.title)}${e.theme ? `: ${esc(e.theme)}` : ""}</h4>
          <p class="row-meta">${esc(e.time)} · ${esc(e.where)}</p>
          <p class="row-note">${esc(e.note)}</p>
        </div>
        <div class="row-side">
          <span class="badge ${st.hot ? "hot" : ""}">${st.label}</span>
          ${e.cta && !st.past ? `<a class="btn btn-line btn-sm" href="${link(e.cta.href)}" target="_blank" rel="noopener">${esc(e.cta.label)}</a>` : ""}
        </div>
      </li>`).join("");

    $("#open").innerHTML = D.open.map((o) =>
      `<li><a href="${link(o.href)}" target="_blank" rel="noopener"><b>${esc(o.title)}</b><span>${esc(o.note)}</span>
        <em>${esc(o.label)} <i class="ph-bold ph-arrow-up-right" aria-hidden="true"></i></em></a></li>`).join("");

    $("#trads").innerHTML = D.traditions.map((t) =>
      `<li class="trad"><span class="trad-icon"><i class="ph-fill ${t.icon}" aria-hidden="true"></i></span>
        <div><h4>${esc(t.title)} <small>${esc(t.season.toLowerCase())}</small></h4><p>${esc(t.note)}</p></div></li>`).join("");
  }

  /* index tabs */
  const tabs = $$("#tabs [role=tab]");
  function selectTab(id, animate = true) {
    tabs.forEach((t) => {
      const on = t.id === id;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = $("#" + t.getAttribute("aria-controls"));
      panel.hidden = !on;
      panel.classList.remove("enter");
      if (on && animate) { void panel.offsetWidth; panel.classList.add("enter"); }
    });
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(t.id));
    t.addEventListener("keydown", (e) => {
      const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;
      const next = tabs[(i + dir + tabs.length) % tabs.length];
      selectTab(next.id);
      next.focus();
    });
  });

  renderFeature();
  renderRows();
  selectTab(renderWeek() ? "tab-week" : "tab-soon", false);

  /* ============================================================
     COUNCIL
     ============================================================ */
  const eboard = $("#eboard"), crew = $("#crew"), crewBody = $("#crewBody"), cd = $("#cd"), cdLabel = $("#cdLabel");
  eboard.innerHTML = D.council.map((c, i) => `
    <button class="eb" role="tab" id="eb-${c.id}" aria-selected="false" aria-controls="crew" style="--g:${c.color};--gk:${c.ink}" data-i="${i}">
      <span class="eb-mono" aria-hidden="true">${initials(c.lead.name)}</span>
      ${face(c.lead.name, "eb-photo")}
      <span class="eb-info">
        <span class="eb-role outlined">${esc(c.lead.role)}</span>
        <span class="eb-name outlined">${esc(c.lead.name)}</span>
        <span class="eb-genre">${esc(c.genre)}</span>
      </span>
    </button>`).join("");
  const ebCards = $$(".eb", eboard);

  /* all five senior advisors, always on show; each one opens the same crew as their e-board partner */
  $("#advisors").innerHTML = D.council.map((c, i) => `
    <button class="sa" type="button" aria-pressed="false" style="--g:${c.color};--gk:${c.ink}" data-i="${i}">
      <span class="sa-photo"><span aria-hidden="true">${initials(c.advisor.name)}</span>${face(c.advisor.name, "")}</span>
      <span class="sa-name outlined">${esc(c.advisor.name)}</span>
      <span class="sa-genre">${esc(c.genre)}</span>
    </button>`).join("");
  const saCards = $$("#advisors .sa");

  const person = (name) => `<li class="person"><span class="avatar">${initials(name)}${face(name, "")}</span><span>${esc(name)}</span></li>`;

  function selectCrew(i, animate = true) {
    const c = D.council[i];
    ebCards.forEach((b, k) => b.setAttribute("aria-selected", String(k === i)));
    saCards.forEach((b, k) => b.setAttribute("aria-pressed", String(k === i)));
    crew.style.setProperty("--g", c.color);
    crew.style.setProperty("--gk", c.ink);
    crew.setAttribute("aria-labelledby", "eb-" + c.id);
    cdLabel.textContent = c.genre;
    const teams = [{ name: "Senior Advisor", people: [c.advisor.name], lead: true }].concat(c.teams);
    crewBody.innerHTML = `
      <h3 class="crew-genre outlined">${esc(c.genre)}</h3>
      <p class="crew-blurb">${esc(c.blurb)}</p>
      <div class="roster">${teams.map((t, k) =>
        `<div class="team ${t.lead ? "lead-team" : ""}" style="--i:${k}"><h4>${esc(t.name.toLowerCase())}:</h4><ul>${t.people.map(person).join("")}</ul></div>`).join("")}</div>`;
    if (animate && !reduce) {
      cd.classList.remove("scratch");
      void cd.offsetWidth;
      cd.classList.add("scratch");
    }
  }
  ebCards.forEach((b, i) => {
    b.addEventListener("click", () => selectCrew(i));
    b.addEventListener("keydown", (e) => {
      const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;
      const k = (i + dir + ebCards.length) % ebCards.length;
      selectCrew(k);
      ebCards[k].focus();
    });
  });
  saCards.forEach((b, i) => b.addEventListener("click", () => selectCrew(i)));
  selectCrew(0, false);

  /* a hero polaroid jumps to that person's crew */
  $$("#heroPolaroids .polaroid").forEach((p) => p.addEventListener("click", () => {
    selectCrew(+p.dataset.i);
    eboard.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }));

  /* the set: drapes, ivy, fairy lights and hanging CDs, like their backdrop */
  const LEAF = "M0 26C-3 20-14 22-18 14-13 13-12 9-16 4-10 4-7 1-8-5-3-3 3-3 8-5 7 1 10 4 16 4 12 9 13 13 18 14 14 22 3 20 0 26Z";
  function drawSet() {
    const drapes = $("#drapes"), garland = $("#garland"), discs = $("#discs");
    const W = garland.clientWidth;
    if (!W) return;
    const wide = W > 900;
    seed = 2026;

    /* drapes */
    const n = wide ? 4 : 2, depth = wide ? 118 : 78;
    let d = `<defs>
      <linearGradient id="dPlum" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5d3a5a"/><stop offset="1" stop-color="#3a2238"/></linearGradient>
      <linearGradient id="dOlive" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f6f40"/><stop offset="1" stop-color="#454623"/></linearGradient></defs>`;
    for (let s = 0; s < n; s++) {
      const x0 = (s * W) / n, x1 = ((s + 1) * W) / n, xm = (x0 + x1) / 2;
      d += `<path fill="url(#${s % 2 ? "dOlive" : "dPlum"})" d="M${x0} 0H${x1}V30Q${xm} ${depth * 2} ${x0} 30Z"/>`;
      [0.5, 0.7, 0.88].forEach((f) => (d += `<path fill="none" stroke="rgba(0,0,0,.2)" stroke-width="2" d="M${x0 + 8} 16Q${xm} ${depth * 2 * f} ${x1 - 8} 16"/>`));
    }
    for (let s = 0; s <= n; s++) {
      const x = (s * W) / n;
      d += `<path fill="${s % 2 ? "#33203199" : "#3a2238"}" d="M${x - 20} 0H${x + 20}L${x + 11} ${depth + 40}L${x} ${depth + 62}L${x - 11} ${depth + 40}Z"/>`;
    }
    drapes.setAttribute("viewBox", `0 0 ${W} 230`);
    drapes.innerHTML = d;

    /* ivy vine + fairy lights */
    const greens = ["#4F7A35", "#3F6A2C", "#6B8F3E", "#2F5524"];
    const swags = wide ? 3 : 2, y0 = 26, sag = wide ? 66 : 44, seg = W / swags;
    let vine = "", leaves = "", bulbs = "", k = 0;
    for (let s = 0; s < swags; s++) {
      const x0 = s * seg - 6, x1 = (s + 1) * seg + 6, xm = (x0 + x1) / 2, cy = y0 + sag * 2;
      vine += `M${x0} ${y0}Q${xm} ${cy} ${x1} ${y0}`;
      const count = Math.floor(seg / 24);
      for (let i = 0; i < count; i++) {
        const t = (i + 0.5) / count;
        const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * xm + t * t * x1;
        const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y0;
        const ang = Math.atan2(2 * (1 - t) * (cy - y0) + 2 * t * (y0 - cy), 2 * (1 - t) * (xm - x0) + 2 * t * (x1 - xm)) * 180 / Math.PI;
        const rot = ang + (i % 2 ? -62 : 38) + (rand() * 44 - 22), sc = 0.62 + rand() * 0.6;
        leaves += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(0)}) scale(${sc.toFixed(2)})"><path class="leaf" style="--i:${k}" fill="${greens[k % 4]}" d="${LEAF}"/></g>`;
        if (i % 3 === 1) {
          const by = y + 16 + rand() * 12;
          bulbs += `<g class="bulb" style="--i:${k}"><circle cx="${x.toFixed(1)}" cy="${by.toFixed(1)}" r="11" fill="rgba(255,214,120,.2)"/><circle cx="${x.toFixed(1)}" cy="${by.toFixed(1)}" r="3.6" fill="#FFE9B0"/></g>`;
        }
        k++;
      }
    }
    garland.setAttribute("viewBox", `0 0 ${W} 280`);
    garland.innerHTML = `<path class="vine" d="${vine}"/>${bulbs}${leaves}`;

    /* CDs on strings */
    const spots = wide ? [5, 17, 30, 44, 58, 71, 84, 95] : [9, 34, 63, 90];
    discs.innerHTML = spots.map((x) => {
      const len = (wide ? 70 : 48) + rand() * (wide ? 120 : 70), size = 30 + rand() * 26;
      return `<span class="hang" style="left:${x}%;--len:${len.toFixed(0)}px;--s:${size.toFixed(0)}px;--a:${(rand() * 360).toFixed(0)}deg;--delay:${(-rand() * 5).toFixed(2)}s"><i></i></span>`;
    }).join("");
  }
  drawSet();

  /* ============================================================
     TRIBES: postage stamps
     ============================================================ */
  const tribesEl = $("#tribes");
  tribesEl.innerHTML = D.tribes.map((t, i) => `
    <button class="tribe" type="button" aria-pressed="false" style="--c:${t.color};--k:${t.ink}" data-i="${i}">
      <span class="tribe-face">
        <img src="${asset(t.art)}" alt="" loading="lazy">
        <span class="tribe-name">${esc(t.name)}</span>
        <span class="tribe-wear">wear ${esc(t.wear.toLowerCase())}</span>
      </span>
      <span class="tribe-mark" aria-hidden="true">repped<small>fact@vcu</small></span>
    </button>`).join("");
  tribesEl.insertAdjacentHTML("afterend", '<p class="marker tribe-line" id="tribeLine" aria-live="polite">pick one. choose wisely.</p>');
  const tribeBtns = $$(".tribe", tribesEl), tribeLine = $("#tribeLine");
  tribeBtns.forEach((b, i) => b.addEventListener("click", (e) => {
    if (b.getAttribute("aria-pressed") === "true") return;
    tribeBtns.forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
    const t = D.tribes[i];
    tribeLine.textContent = t.line;
    burst(e.clientX || innerWidth / 2, e.clientY || innerHeight / 2, [t.color, "#F8F0DD", "#FCD116"], 70);
  }));

  /* pixel balls for the sports card, drawn as box-shadow sprites */
  function sprite(el, rows, pal) {
    const px = parseFloat(getComputedStyle(el).width) || 9;
    const out = [];
    rows.forEach((row, y) => [...row].forEach((ch, x) => pal[ch] && out.push(`${x * px}px ${y * px}px 0 ${pal[ch]}`)));
    el.style.boxShadow = out.join(",");
    el.style.background = "transparent";
  }
  sprite($(".px-basket"), [
    "....OOOO....", "..OOOKOOOO..", ".OOOOKOOOOO.", ".OOOOKOOOOO.", "OKOOOKOOOOKO", "OOKKOKOOKKOO",
    "KKKKKKKKKKKK", "OOKKOKOOKKOO", "OKOOOKOOOOKO", ".OOOOKOOOOO.", ".OOOOKOOOOO.", "..OOOKOOOO.."
  ], { O: "#F08A24", K: "#5a2a08" });
  sprite($(".px-soccer"), [
    "....WWWW....", "..WWKKKKWW..", ".WWWKKKKWWW.", ".KWWWKKWWWK.", "WKKWWWWWWKKW", "WKKWWWWWWKKW",
    "WWWWWKKWWWWW", "WWWWKKKKWWWW", ".KWWKKKKWWK.", ".KKWWKKWWKK.", "..WWWWWWWW..", "....WWWW...."
  ], { W: "#FFFFFF", K: "#17306e" });

  observeReveals();

  /* ============================================================
     CONFETTI (paper scraps)
     ============================================================ */
  const cv = $("#confetti"), cx = cv.getContext("2d");
  let bits = [], confettiOn = false;
  function sizeConfetti() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function burst(x, y, colors = ["#FCD116", "#F26FB0", "#8FDCE3", "#F8F0DD", "#8A2233", "#8E9647"], count = 110) {
    if (reduce) return;
    if (!confettiOn) sizeConfetti();
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, v = 5 + Math.random() * 11;
      bits.push({
        x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 7,
        r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4,
        s: 6 + Math.random() * 9, c: colors[i % colors.length], shape: i % 3, life: 0
      });
    }
    if (!confettiOn) { confettiOn = true; requestAnimationFrame(stepConfetti); }
  }
  function stepConfetti() {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    bits = bits.filter((b) => b.y < innerHeight + 40 && b.life < 260);
    for (const b of bits) {
      b.vx *= 0.985; b.vy = b.vy * 0.985 + 0.34;
      b.x += b.vx; b.y += b.vy; b.r += b.vr; b.life++;
      cx.save();
      cx.translate(b.x, b.y);
      cx.rotate(b.r);
      cx.scale(1, Math.cos(b.life * 0.14 + b.s));
      cx.fillStyle = b.c;
      cx.beginPath();
      if (b.shape === 0) cx.rect(-b.s / 2, -b.s / 3, b.s, b.s / 1.5);
      else if (b.shape === 1) { cx.moveTo(-b.s / 2, -b.s / 2); cx.lineTo(b.s / 2, -b.s / 2); cx.lineTo(0, b.s / 1.2); }
      else cx.arc(0, 0, b.s / 2.6, 0, 6.28);
      cx.fill();
      cx.restore();
    }
    if (bits.length) requestAnimationFrame(stepConfetti);
    else { confettiOn = false; cx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  $$("[data-confetti]").forEach((el) => el.addEventListener("click", (e) => burst(e.clientX, e.clientY)));

  /* ============================================================
     POINTER: tilt, magnetic, hero parallax
     ============================================================ */
  const layers = [[$("#heroDisc"), 0.02], ...$$("#heroPolaroids .polaroid").map((p, i) => [p, 0.03 + (i % 3) * 0.012])];
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  if (fine && !reduce) {
    $(".hero").addEventListener("pointermove", (e) => {
      mouse.tx = (e.clientX / innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / innerHeight - 0.5) * 2;
    });

    $$(".tilt").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transition = "transform .12s ease-out";
        el.style.transform = `perspective(1000px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-4px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transition = "transform .7s cubic-bezier(.16,1,.3,1)";
        el.style.transform = "";
      });
    });

    $$(".magnetic").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.translate = `${((e.clientX - r.left) / r.width - 0.5) * 14}px ${((e.clientY - r.top) / r.height - 0.5) * 10}px`;
      });
      el.addEventListener("pointerleave", () => (el.style.translate = ""));
    });
  }

  /* ============================================================
     ONE TICKER for everything tied to scroll position.
     Reads scrollY once per frame; writes classes and transforms only.
     ============================================================ */
  const checks = $$("#checklist .check"), checksEl = $("#checklist .checks");
  let vh = innerHeight, lastY = -1;
  const measure = () => { vh = innerHeight; lastY = -1; };

  let resizeTimer, lastW = innerWidth;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      measure();
      if (innerWidth !== lastW) { lastW = innerWidth; drawSet(); }
    }, 150);
  });

  function onScroll(y) {
    nav.classList.toggle("scrolled", y > 24);

    const mr = manifesto.getBoundingClientRect();
    if (mr.bottom > -200 && mr.top < vh + 200) {
      const k = clamp((vh * 0.82 - mr.top) / (mr.height + vh * 0.28));
      const n = Math.round(k * words.length * 1.08);
      if (n !== litCount) {
        litCount = n;
        words.forEach((w, i) => w.classList.toggle("lit", i < n));
      }
    }

    const cr = checksEl.getBoundingClientRect();
    if (cr.bottom > -100 && cr.top < vh + 100) {
      const p = clamp((vh * 0.82 - cr.top) / (cr.height + vh * 0.1));
      checks.forEach((c, i) => c.classList.toggle("on", p >= (i + 0.45) / checks.length));
    }
  }

  if (reduce) {
    words.forEach((w) => w.classList.add("lit"));
    checks.forEach((c) => c.classList.add("on"));
  } else {
    const frame = () => {
      const y = scrollY;
      if (y !== lastY) { lastY = y; onScroll(y); }
      if (Math.abs(mouse.tx - mouse.x) > 0.001 || Math.abs(mouse.ty - mouse.y) > 0.001) {
        mouse.x += (mouse.tx - mouse.x) * 0.07;
        mouse.y += (mouse.ty - mouse.y) * 0.07;
        for (const [el, d] of layers) el.style.translate = `${(-mouse.x * d * 620).toFixed(1)}px ${(-mouse.y * d * 420).toFixed(1)}px`;
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  /* small hooks for testing from the console */
  window.__fact = { burst, selectTab, selectCrew, now };
})();
