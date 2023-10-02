import functools
from flask import (
    Blueprint, #Permite crear modulos configurables dentro de la aplicación
    flash, #Permite mandar mensajes de manera generica dentro de la apliación
    render_template, request, url_for, session, current_app, redirect, g
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
            hashed_pwd = generate_password_hash(password+SALT)
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
        c.execute('SELECT * FROM user WHERE username = %s',(username,))
        user = c.fetchone()
        # Finish search of user

        if user is None:
            error = "Invalid user or password"
        else:
            #Start password validation   
            SALT = current_app.config['SECRET_KEY']
            if not check_password_hash(user['password'], password+SALT):
                error = "Invalid user or password"
            
            if error is None:
                session.clear()
                session['user_id'] = user['id']
                session['username'] = user['username']
                return redirect(url_for('to_do_list.index'))
            #Finish password validation   

        flash(error)    
    return render_template('auth/login.html')

@auth.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('auth.login'))

@auth.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        db, c = get_db()
        c.execute('SELECT id, username FROM user WHERE id = %s',(user_id,))
        user = c.fetchone()
        g.user = user


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('auth.login'))
        
        return view(**kwargs)
    
    return wrapped_view