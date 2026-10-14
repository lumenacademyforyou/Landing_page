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
    if (!e.isTrusted) return;
    var target = e.target instanceof Element ? e.target : null;
    if (!target) return;

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
})();
