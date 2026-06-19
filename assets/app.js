document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", mobileNav.classList.contains("is-open"));
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
        dot.setAttribute("aria-pressed", dotIndex === activeIndex ? "true" : "false");
      });
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5000);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        showSlide(dotIndex);
        startTimer();
      });
    });

    showSlide(0);
    startTimer();
  }

  var filterPanel = document.querySelector("[data-library-filter]");

  if (filterPanel) {
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-library-card]"));
    var keywordInput = filterPanel.querySelector("[data-filter-keyword]");
    var regionSelect = filterPanel.querySelector("[data-filter-region]");
    var typeSelect = filterPanel.querySelector("[data-filter-type]");
    var yearSelect = filterPanel.querySelector("[data-filter-year]");
    var countNode = document.querySelector("[data-filter-count]");

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function applyFilters() {
      var keyword = normalize(keywordInput && keywordInput.value);
      var region = regionSelect ? regionSelect.value : "";
      var type = typeSelect ? typeSelect.value : "";
      var year = yearSelect ? yearSelect.value : "";
      var visibleCount = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-year"),
          card.getAttribute("data-genre")
        ].join(" "));
        var matched = true;

        if (keyword && haystack.indexOf(keyword) === -1) {
          matched = false;
        }

        if (region && card.getAttribute("data-region") !== region) {
          matched = false;
        }

        if (type && card.getAttribute("data-type") !== type) {
          matched = false;
        }

        if (year && card.getAttribute("data-year") !== year) {
          matched = false;
        }

        card.hidden = !matched;

        if (matched) {
          visibleCount += 1;
        }
      });

      if (countNode) {
        countNode.textContent = String(visibleCount);
      }
    }

    [keywordInput, regionSelect, typeSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilters);
        control.addEventListener("change", applyFilters);
      }
    });

    applyFilters();
  }
});
