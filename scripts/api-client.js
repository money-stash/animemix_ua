const API_BASE = '/api';

async function apiFetch(path, params = {}) {
  const url = new URL(API_BASE + path, window.location.origin);
  Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

window.AnimeMixAPI = {
  getAnime(p = {})           { return apiFetch('/anime', p); },
  getAnimeDetail(slug, lang) { return apiFetch(`/anime/${slug}`, { lang }); },
  getEpisodes(slug, lang, season) { return apiFetch(`/anime/${slug}/episodes`, { lang, season }); },
  getGenres(lang)            { return apiFetch('/genres', { lang }); },
  search(q, lang)            { return apiFetch('/search', { q, lang }); },
  getContinueWatching(lang)  { return apiFetch('/continue-watching', { lang }); },
  getYears()                 { return apiFetch('/years'); },
};

window.__dataReady = false;

async function loadInitialData() {
  try {
    const [animeRes, genresUk, genresEn, continueRes, yearsRes] = await Promise.all([
      AnimeMixAPI.getAnime({ lang: 'uk', limit: 100 }),
      AnimeMixAPI.getGenres('uk'),
      AnimeMixAPI.getGenres('en'),
      AnimeMixAPI.getContinueWatching('uk'),
      AnimeMixAPI.getYears(),
    ]);

    const mapUk = {}, mapEn = {};
    genresUk.forEach(g => { mapUk[g.slug] = g.name; });
    genresEn.forEach(g => { mapEn[g.slug] = g.name; });

    const normalize = (a) => ({
      ...a,
      genres:    (a.genres || []).map(slug => mapUk[slug] || slug),
      genresEn:  (a.genres || []).map(slug => mapEn[slug] || slug),
      genreSlugs: a.genres || [],
    });

    window.ANIME    = animeRes.data.map(normalize);
    window.CONTINUE = continueRes.map(normalize);
    if (window.AuthClient && window.AuthClient.isLoggedIn()) {
      window.LibraryClient && window.LibraryClient.getContinueWatching()
        .then(list => { if (list && list.length) window.CONTINUE = list.map(normalize); })
        .catch(() => {});
    }
    window.GENRES_UK   = genresUk.map(g => g.name);
    window.GENRES_EN   = genresEn.map(g => g.name);
    window.GENRE_SLUGS = genresUk.map((g, i) => ({ slug: g.slug, name_uk: g.name, name_en: genresEn[i]?.name || g.name }));
    window.YEARS    = yearsRes;

    Object.defineProperty(window, 'GENRES', {
      get() { return window.__lang === 'en' ? window.GENRES_EN : window.GENRES_UK; },
      configurable: true,
    });

    window.getAnime = (id) => window.ANIME.find(a => a.id === id) || window.ANIME[0];

    window.__dataReady = true;
    window.dispatchEvent(new CustomEvent('animemix-data-ready'));
  } catch (err) {
    console.error('AnimeMix: failed to load data', err);
    window.__dataReady = true;
    window.dispatchEvent(new CustomEvent('animemix-data-ready'));
  }
}

loadInitialData();

window.addEventListener('langchange', () => {
  window.dispatchEvent(new CustomEvent('animemix-data-ready'));
});
