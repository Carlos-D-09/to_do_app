import os

import click
from flask.cli import with_appcontext
from sqlalchemyseeder import ResolvingSeeder
from sqlalchemy.exc import SQLAlchemyError

from ..db import db
from ..Models.users import Users
from ..Models.categories import Categories

def configure_seed(app):
    app.cli.add_command(seed_db)

def seed_categories():
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        seeder = ResolvingSeeder(db.session)
        seeder.register_class(Categories)
        seeder.register_class(Users)

        seeder.load_entities_from_json_file(os.path.join(current_dir, 'categories.json'))
        db.session.commit()        
        click.echo("Categories seeded successfully")
    except SQLAlchemyError as e:
        click.echo(f"Error trying to seed categories: {e}")

def seed_users():
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        seeder = ResolvingSeeder(db.session)
        seeder.register_class(Users)

        seeder.load_entities_from_json_file(os.path.join(current_dir, 'users.json'))
        db.session.commit()        
        click.echo("Users seeded successfully")
    except SQLAlchemyError as e:
        click.echo(f"Error trying to seed users: {e}")

@click.command('seed-db')
@with_appcontext
def seed_db():
    seed_users()
    seed_categories()
