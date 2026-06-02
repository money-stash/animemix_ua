const { useState, useEffect, useRef, useMemo, useCallback } = React;

const useLang = () => {
  const [, rerender] = useState(0);
  useEffect(() => {
    const h = () => rerender(n => n + 1);
    window.addEventListener('langchange', h);
    window.addEventListener('animemix-data-ready', h);
    return () => {
      window.removeEventListener('langchange', h);
      window.removeEventListener('animemix-data-ready', h);
    };
  }, []);
  return { t: window.t };
};

function useVW() {
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);
  useEffect(() => {
    let raf = null;
    const h = () => { if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setVw(window.innerWidth)); };
    window.addEventListener('resize', h);
    window.addEventListener('orientationchange', h);
    return () => { window.removeEventListener('resize', h); window.removeEventListener('orientationchange', h); };
  }, []);
  return vw;
}
function useBP() {
  const vw = useVW();
  return {
    vw,
    mobile: vw < 768,
    tablet: vw >= 768 && vw < 1024,
    desktop: vw >= 1024,
    pad: vw < 768 ? 16 : vw < 1024 ? 24 : 32,
  };
}

const Icon = ({ name, size = 18, ...rest }) => {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', ...rest };
  switch (name) {
    case 'play': return <svg {...props}><path d="M6 4l14 8-14 8V4z" fill="currentColor" stroke="none"/></svg>;
    case 'play-circle': return <svg {...props}><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none"/></svg>;
    case 'pause': return <svg {...props}><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/></svg>;
    case 'search': return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
    case 'home': return <svg {...props}><path d="M3 11l9-8 9 8v10a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1V11z"/></svg>;
    case 'grid': return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case 'fire': return <svg {...props}><path d="M12 2s4 4 4 8a4 4 0 11-8 0c0-1 .5-2 1-3-2 1-4 3-4 7a7 7 0 0014 0c0-5-3-9-7-12z"/></svg>;
    case 'heart': return <svg {...props}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
    case 'plus': return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'check': return <svg {...props}><path d="M5 12l5 5L20 7"/></svg>;
    case 'star': return <svg {...props}><path d="M12 2l3 6.5 7 1-5 5 1.2 7-6.2-3.5L5.8 21.5 7 14.5 2 9.5l7-1z" fill="currentColor" stroke="none"/></svg>;
    case 'user': return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 22c0-4 4-7 8-7s8 3 8 7"/></svg>;
    case 'bell': return <svg {...props}><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 004 0"/></svg>;
    case 'arrow-right': return <svg {...props}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case 'arrow-left': return <svg {...props}><path d="M19 12H5M11 5l-7 7 7 7"/></svg>;
    case 'volume': return <svg {...props}><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15 9a3 3 0 010 6M19 5a8 8 0 010 14"/></svg>;
    case 'volume-mute': return <svg {...props}><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M22 9l-6 6M16 9l6 6"/></svg>;
    case 'fullscreen': return <svg {...props}><path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6"/></svg>;
    case 'settings': return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 005 14.41a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1A1.65 1.65 0 004.27 6.6l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9A1.65 1.65 0 0010 2.91V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.09 9 1.65 1.65 0 0020.6 10H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
    case 'list': return <svg {...props}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>;
    case 'film': return <svg {...props}><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/></svg>;
    case 'clock': return <svg {...props}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
    case 'sparkles': return <svg {...props}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5zM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8zM5 16l.6 1.4L7 18l-1.4.6L5 20l-.6-1.4L3 18l1.4-.6z" fill="currentColor" stroke="none"/></svg>;
    case 'eye': return <svg {...props}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'filter': return <svg {...props}><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>;
    case 'chevron-down': return <svg {...props}><path d="M6 9l6 6 6-6"/></svg>;
    case 'chevron-right': return <svg {...props}><path d="M9 6l6 6-6 6"/></svg>;
    case 'logo-mark': return <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M4 28L12 6h3l8 22h-4l-1.7-5h-8.6L7 28H4zm6.5-8h6L13.5 11l-3 9z" fill="url(#lg)"/>
      <path d="M22 6h3v18l-3 4V6z" fill="url(#lg2)"/>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff2d95"/><stop offset="1" stopColor="#b026ff"/></linearGradient>
        <linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b026ff"/><stop offset="1" stopColor="#00f0ff"/></linearGradient>
      </defs>
    </svg>;
    case 'discord': return <svg {...props} viewBox="0 0 24 24"><path d="M20 5a16 16 0 00-4-1l-.2.4a13 13 0 00-3.8-.4 13 13 0 00-3.8.4L8 4a16 16 0 00-4 1A19 19 0 002 18s2.5 1.5 5 2l1-2-2-1c2 1 4 1.5 6 1.5s4-.5 6-1.5l-2 1 1 2c2.5-.5 5-2 5-2a19 19 0 00-2-13z"/><circle cx="9" cy="13" r="1.2" fill="currentColor"/><circle cx="15" cy="13" r="1.2" fill="currentColor"/></svg>;
    case 'tg': return <svg {...props} viewBox="0 0 24 24"><path d="M21.5 3.5L2 11l5 2 2 6 3-4 5 4 4.5-15.5z"/></svg>;
    case 'logout': return <svg {...props}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>;
    default: return <svg {...props}><circle cx="12" cy="12" r="9"/></svg>;
  }
};

const COVERS_KEY = 'animemix_covers_v1';
let _coversCache = (() => { try { return JSON.parse(localStorage.getItem(COVERS_KEY) || '{}'); } catch (e) { return {}; } })();
function _persistCovers() {
  try { localStorage.setItem(COVERS_KEY, JSON.stringify(_coversCache)); }
  catch (e) { console.warn('cover store full', e); }
  window.dispatchEvent(new CustomEvent('covers-change'));
}
function writeCover(id, url) { _coversCache = { ..._coversCache, [id]: url }; _persistCovers(); }
function clearCover(id) { const m = { ..._coversCache }; delete m[id]; _coversCache = m; _persistCovers(); }

function fileToCover(file, cb) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const maxW = 640;
      const scale = Math.min(1, maxW / img.width);
      const cv = document.createElement('canvas');
      cv.width = Math.round(img.width * scale);
      cv.height = Math.round(img.height * scale);
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      cb(cv.toDataURL('image/jpeg', 0.82));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function useCover(id) {
  const [url, setUrl] = useState(_coversCache[id] || null);
  useEffect(() => {
    const h = () => setUrl(_coversCache[id] || null);
    window.addEventListener('covers-change', h);
    return () => window.removeEventListener('covers-change', h);
  }, [id]);
  return url;
}

function useDropCover(id) {
  const [over, setOver] = useState(false);
  const inputRef = useRef(null);
  const handlers = {
    onDragOver: e => { e.preventDefault(); if (!over) setOver(true); },
    onDragLeave: e => { e.preventDefault(); setOver(false); },
    onDrop: e => {
      e.preventDefault(); e.stopPropagation(); setOver(false);
      const f = e.dataTransfer.files && e.dataTransfer.files[0];
      fileToCover(f, url => writeCover(id, url));
    },
  };
  const picker = (
    <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
      onChange={e => { fileToCover(e.target.files[0], url => writeCover(id, url)); e.target.value = ''; }} />
  );
  const open = (e) => { if (e) e.stopPropagation(); inputRef.current && inputRef.current.click(); };
  return [over, handlers, picker, open];
}

const CoverArt = ({ id, over, picker, open, zIndex = 1, radius = 0, hideUploadBtn = false }) => {
  const url = useCover(id);
  return (
    <React.Fragment>
      {url && (
        <img src={url} alt="" draggable={false} style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', borderRadius: radius, zIndex,
        }} />
      )}
      {over && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20, borderRadius: radius,
          border: '2px dashed var(--magenta)', background: 'rgba(255,45,149,0.18)',
          backdropFilter: 'blur(2px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <span className="font-mono" style={{ fontSize: 11, color: 'white', letterSpacing: '0.15em',
            background: 'rgba(0,0,0,0.5)', padding: '6px 12px', borderRadius: 100 }}>{t('coverDropLabel')}</span>
        </div>
      )}
      {picker}
      {!hideUploadBtn && open && (
        <button onClick={open} title={url ? t('coverUploadTitleReplace') : t('coverUploadTitleAdd')} className="cover-upload-btn" style={{
          position: 'absolute', left: 8, bottom: 8, zIndex: 9,
          width: 26, height: 26, borderRadius: 8,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0, transition: 'opacity 0.2s',
        }}>
          <Icon name={url ? 'settings' : 'plus'} size={13} />
        </button>
      )}
    </React.Fragment>
  );
};

const Cover = ({ anime, size = 'md', showInfo = false, onClick, idx = 0, fluid = false }) => {
  const { t } = useLang();
  const [hovered, setHovered] = useState(false);
  const coverUrl = useCover(anime.id);
  const [over, dropHandlers, picker, openPicker] = useDropCover(anime.id);
  const sizes = {
    sm: { w: 140, h: 200, title: 13, jp: 10 },
    md: { w: 200, h: 290, title: 16, jp: 11 },
    lg: { w: 280, h: 400, title: 20, jp: 13 },
    xl: { w: 360, h: 520, title: 26, jp: 15 },
    wide: { w: 380, h: 220, title: 18, jp: 11 },
  };
  const s = sizes[size] || sizes.md;
  const [c1, c2, c3] = anime.palette;

  return (
    <div
      className="cover cover-droppable"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...dropHandlers}
      style={{
        width: fluid ? '100%' : s.w, height: fluid ? 'auto' : s.h,
        aspectRatio: fluid ? '2 / 3' : undefined,
        cursor: onClick ? 'pointer' : 'default',
        transform: hovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'transform 0.4s cubic-bezier(.2,.9,.3,1.2), box-shadow 0.3s',
        boxShadow: hovered
          ? `0 30px 60px -20px ${anime.accent}66, 0 0 0 1px ${anime.accent}88`
          : '0 8px 30px -10px rgba(0,0,0,0.6)',
      }}
    >
      {}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: `
          radial-gradient(ellipse at 30% 20%, ${c2}aa 0%, transparent 55%),
          radial-gradient(ellipse at 70% 80%, ${c3}77 0%, transparent 55%),
          linear-gradient(135deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)
        `,
      }} />

      {}
      <CoverArt id={anime.id} over={over} picker={picker} open={openPicker} zIndex={1} />

      {}
      {!coverUrl && <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        backgroundImage: `radial-gradient(circle at 1px 1px, ${c3}44 1px, transparent 1.5px)`,
        backgroundSize: '8px 8px',
        opacity: 0.6,
        mixBlendMode: 'screen',
      }} />}

      {}
      {!coverUrl && <div className="font-display" style={{
        position: 'absolute', right: -12, top: -20, zIndex: 1,
        fontSize: s.w * 0.7, fontWeight: 900,
        color: 'rgba(255,255,255,0.08)',
        lineHeight: 1, letterSpacing: '-0.05em',
        transform: hovered ? 'translateX(-8px)' : 'translateX(0)',
        transition: 'transform 0.5s',
        userSelect: 'none',
      }}>{anime.titleJp.slice(0, 1)}</div>}

      {}
      <div style={{ position: 'absolute', left: 0, top: 0, width: '40%', height: 2, background: anime.accent, zIndex: 4, opacity: hovered ? 1 : 0.7, boxShadow: `0 0 8px ${anime.accent}` }} />
      <div style={{ position: 'absolute', right: 0, bottom: 0, width: '40%', height: 2, background: anime.accent, zIndex: 4, opacity: hovered ? 1 : 0.7, boxShadow: `0 0 8px ${anime.accent}` }} />

      {}
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 5, display: 'flex', flexDirection: 'column', gap: 5 }}>
        {anime.badges && anime.badges.includes('hot') && <span className="chip chip-hot" style={{ fontSize: 9, padding: '3px 7px' }}>● HOT</span>}
        {anime.badges && anime.badges.includes('new') && <span className="chip chip-new" style={{ fontSize: 9, padding: '3px 7px' }}>NEW</span>}
      </div>

      {}
      <div className="font-mono" style={{
        position: 'absolute', top: 10, right: 10, zIndex: 5,
        fontSize: 11, color: 'white',
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
        padding: '3px 7px', borderRadius: 4,
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <span style={{ color: 'var(--gold)' }}>★</span>{anime.rating}
      </div>

      {}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '12px 14px', zIndex: 6,
      }}>
        <div className="font-mono" style={{ fontSize: 9, color: anime.accent, letterSpacing: '0.1em', marginBottom: 4, opacity: 0.9 }}>
          {anime.titleJp} · {anime.year}
        </div>
        <div className="font-display" style={{
          fontSize: s.title, fontWeight: 700, color: 'white',
          lineHeight: 1.1, textShadow: '0 2px 12px rgba(0,0,0,0.8)',
        }}>{animeTitle(anime)}</div>
        {showInfo && (
          <div style={{ marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
            {anime.ep} {t("episodesWord")} · {animeGenres(anime).slice(0, 2).join(' · ')}
          </div>
        )}
      </div>

      {}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 7,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hovered ? `radial-gradient(circle, ${anime.accent}44 0%, transparent 70%)` : 'transparent',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s',
        pointerEvents: 'none',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${anime.accent}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 30px ${anime.accent}aa`,
        }}>
          <Icon name="play" size={22} style={{ color: 'white', marginLeft: 3 }} />
        </div>
      </div>
    </div>
  );
};

const LangToggle = () => {
  const [lang, setLangState] = useState(window.getLang());
  useEffect(() => {
    const h = (e) => setLangState(e.detail);
    window.addEventListener('langchange', h);
    return () => window.removeEventListener('langchange', h);
  }, []);
  const toggle = () => window.setLang(lang === 'uk' ? 'en' : 'uk');
  return (
    <button onClick={toggle} className="btn-ghost btn nav-link" style={{ padding: '6px 10px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.08em', minWidth: 52, justifyContent: 'center', textAlign: 'center' }}>
      {lang === 'uk' ? 'EN' : 'UA'}
    </button>
  );
};

const getNotifs = () => [
  { id: 1, unread: true,  icon: 'sparkles', title: t('notif1Title'), body: t('notif1Body'), time: t('notif1Time') },
  { id: 2, unread: true,  icon: 'bell',     title: t('notif2Title'), body: t('notif2Body'), time: t('notif2Time') },
  { id: 3, unread: false, icon: 'heart',    title: t('notif3Title'), body: t('notif3Body'), time: t('notif3Time') },
  { id: 4, unread: false, icon: 'grid',     title: t('notif4Title'), body: t('notif4Body'), time: t('notif4Time') },
];

const NotifBell = () => {
  useLang();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(getNotifs);
  const ref = useRef(null);
  const unreadCount = notifs.filter(n => n.unread).length;

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, unread: false })));

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="btn-ghost btn nav-link"
        onClick={() => setOpen(o => !o)}
        style={{ padding: '8px 12px', position: 'relative' }}
      >
        <Icon name="bell" size={16} />
        {unreadCount > 0 && (
          <div className="pulse-dot" style={{ position: 'absolute', top: 8, right: 10, width: 6, height: 6 }} />
        )}
      </button>

      {open && (
        <div className="glass-strong" style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
          width: 340, borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 24px 60px -10px rgba(0,0,0,0.7), 0 0 0 1px rgba(167,139,250,0.15)',
          zIndex: 200,
        }}>
          {}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px' }}>
            <span className="font-display" style={{ fontSize: 13, fontWeight: 700 }}>
              {t('notifTitle')} {unreadCount > 0 && (
                <span style={{ marginLeft: 6, padding: '2px 7px', borderRadius: 100, fontSize: 10,
                  background: 'rgba(255,45,149,0.2)', color: 'var(--magenta)', border: '1px solid rgba(255,45,149,0.3)' }}>
                  {unreadCount}
                </span>
              )}
            </span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 11, color: 'var(--ink-dim)', fontFamily: 'Manrope',
              }}>
                {t('notifMarkAllRead')}
              </button>
            )}
          </div>

          <div style={{ height: 1, background: 'var(--line)' }} />

          {}
          <div style={{ maxHeight: 320, overflowY: 'auto' }} className="rail">
            {notifs.map((n, i) => (
              <div
                key={n.id}
                onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                style={{
                  display: 'flex', gap: 12, padding: '12px 16px',
                  background: n.unread ? 'rgba(255,45,149,0.05)' : 'transparent',
                  borderBottom: i < notifs.length - 1 ? '1px solid var(--line)' : 'none',
                  cursor: 'pointer', transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = n.unread ? 'rgba(255,45,149,0.05)' : 'transparent'}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: n.unread ? 'linear-gradient(135deg, var(--magenta), var(--violet))' : 'rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: n.unread ? 'white' : 'var(--ink-dim)',
                }}>
                  <Icon name={n.icon} size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: n.unread ? 'var(--ink)' : 'var(--ink-dim)', marginBottom: 2 }}>
                    {n.title}
                    {n.unread && <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--magenta)', marginLeft: 6, verticalAlign: 'middle' }} />}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)', lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.body}</div>
                  <div className="font-mono" style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 4 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>

          {}
          <div style={{ height: 1, background: 'var(--line)' }} />
          <div style={{ padding: '10px 16px', textAlign: 'center' }}>
            <button style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: 'var(--violet-soft)', fontFamily: 'Manrope', fontWeight: 500,
            }}>
              {t('notifViewAll')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const TopNav = ({ route, setRoute, openSearch, currentUser }) => {
  useLang();
  const [scrolled, setScrolled] = useState(false);
  const { mobile, tablet, pad } = useBP();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { id: 'home', label: t('navHome'), icon: 'home' },
    { id: 'catalog', label: t('navCatalog'), icon: 'grid' },
    { id: 'simulcast', label: t('navSeason'), icon: 'sparkles' },
    { id: 'profile', label: t('navMy'), icon: 'heart' },
  ];

  return (
    <React.Fragment>
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: `${mobile ? 10 : 14}px ${pad}px`,
      transition: 'all 0.3s',
      background: scrolled || mobile ? 'rgba(6, 3, 13, 0.7)' : 'transparent',
      backdropFilter: scrolled || mobile ? 'blur(20px) saturate(150%)' : 'none',
      borderBottom: scrolled || mobile ? '1px solid var(--line)' : '1px solid transparent',
    }}>
      <div style={{ maxWidth: 1480, margin: '0 auto', display: 'flex', alignItems: 'center', gap: mobile ? 12 : 32 }}>
        <a onClick={() => setRoute('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textDecoration: 'none' }}>
          <Icon name="logo-mark" size={mobile ? 28 : 32} />
          <div>
            <div className="font-display glitch glitch-live" data-text="ANIMEMIX" style={{ fontSize: mobile ? 16 : 18, fontWeight: 800, color: 'white', letterSpacing: '-0.02em', lineHeight: 1 }}>ANIMEMIX</div>
            <div className="font-mono" style={{ fontSize: 8, letterSpacing: '0.3em', color: 'var(--violet-soft)', marginTop: 2 }}>UA · アニメ</div>
          </div>
        </a>

        {!mobile && (
          <nav style={{ display: 'flex', gap: 4, marginLeft: 12 }}>
            {links.map(l => (
              <button
                key={l.id}
                onClick={() => setRoute(l.id)}
                className={`nav-link${route === l.id ? ' active' : ''}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px', borderRadius: 100,
                  background: route === l.id ? 'rgba(255, 45, 149, 0.12)' : 'transparent',
                  border: route === l.id ? '1px solid rgba(255, 45, 149, 0.4)' : '1px solid transparent',
                  color: route === l.id ? 'var(--magenta)' : 'var(--ink-dim)',
                  fontFamily: 'Manrope', fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <Icon name={l.icon} size={15} />
                {!tablet && l.label}
              </button>
            ))}
          </nav>
        )}

        <div style={{ flex: 1 }} />

        {mobile ? (
          <button onClick={openSearch} className="glass" style={{
            width: 42, height: 42, borderRadius: '50%', border: 'none', cursor: 'pointer',
            color: 'var(--ink-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="search" size={18} />
          </button>
        ) : (
          <button onClick={openSearch} className="glass" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', borderRadius: 100,
            minWidth: tablet ? 180 : 280, color: 'var(--ink-mute)',
            fontFamily: 'Manrope', fontSize: 13, cursor: 'pointer',
          }}>
            <Icon name="search" size={16} />
            <span style={{ flex: 1, textAlign: 'left' }}>{tablet ? t('searchPlaceholderTablet') : t('searchPlaceholderDesktop')}</span>
            <span className="font-mono" style={{ fontSize: 10, padding: '2px 6px', border: '1px solid var(--line-strong)', borderRadius: 4 }}>⌘K</span>
          </button>
        )}

        {!mobile && <LangToggle />}
        {!mobile && <NotifBell />}

        <button
          onClick={() => setRoute(currentUser ? 'profile' : 'auth')}
          style={{
            width: mobile ? 38 : 40, height: mobile ? 38 : 40, borderRadius: '50%', cursor: 'pointer', flexShrink: 0,
            background: 'linear-gradient(135deg, #ff2d95, #b026ff)',
            border: currentUser ? '2px solid rgba(0, 240, 255, 0.6)' : '2px solid rgba(167, 139, 250, 0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 14,
            boxShadow: currentUser ? '0 0 12px rgba(0,240,255,0.3)' : 'none',
            transition: 'all 0.2s',
          }}
          title={currentUser ? currentUser.username : 'Увійти'}
        >
          {currentUser
            ? (currentUser.username || '?').slice(0, 1).toUpperCase()
            : <Icon name="user" size={18} />
          }
        </button>
      </div>
    </header>

    {}
    <nav className="bottom-nav">
      {[
        { id: 'home', label: t('navHome'), icon: 'home' },
        { id: 'catalog', label: t('navCatalog'), icon: 'grid' },
        { id: '__search', label: t('searchPlaceholderTablet'), icon: 'search' },
        { id: 'profile', label: t('navMy'), icon: 'user' },
      ].map(l => {
        const active = route === l.id;
        return (
          <button key={l.id} onClick={() => l.id === '__search' ? openSearch() : setRoute(l.id)} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: active ? 'var(--magenta)' : 'var(--ink-mute)', padding: '4px 14px',
            flex: 1,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 40, height: 28, borderRadius: 100,
              background: active ? 'rgba(255,45,149,0.15)' : 'transparent',
              transition: 'background 0.2s',
            }}>
              <Icon name={l.icon} size={19} />
            </div>
            <span style={{ fontSize: 10, fontFamily: 'Manrope', fontWeight: 500 }}>{l.label}</span>
          </button>
        );
      })}
    </nav>
    </React.Fragment>
  );
};

const SectionHeader = ({ kicker, title, action, onAction }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
    <div>
      {kicker && (
        <div className="font-mono" style={{ fontSize: 11, color: 'var(--magenta)', letterSpacing: '0.2em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 16, height: 1, background: 'var(--magenta)' }} />
          {kicker}
        </div>
      )}
      <h2 className="font-display" style={{ fontSize: 'clamp(22px, 4.5vw, 32px)', fontWeight: 700, color: 'white' }}>{title}</h2>
    </div>
    {action && (
      <button onClick={onAction} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'var(--violet-soft)', fontFamily: 'JetBrains Mono', fontSize: 11,
        letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>{action} <Icon name="arrow-right" size={14} /></button>
    )}
  </div>
);

const SearchPalette = ({ open, onClose, onPick }) => {
  const [q, setQ] = useState('');
  const ref = useRef(null);
  useEffect(() => { if (open && ref.current) ref.current.focus(); }, [open]);
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return ANIME.slice(0, 6);
    return ANIME.filter(a =>
      animeTitle(a).toLowerCase().includes(term) ||
      a.titleEn.toLowerCase().includes(term) ||
      animeGenres(a).join(' ').toLowerCase().includes(term) || a.genres.join(' ').toLowerCase().includes(term)
    ).slice(0, 8);
  }, [q]);

  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(6, 3, 13, 0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', justifyContent: 'center', paddingTop: '12vh',
      animation: 'float-up 0.2s ease',
    }}>
      <div onClick={e => e.stopPropagation()} className="glass-strong" style={{
        width: 'min(640px, 92vw)', maxHeight: '70vh', borderRadius: 24, padding: 8, display: 'flex', flexDirection: 'column',
        boxShadow: '0 40px 100px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,45,149,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
          <Icon name="search" size={20} style={{ color: 'var(--magenta)' }} />
          <input
            ref={ref}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder={t('searchPaletteInputPlaceholder')}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'white', fontSize: 16, fontFamily: 'Manrope',
            }}
          />
          <span className="font-mono chip">ESC</span>
        </div>
        <div style={{ padding: 8, overflowY: 'auto' }}>
          <div className="font-mono" style={{ fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.2em', padding: '8px 12px' }}>
            {q ? `${results.length} ${t('searchResultsCount')}` : t('searchPopularNow')}
          </div>
          {results.map(a => (
            <button key={a.id} onClick={() => { onPick(a.id); onClose(); }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '8px 12px',
              borderRadius: 12, background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'white', textAlign: 'left',
              transition: 'background 0.15s',
            }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,45,149,0.08)'}
               onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width: 48, height: 64, borderRadius: 6, overflow: 'hidden', flexShrink: 0,
                background: `linear-gradient(135deg, ${a.palette[0]}, ${a.palette[1]}, ${a.palette[2]})` }} />
              <div style={{ flex: 1 }}>
                <div className="font-display" style={{ fontSize: 14, fontWeight: 600 }}>{animeTitle(a)}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 2 }}>
                  {a.year} · {animeGenres(a).join(' · ')} · ★ {a.rating}
                </div>
              </div>
              <Icon name="chevron-right" size={16} style={{ color: 'var(--violet-soft)' }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  useLang();
  const { mobile, tablet, pad } = useBP();
  return (
  <footer style={{ marginTop: mobile ? 60 : 120, padding: `${mobile ? 40 : 60}px ${pad}px 40px`, borderTop: '1px solid var(--line)' }}>
    <div style={{ maxWidth: 1480, margin: '0 auto', display: 'grid', gridTemplateColumns: mobile ? '1fr' : tablet ? '1fr 1fr' : '2fr 1fr 1fr 1fr', gap: mobile ? 36 : 60 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <Icon name="logo-mark" size={36} />
          <div>
            <div className="font-display" style={{ fontSize: 22, fontWeight: 800 }}>ANIMEMIX</div>
            <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--violet-soft)' }}>UA · アニメ・ミックス</div>
          </div>
        </div>
        <p style={{ color: 'var(--ink-dim)', fontSize: 13, lineHeight: 1.6, maxWidth: 380 }}>
          {t('footerTagline')}
        </p>
        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <button className="btn-ghost btn" style={{ padding: 10 }}><Icon name="discord" size={16} /></button>
          <button className="btn-ghost btn" style={{ padding: 10 }}><Icon name="tg" size={16} /></button>
        </div>
      </div>
      {[
        { h: t('footerColPlatform'), l: [t('footerLinkCatalog'), t('footerLinkSimulcast'), t('footerLinkTop100'), t('footerLinkLatest'), t('footerLinkCollections')] },
        { h: t('footerColCommunity'), l: [t('footerLinkForum'), 'Discord', t('footerLinkTranslators'), t('footerLinkStand'), t('footerLinkDonate')] },
        { h: t('footerColLegal'), l: [t('footerLinkTerms'), t('footerLinkPrivacy'), 'DMCA', t('footerLinkContacts'), t('footerLinkPressKit')] },
      ].map(col => (
        <div key={col.h}>
          <div className="font-mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--magenta)', marginBottom: 14 }}>{col.h.toUpperCase()}</div>
          {col.l.map(item => (
            <div key={item} style={{ fontSize: 13, color: 'var(--ink-dim)', padding: '6px 0', cursor: 'pointer' }}>{item}</div>
          ))}
        </div>
      ))}
    </div>
    <div style={{ maxWidth: 1480, margin: '40px auto 0', paddingTop: 20, borderTop: '1px solid var(--line)', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between', color: 'var(--ink-mute)', fontSize: 11, fontFamily: 'JetBrains Mono' }}>
      <span>{t('footerCopyright')}</span>
      <span>v 4.2.0 · BUILD 240312</span>
    </div>
  </footer>
  );
};

Object.assign(window, { Icon, Cover, CoverArt, useCover, useDropCover, writeCover, clearCover, useVW, useBP, TopNav, SectionHeader, SearchPalette, Footer, LangToggle, useLang });
