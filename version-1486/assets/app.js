(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function normalize(text) {
    return String(text || '').trim().toLowerCase();
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[character];
    });
  }

  ready(function () {
    var menuButton = document.querySelector('[data-mobile-menu-button]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
      menuButton.addEventListener('click', function () {
        mobileMenu.classList.toggle('is-open');
      });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var activeIndex = 0;

      function showSlide(index) {
        activeIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === activeIndex);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === activeIndex);
        });
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener('click', function () {
          showSlide(dotIndex);
        });
      });

      if (slides.length > 1) {
        window.setInterval(function () {
          showSlide(activeIndex + 1);
        }, 5200);
      }
    }

    var filterInput = document.querySelector('.category-filter-input');
    var sortSelect = document.querySelector('.category-sort-select');
    var filterGrid = document.querySelector('.filterable-grid');

    if (filterGrid) {
      var cards = Array.prototype.slice.call(filterGrid.querySelectorAll('.movie-card'));

      function refreshFilter() {
        var keyword = normalize(filterInput ? filterInput.value : '');
        cards.forEach(function (card) {
          var text = normalize(card.getAttribute('data-search'));
          card.style.display = !keyword || text.indexOf(keyword) !== -1 ? '' : 'none';
        });
      }

      function refreshSort() {
        var value = sortSelect ? sortSelect.value : 'year-desc';
        var sorted = cards.slice().sort(function (left, right) {
          var leftYear = Number(left.getAttribute('data-year') || 0);
          var rightYear = Number(right.getAttribute('data-year') || 0);
          var leftTitle = left.getAttribute('data-title') || '';
          var rightTitle = right.getAttribute('data-title') || '';

          if (value === 'year-asc') {
            return leftYear - rightYear || leftTitle.localeCompare(rightTitle, 'zh-Hans-CN');
          }

          if (value === 'title-asc') {
            return leftTitle.localeCompare(rightTitle, 'zh-Hans-CN');
          }

          return rightYear - leftYear || leftTitle.localeCompare(rightTitle, 'zh-Hans-CN');
        });

        sorted.forEach(function (card) {
          filterGrid.appendChild(card);
        });
      }

      if (filterInput) {
        filterInput.addEventListener('input', refreshFilter);
      }

      if (sortSelect) {
        sortSelect.addEventListener('change', function () {
          refreshSort();
          refreshFilter();
        });
        refreshSort();
      }
    }

    var searchResults = document.getElementById('search-results');
    var searchInput = document.getElementById('search-page-input');
    var searchSummary = document.getElementById('search-summary');

    if (searchResults && window.MOVIE_SEARCH_INDEX) {
      var params = new URLSearchParams(window.location.search);
      var query = params.get('q') || '';

      if (searchInput) {
        searchInput.value = query;
      }

      function renderSearch() {
        var keyword = normalize(searchInput ? searchInput.value : query);
        var source = window.MOVIE_SEARCH_INDEX;
        var matches = source.filter(function (item) {
          return !keyword || normalize(item.search).indexOf(keyword) !== -1;
        }).slice(0, 240);

        if (searchSummary) {
          searchSummary.textContent = keyword ? '相关影片' : '影片推荐';
        }

        searchResults.innerHTML = matches.map(function (item) {
          return [
            '<article class="movie-card">',
            '  <a class="poster-link" href="' + item.link + '">',
            '    <img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
            '    <span class="poster-shade"></span>',
            '    <span class="play-chip">播放</span>',
            '  </a>',
            '  <div class="movie-card-body">',
            '    <a class="movie-title" href="' + item.link + '">' + escapeHtml(item.title) + '</a>',
            '    <p class="movie-meta">' + escapeHtml(item.year) + ' · ' + escapeHtml(item.region) + ' · ' + escapeHtml(item.type) + '</p>',
            '    <p class="movie-desc">' + escapeHtml(item.summary) + '</p>',
            '    <div class="tag-row"><a href="' + item.categoryLink + '">' + escapeHtml(item.category) + '</a><span>' + escapeHtml(item.genre) + '</span></div>',
            '  </div>',
            '</article>'
          ].join('');
        }).join('');
      }

      if (searchInput) {
        searchInput.addEventListener('input', renderSearch);
      }

      renderSearch();
    }
  });
})();
