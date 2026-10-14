/* ============================================================
   SCORED FUTURE-GEN INTERACTIVE SIMULATION LOGIC
   - Live AI CBT Examination Simulator
   - Real-Time Biometric & RFID Attendance Stream
   - Autonomous Legacy Migration Simulator
   - Institutional ROI & Scale Calculator
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  initCbtSimulator();
  initBiometricStream();
  initMigrationSimulator();
  initRoiCalculator();
  initEvalShowcase();
});

/* ------------------------------------------------------------
   1. Live AI CBT Examination Simulator
   ------------------------------------------------------------ */
function initCbtSimulator() {
  const simCard = document.querySelector(".cbt-sim-card");
  if (!simCard) return;

  // Questions Database
  const questions = [
    {
      num: 14,
      section: "Section B: Electromagnetism",
      marks: "+4 / -1 Marks",
      text: "A straight conductor of length 0.5 m carrying a steady current of 4.0 A is oriented perpendicular to a uniform magnetic field of 0.8 T. What is the magnitude of the magnetic Lorentz force acting on the conductor?",
      formula: "Lorentz Force: F = B · I · L · sin(θ)",
      options: [
        { label: "A", val: "0.80 N" },
        { label: "B", val: "1.60 N", correct: true },
        { label: "C", val: "3.20 N" },
        { label: "D", val: "6.40 N" }
      ]
    },
    {
      num: 15,
      section: "Section B: Chemical Reactions & Redox",
      marks: "+4 / -1 Marks",
      text: "In the balanced redox reaction: 2MnO₄⁻ + 5C₂O₄²⁻ + 16H⁺ → 2Mn²⁺ + 10CO₂ + 8H₂O, which chemical species functions as the reducing agent?",
      formula: "Oxidation State Analysis: C (+3) → C (+4)",
      options: [
        { label: "A", val: "MnO₄⁻ (Permanganate ion)" },
        { label: "B", val: "C₂O₄²⁻ (Oxalate ion)", correct: true },
        { label: "C", val: "H⁺ (Protons)" },
        { label: "D", val: "Mn²⁺ (Manganous ion)" }
      ]
    },
    {
      num: 16,
      section: "Section A: Advanced Mathematics",
      marks: "+4 / -1 Marks",
      text: "If the quadratic equation kx² - 2(k - 1)x + 4 = 0 has distinct real roots, determine the admissible range of values for parameter k (k ≠ 0).",
      formula: "Discriminant Criterion: Δ = b² - 4ac > 0",
      options: [
        { label: "A", val: "k < -1/3 or k > 1" },
        { label: "B", val: "k < 1/5 or k > 3" },
        { label: "C", val: "k < 1/3 or k > 1", correct: true },
        { label: "D", val: "-1/3 < k < 1" }
      ]
    }
  ];

  let currentIdx = 0;
  const userAnswers = {};

  // Elements
  const qMeta = simCard.querySelector(".cbt-q-meta");
  const qText = simCard.querySelector(".cbt-q-text");
  const formulaPill = simCard.querySelector(".cbt-formula-pill");
  const optionsList = simCard.querySelector(".cbt-options-list");
  const paletteGrid = simCard.querySelector(".cbt-palette-grid");
  const timerVal = simCard.querySelector("#cbt-timer-val");
  const modalOverlay = simCard.querySelector(".cbt-grade-modal-overlay");
  const closeModalBtn = simCard.querySelector(".cbt-close-modal");
  const submitBtn = simCard.querySelector(".cbt-btn-submit");
  const saveBtn = simCard.querySelector(".cbt-btn-save");
  const reviewBtn = simCard.querySelector(".cbt-btn-review");
  const clearBtn = simCard.querySelector(".cbt-btn-clear");

  // Timer countdown simulation with cleanup and viewport observer
  let secondsLeft = 44 * 60 + 28;
  let cbtTimerInterval = null;

  function tickTimer() {
    if (secondsLeft > 0) {
      secondsLeft--;
      const m = Math.floor(secondsLeft / 60);
      const s = secondsLeft % 60;
      if (timerVal) {
        timerVal.textContent =
          "00:" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
      }
    } else if (cbtTimerInterval) {
      clearInterval(cbtTimerInterval);
      cbtTimerInterval = null;
    }
  }

  function startCbtTimer() {
    if (!cbtTimerInterval && secondsLeft > 0) {
      cbtTimerInterval = setInterval(tickTimer, 1000);
    }
  }

  function stopCbtTimer() {
    if (cbtTimerInterval) {
      clearInterval(cbtTimerInterval);
      cbtTimerInterval = null;
    }
  }

  if ("IntersectionObserver" in window) {
    const cbtObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          startCbtTimer();
        } else {
          stopCbtTimer();
        }
      });
    }, { threshold: 0.1 });
    cbtObserver.observe(simCard);
  } else {
    startCbtTimer();
  }

  // Render Palette Pills (20 total)
  if (paletteGrid) {
    paletteGrid.innerHTML = "";
    for (let i = 1; i <= 20; i++) {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "cbt-pal-pill";
      pill.textContent = i;
      pill.setAttribute("data-qnum", i);

      // Pre-seed mock statuses
      if (i <= 13) pill.classList.add("ans");
      else if (i === 14) pill.classList.add("active");
      else if (i <= 17) pill.classList.add("flag");

      pill.addEventListener("click", function () {
        const targetQ = i - 14;
        if (targetQ >= 0 && targetQ < questions.length) {
          currentIdx = targetQ;
          renderCurrentQuestion();
        }
      });
      paletteGrid.appendChild(pill);
    }
  }

  function renderCurrentQuestion() {
    const q = questions[currentIdx];
    if (!q) return;

    if (qMeta) {
      qMeta.innerHTML = `<span>${q.section} &bull; Question ${q.num} of 40</span><span style="color:#10B981">${q.marks}</span>`;
    }
    if (qText) qText.textContent = q.text;
    if (formulaPill) formulaPill.textContent = q.formula;

    if (optionsList) {
      optionsList.innerHTML = "";
      q.options.forEach(function (opt) {
        const row = document.createElement("div");
        row.className = "cbt-option";
        if (userAnswers[q.num] === opt.label) {
          row.classList.add("selected");
        }
        row.innerHTML = `
          <div class="cbt-opt-label">${opt.label}</div>
          <div class="cbt-opt-val">${opt.val}</div>
        `;
        row.addEventListener("click", function () {
          userAnswers[q.num] = opt.label;
          optionsList.querySelectorAll(".cbt-option").forEach((el) => el.classList.remove("selected"));
          row.classList.add("selected");
          updatePalettePill(q.num, "ans");
        });
        optionsList.appendChild(row);
      });
    }

    // Update active pill highlight
    if (paletteGrid) {
      paletteGrid.querySelectorAll(".cbt-pal-pill").forEach((p) => p.classList.remove("active"));
      const curPill = paletteGrid.querySelector(`[data-qnum="${q.num}"]`);
      if (curPill) curPill.classList.add("active");
    }
  }

  function updatePalettePill(num, status) {
    if (!paletteGrid) return;
    const p = paletteGrid.querySelector(`[data-qnum="${num}"]`);
    if (p) {
      p.classList.remove("ans", "flag");
      if (status) p.classList.add(status);
    }
  }

  // Buttons
  if (saveBtn) {
    saveBtn.addEventListener("click", function () {
      if (currentIdx < questions.length - 1) {
        currentIdx++;
        renderCurrentQuestion();
      }
    });
  }

  if (reviewBtn) {
    reviewBtn.addEventListener("click", function () {
      const q = questions[currentIdx];
      updatePalettePill(q.num, "flag");
      if (currentIdx < questions.length - 1) {
        currentIdx++;
        renderCurrentQuestion();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      const q = questions[currentIdx];
      delete userAnswers[q.num];
      if (optionsList) {
        optionsList.querySelectorAll(".cbt-option").forEach((el) => el.classList.remove("selected"));
      }
      updatePalettePill(q.num, null);
    });
  }

  if (submitBtn && modalOverlay) {
    submitBtn.addEventListener("click", function () {
      modalOverlay.classList.add("open");
    });
  }

  if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener("click", function () {
      modalOverlay.classList.remove("open");
    });
  }

  // Initial render
  renderCurrentQuestion();
}

/* ------------------------------------------------------------
   2. Real-Time Biometric & RFID Attendance Stream
   ------------------------------------------------------------ */
function initBiometricStream() {
  const feedList = document.querySelector(".bio-feed-list");
  if (!feedList) return;

  const mockPunches = [
    { name: "Ananya Iyer", class: "Class 9-A", type: "RFID Turnstile Gate 1", status: "On-Time" },
    { name: "Devansh Joshi", class: "Class 11-PCM", type: "Biometric Terminal Lab", status: "On-Time" },
    { name: "Sneha Reddy", class: "Class 10-C", type: "Facial Recognition Gate 2", status: "On-Time" },
    { name: "Kabir Mehta", class: "Class 8-B", type: "Smart Card Tap Main Hub", status: "On-Time" },
    { name: "Pooja Hegde", class: "Class 12-PCB", type: "Biometric Terminal Gate 1", status: "On-Time" }
  ];

  let punchIdx = 0;
  let bioStreamInterval = null;

  function addBioPunch() {
    const item = mockPunches[punchIdx % mockPunches.length];
    punchIdx++;

    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-IN", { hour12: true });

    const row = document.createElement("div");
    row.className = "bio-punch-row";
    row.style.animation = "fadeIn 0.4s ease";
    row.innerHTML = `
      <div class="bio-user-cell">
        <span class="bio-pill-time">${timeStr}</span>
        <div>
          <b>${item.name}</b> · <small style="color:#64748b">${item.class}</small>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:0.78rem;color:#64748b" class="hide-sm">${item.type}</span>
        <span class="bio-sms-sent">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> WhatsApp Alert Dispatched
        </span>
      </div>
    `;

    feedList.insertBefore(row, feedList.firstChild);
    while (feedList.children.length > 5) {
      feedList.removeChild(feedList.lastChild);
    }
  }

  function startBioStream() {
    if (!bioStreamInterval) {
      bioStreamInterval = setInterval(addBioPunch, 4200);
    }
  }

  function stopBioStream() {
    if (bioStreamInterval) {
      clearInterval(bioStreamInterval);
      bioStreamInterval = null;
    }
  }

  if ("IntersectionObserver" in window) {
    const bioObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          startBioStream();
        } else {
          stopBioStream();
        }
      });
    }, { threshold: 0.1 });
    bioObserver.observe(feedList);
  } else {
    startBioStream();
  }
}

/* ------------------------------------------------------------
   3. Autonomous Legacy Migration Simulator
   ------------------------------------------------------------ */
function initMigrationSimulator() {
  const startBtn = document.querySelector("#btn-start-migration");
  const progressWrap = document.querySelector(".mig-progress-bar-wrap");
  const progressFill = document.querySelector(".mig-progress-bar-fill");
  const statusText = document.querySelector(".mig-status-text");
  const successCard = document.querySelector(".mig-success-result");

  if (!startBtn || !progressWrap || !progressFill || !statusText || !successCard) return;

  startBtn.addEventListener("click", function () {
    startBtn.disabled = true;
    startBtn.style.opacity = "0.6";
    startBtn.textContent = "⏳ Migration Engine Processing...";
    progressWrap.style.display = "block";
    successCard.style.display = "none";
    progressFill.style.width = "0%";

    const stages = [
      { pct: "25%", text: "Ingesting legacy Excel workbook (1,250 rows)..." },
      { pct: "55%", text: "Sanitizing student Aadhaar, CBSE roll numbers & phone records..." },
      { pct: "85%", text: "Auto-reconciling historical fee ledger & GST tax balances..." },
      { pct: "100%", text: "Provisioning role-based credentials & parent portals..." }
    ];

    let step = 0;
    const interval = setInterval(function () {
      if (step < stages.length) {
        progressFill.style.width = stages[step].pct;
        statusText.textContent = stages[step].text;
        step++;
      } else {
        clearInterval(interval);
        statusText.textContent = "✅ Migration complete! Zero data loss detected.";
        progressWrap.style.display = "none";
        successCard.style.display = "block";
        startBtn.disabled = false;
        startBtn.style.opacity = "1";
        startBtn.textContent = "🔁 Ingest Another Dataset (Demo)";
      }
    }, 700);
  });
}

/* ------------------------------------------------------------
   4. Institutional ROI & Scale Calculator
   ------------------------------------------------------------ */
function initRoiCalculator() {
  const slider = document.querySelector("#roi-students-slider");
  const studentCountDisplay = document.querySelector("#roi-student-count");
  const paperSavedDisplay = document.querySelector("#roi-paper-saved");
  const hoursReclaimedDisplay = document.querySelector("#roi-hours-reclaimed");
  const gradingSpeedDisplay = document.querySelector("#roi-grading-speed");

  if (!slider) return;

  function updateRoi() {
    const count = parseInt(slider.value, 10);
    if (studentCountDisplay) studentCountDisplay.textContent = count.toLocaleString("en-IN") + " Students";

    // Formatted calculations
    const paperSavings = count * 140; // ~₹140 per student saved on sheets, ink, printing
    const hoursSaved = Math.round(count * 0.42); // admin hours saved per student/year
    const gradingTime = (count / 850).toFixed(1); // sub-second autonomous evaluation

    if (paperSavedDisplay) paperSavedDisplay.textContent = "₹" + paperSavings.toLocaleString("en-IN");
    if (hoursReclaimedDisplay) hoursReclaimedDisplay.textContent = hoursSaved.toLocaleString("en-IN") + " hrs/yr";
    if (gradingSpeedDisplay) gradingSpeedDisplay.textContent = gradingTime + "s Instant";
  }

  slider.addEventListener("input", updateRoi);
  updateRoi();
}


/* ------------------------------------------------------------
   5. AI-Powered Evaluations Video Showcase Tabs (Auto-cycling 3-5s)
   ------------------------------------------------------------ */
function initEvalShowcase() {
  const showcases = document.querySelectorAll(".eval-showcase-wrap");
  if (!showcases.length) return;

  const ROTATION_INTERVAL = 4000; // 4 seconds auto-switch (within 3-5 sec)

  showcases.forEach(function (showcase) {
    const tabCards = Array.from(showcase.querySelectorAll(".eval-tab-card"));
    const screens = Array.from(showcase.querySelectorAll(".eval-screen-content"));
    if (!tabCards.length || !screens.length) return;

    // Ensure progress bar element exists in each tab card
    tabCards.forEach(function (card) {
      if (!card.querySelector(".eval-tab-progress")) {
        const prog = document.createElement("div");
        prog.className = "eval-tab-progress";
        card.appendChild(prog);
      }
    });

    let currentIndex = tabCards.findIndex((c) => c.classList.contains("active"));
    if (currentIndex === -1) currentIndex = 0;

    let timerId = null;
    let isHovered = false;
    let isVisible = true;

    function switchTab(index) {
      currentIndex = index;
      const card = tabCards[currentIndex];
      const target = card ? card.getAttribute("data-target") : null;
      if (!target) return;

      // Update tabs and reset progress bar animation
      tabCards.forEach(function (c) {
        c.classList.remove("active");
        const p = c.querySelector(".eval-tab-progress");
        if (p) {
          p.style.animation = "none";
          void p.offsetWidth; // force reflow
          p.style.animation = "";
        }
      });
      card.classList.add("active");

      // Update screen content with smooth entrance
      screens.forEach((s) => s.classList.remove("active"));
      const activeScreen = showcase.querySelector("#" + target);
      if (activeScreen) {
        activeScreen.classList.add("active");
      }
    }

    function nextTab() {
      if (isHovered || !isVisible) return;
      const nextIndex = (currentIndex + 1) % tabCards.length;
      switchTab(nextIndex);
    }

    function startTimer() {
      stopTimer();
      timerId = setInterval(nextTab, ROTATION_INTERVAL);
    }

    function stopTimer() {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    }

    function resetTimer() {
      stopTimer();
      startTimer();
    }

    // On a phone the tabs sit below the screen they change, so a tap changed something off-screen.
    // Bring the screen into view, and hold the rotation long enough to read it (touch has no hover pause).
    function revealScreen() {
      const screen = showcase.querySelector(".eval-screen-content.active");
      const frame = screen ? (screen.closest(".eval-screen-stage") || screen.parentElement) : null;
      if (!frame) return;
      const header = document.querySelector(".site-header");
      const offset = (header ? header.getBoundingClientRect().height : 0) + 12;
      const top = frame.getBoundingClientRect().top;
      if (top < offset || top > window.innerHeight * 0.5) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: window.scrollY + top - offset, behavior: reduce ? "auto" : "smooth" });
      }
    }

    let holdId = null;
    tabCards.forEach(function (card, idx) {
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      function choose() {
        switchTab(idx);
        stopTimer();
        clearTimeout(holdId);
        holdId = setTimeout(function () { holdId = null; if (!isHovered && isVisible) startTimer(); }, 15000);
        revealScreen();
      }
      card.addEventListener("click", choose);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(); }
      });
    });

    // Pause on hover so user can interact/read freely
    const containerCard = showcase.querySelector(".eval-container-card") || showcase;
    containerCard.addEventListener("mouseenter", function () {
      isHovered = true;
      stopTimer();
    });

    containerCard.addEventListener("mouseleave", function () {
      isHovered = false;
      if (!holdId) startTimer();
    });

    // IntersectionObserver to pause when off-screen
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            isVisible = entry.isIntersecting;
            if (isVisible && !isHovered && !holdId) {
              startTimer();
            } else {
              stopTimer();
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(showcase);
    } else {
      startTimer();
    }

    // Activate initial tab and start timer
    switchTab(currentIndex);
    startTimer();
  });
}
