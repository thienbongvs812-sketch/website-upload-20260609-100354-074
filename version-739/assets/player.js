(function () {
  var hlsInstance = null;

  function safePlay(video) {
    var action = video.play();
    if (action && typeof action.catch === "function") {
      action.catch(function () {});
    }
  }

  window.initMoviePlayer = function (streamUrl) {
    var video = document.getElementById("movie-video");
    var playButton = document.querySelector("[data-play-button]");
    var shell = document.querySelector("[data-player-shell]");
    if (!video || !playButton || !streamUrl) {
      return;
    }
    var started = false;

    function hideOverlay() {
      playButton.classList.add("is-hidden");
      video.setAttribute("controls", "controls");
    }

    function loadAndPlay() {
      hideOverlay();
      if (started) {
        safePlay(video);
        return;
      }
      started = true;
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          safePlay(video);
        });
      } else {
        video.src = streamUrl;
        safePlay(video);
      }
    }

    playButton.addEventListener("click", loadAndPlay);
    video.addEventListener("click", function () {
      if (!started) {
        loadAndPlay();
      }
    });
    if (shell) {
      shell.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          loadAndPlay();
        }
      });
    }
  };
})();
