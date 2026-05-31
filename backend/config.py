import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'animemix-dev-secret')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Default → SQLite for local dev; set DATABASE_URL env var for PostgreSQL
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        f'sqlite:///{os.path.join(BASE_DIR, "animemix.db")}'
    )
    # For PostgreSQL in production, DATABASE_URL looks like:
    # postgresql://user:password@host:5432/animemix


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = False  # set True to log SQL queries


class ProductionConfig(Config):
    DEBUG = False


config_map = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig,
}
