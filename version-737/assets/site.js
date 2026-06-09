(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".menu-toggle");
  if (header && toggle) {
    toggle.addEventListener("click", function () {
      header.classList.toggle("menu-open");
    });
  }

  var topButton = document.querySelector(".back-to-top");
  if (topButton) {
    window.addEventListener("scroll", function () {
      topButton.classList.toggle("visible", window.scrollY > 420);
    });
    topButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.querySelectorAll("img").forEach(function (image) {
    image.addEventListener("error", function () {
      image.classList.add("image-hidden");
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var active = 0;
  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    active = (index + slides.length) % slides.length;
    slides.forEach(function (slide, idx) {
      slide.classList.toggle("active", idx === active);
    });
    dots.forEach(function (dot, idx) {
      dot.classList.toggle("active", idx === active);
    });
  }
  dots.forEach(function (dot, idx) {
    dot.addEventListener("click", function () {
      showSlide(idx);
    });
  });
  if (slides.length > 1) {
    setInterval(function () {
      showSlide(active + 1);
    }, 5200);
  }

  document.querySelectorAll(".site-search, .year-filter").forEach(function (control) {
    control.addEventListener("input", filterList);
    control.addEventListener("change", filterList);
  });

  function filterList() {
    var searchInput = document.querySelector(".site-search");
    var yearSelect = document.querySelector(".year-filter");
    var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var year = yearSelect ? yearSelect.value : "";
    var items = document.querySelectorAll(".searchable-list .movie-card, .searchable-list .rank-row, .searchable-list .searchable-item");
    items.forEach(function (item) {
      var haystack = [
        item.getAttribute("data-title") || "",
        item.getAttribute("data-year") || "",
        item.getAttribute("data-genre") || "",
        item.getAttribute("data-region") || "",
        item.textContent || ""
      ].join(" ").toLowerCase();
      var itemYear = item.getAttribute("data-year") || "";
      var matchesQuery = !query || haystack.indexOf(query) !== -1;
      var matchesYear = !year || itemYear.indexOf(year) !== -1;
      item.classList.toggle("is-hidden", !(matchesQuery && matchesYear));
    });
  }
})();

function initMoviePlayer(url) {
  var video = document.querySelector(".movie-video");
  var overlay = document.querySelector(".play-overlay");
  if (!video || !url) {
    return;
  }

  var started = false;
  function attachAndPlay() {
    if (started) {
      video.play();
      return;
    }
    started = true;
    if (overlay) {
      overlay.classList.add("hidden");
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.play();
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true });
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });
      return;
    }
    video.src = url;
    video.play();
  }

  if (overlay) {
    overlay.addEventListener("click", attachAndPlay);
  }
  video.addEventListener("click", function () {
    if (!started || video.paused) {
      attachAndPlay();
    } else {
      video.pause();
    }
  });
}
