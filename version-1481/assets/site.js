(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            var isOpen = mobileNav.hasAttribute('hidden') === false;
            if (isOpen) {
                mobileNav.setAttribute('hidden', '');
                menuButton.setAttribute('aria-expanded', 'false');
            } else {
                mobileNav.removeAttribute('hidden');
                menuButton.setAttribute('aria-expanded', 'true');
            }
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function setHero(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === current);
        });
    }

    function startHero() {
        if (slides.length <= 1) {
            return;
        }
        window.clearInterval(timer);
        timer = window.setInterval(function () {
            setHero(current + 1);
        }, 5600);
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            setHero(index);
            startHero();
        });
    });

    if (prev) {
        prev.addEventListener('click', function () {
            setHero(current - 1);
            startHero();
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            setHero(current + 1);
            startHero();
        });
    }

    setHero(0);
    startHero();

    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    var inputs = Array.prototype.slice.call(document.querySelectorAll('input[name="q"], [data-filter-input]'));
    inputs.forEach(function (input) {
        if (q && !input.value) {
            input.value = q;
        }
    });

    var filterInput = document.querySelector('[data-filter-input]');
    var yearFilter = document.querySelector('[data-year-filter]');
    var typeFilter = document.querySelector('[data-type-filter]');
    var emptyState = document.querySelector('[data-empty-state]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

    function matchYear(cardYear, filterValue) {
        if (!filterValue) {
            return true;
        }
        var year = parseInt(cardYear || '0', 10);
        if (filterValue === '2010') {
            return year >= 2010 && year < 2020;
        }
        if (filterValue === '2000') {
            return year > 0 && year < 2010;
        }
        return String(year) === filterValue;
    }

    function applyFilters() {
        if (!cards.length) {
            return;
        }
        var keyword = (filterInput ? filterInput.value : q).trim().toLowerCase();
        var yearValue = yearFilter ? yearFilter.value : '';
        var typeValue = typeFilter ? typeFilter.value : '';
        var visible = 0;

        cards.forEach(function (card) {
            var haystack = card.getAttribute('data-search') || '';
            var cardType = card.getAttribute('data-type') || '';
            var cardYear = card.getAttribute('data-year') || '';
            var ok = true;

            if (keyword && haystack.indexOf(keyword) === -1) {
                ok = false;
            }
            if (ok && !matchYear(cardYear, yearValue)) {
                ok = false;
            }
            if (ok && typeValue && cardType.indexOf(typeValue) === -1) {
                ok = false;
            }

            card.hidden = !ok;
            if (ok) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.hidden = visible !== 0;
        }
    }

    if (filterInput) {
        filterInput.addEventListener('input', applyFilters);
    }
    if (yearFilter) {
        yearFilter.addEventListener('change', applyFilters);
    }
    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilters);
    }
    applyFilters();
})();
