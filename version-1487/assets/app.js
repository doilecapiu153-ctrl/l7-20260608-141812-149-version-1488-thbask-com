(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function text(value) {
        return (value || "").toString().toLowerCase();
    }

    function setupMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        var prev = root.querySelector("[data-hero-prev]");
        var next = root.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }

        function move(step) {
            show(index + step);
        }

        function restart() {
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function () {
                move(1);
            }, 5200);
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                restart();
            });
        });
        if (prev) {
            prev.addEventListener("click", function () {
                move(-1);
                restart();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                move(1);
                restart();
            });
        }
        show(0);
        restart();
    }

    function setupFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));
        panels.forEach(function (panel) {
            var input = panel.querySelector("[data-filter-input]");
            var year = panel.querySelector("[data-filter-year]");
            var region = panel.querySelector("[data-filter-region]");
            var type = panel.querySelector("[data-filter-type]");
            var area = panel.closest("section") || document;
            var cards = Array.prototype.slice.call(area.querySelectorAll(".movie-card[data-search]"));
            var empty = area.querySelector("[data-empty-state]");

            function apply() {
                var q = text(input && input.value);
                var y = year && year.value;
                var r = region && region.value;
                var t = type && type.value;
                var visible = 0;
                cards.forEach(function (card) {
                    var matched = true;
                    if (q && text(card.getAttribute("data-search")).indexOf(q) === -1) {
                        matched = false;
                    }
                    if (y && card.getAttribute("data-year") !== y) {
                        matched = false;
                    }
                    if (r && card.getAttribute("data-region") !== r) {
                        matched = false;
                    }
                    if (t && card.getAttribute("data-type") !== t) {
                        matched = false;
                    }
                    card.hidden = !matched;
                    if (matched) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            [input, year, region, type].forEach(function (el) {
                if (el) {
                    el.addEventListener("input", apply);
                    el.addEventListener("change", apply);
                }
            });
        });
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
    });

    window.bindMoviePlayer = function (videoId, overlayId, source) {
        ready(function () {
            var video = document.getElementById(videoId);
            var overlay = document.getElementById(overlayId);
            var started = false;
            var hls = null;

            if (!video) {
                return;
            }

            function hideOverlay() {
                if (overlay) {
                    overlay.classList.add("is-hidden");
                }
            }

            function playVideo() {
                var promise = video.play();
                if (promise && typeof promise.catch === "function") {
                    promise.catch(function () {});
                }
            }

            function start() {
                if (!started) {
                    started = true;
                    if (video.canPlayType("application/vnd.apple.mpegurl")) {
                        video.src = source;
                        video.addEventListener("loadedmetadata", playVideo, { once: true });
                    } else if (window.Hls && window.Hls.isSupported()) {
                        hls = new window.Hls({ enableWorker: true });
                        hls.loadSource(source);
                        hls.attachMedia(video);
                        hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
                    } else {
                        video.src = source;
                        video.addEventListener("loadedmetadata", playVideo, { once: true });
                    }
                } else {
                    playVideo();
                }
                hideOverlay();
            }

            if (overlay) {
                overlay.addEventListener("click", start);
            }
            video.addEventListener("click", function () {
                if (video.paused) {
                    start();
                }
            });
            video.addEventListener("play", hideOverlay);
            window.addEventListener("beforeunload", function () {
                if (hls) {
                    hls.destroy();
                }
            });
        });
    };
})();
