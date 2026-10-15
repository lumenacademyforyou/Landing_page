/* Loaded on every page. When a visitor taps a tab, bring what the tab changed into view: on a phone the content
   sits below (or above) the tabs, so a tap otherwise changes something off-screen. Only real taps and clicks
   (isTrusted) scroll; the tours that switch tabs by themselves never move the page. */
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function headerHeight() {
    var h = document.querySelector(".site-header");
    return (h ? h.getBoundingClientRect().height : 0) + 12;
  }

  /* Where the element sits on the page, from its layout box: a card's fade-in or hover lift moves it with a
     transform, and the page should stop where the card ends up, not where it is mid-animation. */
  function pageTop(el) {
    var y = 0;
    for (var n = el; n; n = n.offsetParent) y += n.offsetTop;
    return y;
  }

  /* Scrolls only when the target's top is hidden under the header or it starts in the lower half of the screen. */
  function reveal(el) {
    if (!el) return;
    var offset = headerHeight(), top = pageTop(el) - window.scrollY;
    if (top >= offset && top <= window.innerHeight * 0.5) return;
    window.scrollTo({ top: pageTop(el) - offset, behavior: reduce ? "auto" : "smooth" });
  }

  document.addEventListener("click", function (e) {
    var target = e.target instanceof Element ? e.target : null;
    if (!target) return;

    /* Open Institutional Login Modal */
    var loginBtn = target.closest('[data-modal="login-dialog"], [data-modal="institutional-login-modal"], .btn-login');
    if (loginBtn) {
      e.preventDefault();
      var dlg = document.getElementById("institutional-login-modal") || document.getElementById("login-dialog");
      if (!dlg) {
        dlg = createLoginModal();
        document.body.appendChild(dlg);
        attachLoginEvents(dlg);
      }
      if (typeof dlg.showModal === "function") {
        dlg.showModal();
      } else {
        dlg.setAttribute("open", "");
      }
      var inp = dlg.querySelector("#school-subdomain");
      if (inp) inp.focus();
      return;
    }

    if (!e.isTrusted) return;

    /* Home and features: the product tour (Dashboard, CBT exam, Analysis). A tap also pauses the tour, so the
       screen chosen stays put while it is read; the play button starts it again. */
    var tourTab = target.closest(".stage .seg [role=tab]");
    if (tourTab) {
      var stage = tourTab.closest(".stage");
      var play = document.getElementById("autoplay");
      if (play && play.getAttribute("aria-pressed") === "false") play.click();
      setTimeout(function () { reveal(stage.querySelector(".frame")); }, 30);
      return;
    }

    /* Features: the category filter. Show the first module in the chosen category. */
    var cat = target.closest(".feat-tab");
    if (cat) {
      setTimeout(function () {
        var first = Array.prototype.find.call(document.querySelectorAll(".fbox"), function (b) { return b.style.display !== "none"; });
        reveal(first);
      }, 30);
    }
  });

  function createLoginModal() {
    var dlg = document.createElement("dialog");
    dlg.id = "institutional-login-modal";
    dlg.className = "scored-login-modal";
    dlg.setAttribute("aria-labelledby", "login-modal-title");
    dlg.innerHTML = [
      '<div class="login-modal-box">',
      '  <div class="login-modal-head">',
      '    <div class="login-modal-brand">',
      '      <img src="assets/scored-banner-logo.jpg" alt="Scored" width="130" height="38" class="modal-logo">',
      '    </div>',
      '    <button type="button" class="login-modal-close" id="login-modal-close" aria-label="Close dialog">&times;</button>',
      '  </div>',
      '  <div class="login-modal-body">',
      '    <h3 id="login-modal-title">Institutional Login</h3>',
      '    <p class="login-modal-desc">Access your institution\'s dedicated Scored portal for examinations, academics, and administration.</p>',
      '    <form class="login-school-form" id="school-login-form">',
      '      <label for="school-subdomain" class="login-field-label">Institution Domain or Code</label>',
      '      <div class="login-input-wrap">',
      '        <input type="text" id="school-subdomain" name="subdomain" placeholder="e.g. yourschool" required autocomplete="off" spellcheck="false">',
      '        <span class="domain-suffix">.scored.co.in</span>',
      '      </div>',
      '      <button type="submit" class="btn btn-primary btn-block">Go to Campus Portal &rarr;</button>',
      '    </form>',
      '    <div class="login-roles-divider"><span>Direct Portal Access</span></div>',
      '    <div class="login-role-grid">',
      '      <a href="https://app.scored.co.in/platform" target="_blank" rel="noopener noreferrer" class="login-role-card">',
      '        <div class="role-icon">',
      '          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      '        </div>',
      '        <div><strong>Staff &amp; Principal</strong><span>Admin, attendance, fees &amp; payroll</span></div>',
      '      </a>',
      '      <a href="https://app.scored.co.in/teacher" target="_blank" rel="noopener noreferrer" class="login-role-card">',
      '        <div class="role-icon">',
      '          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
      '        </div>',
      '        <div><strong>Teacher PWA</strong><span>Marks entry, homework &amp; register</span></div>',
      '      </a>',
      '      <a href="https://app.scored.co.in/parent" target="_blank" rel="noopener noreferrer" class="login-role-card">',
      '        <div class="role-icon">',
      '          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>',
      '        </div>',
      '        <div><strong>Parent &amp; Student</strong><span>Report cards, fee dues &amp; CBT tests</span></div>',
      '      </a>',
      '    </div>',
      '    <div class="login-modal-foot">',
      '      <p>New institution? <a href="contact.html">Schedule onboarding</a> or contact IT support at <a href="mailto:hr@scored.co.in">hr@scored.co.in</a>.</p>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join("\n");
    return dlg;
  }

  function attachLoginEvents(dlg) {
    if (!dlg) return;
    var closeBtn = dlg.querySelector("#login-modal-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        if (dlg.close) dlg.close();
        else dlg.removeAttribute("open");
      });
    }
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg) {
        if (dlg.close) dlg.close();
        else dlg.removeAttribute("open");
      }
    });
    var form = dlg.querySelector("#school-login-form");
    if (form) {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var val = (dlg.querySelector("#school-subdomain").value || "").trim().toLowerCase();
        val = val.replace(/[^a-z0-9-]/g, "");
        if (val) {
          window.location.href = "https://" + val + ".scored.co.in";
        }
      });
    }
  }

  // Pre-attach if already in DOM
  var existingDlg = document.getElementById("login-dialog");
  if (existingDlg) attachLoginEvents(existingDlg);
})();
