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

function App() {
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
        <TweakSection label="Кольори" />
        <TweakColor label="Палітра"
          value={[t.accentColor, t.secondaryColor]}
          options={ACCENT_OPTIONS}
          onChange={(v) => setTweak({ accentColor: v[0], secondaryColor: v[1] })}
        />
        <TweakSection label="Скло" />
        <TweakSlider label="Розмиття" value={t.glassBlur} min={0} max={40} step={2} unit="px"
          onChange={(v) => setTweak('glassBlur', v)} />
        <TweakSection label="Деталі" />
        <TweakToggle label="JP-текст" value={t.showJp} onChange={(v) => setTweak('showJp', v)} />
        <TweakToggle label="Скан-лінії" value={t.scanlines} onChange={(v) => setTweak('scanlines', v)} />
        <TweakRadio label="Щільність" value={t.density} options={['compact', 'regular', 'comfy']}
          onChange={(v) => setTweak('density', v)} />
        <TweakSection label="Сторінка" />
        <TweakButton label="Скинути всі постери" onClick={() => {
          localStorage.removeItem('animemix_covers_v1');
          location.reload();
        }} />
        <TweakSelect label="Перейти на"
          value={route}
          options={[
            { value: 'home', label: 'Головна' },
            { value: 'catalog', label: 'Каталог' },
            { value: 'details', label: 'Тайтл' },
            { value: 'player', label: 'Плеєр' },
            { value: 'profile', label: 'Профіль' },
            { value: 'auth', label: 'Вхід' },
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

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
