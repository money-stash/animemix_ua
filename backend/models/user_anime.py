from datetime import datetime
from ..database import db

class UserAnime(db.Model):
    __tablename__ = 'user_anime'

    id       = db.Column(db.Integer, primary_key=True)
    user_id  = db.Column(db.Integer, db.ForeignKey('users.id',  ondelete='CASCADE'), nullable=False, index=True)
    anime_id = db.Column(db.Integer, db.ForeignKey('anime.id',  ondelete='CASCADE'), nullable=False, index=True)

    status   = db.Column(db.String(20), nullable=False, default='plan')
    rating   = db.Column(db.Float)
    progress = db.Column(db.Integer, default=0)
    notes    = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user  = db.relationship('User',  backref=db.backref('library',  lazy='dynamic', cascade='all,delete-orphan'))
    anime = db.relationship('Anime', backref=db.backref('in_lists', lazy='dynamic'))

    __table_args__ = (
        db.UniqueConstraint('user_id', 'anime_id', name='uq_user_anime'),
    )

    def to_dict(self, lang='uk'):
        return {
            'anime':      self.anime.to_dict(lang) if self.anime else None,
            'status':     self.status,
            'rating':     self.rating,
            'progress':   self.progress,
            'notes':      self.notes,
            'added_at':   self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f'<UserAnime user={self.user_id} anime={self.anime_id} status={self.status}>'

class WatchProgress(db.Model):
    __tablename__ = 'watch_progress'

    id              = db.Column(db.Integer, primary_key=True)
    user_id         = db.Column(db.Integer, db.ForeignKey('users.id',  ondelete='CASCADE'), nullable=False, index=True)
    anime_id        = db.Column(db.Integer, db.ForeignKey('anime.id',  ondelete='CASCADE'), nullable=False, index=True)
    episode_id      = db.Column(db.Integer, db.ForeignKey('episodes.id', ondelete='SET NULL'), nullable=True)

    season_number   = db.Column(db.Integer, default=1, nullable=False)
    episode_number  = db.Column(db.Integer, nullable=False)
    watched_seconds = db.Column(db.Integer, default=0)
    duration_seconds= db.Column(db.Integer, default=1440)
    completed       = db.Column(db.Boolean, default=False)

    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user  = db.relationship('User',  backref=db.backref('progress', lazy='dynamic', cascade='all,delete-orphan'))
    anime = db.relationship('Anime', backref=db.backref('progress', lazy='dynamic'))

    __table_args__ = (
        db.UniqueConstraint('user_id', 'anime_id', 'season_number', 'episode_number',
                            name='uq_watch_progress'),
    )

    @property
    def percent(self):
        if not self.duration_seconds:
            return 0
        return round(self.watched_seconds / self.duration_seconds, 3)

    def to_dict(self):
        return {
            'anime_id':       self.anime_id,
            'season':         self.season_number,
            'episode':        self.episode_number,
            'watched_seconds':self.watched_seconds,
            'duration_seconds':self.duration_seconds,
            'progress':       self.percent,
            'completed':      self.completed,
            'time_str':       self._fmt_time(),
            'updated_at':     self.updated_at.isoformat() if self.updated_at else None,
        }

    def _fmt_time(self):
        def fmt(s): m, sec = divmod(s or 0, 60); return f'{m:02d}:{sec:02d}'
        return f'{fmt(self.watched_seconds)} / {fmt(self.duration_seconds)}'

    def __repr__(self):
        return f'<WatchProgress user={self.user_id} anime={self.anime_id} S{self.season_number}E{self.episode_number}>'
