// ============================================================
// ANIMEMIX — Catalog page
// ============================================================

const CatalogPage = ({ openAnime }) => {
  const [activeGenres, setActiveGenres] = useState(['Екшн']);
  const [sort, setSort] = useState('hot');
  const [year, setYear] = useState('all');
  const [status, setStatus] = useState('all');
  const [view, setView] = useState('grid'); // grid | list
  const { mobile, tablet, pad } = useBP();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggleGenre = (g) => {
    setActiveGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const filtered = useMemo(() => {
    let r = [...ANIME, ...ANIME, ...ANIME]; // dupe to fill grid
    if (activeGenres.length) {
      r = r.filter(a => activeGenres.some(g => a.genres.includes(g)));
    }
    if (year !== 'all') r = r.filter(a => a.year === year);
    if (status !== 'all') r = r.filter(a => a.status === status);
    if (sort === 'hot') r = r.sort((a, b) => (b.badges?.length || 0) - (a.badges?.length || 0));
    if (sort === 'rating') r = r.sort((a, b) => b.rating - a.rating);
    if (sort === 'year') r = r.sort((a, b) => b.year - a.year);
    return r;
  }, [activeGenres, sort, year, status]);

  return (
    <div className="page-enter" style={{ paddingTop: mobile ? 84 : 110 }}>
      <div style={{ maxWidth: 1480, margin: '0 auto', padding: `0 ${pad}px` }}>
        {/* header */}
        <div style={{ marginBottom: mobile ? 24 : 40 }}>
          <div className="font-mono" style={{ fontSize: mobile ? 9 : 11, color: 'var(--magenta)', letterSpacing: '0.25em', marginBottom: 12 }}>
            // КАТАЛОГ // 3,847 ТАЙТЛІВ
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <h1 className="font-display" style={{ fontSize: 'clamp(44px, 11vw, 72px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95 }}>
              Все <span className="gradient-text">аніме.</span>
            </h1>
            <div className="font-jp hide-mobile" style={{ fontSize: 18, color: 'var(--violet-soft)', textAlign: 'right' }}>
              アーカイブ<br />
              <span className="font-mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>LAST UPDATE 23.05.2026 09:14</span>
            </div>
          </div>
        </div>

        {/* mobile filter trigger */}
        {mobile && (
          <button onClick={() => setFiltersOpen(true)} className="glass btn" style={{
            width: '100%', justifyContent: 'center', padding: '14px', borderRadius: 12, marginBottom: 16,
            color: 'var(--magenta)', borderColor: 'rgba(255,45,149,0.4)',
          }}>
            <Icon name="filter" size={16} /> Фільтри {activeGenres.length > 0 && `· ${activeGenres.length}`}
          </button>
        )}

        {/* layout */}
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : tablet ? '230px 1fr' : '280px 1fr', gap: mobile ? 0 : 32, alignItems: 'flex-start' }}>
          {/* sidebar filters — drawer on mobile */}
          {mobile && filtersOpen && (
            <div onClick={() => setFiltersOpen(false)} style={{
              position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(6,3,13,0.7)', backdropFilter: 'blur(6px)',
            }} />
          )}
          <aside className="glass" style={mobile ? {
            position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 401,
            width: 'min(340px, 86vw)', padding: 24, borderRadius: 0,
            overflowY: 'auto', transform: filtersOpen ? 'translateX(0)' : 'translateX(-105%)',
            transition: 'transform 0.3s cubic-bezier(.2,.9,.3,1)',
          } : { padding: 24, borderRadius: 20, position: 'sticky', top: 100 }}>
            <div className="font-mono" style={{ fontSize: 10, color: 'var(--magenta)', letterSpacing: '0.2em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="filter" size={12} /> ФІЛЬТРИ
              <span style={{ flex: 1 }} />
              {mobile
                ? <button onClick={() => setFiltersOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--ink-dim)', cursor: 'pointer', fontSize: 16 }}>✕</button>
                : <button style={{ background: 'transparent', border: 'none', color: 'var(--ink-mute)', cursor: 'pointer', fontSize: 10 }}>ОЧИСТИТИ</button>}
            </div>

            <FilterGroup label="ЖАНРИ">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {GENRES.slice(0, 14).map(g => (
                  <button key={g} onClick={() => toggleGenre(g)} className="chip" style={{
                    cursor: 'pointer', fontFamily: 'Manrope', fontSize: 11, textTransform: 'none', letterSpacing: '0',
                    padding: '6px 12px',
                    background: activeGenres.includes(g) ? 'rgba(255, 45, 149, 0.15)' : 'rgba(255,255,255,0.04)',
                    borderColor: activeGenres.includes(g) ? 'rgba(255, 45, 149, 0.5)' : 'var(--glass-border)',
                    color: activeGenres.includes(g) ? 'var(--magenta)' : 'var(--ink-dim)',
                  }}>{g}</button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label="СТАТУС">
              <RadioRow value={status} onChange={setStatus} options={[
                { v: 'all', l: 'Всі' },
                { v: 'airing', l: 'Виходить' },
                { v: 'completed', l: 'Завершено' },
              ]} />
            </FilterGroup>

            <FilterGroup label="РІК">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['all', ...YEARS].map(y => (
                  <button key={y} onClick={() => setYear(y)} style={{
                    padding: '5px 10px', borderRadius: 6,
                    background: year === y ? 'rgba(255, 45, 149, 0.15)' : 'transparent',
                    border: year === y ? '1px solid rgba(255, 45, 149, 0.5)' : '1px solid var(--line)',
                    color: year === y ? 'var(--magenta)' : 'var(--ink-dim)',
                    fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer',
                  }}>{y === 'all' ? 'УСІ' : y}</button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label="ТРИВАЛІСТЬ">
              <div style={{ padding: '8px 0' }}>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '15%', right: '40%', height: '100%', background: 'linear-gradient(to right, var(--magenta), var(--violet))', borderRadius: 2 }} />
                  <div style={{ position: 'absolute', left: '15%', top: -5, width: 14, height: 14, borderRadius: '50%', background: 'white', border: '2px solid var(--magenta)' }} />
                  <div style={{ position: 'absolute', left: '60%', top: -5, width: 14, height: 14, borderRadius: '50%', background: 'white', border: '2px solid var(--magenta)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--ink-mute)' }}>
                  <span>12 ЕП</span><span>52+ ЕП</span>
                </div>
              </div>
            </FilterGroup>

            <FilterGroup label="ОЗВУЧЕННЯ">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['Український дубляж', 'Українські саби', 'Багатоголосе', 'Оригінал + саби'].map((l, i) => (
                  <label key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--ink-dim)', cursor: 'pointer' }}>
                    <span style={{
                      width: 16, height: 16, borderRadius: 4,
                      border: '1px solid var(--line-strong)',
                      background: i < 2 ? 'linear-gradient(135deg, var(--magenta), var(--violet))' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {i < 2 && <Icon name="check" size={10} style={{ color: 'white' }} />}
                    </span>
                    {l}
                  </label>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label="ВІК">
              <div style={{ display: 'flex', gap: 6 }}>
                {['0+', '12+', '16+', '18+'].map(a => (
                  <button key={a} style={{
                    flex: 1, padding: '6px 0', borderRadius: 8,
                    background: a === '16+' ? 'rgba(255, 45, 149, 0.15)' : 'transparent',
                    border: a === '16+' ? '1px solid rgba(255, 45, 149, 0.5)' : '1px solid var(--line)',
                    color: a === '16+' ? 'var(--magenta)' : 'var(--ink-dim)',
                    fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer',
                  }}>{a}</button>
                ))}
              </div>
            </FilterGroup>
          </aside>

          {/* main */}
          <div>
            {/* toolbar */}
            <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: mobile ? 8 : 16, padding: mobile ? '10px 14px' : '12px 20px', borderRadius: 14, marginBottom: 20, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--ink-dim)' }}>
                ЗНАЙДЕНО <span className="neon-text-magenta">{filtered.length}</span>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 4 : 8, overflowX: 'auto' }} className="rail">
                {!mobile && <span style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'JetBrains Mono', letterSpacing: '0.1em' }}>СОРТУВАННЯ:</span>}
                {[
                  { v: 'hot', l: 'Гарячі' },
                  { v: 'rating', l: 'Рейтинг' },
                  { v: 'year', l: 'Рік' },
                  { v: 'name', l: 'Назва' },
                ].map(o => (
                  <button key={o.v} onClick={() => setSort(o.v)} style={{
                    padding: '6px 12px', borderRadius: 100, fontSize: 12, whiteSpace: 'nowrap',
                    background: sort === o.v ? 'rgba(255, 45, 149, 0.15)' : 'transparent',
                    border: sort === o.v ? '1px solid rgba(255, 45, 149, 0.5)' : '1px solid transparent',
                    color: sort === o.v ? 'var(--magenta)' : 'var(--ink-dim)',
                    cursor: 'pointer', fontFamily: 'Manrope',
                  }}>{o.l}</button>
                ))}
              </div>
              <div className="hide-mobile" style={{ width: 1, height: 20, background: 'var(--line)' }} />
              <div className="hide-mobile" style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => setView('grid')} style={{
                  width: 32, height: 32, borderRadius: 6,
                  background: view === 'grid' ? 'rgba(255, 45, 149, 0.15)' : 'transparent',
                  border: 'none', color: view === 'grid' ? 'var(--magenta)' : 'var(--ink-mute)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><Icon name="grid" size={14} /></button>
                <button onClick={() => setView('list')} style={{
                  width: 32, height: 32, borderRadius: 6,
                  background: view === 'list' ? 'rgba(255, 45, 149, 0.15)' : 'transparent',
                  border: 'none', color: view === 'list' ? 'var(--magenta)' : 'var(--ink-mute)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><Icon name="list" size={14} /></button>
              </div>
            </div>

            {/* active genre pills */}
            {activeGenres.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                {activeGenres.map(g => (
                  <span key={g} className="chip" style={{
                    background: 'rgba(255, 45, 149, 0.12)',
                    borderColor: 'rgba(255, 45, 149, 0.4)',
                    color: 'var(--magenta)', cursor: 'pointer',
                    fontFamily: 'Manrope', textTransform: 'none', letterSpacing: 0,
                    fontSize: 11, padding: '5px 10px',
                  }} onClick={() => toggleGenre(g)}>
                    {g} ✕
                  </span>
                ))}
              </div>
            )}

            {/* grid */}
            {view === 'grid' || mobile ? (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mobile ? 2 : tablet ? 3 : 5}, 1fr)`, gap: mobile ? 12 : 18 }}>
                {filtered.slice(0, 30).map((a, i) => (
                  <Cover key={a.id + i} anime={a} size="md" fluid onClick={() => openAnime(a.id)} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.slice(0, 12).map((a, i) => <ListRow key={a.id + i} anime={a} onClick={() => openAnime(a.id)} idx={i + 1} />)}
              </div>
            )}

            {/* pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 60 }}>
              {['1', '2', '3', '...', '127', 'NEXT'].map((p, i) => (
                <button key={i} style={{
                  minWidth: 40, height: 40, borderRadius: 8,
                  background: p === '1' ? 'linear-gradient(135deg, var(--magenta), var(--violet))' : 'rgba(255,255,255,0.04)',
                  border: p === '1' ? 'none' : '1px solid var(--line-strong)',
                  color: p === '1' ? 'white' : 'var(--ink-dim)',
                  fontFamily: 'JetBrains Mono', fontSize: 12, cursor: 'pointer',
                  padding: p === 'NEXT' ? '0 14px' : 0,
                }}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterGroup = ({ label, children }) => (
  <div style={{ marginBottom: 22, paddingBottom: 18, borderBottom: '1px solid var(--line)' }}>
    <div className="font-mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.2em', marginBottom: 10 }}>{label}</div>
    {children}
  </div>
);

const RadioRow = ({ value, onChange, options }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {options.map(o => (
      <label key={o.v} onClick={() => onChange(o.v)} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: value === o.v ? 'var(--magenta)' : 'var(--ink-dim)', cursor: 'pointer' }}>
        <span style={{
          width: 14, height: 14, borderRadius: '50%',
          border: `2px solid ${value === o.v ? 'var(--magenta)' : 'var(--line-strong)'}`,
          position: 'relative',
        }}>
          {value === o.v && <span style={{ position: 'absolute', inset: 2, borderRadius: '50%', background: 'var(--magenta)' }} />}
        </span>
        {o.l}
      </label>
    ))}
  </div>
);

const ListRow = ({ anime, onClick, idx }) => (
  <div onClick={onClick} className="glass" style={{
    display: 'flex', alignItems: 'center', gap: 18, padding: 14, borderRadius: 14, cursor: 'pointer',
    transition: 'border-color 0.2s',
  }} onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255, 45, 149, 0.5)'}
     onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
    <div className="font-mono" style={{ fontSize: 14, color: 'var(--ink-mute)', width: 32, textAlign: 'center' }}>
      {String(idx).padStart(2, '0')}
    </div>
    <div style={{
      width: 60, height: 80, borderRadius: 8, flexShrink: 0,
      background: `linear-gradient(135deg, ${anime.palette[0]}, ${anime.palette[1]}, ${anime.palette[2]})`,
      position: 'relative', overflow: 'hidden',
    }}>
      <div className="font-display" style={{ position: 'absolute', right: -6, top: -8, fontSize: 70, fontWeight: 900, color: 'rgba(0,0,0,0.2)', lineHeight: 1 }}>{anime.titleJp.slice(0, 1)}</div>
    </div>
    <div style={{ flex: 1 }}>
      <div className="font-display" style={{ fontSize: 17, fontWeight: 600 }}>{anime.title}</div>
      <div className="font-mono" style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 4, letterSpacing: '0.1em' }}>
        {anime.titleJp} · {anime.titleEn}
      </div>
    </div>
    <div style={{ display: 'flex', gap: 6 }}>
      {anime.genres.slice(0, 3).map(g => <span key={g} className="chip" style={{ fontSize: 10 }}>{g}</span>)}
    </div>
    <div style={{ textAlign: 'right', minWidth: 80 }}>
      <div className="font-mono neon-text-magenta" style={{ fontSize: 14 }}>★ {anime.rating}</div>
      <div className="font-mono" style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 4 }}>{anime.year} · {anime.ep} еп</div>
    </div>
    <div style={{ color: 'var(--violet-soft)' }}>
      <Icon name="chevron-right" size={18} />
    </div>
  </div>
);

Object.assign(window, { CatalogPage });
