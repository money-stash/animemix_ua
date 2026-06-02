from datetime import datetime
from ..database import db

anime_genres = db.Table(
    'anime_genres',
    db.Column('anime_id',  db.Integer, db.ForeignKey('anime.id',  ondelete='CASCADE'), primary_key=True),
    db.Column('genre_id',  db.Integer, db.ForeignKey('genres.id', ondelete='CASCADE'), primary_key=True),
)

anime_badges = db.Table(
    'anime_badges',
    db.Column('anime_id',  db.Integer, db.ForeignKey('anime.id',   ondelete='CASCADE'), primary_key=True),
    db.Column('badge_id',  db.Integer, db.ForeignKey('badges.id',  ondelete='CASCADE'), primary_key=True),
)

class Anime(db.Model):
    __tablename__ = 'anime'

    id         = db.Column(db.Integer, primary_key=True)
    slug       = db.Column(db.String(200), unique=True, nullable=False, index=True)

    title_uk   = db.Column(db.String(500), nullable=False)
    title_en   = db.Column(db.String(500), nullable=False)
    title_jp   = db.Column(db.String(500))

    year            = db.Column(db.Integer, index=True)
    episodes_count  = db.Column(db.Integer)
    rating          = db.Column(db.Float, index=True)
    status          = db.Column(db.String(50), index=True)
    age_rating      = db.Column(db.String(10))
    source          = db.Column(db.String(100))
    runtime         = db.Column(db.String(20))

    season_uk  = db.Column(db.String(100))
    season_en  = db.Column(db.String(100))

    synopsis_uk = db.Column(db.Text)
    synopsis_en = db.Column(db.Text)

    cover_url  = db.Column(db.String(500))
    palette    = db.Column(db.JSON)
    accent     = db.Column(db.String(20))

    studio_id  = db.Column(db.Integer, db.ForeignKey('studios.id'), index=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    studio   = db.relationship('Studio', back_populates='anime')
    genres   = db.relationship('Genre',  secondary=anime_genres, lazy='joined')
    badges   = db.relationship('Badge',  secondary=anime_badges, lazy='joined')
    episodes = db.relationship(
        'Episode', back_populates='anime',
        lazy='dynamic',
        order_by='Episode.season_number, Episode.episode_number',
        cascade='all, delete-orphan',
    )

    def to_dict(self, lang='uk', include_episodes=False):
        d = {
            'id':       self.slug,
            'slug':     self.slug,
            'title':    self.title_uk  if lang == 'uk' else self.title_en,
            'title_uk': self.title_uk,
            'title_en': self.title_en,
            'titleEn':  self.title_en,
            'titleJp':  self.title_jp,
            'year':     self.year,
            'ep':       self.episodes_count,
            'rating':   self.rating,
            'status':   self.status,
            'genres':   [g.slug for g in self.genres],
            'genreNames': [g.name_uk if lang == 'uk' else g.name_en for g in self.genres],
            'studio':   self.studio.name if self.studio else None,
            'age':      self.age_rating,
            'synopsis': self.synopsis_uk if lang == 'uk' else self.synopsis_en,
            'synopsis_uk': self.synopsis_uk,
            'synopsis_en': self.synopsis_en,
            'badges':   [b.slug for b in self.badges],
            'runtime':  self.runtime,
            'season':   self.season_uk if lang == 'uk' else self.season_en,
            'season_uk': self.season_uk,
            'season_en': self.season_en,
            'palette':  self.palette or [],
            'accent':   self.accent,
            'cover':    self.cover_url,
        }
        if include_episodes:
            d['episodesList'] = [e.to_dict(lang) for e in self.episodes]
        return d

    def __repr__(self):
        return f'<Anime {self.slug}>'
