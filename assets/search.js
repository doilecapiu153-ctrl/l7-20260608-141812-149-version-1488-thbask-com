document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("[data-search-form]");
  var keywordInput = document.querySelector("[data-search-keyword]");
  var typeSelect = document.querySelector("[data-search-type]");
  var regionSelect = document.querySelector("[data-search-region]");
  var results = document.querySelector("[data-search-results]");
  var count = document.querySelector("[data-search-count]");

  if (!form || !results || !Array.isArray(window.MOVIE_SEARCH_DATA)) {
    return;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function cardTemplate(movie) {
    return [
      '<article class="movie-card">',
      '  <a class="movie-card-link" href="movies/' + movie.id + '.html">',
      '    <div class="movie-thumb">',
      '      <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" onerror="this.classList.add(\'image-missing\'); this.removeAttribute(\'src\');">',
      '      <span class="movie-badge">' + escapeHtml(movie.region) + '</span>',
      '      <span class="play-chip">播放</span>',
      '    </div>',
      '    <div class="movie-card-body">',
      '      <h3>' + escapeHtml(movie.title) + '</h3>',
      '      <p>' + escapeHtml(movie.oneLine) + '</p>',
      '      <div class="movie-meta">',
      '        <span>' + escapeHtml(movie.year) + '</span>',
      '        <span>' + escapeHtml(movie.type) + '</span>',
      '      </div>',
      '    </div>',
      '  </a>',
      '</article>'
    ].join("");
  }

  function render() {
    var keyword = normalize(keywordInput.value);
    var type = typeSelect.value;
    var region = regionSelect.value;

    var matched = window.MOVIE_SEARCH_DATA.filter(function (movie) {
      var haystack = normalize([
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        movie.tags,
        movie.oneLine
      ].join(" "));

      if (keyword && haystack.indexOf(keyword) === -1) {
        return false;
      }

      if (type && movie.type !== type) {
        return false;
      }

      if (region && movie.region !== region) {
        return false;
      }

      return true;
    }).slice(0, 120);

    if (count) {
      count.textContent = String(matched.length);
    }

    if (!matched.length) {
      results.innerHTML = '<div class="empty-state">没有找到匹配影片，请尝试更换关键词或筛选条件。</div>';
      return;
    }

    results.innerHTML = '<div class="movie-grid">' + matched.map(cardTemplate).join("") + '</div>';
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    render();
  });

  [keywordInput, typeSelect, regionSelect].forEach(function (control) {
    control.addEventListener("input", render);
    control.addEventListener("change", render);
  });

  render();
});
