(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var video = document.getElementById('movie-player');
        var button = document.getElementById('player-start');
        if (!video) {
            return;
        }
        var sourceElement = video.querySelector('source[type="application/x-mpegURL"]');
        var url = sourceElement ? sourceElement.getAttribute('src') : '';
        var prepared = false;
        var hlsInstance = null;

        function hideButton() {
            if (button) {
                button.classList.add('hidden');
            }
        }

        function prepare(callback) {
            if (prepared) {
                if (callback) {
                    callback();
                }
                return;
            }
            if (!url) {
                return;
            }
            var canNative = video.canPlayType('application/vnd.apple.mpegurl') || video.canPlayType('application/x-mpegURL');
            if (canNative) {
                video.src = url;
                prepared = true;
                if (callback) {
                    callback();
                }
                return;
            }
            function attachHls() {
                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true,
                        backBufferLength: 90
                    });
                    hlsInstance.loadSource(url);
                    hlsInstance.attachMedia(video);
                    hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        prepared = true;
                        if (callback) {
                            callback();
                        }
                    });
                    hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                        if (data && data.fatal && hlsInstance) {
                            hlsInstance.destroy();
                            hlsInstance = null;
                            video.src = url;
                            prepared = true;
                        }
                    });
                } else {
                    video.src = url;
                    prepared = true;
                    if (callback) {
                        callback();
                    }
                }
            }
            if (window.Hls) {
                attachHls();
            } else {
                var script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js';
                script.async = true;
                script.onload = attachHls;
                script.onerror = function () {
                    video.src = url;
                    prepared = true;
                    if (callback) {
                        callback();
                    }
                };
                document.head.appendChild(script);
            }
        }

        function playVideo() {
            prepare(function () {
                hideButton();
                var promise = video.play();
                if (promise && promise.catch) {
                    promise.catch(function () {});
                }
            });
        }

        if (button) {
            button.addEventListener('click', playVideo);
        }
        video.addEventListener('click', function () {
            if (video.paused) {
                playVideo();
            }
        });
        video.addEventListener('play', hideButton);
        video.addEventListener('pause', function () {
            if (button) {
                button.classList.remove('hidden');
            }
        });
    });
})();
