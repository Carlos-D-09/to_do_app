import os
from flask import Flask
from . import db
from . import auth

def create_app():
    app = Flask(__name__)
    db.init_app(app)
    app.register_blueprint(auth.auth)
    app.config.from_mapping(
        SECRET_KEY = 'dev',
        DATABASE_HOST =os.environ.get('FLASK_DATABASE_HOST'),
        DATABASE_PASSWORD =os.environ.get('FLASK_DATABASE_PASSWORD'),
        DATABASE_USER =os.environ.get('FLASK_DATABASE_USER'),
        DATABASE =os.environ.get('FLASK_DATABASE')
    )

    @app.route('/test')
    def test():
        return "Hola mundo"

    return app

