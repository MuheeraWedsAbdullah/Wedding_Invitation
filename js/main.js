/**
 * Wedding Invitation — interactions
 * Edit WEDDING below to customize names, date, venue, etc.
 */

const WEDDING = {
  bride: "Isabella",
  groom: "Alexander",
  title: "Wedding of Isabella & Alexander",
  // Local wedding time (edit to your timezone / start time)
  date: new Date("2026-06-20T16:00:00"),
  endDate: new Date("2026-06-20T23:00:00"),
  location: "Grand Estate, Rosewood Gardens, Willow Creek",
  description: "Join us for the wedding celebration of Isabella & Alexander.",
};

/* ---------- Loader ---------- */
function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  const hide = () => {
    loader.classList.add("is-done");
    loader.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  document.body.style.overflow = "hidden";

  // Show once per session; still animate briefly if returning
  const seen = sessionStorage.getItem("weddingLoaderSeen");
  const delay = seen ? 900 : 2800;

  window.addEventListener("load", () => {
    setTimeout(() => {
      hide();
      sessionStorage.setItem("weddingLoaderSeen", "1");
    }, delay);
  });

  // Fallback if load already fired
  if (document.readyState === "complete") {
    setTimeout(() => {
      hide();
      sessionStorage.setItem("weddingLoaderSeen", "1");
    }, delay);
  }
}

/* ---------- Header scroll + mobile nav ---------- */
function initNav() {
  const header = document.getElementById("header");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    });

    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }
}

/* ---------- Floating particles / sparkles ---------- */
function initParticles() {
  const canvas = document.getElementById("particles");
  if (!canvas) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let particles = [];
  let raf = 0;

  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(55, Math.floor((w * h) / 22000));
    particles = Array.from({ length: count }, () => spawn(true));
  };

  function spawn(randomY) {
    return {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : h + Math.random() * 40,
      r: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 0.35 + 0.12,
      drift: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.15,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.y -= p.speed;
      p.x += p.drift;
      p.twinkle += p.twinkleSpeed;
      const a = p.alpha * (0.55 + 0.45 * Math.sin(p.twinkle));

      if (p.y < -10 || p.x < -20 || p.x > w + 20) {
        Object.assign(p, spawn(false));
        continue;
      }

      ctx.beginPath();
      ctx.fillStyle = `rgba(212, 175, 85, ${a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      // Soft glow sparkle
      if (p.r > 1.2) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 252, 247, ${a * 0.35})`;
        ctx.arc(p.x, p.y, p.r * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    raf = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);
  window.addEventListener("beforeunload", () => cancelAnimationFrame(raf));
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  els.forEach((el) => io.observe(el));
}

/* ---------- Parallax ---------- */
function initParallax() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 768px)").matches;
  if (reduce || mobile) return;

  const layers = [
    ...document.querySelectorAll("[data-parallax]"),
    ...document.querySelectorAll("[data-parallax-slow]"),
  ];
  if (!layers.length) return;

  let ticking = false;

  const update = () => {
    const vh = window.innerHeight;
    layers.forEach((el) => {
      const rect = el.parentElement
        ? el.parentElement.getBoundingClientRect()
        : el.getBoundingClientRect();
      const progress = (vh / 2 - (rect.top + rect.height / 2)) / vh;
      const slow = el.hasAttribute("data-parallax-slow");
      const amount = slow ? progress * 28 : progress * 55;
      el.style.transform = `translate3d(0, ${amount}px, 0)`;
    });
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  update();
}

/* ---------- Live countdown ---------- */
function initCountdown() {
  const nums = {
    days: document.querySelector('[data-unit="days"]'),
    hours: document.querySelector('[data-unit="hours"]'),
    minutes: document.querySelector('[data-unit="minutes"]'),
    seconds: document.querySelector('[data-unit="seconds"]'),
  };
  if (!nums.days) return;

  const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

  const tick = () => {
    const now = Date.now();
    let diff = WEDDING.date.getTime() - now;

    if (diff <= 0) {
      nums.days.textContent = "00";
      nums.hours.textContent = "00";
      nums.minutes.textContent = "00";
      nums.seconds.textContent = "00";
      return;
    }

    const days = Math.floor(diff / 86400000);
    diff %= 86400000;
    const hours = Math.floor(diff / 3600000);
    diff %= 3600000;
    const minutes = Math.floor(diff / 60000);
    diff %= 60000;
    const seconds = Math.floor(diff / 1000);

    nums.days.textContent = pad(days);
    nums.hours.textContent = pad(hours);
    nums.minutes.textContent = pad(minutes);
    nums.seconds.textContent = pad(seconds);
  };

  tick();
  setInterval(tick, 1000);
}

/* ---------- Gallery lightbox ---------- */
function initGallery() {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("lightboxClose");
  if (!lightbox || !img) return;

  const open = (src, alt) => {
    img.src = src;
    img.alt = alt || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    lightbox.hidden = true;
    img.src = "";
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".gallery__item").forEach((btn) => {
    btn.addEventListener("click", () => {
      open(btn.dataset.src, btn.dataset.alt);
    });
  });

  closeBtn?.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) close();
  });
}

/* ---------- Add to calendar ---------- */
function toICSDate(d) {
  return d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function buildGoogleCalUrl() {
  const start = toICSDate(WEDDING.date).replace("Z", "");
  const end = toICSDate(WEDDING.endDate).replace("Z", "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: WEDDING.title,
    dates: `${start}/${end}`,
    details: WEDDING.description,
    location: WEDDING.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadICS() {
  const uid = `${Date.now()}@wedding-invite`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(WEDDING.date)}`,
    `DTEND:${toICSDate(WEDDING.endDate)}`,
    `SUMMARY:${WEDDING.title}`,
    `DESCRIPTION:${WEDDING.description}`,
    `LOCATION:${WEDDING.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "wedding-invitation.ics";
  a.click();
  URL.revokeObjectURL(url);
}

function initCalendar() {
  document.getElementById("addGoogleCal")?.addEventListener("click", () => {
    window.open(buildGoogleCalUrl(), "_blank", "noopener,noreferrer");
  });
  document.getElementById("downloadIcs")?.addEventListener("click", downloadICS);
}

/* ---------- RSVP + popup ---------- */
function initRSVP() {
  const form = document.getElementById("rsvpForm");
  const modal = document.getElementById("rsvpModal");
  const modalText = document.getElementById("modalText");
  if (!form || !modal) return;

  const openModal = (message) => {
    if (modalText) modalText.textContent = message;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
  };

  modal.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const guests = String(data.get("guests") || "");
    const attendance = String(data.get("attendance") || "");
    const message = String(data.get("message") || "").trim();

    if (!name || !email) {
      openModal("Please fill in your name and email so we can confirm your RSVP.");
      return;
    }

    const entry = {
      name,
      email,
      guests,
      attendance,
      message,
      submittedAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem("weddingRSVPs") || "[]");
      existing.push(entry);
      localStorage.setItem("weddingRSVPs", JSON.stringify(existing));
    } catch {
      /* storage may be blocked */
    }

    const accepting = attendance === "yes";
    openModal(
      accepting
        ? `Thank you, ${name}! We’re delighted you’ll be with us. We can’t wait to celebrate together.`
        : `Thank you, ${name}. We’re sorry you can’t join us — you’ll be in our thoughts.`
    );
    form.reset();
  });
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initNav();
  initParticles();
  initReveal();
  initParallax();
  initCountdown();
  initGallery();
  initCalendar();
  initRSVP();
});
