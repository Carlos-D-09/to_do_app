import functools
from flask import (
    Blueprint, #Permite crear modulos configurables dentro de la aplicación
    flash, #Permite mandar mensajes de manera generica dentro de la apliación
    render_template, request, url_for, session, redirect, g
)

from .database.Models.users import Users

auth = Blueprint('auth',__name__, url_prefix='/auth')

@auth.route('/register', methods=['GET','POST'])
def register():
    if request.method == "POST":
        #Validate inputs
        username = request.form['username']
        password = request.form['password']
        re_password = request.form['re_password']
        error = None

        if not username or not password or not re_password:
            error = "All inpusts are required"
        elif password != re_password:
            error = "The passwords must be the same"
        
        #Start validation uniqueness of records
        if Users.get_by_username(username):
            error = f"The user {username} has been already registered."

        #Register user 
        if error is None:
            user = Users(username, password)
            user.save()
            return redirect(url_for('auth.login'))
        
        flash(error)
    return render_template('auth/register.html')


@auth.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'POST':
        #Validate inputs
        username = request.form['username']
        password = request.form['password']
        error = None
        if not username:
            error = "Username is required"
        if not password: 
            error = "Password is required"
        
        if username == "test user": #Default user to create seed
            error = "Invalid user or password"
        else:
            #Search user
            user = Users.get_by_username(username)
            if not user:
                error = "Invalid user or password"
            else:
                #Validate password
                if not user.check_password(password):
                    error = "Invalid user or password"

        if error is None:
            session.clear()
            session['user_id'] = user.id
            session['username'] = user.username
            return redirect(url_for('activity.index'))

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
        user = Users.get_general_info(user_id)
        g.user = user

def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('auth.login'))
        
        return view(**kwargs)
    
    return wrapped_view