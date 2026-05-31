import os
from flask import Flask, send_from_directory
from flask_cors import CORS


def create_app(env=None):
    app = Flask(__name__, static_folder='.')

    # ── Config ────────────────────────────────────────────────────────────────
    from backend.config import config_map
    cfg_key = env or os.environ.get('FLASK_ENV', 'default')
    app.config.from_object(config_map[cfg_key])

    # ── Extensions ────────────────────────────────────────────────────────────
    CORS(app)
    from backend.database import init_db
    init_db(app)

    # ── API blueprint ─────────────────────────────────────────────────────────
    from backend.api import api_bp
    app.register_blueprint(api_bp)

    # ── Static file routes ────────────────────────────────────────────────────
    @app.route('/')
    def index():
        return send_from_directory('pages', 'animemix.html')

    @app.route('/pages/<path:filename>')
    def pages(filename):
        return send_from_directory('pages', filename)

    @app.route('/components/<path:filename>')
    def components(filename):
        return send_from_directory('components', filename)

    @app.route('/scripts/<path:filename>')
    def scripts(filename):
        r = send_from_directory('scripts', filename)
        r.headers['Cache-Control'] = 'no-store'
        return r

    @app.route('/stylesheets/<path:filename>')
    def stylesheets(filename):
        return send_from_directory('stylesheets', filename)

    @app.route('/dist/<path:filename>')
    def dist(filename):
        r = send_from_directory('dist', filename)
        r.headers['Cache-Control'] = 'no-store'
        return r

    return app


# ── Entry point ───────────────────────────────────────────────────────────────
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(debug=True, port=port)
