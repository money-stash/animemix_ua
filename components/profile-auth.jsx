// ============================================================
// ANIMEMIX — Profile + Auth pages
// ============================================================

// =================================================================
// PROFILE
// =================================================================
const ProfilePage = ({ openAnime, setRoute }) => {
  const { t } = useLang();
  const [tab, setTab] = useState('library');
  const { mobile, tablet, pad } = useBP();

  const lists = {
    watching: ANIME.filter(a => CONTINUE.find(c => c.id === a.id)),
    completed: [ANIME[7], ANIME[10], ANIME[4]],
    plan: [ANIME[1], ANIME[5], ANIME[6], ANIME[8]],
    favorites: [ANIME[0], ANIME[2], ANIME[7]],
    dropped: [ANIME[11]],
  };

  return (
    <div className="page-enter" style={{ paddingTop: mobile ? 84 : 110 }}>
      <div style={{ maxWidth: 1480, margin: '0 auto', padding: `0 ${pad}px` }}>
        {/* HEADER BANNER */}
        <div style={{
          position: 'relative', borderRadius: 24, overflow: 'hidden', marginBottom: mobile ? 24 : 40,
          padding: mobile ? 24 : 36,
          background: 'linear-gradient(135deg, rgba(255, 45, 149, 0.15) 0%, rgba(176, 38, 255, 0.15) 100%)',
          border: '1px solid rgba(167, 139, 250, 0.25)',
        }}>
          {/* bg pattern */}
          <div style={{
            position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 1.5px)`, backgroundSize: '16px 16px',
          }} />
          <div className="font-display" style={{
            position: 'absolute', right: -20, top: -50,
            fontSize: 360, fontWeight: 900, color: 'rgba(255, 45, 149, 0.06)',
            lineHeight: 0.85, userSelect: 'none', letterSpacing: '-0.08em',
          }}>俺</div>

          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'auto 1fr auto', gap: mobile ? 20 : 32, alignItems: mobile ? 'flex-start' : 'center', textAlign: mobile ? 'center' : 'left', justifyItems: mobile ? 'center' : 'stretch' }}>
            <div style={{
              width: 128, height: 128, borderRadius: 28,
              background: 'linear-gradient(135deg, #ff2d95, #b026ff, #6b4dff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontFamily: 'Unbounded', fontWeight: 800, fontSize: 56,
              boxShadow: '0 30px 60px -10px rgba(255, 45, 149, 0.5)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div className="scanlines" style={{ position: 'absolute', inset: 0 }} />
              <span style={{ position: 'relative' }}>Я</span>
            </div>
            <div>
              <div className="font-mono" style={{ fontSize: 11, color: 'var(--magenta)', letterSpacing: '0.25em', marginBottom: 8 }}>
                {t('profileUserMeta')}
              </div>
              <h1 className="font-display" style={{ fontSize: 'clamp(38px, 9vw, 56px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
                <span className="gradient-text">yana_kira</span>
              </h1>
              <div className="font-jp" style={{ fontSize: 16, color: 'var(--violet-soft)', marginTop: 6 }}>
                やな・キラ · {t('profileJoinDate')} · 国: 🇺🇦
              </div>
              <p style={{ color: 'var(--ink-dim)', fontSize: 13, marginTop: 12, maxWidth: 480 }}>
                {t('profileUserBio')}
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap', justifyContent: mobile ? 'center' : 'flex-start' }}>
                <span className="chip chip-hot">{t('profileStatTop')}</span>
                <span className="chip chip-new">{t('profileStatTitles')}</span>
                <span className="chip chip-dub">{t('profileStatHours')}</span>
                <span className="chip">{t('profileStatReviews')}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn-ghost" style={{ padding: '10px 18px', fontSize: 11 }}>
                <Icon name="settings" size={14} /> {t('profileBtnSettings')}
              </button>
              <button className="btn btn-ghost" style={{ padding: '10px 18px', fontSize: 11 }}>
                {t('profileBtnShare')}
              </button>
              <button onClick={() => setRoute('auth')} style={{
                background: 'transparent', border: 'none', color: 'var(--ink-mute)', cursor: 'pointer',
                fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.15em', padding: '8px 0',
              }}>
                <Icon name="logout" size={11} /> {t('profileBtnLogout')}
              </button>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: mobile ? 10 : 16, marginBottom: mobile ? 28 : 40 }}>
          <BigStatCard label={t('statCardWatched')} value="247" sub={t('statCardWatchedSub')} jp="完了" color="var(--magenta)" />
          <BigStatCard label={t('statCardTime')} value="4,128" sub={t('statCardTimeSub')} jp="時間" color="var(--violet-soft)" />
          <BigStatCard label={t('statCardAvg')} value="8.4" sub={t('statCardAvgSub')} jp="評価" color="var(--cyan)" />
          <BigStatCard label={t('statCardStreak')} value="42" sub={t('statCardStreakSub')} jp="連続" color="var(--lime)" />
        </div>

        {/* TWO COL: lists + activity */}
        <div style={{ display: 'grid', gridTemplateColumns: mobile || tablet ? '1fr' : '1fr 360px', gap: 32, alignItems: 'flex-start' }}>
          <div>
            {/* TAB NAV */}
            <div className="rail" style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--line)', marginBottom: 24, flexWrap: mobile ? 'nowrap' : 'wrap', overflowX: mobile ? 'auto' : 'visible' }}>
              {[
                { v: 'library', l: t('profileTabLibrary'), n: 247 },
                { v: 'watching', l: t('profileTabWatching'), n: lists.watching.length },
                { v: 'completed', l: t('profileTabCompleted'), n: lists.completed.length },
                { v: 'plan', l: t('profileTabPlan'), n: lists.plan.length },
                { v: 'favorites', l: t('profileTabFavorites'), n: lists.favorites.length },
                { v: 'stats', l: t('profileTabStats') },
                { v: 'achievements', l: t('profileTabAchievements') },
              ].map(tabItem => (
                <button key={tabItem.v} onClick={() => setTab(tabItem.v)} style={{
                  padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                  color: tab === tabItem.v ? 'white' : 'var(--ink-mute)',
                  fontFamily: 'Unbounded', fontSize: 13, fontWeight: tab === tabItem.v ? 600 : 400,
                  borderBottom: tab === tabItem.v ? '2px solid var(--magenta)' : '2px solid transparent',
                  marginBottom: -1, display: 'flex', alignItems: 'center', gap: 8,
                }}>{tabItem.l} {tabItem.n != null && <span className="font-mono" style={{ fontSize: 10, color: tab === tabItem.v ? 'var(--magenta)' : 'var(--ink-mute)' }}>{tabItem.n}</span>}</button>
              ))}
            </div>

            {tab === 'library' && (
              <div>
                {[
                  [t('libraryGroupWatching'), lists.watching],
                  [t('libraryGroupCompleted'), lists.completed],
                  [t('libraryGroupPlan'), lists.plan],
                  [t('libraryGroupFavorites'), lists.favorites],
                ].map(([title, items]) => (
                  <div key={title} style={{ marginBottom: 36 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <h3 className="font-display" style={{ fontSize: 20, fontWeight: 600 }}>{title}</h3>
                      <span className="chip" style={{ fontSize: 10 }}>{items.length}</span>
                      <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mobile ? 2 : tablet ? 3 : 4}, 1fr)`, gap: mobile ? 12 : 16 }}>
                      {items.map(a => <Cover key={a.id} anime={a} size="md" fluid onClick={() => openAnime(a.id)} />)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(tab === 'watching' || tab === 'completed' || tab === 'plan' || tab === 'favorites') && (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mobile ? 2 : tablet ? 3 : 4}, 1fr)`, gap: mobile ? 12 : 16 }}>
                {lists[tab].map(a => <Cover key={a.id} anime={a} size="md" fluid onClick={() => openAnime(a.id)} />)}
              </div>
            )}

            {tab === 'stats' && <StatsTab mobile={mobile} />}
            {tab === 'achievements' && <AchievementsTab mobile={mobile} />}
          </div>

          {/* RIGHT: activity feed */}
          <aside>
            <div className="glass" style={{ padding: 20, borderRadius: 16, marginBottom: 16 }}>
              <div className="font-mono" style={{ fontSize: 10, color: 'var(--magenta)', letterSpacing: '0.2em', marginBottom: 14 }}>{t('activitySectionLabel')}</div>
              {[
                { t: t('activityWatchedEp'), a: ANIME[1], ago: '2 год тому', icon: 'play' },
                { t: t('activityRated'), a: ANIME[0], ago: '5 год тому', icon: 'star' },
                { t: t('activityReviewed'), a: ANIME[2], ago: '1 день тому', icon: 'list' },
                { t: t('activityAddedToList'), a: ANIME[5], ago: '2 дні тому', icon: 'plus' },
                { t: t('activityCompleted'), a: ANIME[7], ago: '3 дні тому', icon: 'check' },
              ].map((act, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: `${act.a.accent}20`, border: `1px solid ${act.a.accent}50`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: act.a.accent,
                  }}>
                    <Icon name={act.icon} size={14} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: 'var(--ink-dim)' }}>{act.t}</div>
                    <div className="font-display" style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{animeTitle(act.a)}</div>
                    <div className="font-mono" style={{ fontSize: 9, color: 'var(--ink-mute)', marginTop: 2, letterSpacing: '0.1em' }}>{act.ago}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass" style={{ padding: 20, borderRadius: 16 }}>
              <div className="font-mono" style={{ fontSize: 10, color: 'var(--magenta)', letterSpacing: '0.2em', marginBottom: 14 }}>{t('friendsWatchingLabel')}</div>
              {[
                { u: 'kuro.tanaka', a: 'Магічна битва', av: '#ff2d95' },
                { u: 'rei.0', a: 'Данданан', av: '#00f0ff' },
                { u: 'akira_otaku', a: 'Фрірен', av: '#c4ff3d' },
              ].map(f => (
                <div key={f.u} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${f.av}, var(--violet))`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 11 }}>{f.u.slice(0, 1).toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontFamily: 'Manrope', fontWeight: 500 }}>{f.u}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{f.a}</div>
                  </div>
                  <div className="pulse-dot" style={{ width: 6, height: 6 }} />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const BigStatCard = ({ label, value, sub, jp, color }) => (
  <div className="glass" style={{ padding: 24, borderRadius: 18, position: 'relative', overflow: 'hidden' }}>
    <div className="font-display" style={{
      position: 'absolute', right: -10, bottom: -20, fontSize: 100, fontWeight: 900,
      color: `${color}15`, lineHeight: 0.85, userSelect: 'none',
    }}>{jp.slice(0, 1)}</div>
    <div className="font-mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.2em', marginBottom: 10 }}>{label}</div>
    <div className="font-display" style={{ fontSize: 48, fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.03em', position: 'relative' }}>{value}</div>
    <div style={{ fontSize: 12, color: 'var(--ink-dim)', marginTop: 6, position: 'relative' }}>{sub}</div>
  </div>
);

const StatsTab = ({ mobile }) => {
  const { t } = useLang();
  // weekly chart
  const days = ['П', 'В', 'С', 'Ч', 'П', 'С', 'Н'];
  const heights = [40, 65, 30, 80, 92, 100, 70];
  const genres = [
    { name: t('statsGenreAction'), pct: 32, color: '#ff2d95' },
    { name: t('statsGenreDrama'), pct: 24, color: '#b026ff' },
    { name: t('statsGenreFantasy'), pct: 18, color: '#6b4dff' },
    { name: t('statsGenreRomance'), pct: 12, color: '#ff66aa' },
    { name: t('statsGenreComedy'), pct: 8, color: '#c4ff3d' },
    { name: t('statsGenreOther'), pct: 6, color: 'var(--ink-mute)' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 20 }}>
      <div className="glass" style={{ padding: 24, borderRadius: 18 }}>
        <div className="font-mono" style={{ fontSize: 10, color: 'var(--magenta)', letterSpacing: '0.2em', marginBottom: 18 }}>{t('statsWeekLabel')}</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 180, padding: '0 8px' }}>
          {days.map((d, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--ink-mute)' }}>{Math.round(heights[i] / 100 * 4)}г</div>
              <div style={{
                width: 28, height: `${heights[i] * 1.4}px`,
                background: i === 5 ? 'linear-gradient(to top, var(--magenta), var(--violet))' : 'linear-gradient(to top, rgba(255, 45, 149, 0.4), rgba(176, 38, 255, 0.4))',
                borderRadius: 4, position: 'relative',
                boxShadow: i === 5 ? '0 0 16px var(--magenta)' : 'none',
              }} />
              <div style={{ fontFamily: 'Unbounded', fontSize: 11, color: i === 5 ? 'var(--magenta)' : 'var(--ink-dim)' }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="glass" style={{ padding: 24, borderRadius: 18 }}>
        <div className="font-mono" style={{ fontSize: 10, color: 'var(--magenta)', letterSpacing: '0.2em', marginBottom: 18 }}>{t('statsGenresLabel')}</div>
        {genres.map(g => (
          <div key={g.name} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
              <span style={{ color: 'var(--ink-dim)' }}>{g.name}</span>
              <span className="font-mono" style={{ color: g.color }}>{g.pct}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${g.pct * 3}%`, background: g.color, boxShadow: `0 0 8px ${g.color}` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="glass" style={{ padding: 24, borderRadius: 18, gridColumn: mobile ? 'auto' : 'span 2' }}>
        <div className="font-mono" style={{ fontSize: 10, color: 'var(--magenta)', letterSpacing: '0.2em', marginBottom: 18 }}>{t('statsYearLabel')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(53, 1fr)', gap: 3 }}>
          {Array.from({ length: 53 * 7 }, (_, i) => {
            const v = Math.random();
            const bg = v < 0.3 ? 'rgba(255,255,255,0.03)' :
              v < 0.55 ? 'rgba(255, 45, 149, 0.25)' :
              v < 0.8 ? 'rgba(255, 45, 149, 0.55)' :
              'rgba(255, 45, 149, 0.95)';
            return <div key={i} style={{ aspectRatio: '1', background: bg, borderRadius: 2 }} />;
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 10, fontFamily: 'JetBrains Mono', color: 'var(--ink-mute)' }}>
          <span>{t('statsMonthJan')}</span><span>{t('statsMonthMar')}</span><span>{t('statsMonthMay')}</span><span>{t('statsMonthJul')}</span><span>{t('statsMonthSep')}</span><span>{t('statsMonthNov')}</span>
        </div>
      </div>
    </div>
  );
};

const AchievementsTab = ({ mobile }) => {
  const { t } = useLang();
  const ach = [
    { t: t('achTitle1'), d: t('achDesc1'), got: true, c: '#c4ff3d', jp: '一' },
    { t: t('achTitle2'), d: t('achDesc2'), got: true, c: '#ff2d95', jp: '走' },
    { t: t('achTitle3'), d: t('achDesc3'), got: true, c: '#b026ff', jp: '百' },
    { t: t('achTitle4'), d: t('achDesc4'), got: true, c: '#00f0ff', jp: '評' },
    { t: t('achTitle5'), d: t('achDesc5'), got: false, c: '#ffce4a', jp: '味' },
    { t: t('achTitle6'), d: t('achDesc6'), got: false, c: '#ff007a', jp: '千' },
    { t: t('achTitle7'), d: t('achDesc7'), got: true, c: '#6b4dff', jp: '夜' },
    { t: t('achTitle8'), d: t('achDesc8'), got: false, c: '#ff8a4c', jp: '即' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mobile ? 2 : 4}, 1fr)`, gap: mobile ? 12 : 16 }}>
      {ach.map((a, i) => (
        <div key={i} className="glass" style={{
          padding: 20, borderRadius: 16, position: 'relative', overflow: 'hidden',
          opacity: a.got ? 1 : 0.4,
          borderColor: a.got ? `${a.c}55` : 'var(--glass-border)',
        }}>
          <div className="font-display" style={{ position: 'absolute', right: -8, top: -20, fontSize: 100, fontWeight: 900, color: `${a.c}15`, lineHeight: 0.85 }}>{a.jp}</div>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: a.got ? `linear-gradient(135deg, ${a.c}, var(--violet))` : 'rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontFamily: 'Unbounded', fontWeight: 800, fontSize: 20,
            position: 'relative', boxShadow: a.got ? `0 0 24px ${a.c}66` : 'none',
          }}>{a.jp}</div>
          <div className="font-display" style={{ fontSize: 16, fontWeight: 700, marginTop: 14, position: 'relative' }}>{a.t}</div>
          <div style={{ fontSize: 11, color: 'var(--ink-dim)', marginTop: 4, position: 'relative' }}>{a.d}</div>
          {a.got && <div className="font-mono" style={{ fontSize: 9, color: a.c, letterSpacing: '0.15em', marginTop: 10, position: 'relative' }}>{t('achObtained')}</div>}
        </div>
      ))}
    </div>
  );
};

// =================================================================
// AUTH (login + register toggle)
// =================================================================
const AuthPage = ({ setRoute }) => {
  const { t } = useLang();
  const [mode, setMode] = useState('login'); // login | signup
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const { mobile, tablet, pad } = useBP();

  return (
    <div className="page-enter" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: `${mobile ? 88 : 120}px ${pad}px 60px`,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: mobile || tablet ? '1fr' : '1fr 1fr', maxWidth: 1100, width: '100%', gap: mobile ? 28 : 60, alignItems: 'center' }}>
        {/* LEFT: art panel */}
        <div className="glass" style={{
          position: 'relative', overflow: 'hidden', borderRadius: mobile ? 20 : 32, padding: mobile ? 28 : 48,
          minHeight: mobile ? 280 : 600,
          background: 'linear-gradient(135deg, rgba(255, 45, 149, 0.12), rgba(176, 38, 255, 0.18))',
          borderColor: 'rgba(255, 45, 149, 0.3)',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 70% 30%, rgba(176, 38, 255, 0.4), transparent 60%)` }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 1.5px)`, backgroundSize: '14px 14px' }} />
          <div className="scanlines" style={{ position: 'absolute', inset: 0 }} />
          <div className="font-display" style={{
            position: 'absolute', right: -30, bottom: -50, fontSize: 380, fontWeight: 900,
            color: 'rgba(255,255,255,0.04)', lineHeight: 0.85, userSelect: 'none',
          }}>ア</div>

          <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Icon name="logo-mark" size={mobile ? 44 : 56} />
            <div className="font-mono" style={{ fontSize: mobile ? 9 : 11, color: 'var(--magenta)', letterSpacing: '0.25em', marginTop: mobile ? 24 : 40, marginBottom: 14 }}>
              ▶ ANIMEMIX.UA · 2026 · {t('authArtTagline')}
            </div>
            <div className="font-display" style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.03em' }}>
              {t('authArtHeading')}
            </div>
            <div className="font-jp" style={{ fontSize: mobile ? 15 : 18, color: 'var(--violet-soft)', marginTop: 16 }}>
              全てのアニメ · 一つの場所
            </div>
            <p className="hide-mobile" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6, marginTop: 24, maxWidth: 380 }}>
              {t('authArtDesc')}
            </p>

            <div style={{ flex: 1 }} />

            <div className="hide-mobile" style={{ display: 'flex', gap: 16, marginTop: 40, paddingTop: 28, borderTop: '1px solid var(--line)' }}>
              {[
                { v: '184K', l: t('authStatUsers') },
                { v: '4K · HDR', l: t('authStatQuality') },
                { v: '24/7', l: t('authStatSimulcast') },
              ].map(s => (
                <div key={s.l} style={{ flex: 1 }}>
                  <div className="font-display gradient-text" style={{ fontSize: 22, fontWeight: 800 }}>{s.v}</div>
                  <div className="font-mono" style={{ fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.15em', marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: form */}
        <div>
          <div className="font-mono" style={{ fontSize: 11, color: 'var(--magenta)', letterSpacing: '0.3em', marginBottom: 12 }}>
            // {mode === 'login' ? t('authModeLogin') : t('authModeSignup')}
          </div>
          <h1 className="font-display" style={{ fontSize: 'clamp(36px, 8vw, 56px)', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.02em' }}>
            {mode === 'login' ? <>{t('authHeadingLogin')}</> : <>{t('authHeadingSignup')}</>}
          </h1>
          <p style={{ color: 'var(--ink-dim)', fontSize: 14, marginTop: 12 }}>
            {mode === 'login' ? t('authSubLogin') : t('authSubSignup')}
          </p>

          {/* OAuth buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 28 }}>
            <button className="btn btn-ghost" style={{ padding: '14px 18px', fontSize: 12, justifyContent: 'center' }}>
              <Icon name="discord" size={16} /> DISCORD
            </button>
            <button className="btn btn-ghost" style={{ padding: '14px 18px', fontSize: 12, justifyContent: 'center' }}>
              <Icon name="tg" size={16} /> TELEGRAM
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            <span className="font-mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.2em' }}>{t('authDividerOr')}</span>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'signup' && (
              <Field label={t('authFieldNick')}>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="otaku_kira" style={inputCss} />
              </Field>
            )}
            <Field label={t('authFieldEmail')}>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@anime.ua" style={inputCss} />
            </Field>
            <Field label={t('authFieldPassword')}>
              <input value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="•••••••••" style={inputCss} />
              {mode === 'signup' && pass && <PasswordMeter pass={pass} />}
            </Field>
            {mode === 'login' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-dim)', cursor: 'pointer' }}>
                  <span style={{ width: 16, height: 16, borderRadius: 4, background: 'linear-gradient(135deg, var(--magenta), var(--violet))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="check" size={10} style={{ color: 'white' }} />
                  </span>
                  {t('authRememberMe')}
                </label>
                <a style={{ color: 'var(--violet-soft)', cursor: 'pointer' }}>{t('authForgotPassword')}</a>
              </div>
            )}
          </div>

          <button onClick={() => setRoute('home')} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px 28px', fontSize: 13, marginTop: 24 }}>
            {mode === 'login' ? t('authBtnLogin') : t('authBtnSignup')} <Icon name="arrow-right" size={16} />
          </button>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--ink-dim)' }}>
            {mode === 'login'
              ? <>{t('authSwitchToSignup')} <a onClick={() => setMode('signup')} style={{ color: 'var(--magenta)', cursor: 'pointer', fontWeight: 600 }}>{t('authSwitchToSignupLink')}</a></>
              : <>{t('authSwitchToLogin')} <a onClick={() => setMode('login')} style={{ color: 'var(--magenta)', cursor: 'pointer', fontWeight: 600 }}>{t('authSwitchToLoginLink')}</a></>}
          </div>

          <div className="font-mono" style={{ fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.15em', marginTop: 28, textAlign: 'center' }}>
            {t('authTermsNotice')}
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <div className="font-mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.2em', marginBottom: 8 }}>{label}</div>
    {children}
  </div>
);

const inputCss = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line-strong)',
  borderRadius: 12, padding: '14px 18px', color: 'white', outline: 'none',
  fontFamily: 'Manrope', fontSize: 14, transition: 'border-color 0.2s',
};

const PasswordMeter = ({ pass }) => {
  const strength = Math.min(4, Math.floor(pass.length / 3));
  const colors = ['#ff3344', '#ff8a4c', '#ffce4a', '#c4ff3d', '#00d4aa'];
  return (
    <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? colors[strength] : 'rgba(255,255,255,0.06)' }} />
      ))}
    </div>
  );
};

Object.assign(window, { ProfilePage, AuthPage });
