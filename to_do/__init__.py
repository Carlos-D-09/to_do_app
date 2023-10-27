import os
from flask import Flask
from . import db
from . import auth
from . import activity

def create_app():
    app = Flask(__name__)
    db.init_app(app)

    app.register_blueprint(auth.auth)
    app.register_blueprint(activity.activity)
    
    app.config.from_mapping(
        SECRET_KEY = 'dev',
        DATABASE_HOST =os.environ.get('FLASK_DATABASE_HOST'),
        DATABASE_PASSWORD =os.environ.get('FLASK_DATABASE_PASSWORD'),
        DATABASE_USER =os.environ.get('FLASK_DATABASE_USER'),
        DATABASE_PORT =os.environ.get('FLASK_DATABASE_PORT'),
        DATABASE =os.environ.get('FLASK_DATABASE')
    )

    return app

