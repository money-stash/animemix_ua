import re
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity,
)
from ..database import db
from ..models.user import User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')

# Повертаємо i18n-ключ замість тексту — фронтенд перекладає через t()
def _validate_register(data: dict) -> str | None:
    email    = (data.get('email') or '').strip().lower()
    username = (data.get('username') or '').strip()
    password = data.get('password') or ''

    if not email or not username or not password:
        return 'authErrRequired'
    if not EMAIL_RE.match(email):
        return 'authErrBadEmail'
    if len(username) < 3:
        return 'authErrNickShort'
    if len(username) > 32:
        return 'authErrNickLong'
    if not re.match(r'^[\w.-]+$', username):
        return 'authErrNickChars'
    if len(password) < 8:
        return 'authErrPassShort'
    return None


# ── Register ─────────────────────────────────────────────────────────────────

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    err_key = _validate_register(data)
    if err_key:
        return jsonify({'error_key': err_key}), 400

    email    = data['email'].strip().lower()
    username = data['username'].strip()
    password = data['password']

    if User.query.filter_by(email=email).first():
        return jsonify({'error_key': 'authErrEmailTaken'}), 409
    if User.query.filter_by(username=username).first():
        return jsonify({'error_key': 'authErrNickTaken'}), 409

    user = User(email=email, username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    access  = create_access_token(identity=user.id)
    refresh = create_refresh_token(identity=user.id)

    return jsonify({
        'user':          user.to_dict(),
        'access_token':  access,
        'refresh_token': refresh,
    }), 201


# ── Login ─────────────────────────────────────────────────────────────────────

@auth_bp.route('/login', methods=['POST'])
def login():
    data     = request.get_json(silent=True) or {}
    email    = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify({'error_key': 'authErrRequired2'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error_key': 'authErrInvalid'}), 401

    user.last_login = datetime.utcnow()
    db.session.commit()

    access  = create_access_token(identity=user.id)
    refresh = create_refresh_token(identity=user.id)

    return jsonify({
        'user':          user.to_dict(),
        'access_token':  access,
        'refresh_token': refresh,
    })


# ── Refresh token ─────────────────────────────────────────────────────────────

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    access  = create_access_token(identity=user_id)
    return jsonify({'access_token': access})


# ── Me ────────────────────────────────────────────────────────────────────────

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({'error_key': 'authErrNotFound'}), 404
    return jsonify(user.to_dict())


# ── Logout ────────────────────────────────────────────────────────────────────

@auth_bp.route('/logout', methods=['POST'])
@jwt_required(optional=True)
def logout():
    return jsonify({'message': 'ok'})
