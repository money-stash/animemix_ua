// ============================================================
// ANIMEMIX — App shell with routing + tweaks
// ============================================================

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#ff2d95",
  "secondaryColor": "#b026ff",
  "glassBlur": 22,
  "showJp": true,
  "scanlines": true,
  "density": "regular"
}/*EDITMODE-END*/;

const ACCENT_OPTIONS = [
  ['#ff2d95', '#b026ff', '#6b4dff'], // magenta + violet (default)
  ['#00f0ff', '#b026ff', '#ff2d95'], // cyan + violet + magenta
  ['#c4ff3d', '#00d4aa', '#6b4dff'], // matrix
  ['#ff8a4c', '#ff007a', '#ffce4a'], // sunset
  ['#ffce4a', '#ff007a', '#b026ff'], // gold + neon
];

function AppLoader() {
  const [ready, setReady] = useState(window.__dataReady === true);
  useEffect(() => {
    if (window.__dataReady) return;
    const h = () => setReady(true);
    window.addEventListener('animemix-data-ready', h);
    return () => window.removeEventListener('animemix-data-ready', h);
  }, []);

  if (!ready) return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-0)', gap: 20,
    }}>
      <svg width="48" height="48" viewBox="0 0 32 32" fill="none" style={{ animation: 'spin-slow 1.5s linear infinite' }}>
        <path d="M4 28L12 6h3l8 22h-4l-1.7-5h-8.6L7 28H4zm6.5-8h6L13.5 11l-3 9z" fill="url(#lg-load)"/>
        <path d="M22 6h3v18l-3 4V6z" fill="url(#lg2-load)"/>
        <defs>
          <linearGradient id="lg-load" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff2d95"/><stop offset="1" stopColor="#b026ff"/></linearGradient>
          <linearGradient id="lg2-load" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b026ff"/><stop offset="1" stopColor="#00f0ff"/></linearGradient>
        </defs>
      </svg>
      <div className="font-mono" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--ink-mute)' }}>ANIMEMIX…</div>
    </div>
  );
  return <App />;
}

function App() {
  const { t: tr } = useLang();
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useState('home');
  const [animeId, setAnimeId] = useState('solo-leveling');
  const [searchOpen, setSearchOpen] = useState(false);

  // apply tweaks to CSS vars
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--magenta', t.accentColor);
    r.style.setProperty('--violet', t.secondaryColor);
    r.style.setProperty('--glass-blur', `${t.glassBlur}px`);
    r.style.setProperty('--grad-primary',
      `linear-gradient(135deg, ${t.accentColor} 0%, ${t.secondaryColor} 50%, #6b4dff 100%)`);
    document.body.classList.toggle('no-jp', !t.showJp);
    document.body.classList.toggle('no-scanlines', !t.scanlines);
  }, [t]);

  // keyboard shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openAnime = (id) => {
    setAnimeId(id);
    setRoute('details');
    window.scrollTo(0, 0);
  };

  const goTo = (r) => {
    setRoute(r);
    window.scrollTo(0, 0);
  };

  const showShell = route !== 'auth';

  return (
    <div data-screen-label={routeLabel(route)}>
      {t.scanlines && <div className="scan-sweep" />}
      {showShell && <TopNav route={route} setRoute={goTo} openSearch={() => setSearchOpen(true)} />}

      {route === 'home' && <HomePage setRoute={goTo} openAnime={openAnime} />}
      {route === 'catalog' && <CatalogPage openAnime={openAnime} />}
      {route === 'simulcast' && <CatalogPage openAnime={openAnime} />}
      {route === 'details' && <DetailsPage animeId={animeId} openAnime={openAnime} setRoute={goTo} />}
      {route === 'player' && <PlayerPage animeId={animeId} setRoute={goTo} openAnime={openAnime} />}
      {route === 'profile' && <ProfilePage openAnime={openAnime} setRoute={goTo} />}
      {route === 'auth' && <AuthPage setRoute={goTo} />}

      {showShell && <Footer />}

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} onPick={openAnime} />

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label={tr('tweakSectionColors')} />
        <TweakColor label={tr('tweakLabelPalette')}
          value={[t.accentColor, t.secondaryColor]}
          options={ACCENT_OPTIONS}
          onChange={(v) => setTweak({ accentColor: v[0], secondaryColor: v[1] })}
        />
        <TweakSection label={tr('tweakSectionGlass')} />
        <TweakSlider label={tr('tweakLabelBlur')} value={t.glassBlur} min={0} max={40} step={2} unit="px"
          onChange={(v) => setTweak('glassBlur', v)} />
        <TweakSection label={tr('tweakSectionDetails')} />
        <TweakToggle label={tr('tweakLabelJpText')} value={t.showJp} onChange={(v) => setTweak('showJp', v)} />
        <TweakToggle label={tr('tweakLabelScanlines')} value={t.scanlines} onChange={(v) => setTweak('scanlines', v)} />
        <TweakRadio label={tr('tweakLabelDensity')} value={t.density} options={['compact', 'regular', 'comfy']}
          onChange={(v) => setTweak('density', v)} />
        <TweakSection label={tr('tweakSectionPage')} />
        <TweakButton label={tr('tweakBtnResetCovers')} onClick={() => {
          localStorage.removeItem('animemix_covers_v1');
          location.reload();
        }} />
        <TweakSelect label={tr('tweakSelectNavigate')}
          value={route}
          options={[
            { value: 'home', label: tr('tweakOptHome') },
            { value: 'catalog', label: tr('tweakOptCatalog') },
            { value: 'details', label: tr('tweakOptDetails') },
            { value: 'player', label: tr('tweakOptPlayer') },
            { value: 'profile', label: tr('tweakOptProfile') },
            { value: 'auth', label: tr('tweakOptAuth') },
          ]}
          onChange={(v) => goTo(v)}
        />
      </TweaksPanel>
    </div>
  );
}

function routeLabel(r) {
  return ({
    home: 'Home', catalog: 'Catalog', details: 'Anime Details',
    player: 'Player', profile: 'Profile', auth: 'Login/Signup',
  })[r] || r;
}

ReactDOM.createRoot(document.getElementById('app')).render(<AppLoader />);
