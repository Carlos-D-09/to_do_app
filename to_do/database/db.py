import logging
from sqlalchemy.exc import SQLAlchemyError
from flask.cli import with_appcontext
from flask_sqlalchemy import SQLAlchemy
import click

db = SQLAlchemy()

def configure_database(app):
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    sgbd = app.config['SGBD']
    db_host = app.config['DATABASE_HOST']
    db_port = app.config['DATABASE_PORT']
    db_user = app.config['DATABASE_USER']
    db_pwd = app.config['DATABASE_PASSWORD']
    db_name = app.config['DATABASE']

    app.config['SQLALCHEMY_DATABASE_URI'] = sgbd + '://' + db_user + ':' + db_pwd +'@' + db_host + ':' + db_port + '/' + db_name

    app.cli.add_command(init_db_command)
    
    db.init_app(app)

@click.command('init-db') #Command for execute from terminal the db creation
@with_appcontext
def init_db_command(): #Create a fresh installation for the database. 
    try:
        db.drop_all()
        db.create_all()
        click.echo("Base de datos inicializada")
    except SQLAlchemyError as e:
        logging.error(f"Error al inicializar la base de datos: {e}")
        click.echo("Error al inicializar la base de datos")
