from flask import (
    Blueprint,
    flash,
    g, render_template, request, url_for, redirect, abort, jsonify
)
from to_do.db import get_db
from to_do.category import getCategories

#Función para proteger los endpoints
from to_do.auth import login_required

activity = Blueprint('activity', __name__, url_prefix='')

# Start MySQL consults

#Returns all the task that belgons to the logged user and also return the username and the category name
def getAllTodo():
    db, c = get_db()
    c.execute(
        'SELECT a.id, a.name, a.description, a.completed, c.name AS category, end_at, a.created_at, a.important FROM activity a'
        ' JOIN category c on a.category = c.id' 
        ' WHERE a.created_by = %s'
        ' ORDER BY COALESCE(a.end_at, "9999-12-31") asc',
        (g.user['id'],)
    )
    todos = c.fetchall()
    categories = getCategories(g.user['id'])
    return todos, categories

#Returns all the taks uncompleted that have an undefined time or end_at is not over
def getPlanned():
    db, c = get_db()
    c.execute(
        'SELECT a.id, a.name, a.description, a.completed, c.name AS category, a.end_at, a.created_at, a.important FROM activity a'
        ' JOIN category c on a.category = c.id' 
        ' WHERE (DAY(a.end_at) >= DAY(CURRENT_TIMESTAMP) AND MONTH(a.end_at) >= MONTH(CURRENT_TIMESTAMP) AND a.created_by = %s AND a.completed = false) OR'
        ' (a.created_by = %s AND a.end_at is NULL AND a.completed = false)'
        ' ORDER BY COALESCE(a.end_at, "9999-12-31") asc',
        (g.user['id'],g.user['id'])
    )
    todos = c.fetchall()
    return todos

#Returns all the task for today 
def getToday():
    db, c = get_db()
    c.execute(
        'SELECT a.id, a.name, a.description, a.completed, c.name AS category, a.end_at, a.created_at, a.important FROM activity a'
        ' JOIN category c on a.category = c.id' 
        ' WHERE (a.created_by = %s AND DAY(a.end_at) = DAY(CURRENT_TIMESTAMP)) OR'
        ' (a.created_by = %s AND a.end_at is NULL)'
        ' ORDER BY COALESCE(a.end_at, "9999-12-31") asc',
        (g.user['id'],g.user['id'])
    )
    todos = c.fetchall()
    return todos

#Return the importatns todo uncompleted
def getImportants():
    db, c = get_db()
    c.execute(
        'SELECT a.id, a.name, a.description, a.completed, c.name AS category, a.end_at, a.created_at, a.important FROM activity a'
        ' JOIN category c on a.category = c.id' 
        ' WHERE a.created_by = %s AND important = 1 AND a.completed = false'
        ' ORDER BY COALESCE(a.end_at, "9999-12-31") asc',
        (g.user['id'],)
    )
    todos = c.fetchall()
    return todos

#Return the completed todo
def getCompleted():
    db, c = get_db()
    c.execute(
        'SELECT a.id, a.name, a.description, a.completed, c.name AS category, a.end_at, a.created_at, a.important FROM activity a'
        ' JOIN category c on a.category = c.id' 
        ' WHERE a.created_by = %s AND completed = 1'
        ' ORDER BY COALESCE(a.end_at, "9999-12-31") asc',
        (g.user['id'],)
    )
    todos = c.fetchall()
    return todos

#Return the uncompleted todo that have the current category
def getActivitiesByCategory(category):
    db, c = get_db()
    c.execute(
        'SELECT a.id, a.name, a.description, a.completed, c.name AS category, a.end_at, a.created_at, a.important FROM activity a'
        ' JOIN category c on a.category = c.id' 
        ' WHERE a.created_by = %s AND c.id = %s AND a.completed = false'
        ' ORDER BY COALESCE(a.end_at, "9999-12-31") asc',
        (g.user['id'],category)
    )
    todos = c.fetchall()
    return todos

#Return the requested task only if it belongs to the logged user. 
def getTodo(todo_id):
    db, c = get_db()
    c.execute(
        'SELECT a.id, a.name, a.description, a.completed, c.name AS category, a.end_at, a.created_at, a.important FROM activity a'
        ' JOIN category c on a.category = c.id' 
        ' WHERE a.created_by = %s AND a.id = %s',
        (g.user['id'], todo_id)
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
    
#Update a task 
def updateTodo(description, completed, todo_id):
    if checkTodo(todo_id):
        db, c = get_db()
        c.execute('UPDATE activity SET description=%s, completed=%s WHERE id=%s',(description,completed,todo_id))
        db.commit()
    
    return True

#Updatae the tags completed and important for a especific todo
def updateTodoTags(todo_id, tags):
    if checkTodo(todo_id):
        db, c = get_db()
        c.execute('UPDATE activity SET completed=%s, important=%s WHERE id=%s',(tags['completed'],tags['important'],todo_id))
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


#Start Routes
@activity.route('/',methods=['GET'])
@login_required
def index():
    todos, categories = getAllTodo()
    print(categories)
    return render_template('activity/index.html', todos=todos, categories=categories)

#Return all the activities
@activity.route('/activities',methods=['GET'])
@login_required
def activities():
    todos, categories = getAllTodo()
    return jsonify(todos)

#Return the vigent activities
@activity.route('/activities/planned',methods=['GET'])
@login_required
def planned():
    todos = getPlanned()
    return jsonify(todos)

#Return the activities for today
@activity.route('/activities/today',methods=['GET'])
@login_required
def today():
    todos = getToday()
    return jsonify(todos)

#Return the ipmortant activities
@activity.route('/activities/importants',methods=['GET'])
@login_required
def importants():
    todos = getImportants()
    return jsonify(todos)

#Return the completed activities
@activity.route('/activities/completed',methods=['GET'])
@login_required
def completed():
    todos = getCompleted()
    return jsonify(todos)

#Return the activities by category
@activity.route('/activities/category',methods=['GET'])
@login_required
def categoryActivities():
    category_id = request.args.get('category_id')
    todos = getActivitiesByCategory(category_id)
    return jsonify(todos)

#Create todo
@activity.route('/create', methods=['POST'])
@login_required
def create():
    if request.method == "POST":
        # Start Retrieve inputs from the form
        name = request.form['name']
        description = request.form['description']
        try:    
            category = request.form['categories']
        except:
            category = 1 #Category when a to-do doesn't have a category
        try:
            important = request.form['important']
        except:
            important = 0
        date = request.form['date']
        time = request.form['time']
        # End retrieve inputs from the form

        #Start validation for required inputs
        error = None
        if not name:
            error = "Name is required"
        if not description:
            error = "Description is required"
        if error is not None:
            return jsonify(error=error)
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
        return jsonify(success=True)

#Upate todo
@activity.route('/<int:todo_id>/update', methods=['GET','POST'])
@login_required
def update(todo_id):
    if request.method == "POST":
        description = request.form['description']
        completed = None if request.form['completed'] == None else True
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

@activity.route('/<int:todo_id>/update/tags', methods=['POST'])
@login_required
def updateTags(todo_id):
    if request.method == "POST":
        error = None
        try:
            completed = request.form['completed']
            important = request.form['important']
        except:
            error = True

        if error == None:
            tags ={
                'completed': completed,
                'important': important
            }
            updateTodoTags(todo_id, tags)
            todo = getTodo(todo_id)

            response = {
                'success': True,
                'todo': todo
            }
            return jsonify(response)
        
        return jsonify(success=False)

#Delete todo
@activity.route('/<int:todo_id>/delete',methods=['POST'])
@login_required
def delete(todo_id):
    if request.method == "POST":
        if deleteTodo(todo_id):
            todo_list = getAllTodo()
            return redirect(url_for('activity.index'))
        
#End Routes
