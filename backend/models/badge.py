from ..database import db


class Badge(db.Model):
    __tablename__ = 'badges'

    id   = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(50), unique=True, nullable=False)  # hot | new | dub | simulcast

    def __repr__(self):
        return f'<Badge {self.slug}>'
