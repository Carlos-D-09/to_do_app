from ..db import db

from sqlalchemy.dialects.mysql import INTEGER
from sqlalchemy import func

class Oauth_providers(db.Model):
    __tablename__ = 'oauth_providers'

    id = db.Column(INTEGER(unsigned=True), primary_key=True)
    name = db.Column(db.NVARCHAR(100), nullable=False)
    registered_at = db.Column(db.TIMESTAMP, default=func.now(), nullable=False)

    def __init__(self, name):
        self.name = name
    
    def save(self):
        try:
            if not self.id:
                db.session.add(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Error al guardar el proveedor de autenticación: {e}")
            return False
        
    def delete(self):
        try:
            db.session.delete(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Error al tratar de eliminar un proveeder: {e}")
            return False
    
    @staticmethod        
    def get_provider(name):
        return Oauth_providers.query.filter_by(name=name).first()