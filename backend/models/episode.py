from ..database import db


class Episode(db.Model):
    __tablename__ = 'episodes'

    id             = db.Column(db.Integer, primary_key=True)
    anime_id       = db.Column(db.Integer, db.ForeignKey('anime.id', ondelete='CASCADE'), nullable=False, index=True)
    season_number  = db.Column(db.Integer, default=1, nullable=False)
    episode_number = db.Column(db.Integer, nullable=False)

    title_uk       = db.Column(db.String(500))
    title_en       = db.Column(db.String(500))
    description_uk = db.Column(db.Text)
    description_en = db.Column(db.Text)

    duration_min   = db.Column(db.Integer, default=24)
    air_date       = db.Column(db.Date)
    thumbnail_url  = db.Column(db.String(500))
    is_filler      = db.Column(db.Boolean, default=False)

    # Relationship
    anime = db.relationship('Anime', back_populates='episodes')

    __table_args__ = (
        db.UniqueConstraint('anime_id', 'season_number', 'episode_number', name='uq_anime_episode'),
    )

    def to_dict(self, lang='uk'):
        return {
            'id':          self.id,
            'season':      self.season_number,
            'episode':     self.episode_number,
            'title':       self.title_uk if lang == 'uk' else self.title_en,
            'title_uk':    self.title_uk,
            'title_en':    self.title_en,
            'description': self.description_uk if lang == 'uk' else self.description_en,
            'duration':    self.duration_min,
            'air_date':    self.air_date.isoformat() if self.air_date else None,
            'thumbnail':   self.thumbnail_url,
            'is_filler':   self.is_filler,
        }

    def __repr__(self):
        return f'<Episode S{self.season_number}E{self.episode_number} ({self.anime_id})>'
