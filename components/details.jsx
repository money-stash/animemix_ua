const STATUS_LABELS = {
  watching:  { uk: 'Дивлюсь',     en: 'Watching'       },
  completed: { uk: 'Завершено',   en: 'Completed'      },
  plan:      { uk: 'Заплановано', en: 'Plan to watch'  },
  on_hold:   { uk: 'На паузі',    en: 'On hold'        },
  dropped:   { uk: 'Кинув',       en: 'Dropped'        },
};

const DetailsPage = ({ animeId, openAnime, setRoute }) => {
  const { t } = useLang();
  const a = getAnime(animeId || 'solo-leveling');
  const [tab, setTab] = useState('episodes');
  const [season, setSeason] = useState(2);
  const [listEntry, setListEntry] = useState(null);
  const [listLoading, setListLoading] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const coverUrl = useCover(a.id);
  const [posterOver, posterDrop, posterPicker, posterOpen] = useDropCover(a.id);
  const { mobile, tablet, pad } = useBP();

  useEffect(() => {
    if (!AuthClient.isLoggedIn()) return;
    LibraryClient.getEntry(a.id).then(entry => setListEntry(entry?.status ? entry : null)).catch(() => {});
  }, [a.id]);

  const handleListToggle = async () => {
    if (!AuthClient.isLoggedIn()) { setRoute('auth'); return; }
    if (listEntry) {
      setShowStatusMenu(v => !v);
    } else {
      setListLoading(true);
      try {
        const entry = await LibraryClient.upsert(a.id, { status: 'plan' });
        setListEntry(entry);
      } finally { setListLoading(false); }
    }
  };

  const handleStatusChange = async (status) => {
    setShowStatusMenu(false);
    if (status === 'remove') {
      await LibraryClient.remove(a.id);
      setListEntry(null);
    } else {
      setListLoading(true);
      try {
        const entry = await LibraryClient.patch(a.id, { status });
        setListEntry(entry);
      } finally { setListLoading(false); }
    }
  };

  const statusLabel = listEntry
    ? (STATUS_LABELS[listEntry.status]?.[window.__lang] || listEntry.status)
    : null;

  const episodes = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      n: i + 1,
      title: [t('ep1Title'), t('ep2Title'), t('ep3Title'), t('ep4Title'), t('ep5Title'), t('ep6Title'), t('ep7Title'), t('ep8Title'), t('ep9Title'), t('ep10Title')][i % 10],
      duration: '23:50',
      watched: i < 14,
      current: i === 13,
      thumbColor: a.palette[i % 3],
    }));
  }, [a]);

  const related = ANIME.filter(x => x.id !== a.id).slice(0, 5);

  return (
    <div className="page-enter">
      {}
      <section style={{ position: 'relative', minHeight: mobile ? 'auto' : 720, overflow: 'hidden' }}>
        {}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse at 80% 20%, ${a.palette[1]}cc 0%, transparent 55%),
            radial-gradient(ellipse at 20% 80%, ${a.palette[2]}aa 0%, transparent 55%),
            linear-gradient(135deg, ${a.palette[0]} 0%, ${a.palette[1]} 100%)
          `,
        }} />
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 1.5px)`, backgroundSize: '12px 12px', mixBlendMode: 'overlay' }} />
        <div className="scanlines" style={{ position: 'absolute', inset: 0 }} />
        <div className="font-display" style={{ position: 'absolute', left: '55%', top: -60, fontSize: 600, fontWeight: 900, color: 'rgba(0,0,0,0.2)', lineHeight: 0.8, userSelect: 'none', letterSpacing: '-0.08em' }}>{a.titleJp.slice(0, 1)}</div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,3,13,0.5) 0%, rgba(6,3,13,0.3) 30%, var(--bg-0) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(6,3,13,0.9) 0%, transparent 60%)' }} />

        <div style={{ position: 'relative', maxWidth: 1480, margin: '0 auto', padding: `${mobile ? 100 : 140}px ${pad}px ${mobile ? 40 : 60}px`, zIndex: 2 }}>
          <button onClick={() => setRoute('home')} style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: mobile ? 20 : 32,
            background: 'transparent', border: 'none', color: 'var(--ink-dim)', cursor: 'pointer',
            fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '0.15em',
          }}>
            <Icon name="arrow-left" size={14} /> {t('detailsBackBtn')}
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '320px 1fr', gap: mobile ? 28 : 48, alignItems: 'flex-start' }}>
            {}
            <div style={mobile ? { maxWidth: 220, margin: '0 auto', width: '100%' } : undefined}>
              <div className="cover-droppable" {...posterDrop} style={{
                position: 'relative', borderRadius: 16, overflow: 'hidden',
                aspectRatio: '2/3',
                background: `linear-gradient(135deg, ${a.palette[0]}, ${a.palette[1]}, ${a.palette[2]})`,
                boxShadow: `0 40px 80px -20px ${a.accent}88, 0 0 0 1px ${a.accent}aa`,
              }}>
                <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 20%, ${a.palette[2]}cc, transparent 60%)` }} />
                <CoverArt id={a.id} over={posterOver} picker={posterPicker} open={posterOpen} zIndex={1} radius={16} />
                {!coverUrl && <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 1.5px)`, backgroundSize: '8px 8px', mixBlendMode: 'overlay' }} />}
                {!coverUrl && <div className="font-display" style={{ position: 'absolute', right: -16, top: -32, fontSize: 380, fontWeight: 900, color: 'rgba(0,0,0,0.25)', lineHeight: 0.8 }}>{a.titleJp.slice(0, 1)}</div>}
                <div className="scanlines" style={{ position: 'absolute', inset: 0, zIndex: 2 }} />
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 3, padding: 20, background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
                  <div className="font-mono" style={{ fontSize: 10, color: a.accent, letterSpacing: '0.15em', marginBottom: 6 }}>{a.titleJp}</div>
                  <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>{animeTitle(a)}</div>
                </div>
                {}
                <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 4, width: 16, height: 16, borderLeft: `2px solid ${a.accent}`, borderTop: `2px solid ${a.accent}` }} />
                <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 4, width: 16, height: 16, borderRight: `2px solid ${a.accent}`, borderTop: `2px solid ${a.accent}` }} />
                <div style={{ position: 'absolute', bottom: 8, left: 8, zIndex: 4, width: 16, height: 16, borderLeft: `2px solid ${a.accent}`, borderBottom: `2px solid ${a.accent}` }} />
                <div style={{ position: 'absolute', bottom: 8, right: 8, zIndex: 4, width: 16, height: 16, borderRight: `2px solid ${a.accent}`, borderBottom: `2px solid ${a.accent}` }} />
              </div>

              {}
              <div className="glass" style={{ marginTop: 16, padding: 18, borderRadius: 16 }}>
                <div className="font-mono" style={{ fontSize: 10, color: 'var(--magenta)', letterSpacing: '0.2em', marginBottom: 12 }}>METADATA</div>
                <Meta k={t('metaStudio')} v={a.studio} />
                <Meta k={t('metaYear')} v={a.year} />
                <Meta k={t('metaSeason')} v={animeSeason(a)} />
                <Meta k={t('metaEpisodes')} v={`${a.ep} × ${a.runtime}`} />
                <Meta k={t('metaStatus')} v={a.status === 'airing' ? t('metaStatusAiring') : t('metaStatusCompleted')} accent={a.status === 'airing' ? 'var(--lime)' : 'var(--ink-mute)'} />
                <Meta k={t('metaAge')} v={a.age} />
                <Meta k={t('metaSource')} v={t('metaSourceValue')} />
              </div>
            </div>

            {}
            <div>
              <div className="font-mono" style={{ fontSize: 11, color: a.accent, letterSpacing: '0.25em', marginBottom: 10 }}>
                ▶ {a.titleEn.toUpperCase()} · S0{season} · {a.year}
              </div>
              <h1 className="font-display" style={{ fontSize: 'clamp(40px, 9vw, 80px)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: 10 }}>
                <span className="glitch glitch-live" data-text={animeTitle(a)}>{animeTitle(a)}</span>
              </h1>
              <div className="font-jp" style={{ fontSize: mobile ? 18 : 26, color: a.accent, opacity: 0.9, marginBottom: 24 }}>
                {a.titleJp}
              </div>

              {}
              <div style={{ display: 'flex', gap: mobile ? 20 : 32, flexWrap: 'wrap', marginBottom: 28, fontSize: 13 }}>
                <Stat label={t('statLabelRating')} value={a.rating} sub="MAL 9.4" big color="var(--gold)" star />
                <Stat label={t('statLabelRank')} value="#12" sub={t('statSubWeek')} big />
                <Stat label={t('statLabelEpisodes')} value={a.ep} sub={a.status === 'airing' ? `${Math.floor(a.ep * 0.6)} ${t('episodesAiredSub')}` : t('episodesAllSub')} big />
                <Stat label={t('statLabelViewers')} value="284K" sub={t('statSubViewersGrowth')} big />
              </div>

              <p style={{ fontSize: mobile ? 15 : 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', maxWidth: 720, marginBottom: 24 }}>
                {animeSynopsis(a)}
              </p>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                {animeGenres(a).map(g => <span key={g} className="chip" style={{ background: `${a.accent}15`, borderColor: `${a.accent}55`, color: a.accent, fontSize: 11, padding: '5px 12px' }}>{g}</span>)}
              </div>

              <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
                <button onClick={() => setRoute('player')} className="btn btn-primary" style={{ padding: '16px 32px', fontSize: 14, flex: mobile ? '1 1 100%' : undefined, justifyContent: 'center' }}>
                  <Icon name="play" size={18} /> {t('btnContinueWatching')}
                </button>
                {}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={handleListToggle}
                    disabled={listLoading}
                    className="btn btn-ghost"
                    style={{
                      padding: '16px 24px', opacity: listLoading ? 0.7 : 1,
                      borderColor: listEntry ? 'rgba(0,240,255,0.5)' : undefined,
                      color: listEntry ? 'var(--cyan)' : undefined,
                    }}
                  >
                    <Icon name={listEntry ? 'check' : 'plus'} size={16} />
                    {listEntry ? statusLabel : t('btnAddToList')}
                    {listEntry && <Icon name="chevron-down" size={12} />}
                  </button>

                  {showStatusMenu && (
                    <div className="glass-strong" style={{
                      position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 200,
                      borderRadius: 12, overflow: 'hidden', minWidth: 180,
                      boxShadow: '0 16px 40px -8px rgba(0,0,0,0.6)',
                    }}>
                      {Object.entries(STATUS_LABELS).map(([key, labels]) => (
                        <button key={key} onClick={() => handleStatusChange(key)} style={{
                          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                          padding: '10px 16px', background: listEntry?.status === key ? 'rgba(0,240,255,0.08)' : 'transparent',
                          border: 'none', cursor: 'pointer', color: listEntry?.status === key ? 'var(--cyan)' : 'var(--ink-dim)',
                          fontFamily: 'Manrope', fontSize: 13, textAlign: 'left',
                          transition: 'background 0.15s',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                          onMouseLeave={e => e.currentTarget.style.background = listEntry?.status === key ? 'rgba(0,240,255,0.08)' : 'transparent'}
                        >
                          {listEntry?.status === key && <Icon name="check" size={13} />}
                          {labels[window.__lang] || labels.uk}
                        </button>
                      ))}
                      <div style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />
                      <button onClick={() => handleStatusChange('remove')} style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                        padding: '10px 16px', background: 'transparent',
                        border: 'none', cursor: 'pointer', color: 'rgba(255,80,80,0.8)',
                        fontFamily: 'Manrope', fontSize: 13, textAlign: 'left',
                      }}>
                        <Icon name="logout" size={13} />
                        {window.__lang === 'en' ? 'Remove from list' : 'Видалити зі списку'}
                      </button>
                    </div>
                  )}
                </div>
                <button className="btn btn-ghost" style={{ padding: 16 }}>
                  <Icon name="heart" size={16} />
                </button>
                <button className="btn btn-ghost" style={{ padding: 16 }}>
                  <Icon name="bell" size={16} />
                </button>
              </div>

              {}
              <div className="glass" style={{ padding: 18, borderRadius: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div className="font-mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.2em' }}>{t('progressLabel')}</div>
                  <div className="font-mono neon-text-magenta" style={{ fontSize: 13 }}>{t('progressValue')}</div>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '56%', height: '100%', background: 'linear-gradient(to right, var(--magenta), var(--violet))', boxShadow: '0 0 12px rgba(255,45,149,0.6)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section style={{ maxWidth: 1480, margin: '0 auto', padding: `0 ${pad}px 60px` }}>
        {}
        <div className="rail" style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--line)', marginBottom: 32, overflowX: 'auto' }}>
          {[
            { v: 'episodes', l: t('tabEpisodes'), n: a.ep },
            { v: 'cast', l: t('tabCast'), n: 12 },
            { v: 'reviews', l: t('tabReviews'), n: 1247 },
            { v: 'related', l: t('tabRelated'), n: 18 },
            { v: 'comments', l: t('tabComments'), n: 3402 },
          ].map(t => (
            <button key={t.v} onClick={() => setTab(t.v)} style={{
              padding: '16px 20px', whiteSpace: 'nowrap', flexShrink: 0,
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: tab === t.v ? 'white' : 'var(--ink-mute)',
              fontFamily: 'Unbounded', fontSize: 14, fontWeight: tab === t.v ? 600 : 400,
              borderBottom: tab === t.v ? '2px solid var(--magenta)' : '2px solid transparent',
              marginBottom: -1,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {t.l}
              <span className="font-mono" style={{ fontSize: 10, color: tab === t.v ? 'var(--magenta)' : 'var(--ink-mute)' }}>{t.n}</span>
            </button>
          ))}
        </div>

        {tab === 'episodes' && (
          <div>
            {}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span className="font-mono" style={{ fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.15em' }}>{t('seasonLabel')}</span>
              {[1, 2].map(s => (
                <button key={s} onClick={() => setSeason(s)} style={{
                  padding: '8px 18px', borderRadius: 100,
                  background: season === s ? 'linear-gradient(135deg, var(--magenta), var(--violet))' : 'rgba(255,255,255,0.04)',
                  border: season === s ? 'none' : '1px solid var(--line-strong)',
                  color: 'white', fontFamily: 'Unbounded', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer',
                }}>S0{s}</button>
              ))}
              <div style={{ flex: 1 }} />
              <div className="font-mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>{t('episodesMetaInfo')}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(2, 1fr)', gap: 14 }}>
              {episodes.map(ep => <EpisodeCard key={ep.n} ep={ep} anime={a} onClick={() => setRoute('player')} />)}
            </div>
          </div>
        )}

        {tab === 'cast' && <CastTab anime={a} mobile={mobile} />}
        {tab === 'reviews' && <ReviewsTab anime={a} mobile={mobile} />}
        {tab === 'related' && (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mobile ? 2 : tablet ? 3 : 5}, 1fr)`, gap: mobile ? 12 : 18 }}>
            {related.map(r => <Cover key={r.id} anime={r} size="md" fluid onClick={() => openAnime(r.id)} />)}
          </div>
        )}
        {tab === 'comments' && <CommentsTab anime={a} />}
      </section>
    </div>
  );
};

const Meta = ({ k, v, accent }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
    <span className="font-mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.15em' }}>{k}</span>
    <span style={{ fontSize: 12, color: accent || 'white' }}>{v}</span>
  </div>
);

const Stat = ({ label, value, sub, big, color, star }) => (
  <div>
    <div className="font-mono" style={{ fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.2em', marginBottom: 6 }}>{label}</div>
    <div className="font-display" style={{
      fontSize: big ? 30 : 18, fontWeight: 800,
      color: color || 'white', lineHeight: 1,
      display: 'flex', alignItems: 'baseline', gap: 6,
    }}>
      {star && <span style={{ fontSize: 24 }}>★</span>}
      {value}
    </div>
    {sub && <div className="font-mono" style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 4, letterSpacing: '0.1em' }}>{sub}</div>}
  </div>
);

const EpisodeCard = ({ ep, anime, onClick }) => {
  const { t } = useLang();
  return (
    <div onClick={onClick} className="glass" style={{
      display: 'flex', gap: 14, padding: 14, borderRadius: 14, cursor: 'pointer',
      borderColor: ep.current ? 'rgba(255, 45, 149, 0.4)' : 'var(--glass-border)',
      background: ep.current ? 'rgba(255, 45, 149, 0.06)' : 'var(--glass-bg)',
    }}>
      {}
      <div style={{
        position: 'relative', width: 160, height: 90, flexShrink: 0, borderRadius: 8, overflow: 'hidden',
        background: `linear-gradient(135deg, ${anime.palette[(ep.n - 1) % 3]}, ${anime.palette[(ep.n) % 3]})`,
      }}>
        <div className="scanlines" style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)', border: `1px solid ${anime.accent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="play" size={14} style={{ color: 'white' }} />
          </div>
        </div>
        <div className="font-mono" style={{ position: 'absolute', top: 4, left: 6, fontSize: 22, fontWeight: 700, color: 'white', textShadow: '0 0 8px rgba(0,0,0,0.8)', lineHeight: 1 }}>{String(ep.n).padStart(2, '0')}</div>
        <div className="font-mono" style={{ position: 'absolute', bottom: 4, right: 6, fontSize: 10, color: 'white', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 4 }}>{ep.duration}</div>
        {ep.current && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: 'rgba(255,255,255,0.2)' }}>
            <div style={{ width: '62%', height: '100%', background: 'var(--magenta)', boxShadow: '0 0 8px var(--magenta)' }} />
          </div>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="font-mono" style={{ fontSize: 10, color: anime.accent, letterSpacing: '0.15em' }}>
            {t('epLabel')} {String(ep.n).padStart(2, '0')}
          </span>
          {ep.watched && !ep.current && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, color: 'var(--ink-mute)', fontFamily: 'JetBrains Mono', letterSpacing: '0.1em' }}>
            <Icon name="eye" size={10} /> {t('epWatched')}
          </span>}
          {ep.current && <span className="chip chip-hot" style={{ fontSize: 9, padding: '2px 6px' }}>{t('epCurrent')}</span>}
        </div>
        <div className="font-display" style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{ep.title}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-mute)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {t('epDescriptionSample')}
        </div>
      </div>
    </div>
  );
};

const CastTab = ({ anime, mobile }) => {
  const { t } = useLang();
  const cast = [
    { name: 'Сон Чжін-У', va: 'Тосіхіко Сейкі', role: t('castRoleMain'), color: anime.palette[2] },
    { name: 'Ча Хе-Ін', va: 'Рейна Уеда', role: t('castRoleMainF'), color: '#ff66aa' },
    { name: 'Цоїн Іксен', va: 'Бандай Хаято', role: t('castRoleAntagonist'), color: '#7928ca' },
    { name: 'Сун Ман-Чан', va: 'Хіроюкі Йосіно', role: t('castRoleSupport'), color: '#00d4aa' },
    { name: 'Лі Чу-Хо', va: 'Хі Сато', role: t('castRoleSupport'), color: '#ffce4a' },
    { name: 'Хван Дон-Сук', va: 'Кодзі Юса', role: t('castRoleSupport'), color: '#ff3344' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mobile ? 1 : 3}, 1fr)`, gap: 16 }}>
      {cast.map(c => (
        <div key={c.name} className="glass" style={{ padding: 16, borderRadius: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 12, flexShrink: 0,
            background: `linear-gradient(135deg, ${c.color}, ${anime.palette[1]})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontFamily: 'Unbounded', fontWeight: 800, fontSize: 22,
            position: 'relative', overflow: 'hidden',
          }}>
            <div className="scanlines" style={{ position: 'absolute', inset: 0 }} />
            <span style={{ position: 'relative' }}>{c.name.slice(0, 1)}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="font-mono" style={{ fontSize: 9, color: c.color, letterSpacing: '0.15em', marginBottom: 2 }}>
              {c.role.toUpperCase()}
            </div>
            <div className="font-display" style={{ fontSize: 15, fontWeight: 600 }}>{c.name}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 2 }}>{t('castVoicePrefix')} {c.va}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ReviewsTab = ({ anime, mobile }) => {
  const { t } = useLang();
  const reviews = [
    { u: 'kira_ua', av: '#ff2d95', score: 10, time: '2 год тому', upvotes: 247,
      text: t('reviewSeason') },
    { u: 'akira_otaku', av: '#00f0ff', score: 9, time: '5 год тому', upvotes: 198,
      text: 'Озвучення — пушка. Український дубляж нічим не поступається оригіналу, голос Сон-у підібрали ідеально. Чекаю кожну середу як на свято.' },
    { u: 'shadow.king', av: '#b026ff', score: 8, time: '1 день тому', upvotes: 124,
      text: 'Сюжетно слабше за манхву, але візуально — божественно. Деякі сцени затягнуті, можна було б динамічніше. Все одно must watch.' },
  ];
  return (
    <div>
      {}
      <div className="glass" style={{ padding: mobile ? 20 : 28, borderRadius: 20, marginBottom: 28, display: 'grid', gridTemplateColumns: mobile ? '1fr' : '200px 1fr', gap: mobile ? 24 : 40, alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="font-display gradient-text" style={{ fontSize: 80, fontWeight: 900, lineHeight: 1 }}>{anime.rating}</div>
          <div className="font-mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.2em', marginTop: 4 }}>{t('reviewsRatingsCount')}</div>
          <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 8, color: 'var(--gold)' }}>
            {[1, 2, 3, 4, 5].map(s => <span key={s}>★</span>)}
          </div>
        </div>
        <div>
          {[[10, 68], [9, 22], [8, 7], [7, 2], [6, 1]].map(([n, pct]) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <span className="font-mono" style={{ fontSize: 11, color: 'var(--ink-dim)', width: 24 }}>{n}★</span>
              <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(to right, var(--magenta), var(--violet))' }} />
              </div>
              <span className="font-mono" style={{ fontSize: 11, color: 'var(--ink-mute)', width: 40, textAlign: 'right' }}>{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {reviews.map(r => (
        <div key={r.u} className="glass" style={{ padding: 24, borderRadius: 16, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${r.av}, var(--violet))`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{r.u.slice(0, 1).toUpperCase()}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 14 }}>{r.u}</div>
              <div className="font-mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.1em' }}>{r.time}</div>
            </div>
            <div style={{
              padding: '6px 14px', borderRadius: 100,
              background: 'linear-gradient(135deg, rgba(255,45,149,0.15), rgba(176,38,255,0.15))',
              border: '1px solid rgba(255, 45, 149, 0.3)',
              fontFamily: 'Unbounded', fontSize: 13, fontWeight: 700,
              color: 'var(--magenta)',
            }}>★ {r.score}/10</div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)' }}>{r.text}</p>
          <div style={{ display: 'flex', gap: 16, marginTop: 14, color: 'var(--ink-mute)', fontSize: 12, fontFamily: 'JetBrains Mono', letterSpacing: '0.1em' }}>
            <span>↑ {r.upvotes}</span>
            <span>↓</span>
            <span>{t('reviewReply')}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const CommentsTab = ({ anime }) => {
  const { t } = useLang();
  const comments = [
    { u: 'midnight.shogun', av: '#ff2d95', time: '4 хв', text: 'еп 14 — ПЕРШЕ що я подивлюсь сьогодні. хто з мене зрозумів?' },
    { u: 'lain.exe', av: '#00f0ff', time: '12 хв', text: 'OST на 14 епізоді — chef\'s kiss. Хімено Macia вкотре витягує всю серію.' },
    { u: 'pixel.kun', av: '#c4ff3d', time: '32 хв', text: 'Хтось знайшов сабвулфер? З 8:42 щось крутецьке гуркоче за кадром, у плеєрі не чути' },
    { u: 'ruri.no.yume', av: '#b026ff', time: '1 год', text: 'манхва > аніме все одно. але цей сезон ок 7/10' },
    { u: 'cyber_neko', av: '#ff8a4c', time: '2 год', text: 'український дубляж тут просто шик, особисто я тепер тільки в дубляжі дивлюсь' },
  ];
  return (
    <div>
      <div className="glass" style={{ padding: 18, borderRadius: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--magenta), var(--violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>Я</div>
        <input placeholder={t('commentInputPlaceholder')} style={{
          flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line-strong)',
          borderRadius: 100, padding: '12px 18px', color: 'white', outline: 'none', fontFamily: 'Manrope', fontSize: 13,
        }} />
        <button className="btn btn-primary" style={{ padding: '10px 20px' }}>{t('commentSubmitBtn')}</button>
      </div>
      {comments.map(c => (
        <div key={c.u} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${c.av}, var(--violet))`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13 }}>{c.u.slice(0, 1).toUpperCase()}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13 }}>{c.u}</span>
              <span className="font-mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>· {c.time} тому</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.5, color: 'rgba(255,255,255,0.85)', margin: 0 }}>{c.text}</p>
            <div style={{ display: 'flex', gap: 14, marginTop: 8, color: 'var(--ink-mute)', fontSize: 11, fontFamily: 'JetBrains Mono', letterSpacing: '0.1em' }}>
              <span>↑ 42</span>
              <span>{t('reviewReply')}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

Object.assign(window, { DetailsPage });
