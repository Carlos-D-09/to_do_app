import functools
from flask import (
    Blueprint, #Permite crear modulos configurables dentro de la aplicación
    flash, #Permite mandar mensajes de manera generica dentro de la apliación
    g, render_template, request, url_for, session, current_app, redirect
)
from werkzeug.security import check_password_hash, generate_password_hash
from to_do.db import get_db

auth = Blueprint('auth',__name__, url_prefix='/auth')

@auth.route('/register', methods=['GET','POST'])
def register():
    if request.method == "POST":
        #Start validation inputs
        username = request.form['username']
        password = request.form['password']
        if not username:
            error = "Username is required"
        if not password: 
            error = "Password is required"
        #Finish validation inputs

        #Start validation uniqueness of records
        db, c = get_db()
        error = None
        sql = 'SELECT id FROM user WHERE username = %s'
        values = [username]
        c.execute(sql, values)
        if c.fetchone() is not None: 
            error = "The user {} have been already registered." . format(username)
        #Finish validation uniqueness of records

        #Star register of user 
        if error is None:
            sql = 'INSERT INTO user (username, password) VALUES (%s, %s)'
            SALT = current_app.config['SECRET_KEY']
            hashed_pwd = generate_password_hash(password, SALT)
            values = [username, hashed_pwd]
            c.execute(sql, values)
            db.commit()

            return redirect(url_for('auth.login'))
        #Finish register of user 

        flash(error)

    return render_template('auth/register.html')

@auth.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'POST':
        #Start validation inputs
        username = request.form['username']
        password = request.form['password']
        if not username:
            error = "Username is required"
        if not password: 
            error = "Password is required"
        #Finish validation inputs
        
        #Start search of user
        db, c = get_db()
        error = None
        sql = 'SELECT * FROM user WHERE username = %s', (username,)
        c.execute(sql)
        user = c.fetchone()

        if user is None:
            error = "Invalid user or password"
        # Finish search of user
        
        #Start password validation   
        SALT = current_app.config['SECRET_KEY']
        hashed_pwd = generate_password_hash(password, SALT)
        if not check_password_hash(user['password'], hashed_pwd):
            error = "Invalid user or password"
        
        if error is None:
            session.clear()
            session['user_id'] = user['id']
            return redirect(url_for('index'))

        flash(error)
        #Finish password validation   
    return render_template('auth/login.html')
