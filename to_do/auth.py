import functools
import secrets
import requests
from urllib.parse import urlencode
from flask import (
    Blueprint, #Permite crear modulos configurables dentro de la aplicación
    flash, #Permite mandar mensajes de manera generica dentro de la apliación
    render_template, request, url_for, session, redirect, g, current_app, abort, jsonify
)
from .database.Models.users import Users
from .database.Models.oauth_providers import Oauth_providers

auth = Blueprint('auth',__name__, url_prefix='/auth')

@auth.route('/register', methods=['GET','POST'])
def register():
    if request.method == "POST":
        #Validate inputs
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        error = None

        if not username or not password or not email:
            error = "Todos los campos son requeridos"
        
        #Start validation uniqueness of records
        if Users.get_by_username_unprovided(username):
            error = f"El nombre {username} ya esta en uso."
        
        if Users.get_by_email(email):
            error = f"El correo electrónico {email} ya esta en uso."

        #Register user 
        if error is None:
            user = Users(username, email, password, False)
            user.save()
            return render_template(('auth/login.html'), username=username)
    
        return render_template('auth/register.html', error=error, username=username, email=email, password=password)
        
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
            error = "Nombre de usuario o contraseña invalidos"
        else:
            #Search user
            user = Users.get_by_username_unprovided(username)
            if not user:
                error = "Nombre de usuario o contraseña invalidos"
            else:
                #Validate password
                if not user.check_password(password):
                    error = "Nombre de usuario o contraseña invalidos"

        if error is None:
            session.clear()
            session['user_id'] = user.id
            session['username'] = user.username
            return redirect(url_for('activity.index'))

           
        return render_template('auth/login.html', error=error, username=username, password=password)
    
    return render_template('auth/login.html')

@auth.route('/login/provider/<provider>', methods=['GET'])
def login_provider(provider):
    if request.method == 'GET':
        
        #Get provider
        provider_data = current_app.config['OAUTH2_PROVIDERS'].get(provider)
        if provider_data is None:
            error = f"No contamos con soporte para iniciar sesión con cuentas de {provider}"
            return render_template('auth/login.html', error = error)

        # generate a random string for the state parameter
        session['oauth2_state'] = secrets.token_urlsafe(16)

        #OAuth parameters
        oauth_string = urlencode({
            'client_id': provider_data['client_id'],
            'redirect_uri': url_for('auth.login_provider_authorized', provider=provider, _external=True),
            'response_type': 'code',
            'scope': ' ' . join(provider_data['scopes']),
            'state': session['oauth2_state'],
            'code_challenge': '47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU'
        })
        
        #Redirect to provider authorization page
        return redirect(provider_data['authorize_url']+'?'+ oauth_string)

@auth.route('/login/provider/<provider>/authorized')
def login_provider_authorized(provider):

    provider_data = current_app.config['OAUTH2_PROVIDERS'].get(provider)
    if provider_data is None:
        return jsonify({'success':False, 'error': f"No contamos con soporte para iniciar sesión con cuentas de {provider}"})

    #Check authentications errors
    if 'error' in request.args:
        for k, v in request.args.items():
            if k.startswith('error'):
                print(f'{k}: {v}')
                error = f"No podemos contactar con {provider}; porfavor, intente más tarde"
            return redirect(url_for('auth.login', error = error))

    #Check coincidence with oauth state
    if request.args['state'] != session.get('oauth2_state'):
        print('There is a mistake with the returned state')
        error = "No podemos contactar con {provider}; porfavor, intente más tarde"
        return render_template('auth/login.html', error = error)

    #Check authorization code
    code = request.args['code']
    if not code:
        print("The reqeust didn't receive an authorization code")
        error = f"No podemos contactar con {provider}; porfavor, intente más tarde"
        return render_template('auth/login.html', error = error)

    #Echaneg auth code for a token access
    result, token = exchange_code_token(provider, provider_data, code)

    if result == False:
        error = f"No podemos contactar con {provider}; porfavor, intente más tarde"
        return render_template('auth/login.html', error = error)


    #Use access token to get user info
    response = requests.get(provider_data['userinfo']['url'], headers={
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json'
    })

    response = response.json()

    if response.get('error') is not None:
        print(response.get('error'))
        error = "No pudimos recuperar tu información, intenta más tarde"
        return render_template('auth/login.html', error = error)

    email = provider_data['userinfo']['email'](response)
    name = provider_data['userinfo']['name'](response)
    external_id = provider_data['userinfo']['user_external_id'](response)

    user = check_provided_user(name, email, provider, external_id)
    
    if user: 
        session.clear()
        session['user_id'] = user.id
        session['username'] = user.username
        return redirect(url_for('activity.index'))
    
    else:
        error = f"No contamos con soporte para iniciar sesión con cuentas de {provider}"
        return render_template('auth/login.html', error = error)


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

def exchange_code_token(provider, provider_data, code):
    #Exchange the authorization code for an access token
    headers = {
        'Accept': 'application/json',
        'Origin': 'http://localhost:500',
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    data={
        'client_id': provider_data['client_id'],
        'code': code,
        'grant_type': 'authorization_code',
        'code_verifier': '47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU',
        'response_type': 'code',
        'redirect_uri': url_for('auth.login_provider_authorized', provider=provider, _external=True)
    }

    if provider == 'google':
        data['client_secret'] = provider_data['client_secret']

    if provider == 'github':
        data['client_secret'] = provider_data['client_secret']

    response = requests.post(
        provider_data['token_url'], 
        data,
        headers=headers
    )

    response = response.json()
    token = None

    if response.get('error') is not None:
        print(response.get('error_description'))
        return False, "We couln't retrieve your info, please try again later"
    else:
        token = response.get('access_token')
        if token is None:
            print("We didn't receive an access token")
            return False, "We couln't retrieve your info, please try again later"

        return True, token
    
#Check if exist a register with the name and provider received. In case it exist return it, 
#in ohter case create the user and return
def check_provided_user(name, email, provider, external_id):
    prov = Oauth_providers.get_provider(provider)

    print(prov, provider)
    if not prov: 
        return False
    
    user = Users.get_by_external_id(external_id, prov.id)

    if not user:
        user = Users(name, email, '', external_id, True, prov.id)
        user.save()
        return user

    user.name = name
    user.email = email
    user.save()

    return user