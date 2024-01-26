from flask import current_app, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

from ..db import db
from sqlalchemy.dialects.mysql import INTEGER

class Users (db.Model):
    __tablename__ = 'users'

    id = db.Column(INTEGER(unsigned=True), primary_key=True)
    username = db.Column(db.NVARCHAR(50), unique = True, nullable=False)
    password = db.Column(db.NVARCHAR(256), nullable=False)

    def __init__(self, username, password):
        self.username = username
        self.password = password

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
    def get_by_username(username):
        return Users.query.filter_by(username)
    
    @staticmethod
    def get_general_info(user_id):
        return Users.query.filter_by(id=user_id).with_entities(Users.id, Users.username).first()