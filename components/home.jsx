// ============================================================
// ANIMEMIX — Home page (hero grid + rails)
// ============================================================

// dismissible banner teaching the drag-drop poster feature
const DropHint = () => {
  const { t } = useLang();
  const [show, setShow] = useState(() => localStorage.getItem('animemix_drophint_dismissed') !== '1');
  const { mobile } = useBP();
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed', bottom: mobile ? 84 : 24, left: '50%', transform: 'translateX(-50%)',
      zIndex: 300, width: 'min(560px, calc(100vw - 24px))',
    }}>
      <div className="glass-strong" style={{
        display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderRadius: 16,
        background: 'rgba(20, 9, 42, 0.92)', borderColor: 'rgba(255,45,149,0.4)',
        boxShadow: '0 20px 50px -10px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,45,149,0.25)',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, var(--magenta), var(--violet))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
        }}>
          <Icon name="plus" size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="font-display" style={{ fontSize: 14, fontWeight: 600 }}>{t('dropHintTitle')}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-dim)', marginTop: 2 }}>
            {t('dropHintBody')}
          </div>
        </div>
        <button onClick={() => { localStorage.setItem('animemix_drophint_dismissed', '1'); setShow(false); }} style={{
          background: 'transparent', border: 'none', color: 'var(--ink-mute)', cursor: 'pointer',
          fontFamily: 'JetBrains Mono', fontSize: 16, padding: 4,
        }}>✕</button>
      </div>
    </div>
  );
};

const HomePage = ({ setRoute, openAnime }) => {
  const { t } = useLang();
  const featured = ANIME.find(a => a.id === 'solo-leveling');
  const hotGrid = [
    ANIME.find(a => a.id === 'frieren'),
    ANIME.find(a => a.id === 'dandadan'),
    ANIME.find(a => a.id === 'demon-slayer'),
    ANIME.find(a => a.id === 'apothecary'),
    ANIME.find(a => a.id === 'oshi'),
    ANIME.find(a => a.id === 'jjk'),
  ];
  const trending = ANIME.slice().sort((a, b) => b.rating - a.rating);
  const newReleases = ANIME.filter(a => a.badges && a.badges.includes('new'));
  const allTitles = ANIME;
  const { mobile, tablet, pad } = useBP();

  // parallax tilt for featured
  const heroRef = useRef(null);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--mx', x);
      el.style.setProperty('--my', y);
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="page-enter">
      <DropHint />
      {/* ========== HERO ========== */}
      <section ref={heroRef} style={{
        position: 'relative', padding: `${mobile ? 96 : 120}px ${pad}px ${mobile ? 40 : 60}px`,
        minHeight: mobile ? 'auto' : '100vh',
      }}>
        {/* big background art for featured */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: '-5%',
            background: `
              radial-gradient(ellipse at 20% 30%, ${featured.palette[1]}55 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, ${featured.palette[2]}33 0%, transparent 50%)
            `,
            transform: `translate(calc(var(--mx, 0) * -20px), calc(var(--my, 0) * -20px))`,
            transition: 'transform 0.3s',
          }} />
          {/* grid bg */}
          <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
        </div>

        <div style={{ maxWidth: 1480, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* tagline strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: mobile ? 28 : 40 }}>
            <div className="pulse-dot" />
            <span className="font-mono" style={{ fontSize: mobile ? 9 : 11, letterSpacing: '0.2em', color: 'var(--magenta)' }}>
              {mobile ? t('heroLiveOnlineMobile') : t('heroLiveOnline')}
            </span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, var(--magenta), transparent)' }} />
            {!mobile && <span className="font-mono" style={{ fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.2em' }}>
              {t('heroSeason')}
            </span>}
          </div>

          {/* hero headline */}
          <div style={{ display: 'grid', gridTemplateColumns: mobile || tablet ? '1fr' : '1fr 1fr', gap: mobile ? 36 : 60, alignItems: 'center', marginBottom: mobile ? 40 : 80 }}>
            <div>
              <div className="font-display" style={{ fontSize: 'clamp(58px, 13vw, 92px)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-0.04em' }}>
                <div style={{ color: 'white' }}>{t('heroHeadingLine1')}</div>
                <div className="glitch glitch-live" data-text={t('heroHeadingLine2')} style={{ display: 'inline-block', position: 'relative' }}>
                  <span className="gradient-text">{t('heroHeadingLine2')}</span>
                </div>
                <div style={{ color: 'white' }}>{t('heroHeadingLine3')}</div>
              </div>
              <div className="font-jp" style={{ fontSize: mobile ? 16 : 22, color: 'var(--violet-soft)', marginTop: 16, letterSpacing: '0.05em' }}>
                境界のないアニメ · {t('heroSubtitle')}
              </div>
              <p style={{ color: 'var(--ink-dim)', fontSize: mobile ? 15 : 17, lineHeight: 1.5, maxWidth: 480, marginTop: 24 }}>
                {t('heroDescription')}
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: mobile ? 28 : 36, flexWrap: 'wrap' }}>
                <button onClick={() => openAnime(featured.id)} className="btn btn-primary" style={{ padding: '14px 28px', fontSize: 14 }}>
                  <Icon name="play" size={16} /> {t('heroBtnWatch')}
                </button>
                <button onClick={() => setRoute('catalog')} className="btn btn-ghost" style={{ padding: '14px 28px', fontSize: 14 }}>
                  <Icon name="grid" size={16} /> {t('heroBtnCatalog')}
                </button>
              </div>

              {/* stats row */}
              <div style={{ display: 'flex', gap: mobile ? 0 : 40, justifyContent: mobile ? 'space-between' : 'flex-start', marginTop: mobile ? 36 : 60, paddingTop: 28, borderTop: '1px solid var(--line)' }}>
                {[
                  { v: '3,847', l: t('statTitles') },
                  { v: '64.2K', l: t('statEpisodes') },
                  { v: '128', l: t('statSimulcast') },
                  { v: '4K · HDR', l: t('statQuality') },
                ].map(s => (
                  <div key={s.l}>
                    <div className="font-display gradient-text" style={{ fontSize: mobile ? 22 : 28, fontWeight: 800 }}>{s.v}</div>
                    <div className="font-mono" style={{ fontSize: mobile ? 8 : 10, letterSpacing: '0.15em', color: 'var(--ink-mute)', marginTop: 4 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* hot grid — 6 covers in a designed grid */}
            <HotGrid items={hotGrid} onPick={openAnime} mobile={mobile} />
          </div>

          {/* ========== CONTINUE WATCHING STRIP ========== */}
          <ContinueStrip onPick={openAnime} setRoute={setRoute} mobile={mobile} />
        </div>
      </section>

      {/* ========== FEATURED CINEMATIC ========== */}
      <FeaturedCinematic anime={featured} onPlay={() => setRoute('player')} onOpen={() => openAnime(featured.id)} mobile={mobile} pad={pad} />

      {/* ========== TRENDING RAIL ========== */}
      <section style={{ padding: `${mobile ? 36 : 60}px ${pad}px`, position: 'relative' }}>
        <div style={{ maxWidth: 1480, margin: '0 auto' }}>
          <SectionHeader kicker={t('trendingKicker')} title={t('trendingTitle')} action={t('trendingActionAll')} onAction={() => setRoute('catalog')} />
          <Rail items={trending.slice(0, 8)} onPick={openAnime} />
        </div>
      </section>

      {/* ========== GENRE STRIP ========== */}
      <GenreStrip setRoute={setRoute} mobile={mobile} tablet={tablet} pad={pad} />

      {/* ========== NEW THIS SEASON ========== */}
      <section style={{ padding: `${mobile ? 36 : 60}px ${pad}px` }}>
        <div style={{ maxWidth: 1480, margin: '0 auto' }}>
          <SectionHeader kicker={t('newSeasonKicker')} title={t('newSeasonTitle')} action={t('newSeasonAction')} onAction={() => setRoute('catalog')} />
          <Rail items={newReleases.concat(ANIME.slice(0, 4))} onPick={openAnime} />
        </div>
      </section>

      {/* ========== EDITORS PICKS BIG TILES ========== */}
      <EditorsBlock anime={ANIME} onPick={openAnime} mobile={mobile} pad={pad} />

      {/* ========== ALL ========== */}
      <section style={{ padding: `${mobile ? 36 : 60}px ${pad}px` }}>
        <div style={{ maxWidth: 1480, margin: '0 auto' }}>
          <SectionHeader kicker={t('libraryKicker')} title={t('libraryTitle')} action={t('libraryAction')} onAction={() => setRoute('catalog')} />
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mobile ? 2 : tablet ? 4 : 6}, 1fr)`, gap: mobile ? 12 : 20 }}>
            {allTitles.slice(0, 12).map(a => (
              <Cover key={a.id} anime={a} size="md" fluid onClick={() => openAnime(a.id)} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// ---------- HOT GRID (6 hero covers arranged) ----------
const HotGrid = ({ items, onPick, mobile }) => {
  const { t } = useLang();
  return (
    <div style={{
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
      gridTemplateRows: mobile ? 'repeat(3, 150px)' : 'repeat(2, 220px)',
      gap: mobile ? 8 : 12,
      marginTop: mobile ? 24 : 0,
    }}>
      {/* corner labels */}
      <div style={{
        position: 'absolute', top: -20, left: 0,
        fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.2em',
        color: 'var(--magenta)',
      }}>{t('hotGridLabel')}</div>

      {items.map((a, i) => (
        <HotCoverTile key={a.id} anime={a} onClick={() => onPick(a.id)} idx={i} />
      ))}
    </div>
  );
};

const HotCoverTile = ({ anime, onClick, idx }) => {
  useLang();
  const [hov, setHov] = useState(false);
  const [c1, c2, c3] = anime.palette;
  const coverUrl = useCover(anime.id);
  const [over, dropHandlers, picker, openPicker] = useDropCover(anime.id);
  return (
    <div
      className="cover-droppable"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      {...dropHandlers}
      style={{
        position: 'relative', borderRadius: 16, overflow: 'hidden',
        cursor: 'pointer',
        background: `linear-gradient(135deg, ${c1}, ${c2}, ${c3})`,
        boxShadow: hov ? `0 30px 60px -20px ${anime.accent}88, 0 0 0 1px ${anime.accent}88` : '0 8px 20px -10px rgba(0,0,0,0.7)',
        transform: hov ? 'translateY(-4px) scale(1.03)' : 'none',
        transition: 'all 0.4s cubic-bezier(.2,.9,.3,1.2)',
      }}
    >
      {/* radial */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 60% 20%, ${c3}99 0%, transparent 60%)`,
      }} />
      <CoverArt id={anime.id} over={over} picker={picker} open={openPicker} zIndex={1} radius={16} />
      {/* halftone */}
      {!coverUrl && <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 1.5px)`,
        backgroundSize: '6px 6px', mixBlendMode: 'overlay',
      }} />}
      {/* huge kanji */}
      {!coverUrl && <div className="font-display" style={{
        position: 'absolute', right: -8, top: -16,
        fontSize: 160, fontWeight: 900,
        color: 'rgba(0,0,0,0.18)',
        lineHeight: 1, userSelect: 'none', letterSpacing: '-0.08em',
      }}>{anime.titleJp.slice(0, 1)}</div>}

      {/* scanlines */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 3px)',
        opacity: 0.7, pointerEvents: 'none',
      }} />

      {/* rank */}
      <div style={{
        position: 'absolute', top: 12, left: 12, zIndex: 5,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <div className="font-mono" style={{
          fontSize: 28, fontWeight: 700, color: 'white',
          lineHeight: 1, letterSpacing: '-0.05em',
          textShadow: `0 0 12px ${anime.accent}`,
        }}>#{String(idx + 1).padStart(2, '0')}</div>
      </div>

      {/* bottom */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 5,
        padding: 16,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
      }}>
        <div className="font-mono" style={{ fontSize: 9, color: anime.accent, letterSpacing: '0.15em', marginBottom: 4 }}>
          {anime.titleJp}
        </div>
        <div className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'white', lineHeight: 1.1 }}>
          {animeTitle(anime)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>
          <span style={{ color: 'var(--gold)' }}>★ {anime.rating}</span>
          <span>·</span>
          <span>{anime.ep} еп</span>
        </div>
      </div>

      {/* hover scanline sweep */}
      {hov && (
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 0,
          height: 60,
          background: `linear-gradient(to bottom, transparent, ${anime.accent}44, transparent)`,
          animation: 'scan-sweep 1.2s linear infinite',
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
};

// ---------- CONTINUE STRIP ----------
const ContinueStrip = ({ onPick, setRoute, mobile }) => {
  const { t } = useLang();
  return (
    <div className="glass" style={{
      padding: mobile ? 16 : 24, marginTop: 24,
      borderRadius: mobile ? 18 : 24,
      borderColor: 'rgba(255, 45, 149, 0.25)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'rgba(255,45,149,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,45,149,0.3)',
          }}>
            <Icon name="play" size={16} style={{ color: 'var(--magenta)' }} />
          </div>
          <div>
            <div className="font-mono" style={{ fontSize: 10, color: 'var(--magenta)', letterSpacing: '0.2em' }}>CONTINUE</div>
            <div className="font-display" style={{ fontSize: 18, fontWeight: 600 }}>{t('continueWatchingLabel')}</div>
          </div>
        </div>
        <button onClick={() => setRoute('profile')} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--violet-soft)', fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '0.1em',
        }}>{t('continueHistoryAll')}</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: mobile ? 12 : 16 }}>
        {CONTINUE.map(c => {
          const a = getAnime(c.id);
          return (
            <div key={c.id} onClick={() => setRoute('player')} style={{
              cursor: 'pointer', position: 'relative',
              borderRadius: 12, overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              transition: 'transform 0.2s',
            }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
               onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{
                position: 'relative', height: 130, borderRadius: 10, overflow: 'hidden',
                background: `linear-gradient(135deg, ${a.palette[0]}, ${a.palette[1]}, ${a.palette[2]})`,
              }}>
                <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 70% 30%, ${a.palette[2]}77, transparent 60%)` }} />
                <div className="font-display" style={{ position: 'absolute', right: -8, top: -12, fontSize: 100, fontWeight: 900, color: 'rgba(0,0,0,0.2)', lineHeight: 1, userSelect: 'none' }}>{a.titleJp.slice(0,1)}</div>
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent 50%)',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                    border: `1px solid ${a.accent}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name="play" size={16} style={{ color: 'white', marginLeft: 2 }} />
                  </div>
                </div>
                {/* progress bar */}
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: 'rgba(255,255,255,0.15)' }}>
                  <div style={{ height: '100%', width: `${c.progress * 100}%`, background: `linear-gradient(to right, ${a.accent}, var(--magenta))`, boxShadow: `0 0 8px ${a.accent}` }} />
                </div>
              </div>
              <div style={{ paddingTop: 10 }}>
                <div className="font-mono" style={{ fontSize: 9, color: a.accent, letterSpacing: '0.15em', marginBottom: 2 }}>
                  {t('continueEpProgress')} {c.episode}/{c.total} · {c.time}
                </div>
                <div className="font-display" style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>{animeTitle(a)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- FEATURED CINEMATIC ----------
const FeaturedCinematic = ({ anime, onPlay, onOpen, mobile, pad }) => {
  const { t } = useLang();
  return (
    <section style={{
      position: 'relative', margin: `40px ${pad || 32}px`, borderRadius: mobile ? 20 : 32, overflow: 'hidden',
      minHeight: mobile ? 420 : 540,
      border: '1px solid rgba(255,45,149,0.2)',
    }}>
      {/* big bg */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse at 80% 30%, ${anime.palette[1]}cc 0%, transparent 55%),
          radial-gradient(ellipse at 20% 70%, ${anime.palette[2]}88 0%, transparent 55%),
          linear-gradient(135deg, ${anime.palette[0]} 0%, ${anime.palette[1]} 100%)
        `,
      }} />
      {/* halftone */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 1.5px)`,
        backgroundSize: '12px 12px', mixBlendMode: 'overlay',
      }} />
      {/* scanlines */}
      <div className="scanlines" style={{ position: 'absolute', inset: 0 }} />

      {/* huge jp */}
      <div className="font-display" style={{
        position: 'absolute', right: -20, top: -30,
        fontSize: 480, fontWeight: 900,
        color: 'rgba(0,0,0,0.18)',
        lineHeight: 0.8, userSelect: 'none', letterSpacing: '-0.08em',
      }}>{anime.titleJp.slice(0, 1)}</div>

      {/* dark vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: mobile
          ? 'linear-gradient(to top, rgba(6,3,13,0.97) 0%, rgba(6,3,13,0.5) 55%, transparent 100%)'
          : 'linear-gradient(to right, rgba(6,3,13,0.95) 0%, rgba(6,3,13,0.6) 40%, transparent 70%)',
      }} />

      <div style={{ position: 'relative', padding: mobile ? 24 : 60, zIndex: 2, maxWidth: 680, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: mobile ? 420 : 540 }}>
        <div className="font-mono" style={{ fontSize: mobile ? 9 : 11, color: anime.accent, letterSpacing: '0.25em', marginBottom: 16 }}>
          {t('featuredPremiere')}
        </div>
        <div className="font-display" style={{ fontSize: 'clamp(36px, 8vw, 64px)', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 8 }}>
          {animeTitle(anime)}
        </div>
        <div className="font-jp" style={{ fontSize: mobile ? 16 : 22, color: anime.accent, letterSpacing: '0.05em', marginBottom: 20, opacity: 0.9 }}>
          {anime.titleJp}
        </div>
        <p style={{ fontSize: mobile ? 14 : 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', maxWidth: 520, marginBottom: 24 }}>
          {anime.synopsis}
        </p>
        <div style={{ display: 'flex', gap: mobile ? 8 : 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 24, fontSize: mobile ? 11 : 13, color: 'rgba(255,255,255,0.7)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--gold)' }}>★</span> {anime.rating}/10
          </span>
          <span>·</span>
          <span>{anime.year}</span>
          <span>·</span>
          <span>{anime.ep} епізодів</span>
          {!mobile && <span>·</span>}
          {!mobile && <span>{anime.studio}</span>}
          <span>·</span>
          <span className="chip chip-hot">{anime.age}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: mobile ? 0 : 32, flexWrap: 'wrap' }}>
          <button onClick={onPlay} className="btn btn-primary" style={{ padding: '14px 28px' }}>
            <Icon name="play" size={16} /> {t('featuredBtnWatch')}
          </button>
          <button onClick={onOpen} className="btn btn-ghost" style={{ padding: '14px 28px' }}>
            {t('featuredBtnDetails')}
          </button>
          <button className="btn btn-ghost" style={{ padding: 14 }}>
            <Icon name="plus" size={16} />
          </button>
        </div>

        {/* genre row */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {anime.genres.map(g => <span key={g} className="chip">{g}</span>)}
        </div>
      </div>

      {/* corner readout */}
      <div className="font-mono hide-mobile" style={{
        position: 'absolute', top: 24, right: 24, zIndex: 3,
        fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em',
        textAlign: 'right',
      }}>
        <div style={{ color: anime.accent }}>● FEATURED / 編集者の選択</div>
        <div style={{ marginTop: 4 }}>REC.ID: ANM-{anime.id.toUpperCase()}-S02</div>
        <div style={{ marginTop: 2 }}>RUNTIME: {anime.runtime} · 4K · HDR10+</div>
      </div>
    </section>
  );
};

// ---------- Rail ----------
const Rail = ({ items, onPick }) => {
  const ref = useRef(null);
  const scroll = (dir) => {
    if (ref.current) ref.current.scrollBy({ left: dir * 600, behavior: 'smooth' });
  };
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => scroll(-1)} className="glass rail-arrow" style={{
        position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 4,
        width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer',
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><Icon name="arrow-left" size={18} /></button>
      <button onClick={() => scroll(1)} className="glass rail-arrow" style={{
        position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 4,
        width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer',
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><Icon name="arrow-right" size={18} /></button>
      <div ref={ref} className="rail" style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, scrollSnapType: 'x proximity' }}>
        {items.map((a, i) => <div key={`${a.id}-${i}`} style={{ scrollSnapAlign: 'start', flexShrink: 0 }}><Cover anime={a} size="md" onClick={() => onPick(a.id)} /></div>)}
      </div>
    </div>
  );
};

// ---------- Genre strip ----------
const GenreStrip = ({ setRoute, mobile, tablet, pad }) => {
  const { t } = useLang();
  const featured = [
    { name: t('genreDarkFantasy'), jp: 'ダーク', color: '#b026ff', count: 287 },
    { name: t('genreRomance'), jp: 'ロマンス', color: '#ff2d95', count: 412 },
    { name: t('genreAction'), jp: 'アクション', color: '#ff007a', count: 891 },
    { name: t('genreIsekai'), jp: '異世界', color: '#6b4dff', count: 198 },
    { name: t('genrePsychology'), jp: '心理', color: '#00f0ff', count: 76 },
    { name: t('genreMecha'), jp: 'メカ', color: '#c4ff3d', count: 154 },
  ];
  return (
    <section style={{ padding: `${mobile ? 36 : 60}px ${pad || 32}px` }}>
      <div style={{ maxWidth: 1480, margin: '0 auto' }}>
        <SectionHeader kicker={t('genresKicker')} title={t('genresTitle')} action={t('genresActionAll')} onAction={() => setRoute('catalog')} />
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mobile ? 2 : tablet ? 3 : 6}, 1fr)`, gap: mobile ? 10 : 14 }}>
          {featured.map(g => (
            <div key={g.name} onClick={() => setRoute('catalog')} style={{
              position: 'relative', height: 140, borderRadius: 16, padding: 18,
              overflow: 'hidden', cursor: 'pointer',
              background: `linear-gradient(135deg, ${g.color}22, ${g.color}05)`,
              border: `1px solid ${g.color}33`,
              transition: 'all 0.3s',
            }} onMouseEnter={e => {
              e.currentTarget.style.borderColor = `${g.color}aa`;
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = `0 20px 40px -15px ${g.color}88`;
            }} onMouseLeave={e => {
              e.currentTarget.style.borderColor = `${g.color}33`;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div className="font-display" style={{
                position: 'absolute', right: -10, bottom: -30,
                fontSize: 90, fontWeight: 900, color: `${g.color}22`,
                lineHeight: 1, userSelect: 'none', letterSpacing: '-0.05em',
              }}>{g.jp.slice(0, 1)}</div>
              <div className="font-mono" style={{ fontSize: 10, color: g.color, letterSpacing: '0.2em' }}>
                {g.count} {t('genreTitleCount')}
              </div>
              <div className="font-display" style={{ fontSize: 22, fontWeight: 700, marginTop: 12, position: 'relative' }}>
                {g.name}
              </div>
              <div className="font-jp" style={{ fontSize: 12, color: g.color, marginTop: 4, opacity: 0.8 }}>
                {g.jp}
              </div>
              <div style={{ position: 'absolute', bottom: 14, right: 14, color: g.color, opacity: 0.6 }}>
                <Icon name="arrow-right" size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- Editors picks block (mosaic) ----------
const EditorsBlock = ({ anime, onPick, mobile, pad }) => {
  const { t } = useLang();
  const a1 = anime.find(a => a.id === 'vinland');
  const a2 = anime.find(a => a.id === 'aot');
  const a3 = anime.find(a => a.id === 'chainsaw');
  return (
    <section style={{ padding: `${mobile ? 36 : 60}px ${pad || 32}px` }}>
      <div style={{ maxWidth: 1480, margin: '0 auto' }}>
        <SectionHeader kicker={t('editorsPicksKicker')} title={t('editorsPicksTitle')} />
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '2fr 1fr 1fr', gridTemplateRows: mobile ? 'none' : '420px', gap: mobile ? 12 : 18 }}>
          <BigTile anime={a1} onClick={() => onPick(a1.id)} mobile={mobile} />
          <BigTile anime={a2} onClick={() => onPick(a2.id)} compact mobile={mobile} />
          <BigTile anime={a3} onClick={() => onPick(a3.id)} compact mobile={mobile} />
        </div>
      </div>
    </section>
  );
};

const BigTile = ({ anime, onClick, compact = false, mobile }) => {
  useLang();
  const [hov, setHov] = useState(false);
  const [c1, c2, c3] = anime.palette;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', borderRadius: mobile ? 18 : 24, overflow: 'hidden',
        cursor: 'pointer', minHeight: mobile ? 280 : undefined,
        background: `linear-gradient(135deg, ${c1}, ${c2}, ${c3})`,
        boxShadow: hov ? `0 40px 80px -20px ${anime.accent}88, 0 0 0 1px ${anime.accent}aa` : '0 20px 40px -20px rgba(0,0,0,0.8)',
        transform: hov ? 'translateY(-4px)' : 'none',
        transition: 'all 0.4s',
      }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 20%, ${c2}aa, transparent 60%)` }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 1.5px)`, backgroundSize: '10px 10px', mixBlendMode: 'overlay' }} />
      <div className="font-display" style={{ position: 'absolute', right: -20, top: -40, fontSize: compact ? 280 : 380, fontWeight: 900, color: 'rgba(0,0,0,0.18)', lineHeight: 0.85, userSelect: 'none', letterSpacing: '-0.08em' }}>{anime.titleJp.slice(0, 1)}</div>
      <div className="scanlines" style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)' }} />

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: compact ? 24 : 36, zIndex: 2 }}>
        <div className="font-mono" style={{ fontSize: 11, color: anime.accent, letterSpacing: '0.2em', marginBottom: 12 }}>
          ▶ {anime.titleJp} · {anime.year}
        </div>
        <div className="font-display" style={{ fontSize: compact ? 26 : 44, fontWeight: 800, lineHeight: 1, marginBottom: 12 }}>
          {animeTitle(anime)}
        </div>
        {!compact && <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', maxWidth: 420, lineHeight: 1.5, marginBottom: 18 }}>
          {anime.synopsis}
        </p>}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
          <span style={{ color: 'var(--gold)' }}>★ {anime.rating}</span>
          <span>·</span>
          <span>{anime.ep} еп</span>
          <span>·</span>
          <span>{anime.studio}</span>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { HomePage });
