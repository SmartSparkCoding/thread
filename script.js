/* THE THREAD OF CLUB DOOM — scroll magic */

/* ---------- scroll progress bar ---------- */
const fill = document.getElementById("progress-fill");

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? (window.scrollY / max) * 100 : 0;
  fill.style.width = p + "%";
}
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

/* ---------- reveal on scroll ---------- */
const revealables = document.querySelectorAll(".rv");

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? Number(el.dataset.delay) : 0;
        setTimeout(() => el.classList.add("in"), delay);
        revealObserver.unobserve(el);
      }
    }
  },
  { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
);

revealables.forEach((el) => revealObserver.observe(el));

/* ---------- number counters ---------- */
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function runCounter(el) {
  const target = Number(el.dataset.to);
  const dur = 1400;
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(easeOutExpo(t) * target);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.6 }
);

document.querySelectorAll("[data-to]").forEach((el) => counterObserver.observe(el));

/* ---------- roaming :eyes_shaking: that follows the mouse ---------- */
const ghost = document.getElementById("cursor-emoji");
let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;
let cx = mx;
let cy = my;

window.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
});

window.addEventListener("click", () => {
  ghost.classList.add("pop");
  setTimeout(() => ghost.classList.remove("pop"), 140);
});

function follow() {
  cx += (mx - cx) * 0.16;
  cy += (my - cy) * 0.16;
  ghost.style.left = cx + "px";
  ghost.style.top = cy + "px";
  requestAnimationFrame(follow);
}
follow();

/* ---------- the password saga (you will never guess it) ---------- */
const pwdInput = document.getElementById("pwd-input");
const pwdBtn = document.getElementById("pwd-btn");
const pwdMsg = document.getElementById("pwd-msg");
const pwdLog = document.getElementById("pwd-log");
let attempts = 0;

function tryPassword() {
  const guess = pwdInput.value.trim().toLowerCase();
  pwdInput.value = "";
  attempts++;

  pwdMsg.classList.remove("granted");
  pwdMsg.classList.add("denied");

  const denial = [
    "ACCESS DENIED. wally remains unimpressed :cat-popcorn:",
    "ACCESS DENIED. lynn's lawyers have been informed.",
    "ACCESS DENIED. that's not it, and it never will be.",
    "ACCESS DENIED. dhyan can see this from the deployment logs, you know.",
    "ACCESS DENIED. even clubs26 wasn't it. and you knew that.",
    "ACCESS DENIED. " + (attempts > 5 ? "you really think the password is something that normal? respect the craft." : "try 'clubs26'. oh wait. you already did."),
    "ACCESS DENIED. :cat-popcorn:",
  ];

  if (guess === "give up" || guess === "i give up") {
    pwdMsg.textContent = "> correct. giving up was always the right answer. :cat-popcorn:";
    pwdMsg.classList.add("granted");
    pwdMsg.classList.remove("denied");
  } else if (guess === "clubs26" || guess === "clubs-platform" || guess === "clubs2026") {
    pwdMsg.textContent = "> ACCESS DENIED. (nice try. jacob tried that one at 7:01pm.)";
  } else if (guess === "") {
    pwdMsg.textContent = "> access required. you have to type something. like jacob, you'll never get in.";
  } else {
    pwdMsg.textContent = denial[Math.min(attempts - 1, denial.length - 1)];
  }

  pwdLog.textContent = "> attempt " + attempts + " recorded in the deployment logs. dhyan is watching.";
}
pwdBtn.addEventListener("click", tryPassword);
pwdInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryPassword();
});

/* ---------- the clue decoder flip cards ---------- */
document.querySelectorAll(".dcard").forEach((card) => {
  const flip = () => card.classList.toggle("flipped");
  card.addEventListener("click", flip);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flip();
    }
  });
});

/* ---------- hackatime progress bar ---------- */
const hackaBar = document.querySelector(".hacka-fill");
if (hackaBar) {
  const w = Number(hackaBar.dataset.w);
  const hackaObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setTimeout(() => (hackaBar.style.width = w + "%"), 200);
          hackaObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.4 }
  );
  hackaObserver.observe(hackaBar);
}

/* ---------- vibes submission checklist (need 3 human features) ---------- */
const hfeats = document.querySelectorAll(".hfeat");
const featCount = document.getElementById("feat-count");
const featDone = document.getElementById("feat-done");

hfeats.forEach((box) => {
  box.addEventListener("change", () => {
    const done = document.querySelectorAll(".hfeat:checked").length;
    featCount.textContent = "human features: " + done + " / 3";
    if (done >= 3) {
      featCount.textContent = "human features: " + done + " / 3 (OVERQUOTA. INCREDIBLE.)";
      featDone.classList.add("show");
    } else {
      featDone.classList.remove("show");
    }
  });
});

/* ---------- the popcorn button ---------- */
const popBtn = document.getElementById("popcorn-btn");
const popCount = document.getElementById("popcorn-count");
let pops = 0;
if (popBtn) {
  popBtn.addEventListener("click", () => {
    pops++;
    popBtn.classList.remove("pop");
    void popBtn.offsetWidth;
    popBtn.classList.add("pop");
    popCount.textContent =
      pops + " cats popped · every pop funds 0.00001 more replies to the thread";
  });
}
