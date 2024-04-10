import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from .database import db
from . import auth
from . import activity
from . import category

from .database.Models.users import Users
from .database.Models.categories import Categories
from .database.Models.activities import Activities
from .database.Seeder.seed import configure_seed

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)

    app.register_blueprint(auth.auth)
    app.register_blueprint(activity.activity)
    app.register_blueprint(category.category)

    load_dotenv()

    app.config.from_mapping(
        SECRET_KEY = os.environ.get('SECRET_KEY'),
        SGBD = os.environ.get('SGBD'),
        DATABASE_HOST =os.environ.get('DATABASE_HOST'),
        DATABASE_PASSWORD =os.environ.get('DATABASE_PASSWORD'),
        DATABASE_USER =os.environ.get('DATABASE_USER'),
        DATABASE_PORT =os.environ.get('DATABASE_PORT'),
        DATABASE = os.environ.get('DATABASE'),
        GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID'),
        GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')
    )

    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = os.environ.get('OAUTHLIB_INSECURE_TRANSPORT')

    db.configure_database(app)
    configure_seed(app)


    return app


