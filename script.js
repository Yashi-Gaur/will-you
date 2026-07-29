/* ===================================================================
   WEB3FORMS CONFIG — the email associated with this Access Key
   (yashigaurbcgs@gmail.com) is where every submission gets delivered.
=================================================================== */
const WEB3FORMS_ACCESS_KEY = "98830771-329a-4c21-a313-e066fd7c5814";

function sendEmail(subject, message) {
  if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY") {
    console.warn("Web3Forms not configured yet. Would have sent:", subject, message);
    return Promise.resolve();
  }
  return fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: subject,
      message: message,
      from_name: "will_you site",
    }),
  }).then((res) => {
    if (!res.ok) throw new Error("Web3Forms request failed: " + res.status);
    return res.json().then((data) => {
      if (!data.success) throw new Error("Web3Forms error: " + JSON.stringify(data));
      return data;
    });
  });
}

/* ===================================================================
   FLOATING BACKGROUND HEARTS/PETALS
=================================================================== */
(function floaters() {
  const emojis = ["🌸", "💗", "🌷", "✨", "💌"];
  const container = document.getElementById("floaters");
  for (let i = 0; i < 18; i++) {
    const el = document.createElement("div");
    el.className = "floater";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + "%";
    el.style.animationDuration = 10 + Math.random() * 12 + "s";
    el.style.animationDelay = Math.random() * 12 + "s";
    el.style.fontSize = 1 + Math.random() * 1.2 + "rem";
    container.appendChild(el);
  }
})();

/* ===================================================================
   SCREEN NAVIGATION
=================================================================== */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ===================================================================
   SCREEN 1: LOGIN + SECRET CODE
=================================================================== */
const VALID_NAMES = ["anubhav", "anubhav saini"];
const SECRET_WORDS = [
  "Sweetheart", "Cupid", "Blossom", "Smitten", "Honeybun", "Lovebird",
  "Cherish", "Rendezvous", "Bouquet", "Darling", "Sunshine", "Cuddle",
  "Starlit", "Enchanted", "Whimsy", "Serendipity", "Marigold", "Firefly",
  "Swoon", "Infatuated",
];

let currentSecretWord = null;

const nameInput = document.getElementById("name-input");
const getCodeBtn = document.getElementById("get-code-btn");
const loginStatus = document.getElementById("login-status");
const codeBlock = document.getElementById("code-block");
const codeInput = document.getElementById("code-input");
const welcomeBtn = document.getElementById("welcome-btn");

function normalizeName(s) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

getCodeBtn.addEventListener("click", () => {
  const name = normalizeName(nameInput.value);

  if (!VALID_NAMES.includes(name)) {
    loginStatus.textContent = "You're not him, go away!!!";
    loginStatus.className = "status-msg error";
    nameInput.classList.remove("shake");
    void nameInput.offsetWidth; // restart animation
    nameInput.classList.add("shake");
    codeBlock.classList.add("hidden");
    return;
  }

  currentSecretWord = SECRET_WORDS[Math.floor(Math.random() * SECRET_WORDS.length)];

  getCodeBtn.disabled = true;
  loginStatus.textContent = "Sending your secret code... 💌";
  loginStatus.className = "status-msg";

  sendEmail(
    "💌 Your secret code has been requested",
    `${name === "anubhav" ? "Anubhav" : "Anubhav Saini"} is asking for the secret code.\n\nThe secret code is: ${currentSecretWord}`
  )
    .then(() => {
      loginStatus.textContent = "Code sent! Go ask me for it 😉";
      loginStatus.className = "status-msg success";
      codeBlock.classList.remove("hidden");
    })
    .catch((err) => {
      console.error(err);
      loginStatus.textContent = "The code was generated, but the email didn't send. Ask for it directly!";
      loginStatus.className = "status-msg error";
      codeBlock.classList.remove("hidden");
    })
    .finally(() => {
      getCodeBtn.disabled = false;
    });
});

codeInput.addEventListener("input", () => {
  const val = codeInput.value.trim().toLowerCase();
  welcomeBtn.disabled = !(currentSecretWord && val === currentSecretWord.toLowerCase());
});

welcomeBtn.addEventListener("click", () => {
  showScreen("screen-questions");
  renderQuestion();
});

/* ===================================================================
   SCREEN 2: QUESTIONS
=================================================================== */
let currentQuestion = 1;
const TOTAL_QUESTIONS = 3;

const answers = {
  flower: null,
  flowerOther: "",
  learn: [],
  learnOther: "",
  cliche: null,
  clicheOther: "",
};

const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");

function updateDots() {
  document.querySelectorAll(".dot").forEach((dot) => {
    dot.classList.toggle("active", Number(dot.dataset.dot) === currentQuestion);
  });
}

function renderQuestion() {
  [1, 2, 3].forEach((n) => {
    document.getElementById(`question-${n}`).classList.toggle("hidden", n !== currentQuestion);
  });
  updateDots();

  backBtn.classList.toggle("hidden", currentQuestion === 1);
  nextBtn.classList.toggle("hidden", currentQuestion === TOTAL_QUESTIONS);
  submitBtn.classList.toggle("hidden", currentQuestion !== TOTAL_QUESTIONS);

  validateCurrentQuestion();
}

function validateCurrentQuestion() {
  let valid = false;

  if (currentQuestion === 1) {
    valid = !!answers.flower && (answers.flower !== "__other__" || answers.flowerOther.trim() !== "");
  } else if (currentQuestion === 2) {
    valid =
      answers.learn.length > 0 &&
      (!answers.learn.includes("__other__") || answers.learnOther.trim() !== "");
  } else if (currentQuestion === 3) {
    valid = !!answers.cliche && (answers.cliche !== "__other__" || answers.clicheOther.trim() !== "");
  }

  if (currentQuestion === TOTAL_QUESTIONS) {
    submitBtn.disabled = !valid;
  } else {
    nextBtn.disabled = !valid;
  }
}

backBtn.addEventListener("click", () => {
  if (currentQuestion > 1) {
    currentQuestion -= 1;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentQuestion < TOTAL_QUESTIONS) {
    currentQuestion += 1;
    renderQuestion();
  }
});

/* --- Q1: single select flower --- */
const q1Other = document.getElementById("q1-other-input");
document.getElementById("q1-options").addEventListener("click", (e) => {
  const card = e.target.closest(".option-card");
  if (!card) return;
  document.querySelectorAll("#q1-options .option-card").forEach((c) => c.classList.remove("selected"));
  card.classList.add("selected");
  answers.flower = card.dataset.value;
  q1Other.classList.toggle("hidden", answers.flower !== "__other__");
  if (answers.flower === "__other__") q1Other.focus();
  validateCurrentQuestion();
});
q1Other.addEventListener("input", () => {
  answers.flowerOther = q1Other.value;
  validateCurrentQuestion();
});

/* --- Q2: multi select learn --- */
const q2Other = document.getElementById("q2-other-input");
document.getElementById("q2-options").addEventListener("click", (e) => {
  const card = e.target.closest(".option-card");
  if (!card) return;
  const value = card.dataset.value;
  const idx = answers.learn.indexOf(value);
  if (idx === -1) {
    answers.learn.push(value);
    card.classList.add("selected");
  } else {
    answers.learn.splice(idx, 1);
    card.classList.remove("selected");
  }
  const otherOn = answers.learn.includes("__other__");
  q2Other.classList.toggle("hidden", !otherOn);
  if (otherOn) q2Other.focus();
  validateCurrentQuestion();
});
q2Other.addEventListener("input", () => {
  answers.learnOther = q2Other.value;
  validateCurrentQuestion();
});

/* --- Q3: single select cliche --- */
const q3Other = document.getElementById("q3-other-input");
document.getElementById("q3-options").addEventListener("click", (e) => {
  const card = e.target.closest(".option-card");
  if (!card) return;
  document.querySelectorAll("#q3-options .option-card").forEach((c) => c.classList.remove("selected"));
  card.classList.add("selected");
  answers.cliche = card.dataset.value;
  q3Other.classList.toggle("hidden", answers.cliche !== "__other__");
  if (answers.cliche === "__other__") q3Other.focus();
  validateCurrentQuestion();
});
q3Other.addEventListener("input", () => {
  answers.clicheOther = q3Other.value;
  validateCurrentQuestion();
});

/* --- Submit --- */
submitBtn.addEventListener("click", () => {
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending... 💕";

  const flower = answers.flower === "__other__" ? answers.flowerOther : answers.flower;
  const learnList = answers.learn.map((v) => (v === "__other__" ? answers.learnOther : v));
  const cliche = answers.cliche === "__other__" ? answers.clicheOther : answers.cliche;

  const message =
    `Favourite flower: ${flower}\n\n` +
    `Wants to learn on a date: ${learnList.join(", ")}\n\n` +
    `Favourite dating clichè: ${cliche}`;

  sendEmail("💕 Date questionnaire responses", message)
    .catch((err) => console.error(err))
    .finally(() => {
      showScreen("screen-thankyou");
    });
});

/* ===================================================================
   SCREEN 3: THANK YOU
=================================================================== */
document.getElementById("thankyou-arrow").addEventListener("click", () => {
  showScreen("screen-proposal");
  noBtn.classList.remove("hidden");
  positionNoButtonInitially();
});

/* ===================================================================
   SCREEN 4: PROPOSAL — yes / repelling no
=================================================================== */
const proposalImg = document.getElementById("proposal-img");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const noAudio = document.getElementById("no-audio");

const REPEL_RADIUS = 160; // drives the smooth glide-away motion + "no" image
const SOUND_TRIGGER_DISTANCE = 5; // px from the button's actual edge
const SOUND_REARM_DISTANCE = 20; // px — must back off past this before it can re-trigger
let hoveringYes = false;
let nearNo = false;
let audioPlaying = false;
let noAudioArmed = true; // allows a fresh play once mouse moves away and comes back

// Shortest distance from a point to a rect's edge (0 if the point is inside it).
function distanceToRectEdge(px, py, rect) {
  const dx = Math.max(rect.left - px, 0, px - rect.right);
  const dy = Math.max(rect.top - py, 0, py - rect.bottom);
  return Math.hypot(dx, dy);
}

noAudio.addEventListener("ended", () => {
  audioPlaying = false;
  updateProposalImage();
});

function updateProposalImage() {
  if (hoveringYes) {
    proposalImg.src = "main_page_yes.jpeg";
  } else if (nearNo || audioPlaying) {
    proposalImg.src = "main_page_no.jpeg";
  } else {
    proposalImg.src = "main_page_base.jpg";
  }
}

yesBtn.addEventListener("mouseenter", () => {
  hoveringYes = true;
  nearNo = false;
  noAudio.pause();
  noAudio.currentTime = 0;
  audioPlaying = false;
  noAudioArmed = true;
  updateProposalImage();
});
yesBtn.addEventListener("mouseleave", () => {
  hoveringYes = false;
  updateProposalImage();
});

// Continuously nudges the no button away from the cursor (instead of
// teleporting to a random spot) so the motion reads as one smooth glide.
// Bounds are the full viewport — the button is position:fixed and can
// roam anywhere on the page, not just within the card.
function repelNoButton(clientX, clientY) {
  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;
  const maxLeft = Math.max(0, window.innerWidth - btnW);
  const maxTop = Math.max(0, window.innerHeight - btnH);

  const curLeft = parseFloat(noBtn.style.left) || 0;
  const curTop = parseFloat(noBtn.style.top) || 0;
  const centerX = curLeft + btnW / 2;
  const centerY = curTop + btnH / 2;

  const dx = centerX - clientX;
  const dy = centerY - clientY;
  const dist = Math.hypot(dx, dy) || 0.001;
  const angle = Math.atan2(dy, dx);

  const pushAmount = (REPEL_RADIUS - dist) * 0.9 + 24;
  let newLeft = clamp(curLeft + Math.cos(angle) * pushAmount, 0, maxLeft);
  let newTop = clamp(curTop + Math.sin(angle) * pushAmount, 0, maxTop);

  // if clamping against a wall/corner left it still within reach, slide sideways along the wall
  const clampedDist = Math.hypot(newLeft + btnW / 2 - clientX, newTop + btnH / 2 - clientY);
  if (clampedDist < REPEL_RADIUS * 0.75) {
    const perp = angle + Math.PI / 2;
    const optionA = {
      left: clamp(newLeft + Math.cos(perp) * btnW * 0.8, 0, maxLeft),
      top: clamp(newTop + Math.sin(perp) * btnH * 0.8, 0, maxTop),
    };
    const optionB = {
      left: clamp(newLeft - Math.cos(perp) * btnW * 0.8, 0, maxLeft),
      top: clamp(newTop - Math.sin(perp) * btnH * 0.8, 0, maxTop),
    };
    const distA = Math.hypot(optionA.left + btnW / 2 - clientX, optionA.top + btnH / 2 - clientY);
    const distB = Math.hypot(optionB.left + btnW / 2 - clientX, optionB.top + btnH / 2 - clientY);
    const best = distA > distB ? optionA : optionB;
    if (Math.max(distA, distB) > clampedDist) {
      newLeft = best.left;
      newTop = best.top;
    }
  }

  noBtn.style.left = newLeft + "px";
  noBtn.style.top = newTop + "px";
  noBtn.style.transform = "none";
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function handlePointerMove(clientX, clientY) {
  if (hoveringYes || noBtn.classList.contains("hidden")) return;

  const rect = noBtn.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dist = Math.hypot(clientX - centerX, clientY - centerY);
  const edgeDist = distanceToRectEdge(clientX, clientY, rect);

  if (dist < REPEL_RADIUS) {
    repelNoButton(clientX, clientY);
    nearNo = true;
  } else {
    nearNo = false;
  }

  if (edgeDist < SOUND_TRIGGER_DISTANCE) {
    if (noAudioArmed) {
      noAudio.currentTime = 0;
      noAudio.play().catch(() => {});
      audioPlaying = true;
      noAudioArmed = false;
    }
  } else if (edgeDist > SOUND_REARM_DISTANCE) {
    noAudioArmed = true;
  }

  updateProposalImage();
}

// Hard safety net: if the cursor ever actually reaches the button despite the
// repulsion above (e.g. a very fast mouse jump between move events), snap it
// away instantly — no transition, no chance for a click to land on it.
function hardEscape() {
  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;
  const maxLeft = Math.max(0, window.innerWidth - btnW);
  const maxTop = Math.max(0, window.innerHeight - btnH);
  const curLeft = parseFloat(noBtn.style.left) || 0;

  const prevTransition = noBtn.style.transition;
  noBtn.style.transition = "none";
  noBtn.style.left = (curLeft < maxLeft / 2 ? maxLeft : 0) + "px";
  noBtn.style.top = Math.random() * maxTop + "px";
  noBtn.style.transform = "none";
  void noBtn.offsetWidth; // force reflow before re-enabling the transition
  noBtn.style.transition = prevTransition;

  nearNo = true;
  if (noAudioArmed) {
    noAudio.currentTime = 0;
    noAudio.play().catch(() => {});
    audioPlaying = true;
    noAudioArmed = false;
  }
  updateProposalImage();
}

noBtn.addEventListener("mouseenter", hardEscape);
noBtn.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    hardEscape();
  },
  { passive: false }
);

// listens page-wide (not just over the card) since the no button can be
// anywhere in the viewport
document.addEventListener("mousemove", (e) => handlePointerMove(e.clientX, e.clientY));
document.addEventListener("touchmove", (e) => {
  if (e.touches && e.touches[0]) {
    handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
  }
});

// Parks the no button exactly over its invisible placeholder, which sits in
// the same flex row as the yes button — so at rest the two are symmetric
// about the card's center and perfectly aligned horizontally. Must run only
// once visible (getBoundingClientRect is meaningless while display:none).
// It's still free to roam the full viewport once the chase starts (see
// repelNoButton/hardEscape below) — this only governs the starting spot.
function positionNoButtonInitially() {
  if (noBtn.offsetWidth === 0) return;
  const placeholder = document.getElementById("no-btn-placeholder");
  const rect = placeholder.getBoundingClientRect();

  noBtn.style.left = rect.left + "px";
  noBtn.style.top = rect.top + "px";
  noBtn.style.transform = "none";
}

yesBtn.addEventListener("click", () => {
  document.getElementById("proposal-question").classList.add("hidden");
  document.getElementById("proposal-yay").classList.remove("hidden");
  noBtn.classList.add("hidden");

  sendEmail("He said YES!", "Anubhav said yes!!").catch((err) => console.error(err));
});
