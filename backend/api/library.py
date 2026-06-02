from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from ..database import db
from ..models import Anime, UserAnime, WatchProgress

library_bp = Blueprint('library', __name__, url_prefix='/api/user')

VALID_STATUSES = {'watching', 'completed', 'plan', 'dropped', 'on_hold'}

def _lang():
    return request.args.get('lang', 'uk')

def _get_anime_or_404(slug):
    a = Anime.query.filter_by(slug=slug).first()
    if not a:
        raise ValueError(f'Anime not found: {slug}')
    return a

def _get_or_create_entry(user_id, anime_id):
    entry = UserAnime.query.filter_by(user_id=user_id, anime_id=anime_id).first()
    if not entry:
        entry = UserAnime(user_id=user_id, anime_id=anime_id, status='plan')
        db.session.add(entry)
    return entry

@library_bp.route('/library', methods=['GET'])
@jwt_required()
def get_library():
    user_id = int(get_jwt_identity())
    lang    = _lang()
    status  = request.args.get('status')

    q = UserAnime.query.filter_by(user_id=user_id)
    if status:
        q = q.filter_by(status=status)
    q = q.order_by(UserAnime.updated_at.desc())

    return jsonify([e.to_dict(lang) for e in q.all()])

@library_bp.route('/library/<slug>', methods=['GET'])
@jwt_required()
def get_entry(slug):
    user_id = int(get_jwt_identity())
    try:
        anime = _get_anime_or_404(slug)
    except ValueError:
        return jsonify({'error': 'Not found'}), 404

    entry = UserAnime.query.filter_by(user_id=user_id, anime_id=anime.id).first()
    if not entry:
        return jsonify(None)
    return jsonify(entry.to_dict(_lang()))

@library_bp.route('/library/<slug>', methods=['POST', 'PUT'])
@jwt_required()
def upsert_entry(slug):
    user_id = int(get_jwt_identity())
    data    = request.get_json(silent=True) or {}

    try:
        anime = _get_anime_or_404(slug)
    except ValueError:
        return jsonify({'error': 'Anime not found'}), 404

    status = data.get('status', 'plan')
    if status not in VALID_STATUSES:
        return jsonify({'error': f'Invalid status. Use: {", ".join(VALID_STATUSES)}'}), 400

    entry = _get_or_create_entry(user_id, anime.id)
    entry.status   = status
    entry.progress = int(data.get('progress', entry.progress or 0))
    if 'rating' in data:
        r = data['rating']
        entry.rating = float(r) if r is not None else None
    if 'notes' in data:
        entry.notes = data['notes']

    if status == 'completed' and anime.episodes_count:
        entry.progress = anime.episodes_count

    db.session.commit()
    return jsonify(entry.to_dict(_lang())), 200

@library_bp.route('/library/<slug>', methods=['PATCH'])
@jwt_required()
def patch_entry(slug):
    user_id = int(get_jwt_identity())
    data    = request.get_json(silent=True) or {}

    try:
        anime = _get_anime_or_404(slug)
    except ValueError:
        return jsonify({'error': 'Anime not found'}), 404

    entry = UserAnime.query.filter_by(user_id=user_id, anime_id=anime.id).first()
    if not entry:
        return jsonify({'error': 'Not in library'}), 404

    if 'status' in data:
        if data['status'] not in VALID_STATUSES:
            return jsonify({'error': 'Invalid status'}), 400
        entry.status = data['status']
        if entry.status == 'completed' and anime.episodes_count:
            entry.progress = anime.episodes_count
    if 'rating'   in data: entry.rating   = float(data['rating'])   if data['rating'] is not None else None
    if 'progress' in data: entry.progress = int(data['progress'])
    if 'notes'    in data: entry.notes    = data['notes']

    db.session.commit()
    return jsonify(entry.to_dict(_lang()))

@library_bp.route('/library/<slug>', methods=['DELETE'])
@jwt_required()
def delete_entry(slug):
    user_id = int(get_jwt_identity())
    try:
        anime = _get_anime_or_404(slug)
    except ValueError:
        return jsonify({'error': 'Not found'}), 404

    entry = UserAnime.query.filter_by(user_id=user_id, anime_id=anime.id).first()
    if entry:
        db.session.delete(entry)
        db.session.commit()
    return jsonify({'message': 'Removed'})

@library_bp.route('/progress', methods=['POST'])
@jwt_required()
def save_progress():
    user_id = int(get_jwt_identity())
    data    = request.get_json(silent=True) or {}

    anime_slug      = data.get('anime_slug') or data.get('anime_id')
    episode_number  = data.get('episode', 1)
    season_number   = data.get('season', 1)
    watched_seconds = int(data.get('watched_seconds', 0))
    duration_seconds= int(data.get('duration_seconds', 1440))
    completed       = bool(data.get('completed', False))

    try:
        anime = _get_anime_or_404(anime_slug)
    except ValueError:
        return jsonify({'error': 'Anime not found'}), 404

    prog = WatchProgress.query.filter_by(
        user_id=user_id, anime_id=anime.id,
        season_number=season_number, episode_number=episode_number,
    ).first()

    if not prog:
        prog = WatchProgress(
            user_id=user_id, anime_id=anime.id,
            season_number=season_number, episode_number=episode_number,
        )
        db.session.add(prog)

    prog.watched_seconds  = watched_seconds
    prog.duration_seconds = duration_seconds
    prog.completed        = completed
    prog.updated_at       = datetime.utcnow()

    entry = _get_or_create_entry(user_id, anime.id)
    if entry.status == 'plan':
        entry.status = 'watching'
    if completed:
        total = WatchProgress.query.filter_by(
            user_id=user_id, anime_id=anime.id, completed=True,
        ).count() + (0 if prog.completed else 1)
        entry.progress = max(entry.progress or 0, episode_number)
        if anime.episodes_count and total >= anime.episodes_count:
            entry.status = 'completed'
            entry.progress = anime.episodes_count
    else:
        entry.progress = max(entry.progress or 0, episode_number - 1)

    db.session.commit()
    return jsonify(prog.to_dict()), 200

@library_bp.route('/continue-watching', methods=['GET'])
@jwt_required()
def continue_watching():
    user_id = int(get_jwt_identity())
    lang    = _lang()

    subq = (
        db.session.query(
            WatchProgress.anime_id,
            func.max(WatchProgress.updated_at).label('last_watched'),
        )
        .filter_by(user_id=user_id, completed=False)
        .group_by(WatchProgress.anime_id)
        .subquery()
    )

    rows = (
        db.session.query(WatchProgress, Anime)
        .join(subq, (WatchProgress.anime_id == subq.c.anime_id) &
                    (WatchProgress.updated_at == subq.c.last_watched))
        .join(Anime, Anime.id == WatchProgress.anime_id)
        .filter(WatchProgress.user_id == user_id)
        .order_by(subq.c.last_watched.desc())
        .limit(8)
        .all()
    )

    result = []
    for prog, anime in rows:
        d = anime.to_dict(lang)
        d.update({
            'episode':         prog.episode_number,
            'season':          prog.season_number,
            'total':           anime.episodes_count or '?',
            'progress':        prog.percent,
            'time':            prog._fmt_time(),
            'watched_seconds': prog.watched_seconds,
        })
        result.append(d)

    return jsonify(result)

@library_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    user_id = int(get_jwt_identity())

    counts = dict(
        db.session.query(UserAnime.status, func.count(UserAnime.id))
        .filter_by(user_id=user_id)
        .group_by(UserAnime.status)
        .all()
    )

    avg_rating = (
        db.session.query(func.avg(UserAnime.rating))
        .filter(UserAnime.user_id == user_id, UserAnime.rating.isnot(None))
        .scalar()
    )

    total_watched_seconds = (
        db.session.query(func.sum(WatchProgress.watched_seconds))
        .filter_by(user_id=user_id, completed=True)
        .scalar() or 0
    )

    total_episodes = (
        db.session.query(func.count(WatchProgress.id))
        .filter_by(user_id=user_id, completed=True)
        .scalar() or 0
    )

    return jsonify({
        'watching':    counts.get('watching',   0),
        'completed':   counts.get('completed',  0),
        'plan':        counts.get('plan',        0),
        'dropped':     counts.get('dropped',     0),
        'on_hold':     counts.get('on_hold',     0),
        'total':       sum(counts.values()),
        'avg_rating':  round(float(avg_rating), 2) if avg_rating else None,
        'hours_watched': round(total_watched_seconds / 3600, 1),
        'episodes_watched': total_episodes,
    })
