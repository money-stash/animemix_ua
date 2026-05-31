from ..database import db


class Genre(db.Model):
    __tablename__ = 'genres'

    id      = db.Column(db.Integer, primary_key=True)
    slug    = db.Column(db.String(100), unique=True, nullable=False)
    name_uk = db.Column(db.String(100), nullable=False)
    name_en = db.Column(db.String(100), nullable=False)

    def to_dict(self, lang='uk'):
        return {
            'slug': self.slug,
            'name': self.name_uk if lang == 'uk' else self.name_en,
            'name_uk': self.name_uk,
            'name_en': self.name_en,
        }

    def __repr__(self):
        return f'<Genre {self.slug}>'
