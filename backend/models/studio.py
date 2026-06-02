from ..database import db

class Studio(db.Model):
    __tablename__ = 'studios'

    id   = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    name = db.Column(db.String(200), nullable=False)

    anime = db.relationship('Anime', back_populates='studio', lazy='dynamic')

    def to_dict(self):
        return {'id': self.id, 'slug': self.slug, 'name': self.name}

    def __repr__(self):
        return f'<Studio {self.name}>'
