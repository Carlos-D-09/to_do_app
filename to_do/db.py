import mysql.connector 
import click
from flask import current_app, g
from flask.cli import with_appcontext
from .schema import instructions 

#Connect with the database
def get_db():
    if 'db' not in g:
        try:
            g.db = mysql.connector.connect(
                host = current_app.config['DATABASE_HOST'],
                user = current_app.config['DATABASE_USER'],
                password = current_app.config['DATABASE_PASSWORD'],
                database = current_app.config['DATABASE']

            )
            g.cursor = g.db.cursor(dictionary = True)
            print('Connected to db')
            return g.db, g.cursor
        except:
            print('Unable to connect with database')



#Close database connection
def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

#Execute commands for create database tables 
def init_db():
    db, cursor = get_db()
    
    for i in instructions:
        cursor.execute(i)

    db.commit()

@click.command('init-db') #Command for execute from terminal the db creation
@with_appcontext
def init_db_command(): #Create a fresh installation for the database. 
    init_db()
    click.echo("Base de datos inicializada")

def init_app(app):
    # teardown_appcontext se ejecuta cuando se termina la ejeución de algún método en la aplicación de flask
    app.teardown_appcontext(close_db)
    # Permite ejecutar la función init_db_command() cuando se ejecuta la aplicación de flask
    app.cli.add_command(init_db_command)

