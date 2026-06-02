const TOKEN_KEY   = 'animemix_token';
const REFRESH_KEY = 'animemix_refresh';
const USER_KEY    = 'animemix_user';

window.AuthClient = {
  getToken()   { return localStorage.getItem(TOKEN_KEY); },
  getRefresh() { return localStorage.getItem(REFRESH_KEY); },
  getUser()    { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } },
  isLoggedIn() { return !!this.getToken(); },

  _setSession(data) {
    if (data.access_token)  localStorage.setItem(TOKEN_KEY,   data.access_token);
    if (data.refresh_token) localStorage.setItem(REFRESH_KEY, data.refresh_token);
    if (data.user)          localStorage.setItem(USER_KEY,    JSON.stringify(data.user));
    window.__currentUser = data.user || null;
    window.dispatchEvent(new CustomEvent('auth-change', { detail: data.user || null }));
  },

  _clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    window.__currentUser = null;
    window.dispatchEvent(new CustomEvent('auth-change', { detail: null }));
  },

  async _fetch(path, opts = {}) {
    const token = this.getToken();
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch('/api/auth' + path, { ...opts, headers });

    if (res.status === 401) {
      const refreshed = await this._tryRefresh();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${this.getToken()}`;
        return fetch('/api/auth' + path, { ...opts, headers });
      }
    }
    return res;
  },

  async _tryRefresh() {
    const refresh = this.getRefresh();
    if (!refresh) return false;
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${refresh}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) { this._clearSession(); return false; }
      const data = await res.json();
      localStorage.setItem(TOKEN_KEY, data.access_token);
      return true;
    } catch {
      return false;
    }
  },

  async register(email, username, password) {
    const res  = await this._fetch('/register', { method: 'POST', body: JSON.stringify({ email, username, password }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error_key ? window.t(data.error_key) : (data.error || 'Error'));
    this._setSession(data);
    return data.user;
  },

  async login(email, password) {
    const res  = await this._fetch('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error_key ? window.t(data.error_key) : (data.error || 'Error'));
    this._setSession(data);
    return data.user;
  },

  async logout() {
    await this._fetch('/logout', { method: 'POST' }).catch(() => {});
    this._clearSession();
  },

  async me() {
    const res = await this._fetch('/me');
    if (!res.ok) return null;
    const user = await res.json();
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.__currentUser = user;
    return user;
  },
};

window.__currentUser = AuthClient.getUser();
if (AuthClient.isLoggedIn()) {
  AuthClient.me().catch(() => AuthClient._clearSession());
}
