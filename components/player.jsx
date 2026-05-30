// ============================================================
// ANIMEMIX — Player page (video player with chrome)
// ============================================================

const PlayerPage = ({ animeId, setRoute, openAnime }) => {
  const a = getAnime(animeId || 'solo-leveling');
  const { mobile, tablet, pad } = useBP();
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0.42);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('4K');
  const [muted, setMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const time = useMemo(() => {
    const total = 24 * 60;
    const cur = Math.floor(total * progress);
    const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
    return { cur: fmt(cur), total: fmt(total) };
  }, [progress]);

  // simulate playback
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setProgress(p => Math.min(1, p + 0.0008)), 100);
    return () => clearInterval(t);
  }, [playing]);

  const episodeList = useMemo(() => Array.from({ length: 25 }, (_, i) => ({
    n: i + 1,
    title: ['Пробудження', 'Іспит', 'Червоне підземелля', 'Пастка', 'Подвійне підземелля', 'Виклик', 'Ще не пізно', 'Шанс', 'Розкол', 'Тіньовий монарх'][i % 10],
    current: i === 13,
    watched: i < 13,
  })), []);

  return (
    <div className="page-enter" style={{ paddingTop: mobile ? 76 : 90, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1480, margin: '0 auto', padding: `0 ${pad}px` }}>
        {/* back */}
        <button onClick={() => openAnime(a.id)} style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
          background: 'transparent', border: 'none', color: 'var(--ink-dim)', cursor: 'pointer',
          fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '0.15em',
        }}>
          <Icon name="arrow-left" size={14} /> ПОВЕРНУТИСЬ ДО {a.title.toUpperCase()}
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: mobile || tablet ? '1fr' : '1fr 360px', gap: 24, alignItems: 'flex-start' }}>
          {/* === PLAYER === */}
          <div>
            <div
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(true)}
              style={{
                position: 'relative', aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden',
                background: `linear-gradient(135deg, ${a.palette[0]}, ${a.palette[1]})`,
                boxShadow: `0 30px 80px -20px ${a.accent}66, 0 0 0 1px ${a.accent}44`,
              }}>
              {/* "video" content - simulated scene */}
              <div style={{ position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse at 30% 40%, ${a.palette[2]}aa 0%, transparent 50%),
                  radial-gradient(ellipse at 70% 60%, ${a.palette[1]}88 0%, transparent 55%)`,
              }} />

              {/* huge subject silhouette */}
              <div className="font-display" style={{
                position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
                fontSize: 480, fontWeight: 900, color: 'rgba(0,0,0,0.35)',
                lineHeight: 1, userSelect: 'none', letterSpacing: '-0.08em',
              }}>{a.titleJp.slice(0, 1)}</div>

              {/* scan lines */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0.25) 3px)',
                opacity: 0.7, pointerEvents: 'none',
              }} />

              {/* CRT vignette */}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)', pointerEvents: 'none' }} />

              {/* timestamp overlay */}
              <div className="font-mono" style={{
                position: 'absolute', top: 16, left: 20, zIndex: 4,
                fontSize: 11, color: a.accent, letterSpacing: '0.15em',
                textShadow: '0 0 8px rgba(0,0,0,0.8)',
              }}>
                ● REC · {a.titleEn.toUpperCase()} · S02·E14
              </div>
              <div className="font-mono" style={{
                position: 'absolute', top: 16, right: 20, zIndex: 4,
                display: 'flex', gap: 8, alignItems: 'center',
                fontSize: 10, color: 'white', textShadow: '0 0 8px rgba(0,0,0,0.8)',
              }}>
                <span style={{ padding: '3px 8px', background: `${a.accent}30`, border: `1px solid ${a.accent}`, borderRadius: 4 }}>{quality}</span>
                <span style={{ padding: '3px 8px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4 }}>HDR10+</span>
                <span style={{ padding: '3px 8px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4 }}>UA DUB</span>
              </div>

              {/* center play state */}
              {!playing && (
                <div onClick={() => setPlaying(true)} style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5,
                  background: 'rgba(0,0,0,0.4)', cursor: 'pointer',
                }}>
                  <div style={{
                    width: 100, height: 100, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)',
                    border: `2px solid ${a.accent}`, boxShadow: `0 0 60px ${a.accent}aa`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name="play" size={40} style={{ color: 'white', marginLeft: 4 }} />
                  </div>
                </div>
              )}

              {/* skip intro button (appears) */}
              {progress < 0.08 && (
                <button style={{
                  position: 'absolute', bottom: 90, right: 24, zIndex: 6,
                  padding: '10px 20px', borderRadius: 100,
                  background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)',
                  border: `1px solid ${a.accent}`,
                  color: 'white', fontFamily: 'JetBrains Mono', fontSize: 12, letterSpacing: '0.15em', cursor: 'pointer',
                }}>SKIP OP →</button>
              )}

              {/* ====== CONTROLS BAR ====== */}
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 7,
                padding: '24px 20px 14px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                opacity: showControls ? 1 : 0,
                transition: 'opacity 0.3s',
              }}>
                {/* timeline */}
                <div style={{ position: 'relative', height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, marginBottom: 14, cursor: 'pointer' }}
                  onClick={e => {
                    const r = e.currentTarget.getBoundingClientRect();
                    setProgress((e.clientX - r.left) / r.width);
                  }}>
                  {/* buffered */}
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${Math.min(1, progress + 0.15) * 100}%`, background: 'rgba(255,255,255,0.25)', borderRadius: 2 }} />
                  {/* progress */}
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress * 100}%`, background: 'linear-gradient(to right, var(--magenta), var(--violet))', borderRadius: 2, boxShadow: '0 0 12px rgba(255,45,149,0.7)' }} />
                  {/* chapters */}
                  {[0.05, 0.08, 0.4, 0.92].map((c, i) => (
                    <div key={i} style={{ position: 'absolute', left: `${c * 100}%`, top: -2, width: 2, height: 8, background: 'rgba(255,255,255,0.4)' }} />
                  ))}
                  {/* scrubber */}
                  <div style={{
                    position: 'absolute', left: `${progress * 100}%`, top: '50%', transform: 'translate(-50%, -50%)',
                    width: 14, height: 14, borderRadius: '50%',
                    background: 'white', boxShadow: '0 0 12px var(--magenta), 0 0 0 4px rgba(255,45,149,0.3)',
                  }} />
                </div>

                {/* buttons row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 8 : 16 }}>
                  <button onClick={() => setPlaying(!playing)} style={ctrlBtn}>
                    <Icon name={playing ? 'pause' : 'play'} size={20} />
                  </button>
                  <button style={ctrlBtn}><Icon name="arrow-left" size={16} /></button>
                  <button style={ctrlBtn}><Icon name="arrow-right" size={16} /></button>
                  <button onClick={() => setMuted(!muted)} style={ctrlBtn}>
                    <Icon name={muted ? 'volume-mute' : 'volume'} size={18} />
                  </button>
                  <div className="hide-mobile" style={{ width: 80, height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 2, position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: muted ? '0%' : '70%', background: 'white', borderRadius: 2 }} />
                  </div>

                  <span className="font-mono" style={{ fontSize: mobile ? 10 : 12, color: 'white', marginLeft: mobile ? 4 : 8, letterSpacing: '0.05em' }}>
                    <span style={{ color: a.accent }}>{time.cur}</span>
                    <span style={{ color: 'var(--ink-mute)' }}> / {time.total}</span>
                  </span>

                  <div style={{ flex: 1 }} />

                  <span className="hide-mobile" style={{ fontSize: 11, color: 'white', opacity: 0.7, fontFamily: 'Manrope' }}>
                    Далі: <span style={{ color: a.accent }}>Еп 15 · Битва за башню</span>
                  </span>
                  <button style={ctrlBtn} onClick={() => setShowSettings(!showSettings)}>
                    <Icon name="settings" size={18} />
                  </button>
                  <button style={ctrlBtn}><Icon name="fullscreen" size={18} /></button>
                </div>

                {/* settings popover */}
                {showSettings && (
                  <div className="glass-strong" style={{
                    position: 'absolute', right: 50, bottom: 70,
                    width: 280, borderRadius: 14, padding: 16,
                    background: 'rgba(10, 4, 22, 0.92)',
                  }}>
                    <PopRow label="ЯКІСТЬ" value={quality} options={['4K', '1080p', '720p', '480p']} onChange={setQuality} accent={a.accent} />
                    <PopRow label="ШВИДКІСТЬ" value="1.0x" options={['0.5x', '0.75x', '1.0x', '1.25x', '1.5x', '2.0x']} accent={a.accent} />
                    <PopRow label="ДУБЛЯЖ" value="UA" options={['UA', 'JP+UA SUB', 'JP+EN SUB']} accent={a.accent} />
                    <PopRow label="СУБТИТРИ" value="UA" options={['UA', 'EN', 'OFF']} accent={a.accent} />
                  </div>
                )}
              </div>
            </div>

            {/* below player: episode info */}
            <div className="glass" style={{ marginTop: 20, padding: mobile ? 18 : 24, borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12, flexWrap: 'wrap' }}>
                <div className="font-mono" style={{ fontSize: mobile ? 10 : 11, color: a.accent, letterSpacing: '0.15em' }}>
                  ▶ {a.titleEn.toUpperCase()} · СЕЗОН 2 · ЕП 14 / 25
                </div>
                <span className="chip chip-new" style={{ fontSize: 9 }}>● ЗАРАЗ</span>
                <div style={{ flex: 1 }} />
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="btn-ghost btn" style={{ padding: '8px 14px', fontSize: 11 }}>
                    <Icon name="heart" size={14} /> 24.1K
                  </button>
                  <button className="btn-ghost btn" style={{ padding: '8px 14px', fontSize: 11 }}>
                    <Icon name="plus" size={14} /> ЗБЕРЕГТИ
                  </button>
                  <button className="btn-ghost btn" style={{ padding: '8px 14px', fontSize: 11 }}>
                    ПОДІЛИТИСЬ
                  </button>
                </div>
              </div>
              <h2 className="font-display" style={{ fontSize: 28, fontWeight: 700 }}>14 · Тіньовий монарх</h2>
              <div className="font-jp" style={{ fontSize: 14, color: a.accent, opacity: 0.85, marginTop: 4 }}>影の君主</div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ink-dim)', marginTop: 14, maxWidth: 800 }}>
                Сон-у нарешті розкриває справжню силу системи. Хе-Ін отримує тривожне повідомлення з гільдії, поки в темних підземеллях прокидається те, що мало спати ще тисячу років.
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
                <span className="chip">Реж: Сін Хі-Со</span>
                <span className="chip">Сценарій: Ко Хан-Сук</span>
                <span className="chip">OST: Хімено Macia</span>
                <span className="chip">24 хв</span>
              </div>
            </div>

            {/* live chat */}
            <LiveChat anime={a} />
          </div>

          {/* === EPISODE SIDEBAR === */}
          <aside style={mobile || tablet ? {} : { position: 'sticky', top: 100 }}>
            <div className="glass" style={{ borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--line)' }}>
                <div className="font-mono" style={{ fontSize: 10, color: 'var(--magenta)', letterSpacing: '0.2em', marginBottom: 6 }}>ПЛЕЙ-ЛИСТ · S02</div>
                <div className="font-display" style={{ fontSize: 18, fontWeight: 600 }}>{a.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'JetBrains Mono' }}>
                  <span>14 / 25 ПЕРЕГЛЯНУТО</span>
                  <span style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1, overflow: 'hidden' }}>
                    <span style={{ display: 'block', height: '100%', width: '56%', background: 'var(--magenta)' }} />
                  </span>
                  <span>56%</span>
                </div>
              </div>
              <div style={{ maxHeight: 560, overflowY: 'auto' }}>
                {episodeList.map(ep => (
                  <div key={ep.n} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
                    borderBottom: '1px solid var(--line)', cursor: 'pointer',
                    background: ep.current ? 'rgba(255, 45, 149, 0.08)' : 'transparent',
                    borderLeft: ep.current ? '3px solid var(--magenta)' : '3px solid transparent',
                    transition: 'background 0.15s',
                  }} onMouseEnter={e => !ep.current && (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                     onMouseLeave={e => !ep.current && (e.currentTarget.style.background = 'transparent')}>
                    <div className="font-mono" style={{ fontSize: 13, color: ep.current ? a.accent : ep.watched ? 'var(--ink-mute)' : 'var(--ink-dim)', width: 24 }}>
                      {String(ep.n).padStart(2, '0')}
                    </div>
                    <div style={{
                      width: 60, height: 36, borderRadius: 4, flexShrink: 0,
                      background: `linear-gradient(135deg, ${a.palette[(ep.n - 1) % 3]}, ${a.palette[ep.n % 3]})`,
                      position: 'relative', overflow: 'hidden',
                    }}>
                      <div className="scanlines" style={{ position: 'absolute', inset: 0 }} />
                      {ep.current && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}>
                        <div style={{ width: 14, height: 14, background: 'var(--magenta)', borderRadius: 2 }} />
                      </div>}
                      {ep.watched && !ep.current && <div style={{ position: 'absolute', right: 2, bottom: 2, color: 'var(--ink-mute)' }}><Icon name="check" size={10} /></div>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Manrope', fontSize: 13, fontWeight: ep.current ? 600 : 400, color: ep.current ? 'white' : ep.watched ? 'var(--ink-mute)' : 'var(--ink-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ep.title}
                      </div>
                      <div className="font-mono" style={{ fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.1em', marginTop: 2 }}>23:50</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* up next */}
            <div className="glass" style={{ marginTop: 16, padding: 16, borderRadius: 14 }}>
              <div className="font-mono" style={{ fontSize: 10, color: 'var(--magenta)', letterSpacing: '0.2em', marginBottom: 10 }}>ДАЛІ ▶</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  width: 120, height: 70, borderRadius: 6, flexShrink: 0,
                  background: `linear-gradient(135deg, ${a.palette[1]}, ${a.palette[2]})`, position: 'relative', overflow: 'hidden',
                }}>
                  <div className="scanlines" style={{ position: 'absolute', inset: 0 }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="play" size={16} style={{ color: 'white' }} />
                  </div>
                </div>
                <div>
                  <div className="font-mono" style={{ fontSize: 9, color: a.accent, letterSpacing: '0.15em' }}>ЕП 15</div>
                  <div className="font-display" style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>Битва за башню</div>
                  <div className="font-mono" style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 4 }}>АВТОГРА ЧЕРЕЗ 8с</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const ctrlBtn = {
  width: 36, height: 36, borderRadius: 8,
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const PopRow = ({ label, value, options = [], onChange, accent }) => (
  <div style={{ padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
    <div className="font-mono" style={{ fontSize: 9, color: 'var(--ink-mute)', letterSpacing: '0.2em', marginBottom: 6 }}>{label}</div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {options.map(o => (
        <button key={o} onClick={() => onChange && onChange(o)} style={{
          padding: '4px 10px', borderRadius: 6, fontSize: 11,
          background: value === o ? `${accent}22` : 'rgba(255,255,255,0.04)',
          border: `1px solid ${value === o ? accent : 'transparent'}`,
          color: value === o ? accent : 'var(--ink-dim)',
          fontFamily: 'JetBrains Mono', cursor: 'pointer',
        }}>{o}</button>
      ))}
    </div>
  </div>
);

const LiveChat = ({ anime }) => {
  const messages = [
    { u: 'kira_ua', av: '#ff2d95', text: 'нарешті 14 епізод!!! 😭', t: 'щойно' },
    { u: 'shadow.king', av: '#b026ff', text: 'озвучка цей раз просто 10/10', t: '12с' },
    { u: 'pixel.kun', av: '#c4ff3d', text: 'хто крім мене перемотує?', t: '34с' },
    { u: 'lain.exe', av: '#00f0ff', text: 'OST тут просто шик', t: '1хв' },
    { u: 'akira_otaku', av: '#ffce4a', text: 'CG в сцені з тінями — чудовий', t: '2хв' },
  ];
  return (
    <div className="glass" style={{ marginTop: 20, padding: 20, borderRadius: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div className="pulse-dot" />
        <div className="font-mono" style={{ fontSize: 11, color: 'var(--magenta)', letterSpacing: '0.2em' }}>
          LIVE CHAT · 247 ОНЛАЙН
        </div>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, var(--magenta), transparent)' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
        {messages.map(m => (
          <div key={m.u} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg, ${m.av}, var(--violet))`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{m.u.slice(0, 1).toUpperCase()}</div>
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 600, fontSize: 12, color: m.av }}>{m.u}</span>
              <span style={{ fontSize: 12, marginLeft: 8, color: 'rgba(255,255,255,0.9)' }}>{m.text}</span>
              <span className="font-mono" style={{ fontSize: 9, color: 'var(--ink-mute)', marginLeft: 8, letterSpacing: '0.1em' }}>{m.t}</span>
            </div>
          </div>
        ))}
      </div>
      <input placeholder="Напиши в чат…" style={{
        width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line-strong)',
        borderRadius: 100, padding: '10px 16px', color: 'white', outline: 'none', fontFamily: 'Manrope', fontSize: 12,
      }} />
    </div>
  );
};

Object.assign(window, { PlayerPage });
