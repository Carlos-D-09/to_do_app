from flask import (
    Blueprint,
    flash,
    g, render_template, request, url_for, redirect, abort
)
from to_do.db import get_db

#Función para proteger todos nuestros endpoints
from to_do.auth import login_required

activity = Blueprint('activity', __name__, url_prefix='')

# Start MySQL consults

#Returns all the task that belgons to the logged user and also return the username and the category name
def getAllTodo():
    db, c = get_db()
    c.execute(
        'SELECT a.id, a.name, a.description, a.completed, c.name AS category, end_at, a.created_at, a.important FROM activity a'
        ' JOIN category c on a.category = c.id' 
        ' WHERE a.created_by = %s order by created_at desc',
        (g.user['id'],)
    )
    todos = c.fetchall()
    c.execute(
        'SELECT name FROM category WHERE created_by = %s',
        (g.user['id'], )
    )
    categories = c.fetchall()
    print(todos)
    return todos, categories

#Return the requested task only if it belongs to the logged user. 
def getTodo(todo_id):
    db, c = get_db()
    c.execute(
        'SELECT a.id, a.description, u.username, a.completed, a.created_at FROM activity a JOIN user u on a.created_by = u.id WHERE a.id = %s', (todo_id,)
    )
    todo = c.fetchone()
    if todo is None:
        abort(404, "The task doesn't exist")

    return todo

#Verify if exist the task and if it belongs to the logged user. 
def checkTodo(todo_id):
    db, c = get_db()
    c.execute('SELECT id FROM activity WHERE id = %s and created_by = %s',(todo_id, g.user['id']))

    if c.fetchone() is None:
        abort(404, "The task doesn't exist")
    
    return True

#Returns all the categories that belongs to the logged user and the standard categories. 
def getCategories(user_id):
    db, c = get_db()
    c.execute(
        'SELECT id, name FROM category WHERE created_by = %s', (user_id, )
    )
    return c.fetchall()
    
#Update a task 
def updateTodo(description, completed, todo_id):
    if checkTodo(todo_id):
        db, c = get_db()
        c.execute('UPDATE activity SET description=%s, completed=%s WHERE id=%s',(description,completed,todo_id))
        db.commit()
    
    return True

#Delete a task 
def deleteTodo(todo_id):
    if checkTodo(todo_id):
        db, c = get_db()
        c.execute('DELETE FROM activity WHERE id = %s',(todo_id,))
        db.commit()

    return True

#Create a task 
def createTodo(name, description, category, end_at, important):
    db, c = get_db()
    if end_at == 'undefined':
        c.execute('INSERT INTO activity (created_by, name, description, completed, category, important) VALUES(%s,%s,%s,%s,%s,%s)', 
                (g.user['id'],name, description, False, category, important)
        )
    else:
        c.execute('INSERT INTO activity (created_by, name, description, completed, category, end_at, important) VALUES(%s,%s,%s,%s,%s,%s,%s)', 
                (g.user['id'], name, description, False, category, end_at, important)
        )
    db.commit()
# End MySQL commandas


@activity.route('/',methods=['GET'])
@login_required
def index():
    todos, categories = getAllTodo()
    return render_template('activity/index.html', todos=todos, categories=categories)

@activity.route('/create', methods=['GET','POST'])
@login_required
def create():
    if request.method == "POST":
        # Start Retrieve inputs from the form
        name = request.form['name']
        description = request.form['description']
        try:    
            category = request.form['categories']
            important = request.form['important']
        except:
            category = 1
            important = 0
        date = request.form['date']
        time = request.form['time']
        if not important:
            important = False
        else:
            important = True
        # End retrieve inputs from the form

        #Start validation for required inputs
        error = None
        if not name:
            error = "Name is required"
        if not description:
            error = "Description is required"
        if error is not None:
            flash(error)
        #End validation for required inputs

        #Start validations day and hour
        if not date:
            #If the to-do hasn't a limit day set end_at as undefined
            end_at = 'undefined'
            #We don't save the hour if the to-do hasn't a day

        else: #If the to-do has a limit day
            
            #Start validation hour 
            if not time:
                #If it hasn't set 12pm as default hour
                time = '12:00:00'
            else: #If the to-do has a limit hour
                #add milisencods to the hour for save as timestamp
                time = time + ':00'
            #End validation hour 

            #Create timestamp
            end_at = date + ' ' + time
        
        #End validation day and hour

        createTodo(name, description, category, end_at, important)
        
        
        return redirect(url_for('activity.index'))

    categories = getCategories(g.user['id'])
    return render_template('activity/create.html', categories=categories)

@activity.route('/<int:todo_id>/update', methods=['GET','POST'])
@login_required
def update(todo_id):
    if request.method == "POST":
        description = request.form['description']
        completed = None if request.form.get('completed') == None else True
        error = None
        
        if not description: 
            error = "Description is required"
        
        if error is not None:
            flash(error)
        else:
            updateTodo(description, completed, todo_id)
            return redirect(url_for('activity.index'))
    
    todo_item = getTodo(todo_id)
    return render_template('activity/update.html',todo = todo_item)

@activity.route('/<int:todo_id>/delete',methods=['POST'])
@login_required
def delete(todo_id):
    if request.method == "POST":
        if deleteTodo(todo_id):
            todo_list = getAllTodo()
            return redirect(url_for('activity.index'))
