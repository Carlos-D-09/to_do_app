import os
from dotenv import load_dotenv
from flask import Flask
from . import db
from . import auth
from . import activity
from . import category

def create_app():
    app = Flask(__name__)
    db.init_app(app)

    app.register_blueprint(auth.auth)
    app.register_blueprint(activity.activity)
    app.register_blueprint(category.category)

    load_dotenv()
    
    app.config.from_mapping(
        SECRET_KEY = os.environ.get('SECRET_KEY'),
        DATABASE_HOST =os.environ.get('DATABASE_HOST'),
        DATABASE_PASSWORD =os.environ.get('DATABASE_PASSWORD'),
        DATABASE_USER =os.environ.get('DATABASE_USER'),
        DATABASE_PORT =os.environ.get('DATABASE_PORT'),
        DATABASE =os.environ.get('DATABASE')
    )

    return app