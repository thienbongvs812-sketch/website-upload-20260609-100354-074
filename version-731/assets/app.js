(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
      return;
    }
    callback();
  }

  function initMobileMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    if (!toggle) {
      return;
    }
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
    });
  }

  function initHeroCarousel() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('is-active', itemIndex === index);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('active', itemIndex === index);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5600);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    show(0);
    restart();
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function initSearchFilters() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
    var grids = Array.prototype.slice.call(document.querySelectorAll('[data-card-grid]'));
    var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter-chip]'));
    if (!grids.length) {
      return;
    }
    var activeCategory = 'all';

    function currentQuery() {
      if (!inputs.length) {
        return '';
      }
      return normalize(inputs[0].value);
    }

    function apply() {
      var query = currentQuery();
      grids.forEach(function (grid) {
        var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-movie-card]'));
        cards.forEach(function (card) {
          var text = normalize(card.getAttribute('data-search'));
          var category = card.getAttribute('data-category') || '';
          var matchText = !query || text.indexOf(query) !== -1;
          var matchCategory = activeCategory === 'all' || category === activeCategory;
          card.classList.toggle('is-hidden', !(matchText && matchCategory));
        });
      });
    }

    inputs.forEach(function (input) {
      input.addEventListener('input', apply);
      var params = new URLSearchParams(window.location.search);
      var query = params.get('q');
      if (query) {
        input.value = query;
      }
    });

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeCategory = chip.getAttribute('data-filter-chip') || 'all';
        chips.forEach(function (item) {
          item.classList.toggle('active', item === chip);
        });
        apply();
      });
    });

    apply();
  }

  function attachStream(video, stream) {
    if (!video || !stream) {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (video.src !== stream) {
        video.src = stream;
      }
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      if (!video.hlsPlayer) {
        video.hlsPlayer = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        video.hlsPlayer.loadSource(stream);
        video.hlsPlayer.attachMedia(video);
      }
      return;
    }
    if (video.src !== stream) {
      video.src = stream;
    }
  }

  window.initMoviePlayer = function (options) {
    ready(function () {
      var video = document.getElementById(options.videoId);
      var overlay = document.getElementById(options.overlayId);
      var button = document.getElementById(options.buttonId);
      var stream = options.stream;
      var started = false;

      function start() {
        if (!video) {
          return;
        }
        attachStream(video, stream);
        started = true;
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {});
        }
      }

      if (overlay) {
        overlay.addEventListener('click', start);
      }

      if (button) {
        button.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
          start();
        });
      }

      if (video) {
        video.addEventListener('click', function () {
          if (!started || video.paused) {
            start();
          }
        });
        video.addEventListener('play', function () {
          if (overlay) {
            overlay.classList.add('is-hidden');
          }
        });
      }
    });
  };

  ready(function () {
    initMobileMenu();
    initHeroCarousel();
    initSearchFilters();
  });
})();
