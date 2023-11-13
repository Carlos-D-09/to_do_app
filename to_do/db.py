import mysql.connector 
import click
from flask import current_app, g
from flask.cli import with_appcontext
from .schema import tables, seeder

#Connect with the database
def get_db():
    if 'db' not in g:
        try:
            g.db = mysql.connector.connect(
                host = current_app.config['DATABASE_HOST'],
                user = current_app.config['DATABASE_USER'],
                password = current_app.config['DATABASE_PASSWORD'],
                database = current_app.config['DATABASE'],
                port = current_app.config['DATABASE_PORT']
            )
            g.cursor = g.db.cursor(dictionary = True)
            # print('Connected to db')
            return g.db, g.cursor
        except mysql.connector.Error as err:
            print('Error: Unable to connect with database. {}'.format(err))
    
    return g.db, g.cursor



#Close database connection
def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

#Execute commands for create database tables 
def init_db():
    db, cursor = get_db()
    
    for i in tables:
        cursor.execute(i)

    db.commit()

def db_seed():
    db, cursor = get_db()

    for i in seeder:
        cursor.execute(i)
    
    db.commit()


@click.command('seed-db') #Command for execute from terminal the db seeding 
@with_appcontext
def seed_db_command(): #Seed a fresh installation for the database. 
    db_seed()
    click.echo("Base de datos poblada")

@click.command('init-db') #Command for execute from terminal the db creation
@with_appcontext
def init_db_command(): #Create a fresh installation for the database. 
    init_db()
    click.echo("Base de datos inicializada")


def init_app(app):
    # teardown_appcontext se ejecuta cuando se termina la ejeución de algún método en la aplicación de flask
    app.teardown_appcontext(close_db)
    # Permite ejecutar la función init_db_command() y seed_db_command() cuando se ejecuta la aplicación de flask
    app.cli.add_command(init_db_command)
    app.cli.add_command(seed_db_command)

