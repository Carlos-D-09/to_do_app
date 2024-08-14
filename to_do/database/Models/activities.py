from ..db import db
from .users import Users
from .categories import Categories

from sqlalchemy.dialects.mysql import INTEGER
from sqlalchemy import func, extract, or_, update

class Activities(db.Model):
    __tablename__ = 'activities'

    id = db.Column(INTEGER(unsigned=True), primary_key=True)
    created_at = db.Column(db.TIMESTAMP, default=func.now(), nullable=False)
    name = db.Column(db.NVARCHAR(50), nullable=False)
    description = db.Column( db.NVARCHAR(250), nullable=False)
    completed = db.Column(db.Boolean, nullable=False)
    important = db.Column(db.Boolean, nullable=False)
    end_at = db.Column(db.TIMESTAMP)

    created_by = db.Column(INTEGER(unsigned=True), db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('Users', backref=db.backref('activity-user',lazy=True))

    category_id = db.Column(INTEGER(unsigned=True), db.ForeignKey('categories.id'), nullable=False)
    category = db.relationship('Categories', backref=db.backref('category-user',lazy=True))

    def __init__(self, name, description, important, end_at, category_id, user_id):
        self.name = name
        self.description = description
        self.completed = 0
        self.important = important
        self.end_at = end_at
        self.category_id = category_id
        self.created_by = user_id

    def save(self):
        try:
            if not self.id:
                db.session.add(self)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            print(f"Error trying to create the activity: {e}")
            return False

    def update_activity(self, name, description, completed, category, important, end_at):
        try:
            self.name = name
            self.description = description
            self.completed = completed
            self.category_id = category
            self.important = important
            self.end_at = end_at
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            print(f"Error trying to update the activity: {e}")
            return False
        
    def update_activity_tags(self, completed, important):
        try:
            self.completed = completed
            self.important = important
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            print(f"Error trying to update the activity tags: {e}")
            return False

    def delete_activity(self):
        try:
            db.session.delete(self)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()  # Deshace los cambios en caso de error
            print(f"Error trying to deleting the activity: {e}")
            return False

    @staticmethod
    def get_activity_object(user_id,activity_id):
        return Activities.query.filter_by(id=activity_id, created_by=user_id).first()

    @staticmethod
    def get_activity(user_id, activity_id):
        return Activities.query.with_entities(
            Activities.id, 
            Activities.name, 
            Activities.description, 
            Activities.completed, 
            Activities.category_id,
            Categories.name.label('category'),
            func.date_format(Activities.end_at, '%d-%m-%Y at %H:%i').label('end_at'),
            Activities.created_at, 
            Activities.completed, 
            Activities.important
            ).join(
                Categories, Activities.category_id == Categories.id
            ).filter(
                (Activities.created_by == user_id) & 
                (Activities.id == activity_id)
            ).first()._asdict()

    @staticmethod
    def get_activities(user_id):
        return Activities.query.with_entities(
            Activities.id, 
            Activities.name, 
            Activities.description, 
            Activities.completed, 
            Categories.name.label('category'),
            func.date_format(Activities.end_at, '%d-%m-%Y at %H:%i').label('end_at'),
            Activities.created_at, 
            Activities.completed, 
            Activities.important
            ).join(
                Categories, Activities.category_id == Categories.id
            ).filter(
                Activities.created_by == user_id
            ).order_by(
                func.coalesce(Activities.end_at,'9999-12-31').asc()
            ).all()

    @staticmethod
    def get_planned_activities(user_id):
        current_year = func.extract('year',func.current_timestamp())
        current_month = func.extract('month', func.current_timestamp())
        current_day = func.extract('day',func.current_timestamp())
        return Activities.query.with_entities(
            Activities.id,
            Activities.name,
            Activities.description,
            Activities.completed,
            Categories.name.label('category'),
            func.date_format(Activities.end_at, '%d-%m-%Y at %H:%i').label('end_at'),
            Activities.created_at, 
            Activities.important
        ).join(
            Categories, Activities.category_id == Categories.id
        ).filter(            
            or_(
                (extract('year', Activities.end_at) >= current_year) &
                (extract('month', Activities.end_at) > current_month) &
                (Activities.created_by == user_id) &
                (Activities.completed == False), 
                (extract('year',Activities.end_at) == current_year) &
                (extract('month',Activities.end_at) == current_month) &
                (extract('day',Activities.end_at) >= current_day) &
                (Activities.created_by == user_id) & 
                (Activities.completed == False),
                (Activities.created_by == user_id) &
                (Activities.end_at == None) &
                (Activities.completed == False)
            )
        ).order_by(
            func.coalesce(Activities.end_at,'"9999-12-31"').asc()
        ).all()
    
    @staticmethod
    def get_today_activities(user_id):

        current_year = func.extract('year',func.current_timestamp())
        current_month = func.extract('month', func.current_timestamp())
        current_day = func.extract('day',func.current_timestamp())

        return Activities.query.with_entities(
            Activities.id,
            Activities.name,
            Activities.description,
            Activities.completed,
            Categories.name.label('category'),
            func.date_format(Activities.end_at, '%d-%m-%Y at %H:%i').label('end_at'),
            Activities.created_at, 
            Activities.important
        ).join(
            Categories, Activities.category_id == Categories.id
        ).filter(
            or_(
                (extract('year',Activities.end_at) > current_year) &
                (extract('month', Activities.end_at) > current_month) &
                (extract('day', Activities.end_at) == current_day) &
                (Activities.created_by == user_id) &
                (Activities.completed == False),
                (Activities.created_by == user_id) &
                (Activities.end_at == None) &
                (Activities.completed == False)
            )
        ).order_by(
            func.coalesce(Activities.end_at,'"9999-12-31"').asc()
        ).all()
    
    @staticmethod
    def get_important_activities(user_id):
        return Activities.query.with_entities(
            Activities.id,
            Activities.name,
            Activities.description,
            Activities.completed,
            Categories.name.label('category'),
            func.date_format(Activities.end_at, '%d-%m-%Y at %H:%i').label('end_at'),
            Activities.created_at, 
            Activities.important
        ).join(
            Categories, Activities.category_id == Categories.id
        ).filter(
            (Activities.created_by == user_id) &
            (Activities.important == True) &
            (Activities.completed == False)
        ).order_by(
            func.coalesce(Activities.end_at,'"9999-12-31"').asc()
        ).all()
    
    @staticmethod
    def get_completed_activities(user_id):
        return Activities.query.with_entities(
            Activities.id,
            Activities.name,
            Activities.description,
            Activities.completed,
            Categories.name.label('category'),
            func.date_format(Activities.end_at, '%d-%m-%Y at %H:%i').label('end_at'),
            Activities.created_at, 
            Activities.important
        ).join(
            Categories, Activities.category_id == Categories.id
        ).filter(
            (Activities.created_by == user_id) &
            (Activities.completed == True)
        ).order_by(
            func.coalesce(Activities.end_at,'"9999-12-31"').asc()
        ).all()
    
    @staticmethod
    def get_activities_by_category(category_id, user_id):
        return Activities.query.with_entities(
            Activities.id,
            Activities.name,
            Activities.description,
            Activities.completed,
            Categories.name.label('category'),
            func.date_format(Activities.end_at, '%d-%m-%Y at %H:%i').label('end_at'),
            Activities.created_at, 
            Activities.important
        ).join(
            Categories, Activities.category_id == Categories.id
        ).filter(
            (Categories.id == category_id) &
            (Activities.created_by == user_id)
        ).order_by(
            func.coalesce(Activities.end_at,'"9999-12-31"').asc()
        ).all()
    
    @staticmethod
    def set_all_activities_undefined(user_id, category_id):
        try:
            update_statement = (
                update(Activities)
                .where((Activities.created_by == user_id) & (Activities.category_id == category_id))
                .values(category_id=1)
            )
            db.session.execute(update_statement)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            print(f"Error trying to set undefined as category: {e}")
            return False

    

