import bcrypt
from datetime import datetime
from ..database import db


class User(db.Model):
    __tablename__ = 'users'

    id           = db.Column(db.Integer, primary_key=True)
    email        = db.Column(db.String(255), unique=True, nullable=False, index=True)
    username     = db.Column(db.String(100), unique=True, nullable=False, index=True)
    password_hash= db.Column(db.String(255), nullable=False)

    is_verified  = db.Column(db.Boolean, default=False)
    avatar_url   = db.Column(db.String(500))
    bio          = db.Column(db.Text)

    # OAuth — підготовка для Discord / Telegram
    discord_id   = db.Column(db.String(100), unique=True, nullable=True)
    telegram_id  = db.Column(db.String(100), unique=True, nullable=True)

    created_at   = db.Column(db.DateTime, default=datetime.utcnow)
    last_login   = db.Column(db.DateTime)

    # ── Password helpers ────────────────────────────────────────────────────
    def set_password(self, plain: str):
        self.password_hash = bcrypt.hashpw(
            plain.encode('utf-8'),
            bcrypt.gensalt(rounds=12),
        ).decode('utf-8')

    def check_password(self, plain: str) -> bool:
        return bcrypt.checkpw(
            plain.encode('utf-8'),
            self.password_hash.encode('utf-8'),
        )

    # ── Serialisation ───────────────────────────────────────────────────────
    def to_dict(self):
        return {
            'id':          self.id,
            'email':       self.email,
            'username':    self.username,
            'avatar':      self.avatar_url,
            'bio':         self.bio,
            'is_verified': self.is_verified,
            'created_at':  self.created_at.isoformat() if self.created_at else None,
            'has_discord': bool(self.discord_id),
            'has_telegram':bool(self.telegram_id),
        }

    def __repr__(self):
        return f'<User {self.username}>'
