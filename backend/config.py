import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(BASE_DIR, '.env'))
except ImportError:
    pass

class Config:
    SECRET_KEY  = os.environ.get('SECRET_KEY', 'animemix-dev-secret-change-in-prod')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    @staticmethod
    def _db_url():
        url = os.environ.get('DATABASE_URL')
        if url:
            return url.replace('postgres://', 'postgresql://', 1)
        pg_user = os.environ.get('PGUSER', os.environ.get('USER', 'postgres'))
        pg_host = os.environ.get('PGHOST', 'localhost')
        pg_port = os.environ.get('PGPORT', '5432')
        pg_db   = os.environ.get('PGDATABASE', 'animemix')
        return f'postgresql://{pg_user}@{pg_host}:{pg_port}/{pg_db}'

    SQLALCHEMY_DATABASE_URI = _db_url.__func__()

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = False

class ProductionConfig(Config):
    DEBUG = False

config_map = {
    'development': DevelopmentConfig,
    'production':  ProductionConfig,
    'default':     DevelopmentConfig,
}
