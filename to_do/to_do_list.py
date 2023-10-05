from flask import (
    Blueprint,
    flash,
    g, render_template, request, url_for, redirect, abort
)

#Función para proteger todos nuestros endpoints
from to_do.auth import login_required
from to_do.db import get_db

to_do_list = Blueprint('to_do_list', __name__, url_prefix='')

# Start declaration of MySQL commandas

#Returns all the task that belgons to the logged user and also return the usrename
def getAllTodo():
    db, c = get_db()
    c.execute(
        'SELECT t.id, t.description, u.username, t.completed, t.created_at FROM list t'
        ' JOIN user u on t.created_by = u.id' 
        ' WHERE t.created_by = %s order by created_at desc',
        (g.user['id'],)
    )
    return c.fetchall()

#Return the requested task only if it belongs to the logged user. 
def getTodo(todo_id):
    db, c = get_db()
    c.execute(
        'SELECT t.id, t.description, u.username, t.completed, t.created_at FROM list t JOIN user u on t.created_by = u.id WHERE t.id = %s', (todo_id,)
    )
    todo = c.fetchone()
    if todo is None:
        abort(404, "The task doesn't exist")

    return todo

#Verify if exist the task and if it belongs to the logged user. 
def checkTodo(todo_id):
    db, c = get_db()
    c.execute('SELECT id FROM list WHERE id = %s and created_by = %s',(todo_id, g.user['id']))

    if c.fetchone() is None:
        abort(404, "The task doesn't exist")
    
    return True
    
#Update a task 
def updateTodo(description, completed, todo_id):
    if checkTodo(todo_id):
        db, c = get_db()
        c.execute('UPDATE list SET description=%s, completed=%s WHERE id=%s',(description,completed,todo_id))
        db.commit()
    
    return True

#Delete a task 
def deleteTodo(todo_id):
    if checkTodo(todo_id):
        db, c = get_db()
        c.execute('DELETE FROM list WHERE id = %s',(todo_id,))
        db.commit()

    return True

#Create a task 
def createTodo(description):
    db, c = get_db()
    c.execute('INSERT INTO list (created_by, description, completed) VALUES(%s,%s,%s)',
                (g.user['id'], description, False)
    )
    db.commit()
# Finish declaration of MySQL commandas


@to_do_list.route('/',methods=['GET'])
@login_required
def index():
    todo_list = getAllTodo()
    return render_template('to_do/index.html', todos=todo_list)

@to_do_list.route('/create', methods=['GET','POST'])
@login_required
def create():
    if request.method == "POST":
        description = request.form['description']
        error = None
        if not description:
            error = "Description is required"
        if error is not None:
            flash(error)
        else:
            createTodo(description)
            return redirect(url_for('to_do_list.index'))

    return render_template('to_do/create.html')

@to_do_list.route('/<int:todo_id>/update', methods=['GET','POST'])
@login_required
def update(todo_id):
    if request.method == "POST":
        description = request.form['description']
        completed = True if request.form.get('completed') == 'on' else False
        error = None
        
        if not description: 
            error = "Description is required"
        
        if error is not None:
            flash(error)
        else:
            updateTodo(description, completed, todo_id)
            return redirect(url_for('to_do_list.index'))
    
    todo_item = getTodo(todo_id)
    return render_template('to_do/update.html',todo = todo_item)

@to_do_list.route('/<int:todo_id>/delete',methods=['POST'])
@login_required
def delete(todo_id):
    if request.method == "POST":
        if deleteTodo(todo_id):
            todo_list = getAllTodo()
            return redirect(url_for('to_do_list.index'))
