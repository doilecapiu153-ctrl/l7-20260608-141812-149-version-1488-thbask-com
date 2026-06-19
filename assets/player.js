document.addEventListener("DOMContentLoaded", function () {
  var video = document.querySelector("[data-video-player]");
  var overlay = document.querySelector("[data-play-overlay]");
  var status = document.querySelector("[data-player-status]");
  var hlsInstance = null;
  var isReady = false;

  if (!video) {
    return;
  }

  var source = video.getAttribute("data-source");

  function showStatus(message) {
    if (!status) {
      return;
    }

    status.textContent = message;
    status.classList.add("is-visible");
  }

  function preparePlayer() {
    if (isReady || !source) {
      return;
    }

    isReady = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);

      hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          showStatus("播放器加载遇到问题，请刷新页面或稍后重试。err=" + data.type);
        }
      });

      return;
    }

    video.src = source;
  }

  function playVideo() {
    preparePlayer();

    if (overlay) {
      overlay.hidden = true;
    }

    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        showStatus("浏览器阻止了自动播放，请使用播放器控件手动播放。 ");
      });
    }
  }

  if (overlay) {
    overlay.addEventListener("click", playVideo);
  }

  video.addEventListener("play", function () {
    if (overlay) {
      overlay.hidden = true;
    }
  });

  window.addEventListener("pagehide", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
});
