from flask import Blueprint, jsonify, request, abort
from sqlalchemy import or_
from ..database import db
from ..models import Anime, Genre, Studio, Badge, Episode

api_bp = Blueprint('api', __name__, url_prefix='/api')


# ── Helpers ───────────────────────────────────────────────────────────────────

def lang_param():
    return request.args.get('lang', 'uk')


# ── Anime list ────────────────────────────────────────────────────────────────

@api_bp.route('/anime')
def get_anime():
    lang        = lang_param()
    genre_slug  = request.args.get('genre')
    status      = request.args.get('status')
    year        = request.args.get('year', type=int)
    sort        = request.args.get('sort', 'rating')   # rating | year | name | hot
    page        = request.args.get('page', 1, type=int)
    limit       = request.args.get('limit', 20, type=int)
    limit       = min(limit, 100)  # cap

    q = Anime.query

    if genre_slug:
        q = q.join(Anime.genres).filter(Genre.slug == genre_slug)
    if status:
        q = q.filter(Anime.status == status)
    if year:
        q = q.filter(Anime.year == year)

    if sort == 'year':
        q = q.order_by(Anime.year.desc(), Anime.rating.desc())
    elif sort == 'name':
        q = q.order_by(Anime.title_uk if lang == 'uk' else Anime.title_en)
    else:  # rating / hot
        q = q.order_by(Anime.rating.desc())

    total      = q.count()
    anime_list = q.offset((page - 1) * limit).limit(limit).all()

    return jsonify({
        'data':  [a.to_dict(lang) for a in anime_list],
        'total': total,
        'page':  page,
        'limit': limit,
        'pages': (total + limit - 1) // limit,
    })


# ── Single anime ──────────────────────────────────────────────────────────────

@api_bp.route('/anime/<slug>')
def get_anime_detail(slug):
    lang  = lang_param()
    anime = Anime.query.filter_by(slug=slug).first_or_404()
    return jsonify(anime.to_dict(lang, include_episodes=True))


# ── Episodes for an anime ─────────────────────────────────────────────────────

@api_bp.route('/anime/<slug>/episodes')
def get_episodes(slug):
    lang    = lang_param()
    season  = request.args.get('season', type=int)
    anime   = Anime.query.filter_by(slug=slug).first_or_404()
    q       = anime.episodes
    if season:
        q = q.filter_by(season_number=season)
    return jsonify([e.to_dict(lang) for e in q.all()])


# ── Genres ────────────────────────────────────────────────────────────────────

@api_bp.route('/genres')
def get_genres():
    lang   = lang_param()
    genres = Genre.query.order_by(Genre.name_uk).all()
    return jsonify([g.to_dict(lang) for g in genres])


# ── Search ────────────────────────────────────────────────────────────────────

@api_bp.route('/search')
def search():
    lang  = lang_param()
    q_str = request.args.get('q', '').strip()
    limit = request.args.get('limit', 10, type=int)
    if not q_str:
        return jsonify([])

    like = f'%{q_str}%'
    results = Anime.query.filter(
        or_(
            Anime.title_uk.ilike(like),
            Anime.title_en.ilike(like),
            Anime.title_jp.ilike(like),
        )
    ).order_by(Anime.rating.desc()).limit(limit).all()

    return jsonify([a.to_dict(lang) for a in results])


# ── Continue watching (mock — will be per-user after auth) ───────────────────

CONTINUE_MOCK = [
    {'slug': 'solo-leveling', 'episode': 14, 'total': 25, 'progress': 0.62, 'time': '14:22 / 23:50'},
    {'slug': 'dandadan',      'episode': 7,  'total': 12, 'progress': 0.15, 'time': '03:40 / 24:10'},
    {'slug': 'apothecary',    'episode': 19, 'total': 24, 'progress': 0.88, 'time': '21:08 / 24:00'},
    {'slug': 'frieren',       'episode': 25, 'total': 28, 'progress': 0.42, 'time': '10:11 / 24:00'},
]

@api_bp.route('/continue-watching')
def continue_watching():
    lang   = lang_param()
    result = []
    for item in CONTINUE_MOCK:
        anime = Anime.query.filter_by(slug=item['slug']).first()
        if anime:
            d = anime.to_dict(lang)
            d.update({
                'episode':  item['episode'],
                'total':    item['total'],
                'progress': item['progress'],
                'time':     item['time'],
            })
            result.append(d)
    return jsonify(result)


# ── Years ─────────────────────────────────────────────────────────────────────

@api_bp.route('/years')
def get_years():
    rows  = db.session.query(Anime.year).distinct().order_by(Anime.year.desc()).all()
    years = [r[0] for r in rows if r[0]]
    return jsonify(years)


# ── Studios ───────────────────────────────────────────────────────────────────

@api_bp.route('/studios')
def get_studios():
    studios = Studio.query.order_by(Studio.name).all()
    return jsonify([s.to_dict() for s in studios])


# ── Health check ──────────────────────────────────────────────────────────────

@api_bp.route('/health')
def health():
    return jsonify({'status': 'ok'})
