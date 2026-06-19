(function () {
    var blocks = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    blocks.forEach(function (block) {
        var video = block.querySelector('video');
        var cover = block.querySelector('.player-cover');
        var stream = block.getAttribute('data-stream');
        var started = false;
        var hls = null;

        function loadStream() {
            if (!video || !stream || started) {
                return;
            }
            started = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else {
                video.src = stream;
            }

            if (cover) {
                cover.classList.add('is-hidden');
            }

            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        }

        if (cover) {
            cover.addEventListener('click', loadStream);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (!started) {
                    loadStream();
                } else if (video.paused) {
                    video.play();
                }
            });
        }

        window.addEventListener('pagehide', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    });
})();
