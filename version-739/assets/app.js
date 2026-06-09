(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMobileMenu() {
    var toggle = document.querySelector("[data-mobile-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var activeIndex = 0;
    var timer = null;

    function show(index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(activeIndex + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var nextIndex = Number(dot.getAttribute("data-hero-dot"));
        show(nextIndex);
        start();
      });
    });
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function setupFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
    scopes.forEach(function (scope) {
      var grid = scope.querySelector("[data-movie-grid]");
      if (!grid) {
        return;
      }
      var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
      var search = scope.querySelector("[data-search-field]");
      var region = scope.querySelector("[data-region-filter]");
      var type = scope.querySelector("[data-type-filter]");
      var year = scope.querySelector("[data-year-filter]");
      var sort = scope.querySelector("[data-sort-select]");
      var original = cards.slice();

      function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
      }

      function match(card) {
        var query = normalize(search && search.value);
        var regionValue = region ? region.value : "";
        var typeValue = type ? type.value : "";
        var yearValue = year ? year.value : "";
        var text = normalize(card.getAttribute("data-search"));
        var matched = true;
        if (query && text.indexOf(query) === -1) {
          matched = false;
        }
        if (regionValue && card.getAttribute("data-region") !== regionValue) {
          matched = false;
        }
        if (typeValue && card.getAttribute("data-type") !== typeValue) {
          matched = false;
        }
        if (yearValue && card.getAttribute("data-year") !== yearValue) {
          matched = false;
        }
        return matched;
      }

      function sortCards(list) {
        var mode = sort ? sort.value : "default";
        if (mode === "default") {
          return original.slice();
        }
        return list.slice().sort(function (a, b) {
          if (mode === "year-desc") {
            return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
          }
          if (mode === "year-asc") {
            return Number(a.getAttribute("data-year")) - Number(b.getAttribute("data-year"));
          }
          if (mode === "title-asc") {
            return a.getAttribute("data-title").localeCompare(b.getAttribute("data-title"), "zh-Hans-CN");
          }
          return 0;
        });
      }

      function apply() {
        var ordered = sortCards(cards);
        ordered.forEach(function (card) {
          grid.appendChild(card);
          card.classList.toggle("hidden-by-filter", !match(card));
        });
      }

      [search, region, type, year, sort].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });
      apply();
    });
  }

  function setupImageFallback() {
    Array.prototype.slice.call(document.querySelectorAll("img")).forEach(function (image) {
      image.addEventListener("error", function () {
        image.classList.add("is-missing");
      });
    });
  }

  function setupSearchQuery() {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");
    if (!query) {
      return;
    }
    var input = document.querySelector("[data-search-field]");
    if (input) {
      input.value = query;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  ready(function () {
    setupMobileMenu();
    setupHero();
    setupFilters();
    setupImageFallback();
    setupSearchQuery();
  });
})();
