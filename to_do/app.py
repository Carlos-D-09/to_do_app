import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from database import db
import auth
import activity
import category

from database.Models.users import Users
from database.Models.categories import Categories
from database.Models.activities import Activities
from database.Seeder.seed import configure_seed

dotenv_path ='/srv/http/toDo/.env'
load_dotenv(dotenv_path)

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True, origins='*', resources= "/*")

    app.register_blueprint(auth.auth)
    app.register_blueprint(activity.activity)
    app.register_blueprint(category.category)

    app.config.from_mapping(
        APP_EMAIL = os.environ.get('APP_EMAIL'),
        APP_EMAIL_PASSWORD = os.environ.get('APP_EMAIL_PASSWORD'),
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

    set_oauth_providers(app)

    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = os.environ.get('OAUTHLIB_INSECURE_TRANSPORT')
    os.environ['AUTHLIB_INSECURE_TRANSPORT'] = os.environ.get('AUTHLIB_INSECURE_TRANSPORT')

    db.configure_database(app)
    configure_seed(app)


    return app

def set_oauth_providers(app):
    app.config['OAUTH2_PROVIDERS'] = {
        #Scopes information retrived from: 
        #https://developers.google.com/identity/protocols/oauth2/scopes?hl=es-419
        # Google OAuth 2.0 documentation:
        # https://developers.google.com/identity/protocols/oauth2/web-server#httprest

        'google': {
            'client_id': os.environ.get('GOOGLE_CLIENT_ID'),
            'client_secret': os.environ.get('GOOGLE_CLIENT_SECRET'),
            'authorize_url': 'https://accounts.google.com/o/oauth2/auth',
            'token_url': 'https://accounts.google.com/o/oauth2/token',
            'userinfo': {
                'url': 'https://www.googleapis.com/oauth2/v3/userinfo',
                'email': lambda json: json['email'],
                'name': lambda json: json['name'],
                'user_external_id': lambda json: json['sub'],
            },
            'scopes':  ['openid', 'email', 'profile'],
        },

        #Scopes information retrived from:
        #https://learn.microsoft.com/en-us/graph/api/resources/users?view=graph-rest-1.0
        #Microsoft OAuth 2.0 documentation: 
        #https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols

        'microsoft': {
            'client_id': os.environ.get('MICROSOFT_DIRECTORY_CLIENT_ID'),
            'app_id': os.environ.get('MICROSOFT_APP_ID'),
            'authorize_url': 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
            'token_url': 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            'userinfo': {
                'url': 'https://graph.microsoft.com/v1.0/me',
                'email': lambda json: json['mail'],
                'name': lambda json: json['givenName'],
                'user_external_id': lambda json: json['id']
            },
            'scopes':  ['openid', 'User.Read'],
        },

        #Scopers information retrieved from: 
        #https://docs.github.com/es/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps
        #Github Oauth documentation: 
        #https://docs.github.com/es/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app

        'github': {
            'client_id': os.environ.get('GITHUB_CLIENT_ID'),
            'client_secret': os.environ.get('GITHUB_CLIENT_SECRET'),
            'authorize_url': 'https://github.com/login/oauth/authorize',
            'token_url': 'https://github.com/login/oauth/access_token',
            'userinfo': {
                'url': 'https://api.github.com/user',
                'name': lambda json: json['name'],
                'email': lambda json: json['email'],
                'user_external_id': lambda json: json['id']
            },
            'scopes':  ['user', 'user:email'],
        },

    }
