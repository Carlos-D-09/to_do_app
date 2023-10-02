from flask import (
    Blueprint,
    flash,
    g, render_template, request, url_for, session, current_app, redirect
)

#Función para proteger todos nuestros endpoints
from to_do.auth import login_required
from to_do.db import get_db

to_do_list = Blueprint('to_do_list', __name__, url_prefix='')

@to_do_list.route('/',methods=['GET'])
@login_required
def index():
    # db, c = get_db()
    # c.execute(
    #     'SELECT t.id, t.description, u.username, t.completed, t.created_at FROM list t JOIN user u on t.created_by = u.id order by created_at desc'
    # )
    # todo_list = c.fetchall()
    todo_list = []
    return render_template('to_do/index.html', todos=todo_list)

@to_do_list.route('create', methods=['GET','POST'])
@login_required
def create():
    return ''

@to_do_list.route('update', methods=['GET','POST'])
@login_required
def update():
    return ''