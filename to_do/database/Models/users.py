from flask import current_app, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

from ..db import db
from .oauth_providers import Oauth_providers

from sqlalchemy.dialects.mysql import INTEGER

class Users (db.Model):
    __tablename__ = 'users'

    id = db.Column(INTEGER(unsigned=True), primary_key=True)
    username = db.Column(db.NVARCHAR(50), nullable=False)
    email = db.Column(db.NVARCHAR(250))
    provided = db.Column(db.Boolean, nullable=False)
    external_id = db.Column(db.NVARCHAR(256))
    password = db.Column(db.NVARCHAR(256))

    provider_id = db.Column(INTEGER(unsigned=True), db.ForeignKey('oauth_providers.id'), nullable=True)
    provider = db.relationship('Oauth_providers', backref=db.backref('user-provider', lazy=True))

    def __init__(self, username, email= None,password=None, external_id = None, provided=False, provider=None):
        self.username = username
        self.email=email
        if password is not None:
            self.password = Users.generate_password(password)
        self.provided = provided
        self.external_id = external_id
        self.provider_id = provider

    def save(self):
        if not self.id:
            db.session.add(self)
        db.session.commit()

    def check_password(self, password):
        pwd = password + current_app.config['SECRET_KEY']
        return check_password_hash(self.password, pwd)

    @staticmethod
    def generate_password(password):
        pwd = password + current_app.config['SECRET_KEY']
        return generate_password_hash(pwd, method="pbkdf2")

    @staticmethod
    def get_by_id(user_id):
        return Users.query.get(user_id)
    
    @staticmethod
    def get_by_username_unprovided(username):
        return Users.query.filter_by(username=username, provided=False).first()
    
    @staticmethod
    def get_by_external_id(external_id, provider):
        return Users.query.filter_by(external_id=external_id, provided=True, provider_id=provider).first()
    
    @staticmethod
    def get_general_info(user_id):
        return Users.query.filter_by(id=user_id).with_entities(Users.id, Users.username).first()