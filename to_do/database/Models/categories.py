from ..db import db

from sqlalchemy.dialects.mysql import INTEGER
from sqlalchemy import or_, func

class Categories(db.Model):
    __tablename__ = 'categories'

    id = db.Column(INTEGER(unsigned=True), primary_key=True)
    created_at = db.Column(db.TIMESTAMP, default=func.now(), nullable=False)
    name = db.Column(db.NVARCHAR(50), nullable=False)
    description = db.Column(db.NVARCHAR(250), nullable=False)

    created_by = db.Column(INTEGER(unsigned=True), db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('Users', backref=db.backref('category-user',lazy=True))

    def __init__(self, name, description, created_by):
        self.name = name
        self.description = description
        self.created_by = created_by

    def save(self):
        try:
            if not self.id:
                db.session.add(self)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            print(f"Error al guardar la categoria: {e}")
            return False
        
    def update_category(self, name, description):
        try:
            self.name = name
            self.description = description
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            print(f"Error trying to update a category: {e}")

    def delete_category(self):
        try:
            db.session.delete(self)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()  # Deshace los cambios en caso de error
            print(f"Error trying to deleting the activity: {e}")
            return False

    @staticmethod
    def get_category_object(user_id,category_id):
        return Categories.query.filter_by(created_by=user_id, id=category_id).first()

    @staticmethod
    def get_category(user_id, category_id):
        return Categories.query.with_entities(
            Categories.id, 
            Categories.name, 
            Categories.description
        ).filter(
            (Categories.created_by == user_id) &
            (Categories.id == category_id)
        ).first()._asdict()
    
    @staticmethod
    def get_categories(user_id):
        return Categories.query.with_entities(
            Categories.id, 
            Categories.name, 
        ).filter(
            or_(
                (Categories.created_by == user_id),
                (Categories.created_by == 1)
            )
        ).all()
