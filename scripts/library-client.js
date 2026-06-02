window.LibraryClient = {

  async _fetch(path, opts = {}) {
    const token = AuthClient.getToken();
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch('/api/user' + path, { ...opts, headers });
    return res;
  },

  
  async getLibrary(status = null) {
    const lang = window.__lang || 'uk';
    const q = status ? `?lang=${lang}&status=${status}` : `?lang=${lang}`;
    const res = await this._fetch(`/library${q}`);
    return res.ok ? res.json() : [];
  },

  
  async getEntry(animeSlug) {
    const res = await this._fetch(`/library/${animeSlug}?lang=${window.__lang || 'uk'}`);
    if (!res.ok || res.status === 404) return null;
    const data = await res.json();
    return data;
  },

  
  async upsert(animeSlug, { status = 'plan', progress, rating, notes } = {}) {
    const body = { status };
    if (progress !== undefined) body.progress = progress;
    if (rating   !== undefined) body.rating   = rating;
    if (notes    !== undefined) body.notes    = notes;
    const res = await this._fetch(`/library/${animeSlug}`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error');
    window.dispatchEvent(new CustomEvent('library-change', { detail: { slug: animeSlug, entry: data } }));
    return data;
  },

  
  async patch(animeSlug, fields) {
    const res = await this._fetch(`/library/${animeSlug}`, {
      method: 'PATCH',
      body: JSON.stringify(fields),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error');
    window.dispatchEvent(new CustomEvent('library-change', { detail: { slug: animeSlug, entry: data } }));
    return data;
  },

  
  async remove(animeSlug) {
    const res = await this._fetch(`/library/${animeSlug}`, { method: 'DELETE' });
    window.dispatchEvent(new CustomEvent('library-change', { detail: { slug: animeSlug, entry: null } }));
    return res.ok;
  },

  
  async saveProgress({ animeSlug, episode, season = 1, watchedSeconds, durationSeconds = 1440, completed = false }) {
    if (!AuthClient.isLoggedIn()) return null;
    const res = await this._fetch('/progress', {
      method: 'POST',
      body: JSON.stringify({
        anime_slug: animeSlug,
        episode, season,
        watched_seconds: watchedSeconds,
        duration_seconds: durationSeconds,
        completed,
      }),
    });
    return res.ok ? res.json() : null;
  },

  
  async getContinueWatching() {
    if (!AuthClient.isLoggedIn()) return null;
    const lang = window.__lang || 'uk';
    const res = await this._fetch(`/continue-watching?lang=${lang}`);
    return res.ok ? res.json() : null;
  },

  
  async getStats() {
    const res = await this._fetch('/stats');
    return res.ok ? res.json() : null;
  },
};

window.addEventListener('library-change', () => {
  window.dispatchEvent(new CustomEvent('animemix-data-ready'));
});
