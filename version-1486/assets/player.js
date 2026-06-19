(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function attach(video, streamUrl) {
    if (video.dataset.loaded === 'yes') {
      return;
    }

    video.dataset.loaded = 'yes';

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      video.hlsController = hls;
      return;
    }

    video.src = streamUrl;
  }

  ready(function () {
    document.querySelectorAll('[data-player]').forEach(function (player) {
      var video = player.querySelector('video');
      var cover = player.querySelector('.player-cover');
      var streamUrl = player.getAttribute('data-stream');

      function play() {
        attach(video, streamUrl);
        video.controls = true;
        if (cover) {
          cover.classList.add('is-hidden');
        }
        var started = video.play();
        if (started && typeof started.catch === 'function') {
          started.catch(function () {});
        }
      }

      if (cover) {
        cover.addEventListener('click', play);
      }

      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
    });
  });
})();
