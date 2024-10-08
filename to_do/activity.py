from flask import (
    Blueprint,
    flash,
    g, render_template, request, url_for, redirect, abort, jsonify
)

from .auth import login_required
from .database.Models.activities import Activities
from .database.Models.categories import Categories

activity = Blueprint('activity', __name__, url_prefix='')

@activity.route('/',methods=['GET'])
@login_required
def index():
    todos = Activities.get_activities(g.user.id)
    categories = Categories.get_categories(g.user.id)
    todos_list = [todo._asdict() for todo in todos]
    categories_list = [category._asdict() for category in categories]
    return render_template('activities/index.html', todos=todos_list, categories=categories_list)

#Return all the activities
@activity.route('/activities',methods=['GET'])
@login_required
def get_activities():
    todos = Activities.get_activities(g.user.id)
    todos_list = [todo._asdict() for todo in todos]
    return jsonify(todos_list)

# Return a single todo
@activity.route('/activity/<int:todo_id>', methods=['GET'])
@login_required
def todo(todo_id):
    todo = Activities.get_activity(g.user.id, todo_id)
    if todo is not None:
        return jsonify({'success':True,'todo': todo})
    else:
        return jsonify({'success':False,'error':"The todo doesn't exist"})

#Return the vigent activities
@activity.route('/activities/planned',methods=['GET'])
@login_required
def planned():
    todos = Activities.get_planned_activities(g.user.id)
    todos_list = [todo._asdict() for todo in todos]
    return jsonify(todos_list)

#Return the activities for today
@activity.route('/activities/today',methods=['GET'])
@login_required
def today():
    todos = Activities.get_today_activities(g.user.id)
    todos_list = [todo._asdict() for todo in todos]
    return jsonify(todos_list)

#Return the ipmortant activities
@activity.route('/activities/importants',methods=['GET'])
@login_required
def importants():
    todos = Activities.get_important_activities(g.user.id)
    todos_list = [todo._asdict() for todo in todos]
    return jsonify(todos_list)

#Return the completed activities
@activity.route('/activities/completed',methods=['GET'])
@login_required
def completed():
    todos = Activities.get_completed_activities(g.user.id)
    todos_list = [todo._asdict() for todo in todos]
    return jsonify(todos_list)

#Return the activities by category
@activity.route('/activities/category',methods=['GET'])
@login_required
def category_activities():
    category_id = request.args.get('category_id')
    todos = Activities.get_activities_by_category(category_id, g.user.id)
    todos_list = [todo._asdict() for todo in todos]
    return jsonify(todos_list)

#Create todo
@activity.route('/create', methods=['POST'])
@login_required
def create_activity():
    if request.method == "POST":
        try: 
            todo_json = request.get_json()
            name = todo_json['name']
            description = todo_json['description']
            category = todo_json['category']
            important = todo_json['important']
            date = todo_json['date']
            time = todo_json['time']

            if not name or not description:
                return jsonify({'success':False, 'error': "Name and description are required"})

            #Validate Day and hour
            if not date:
                #If the to-do hasn't a limit day set end_at as undefined
                end_at = None
                #We don't save the hour if the to-do hasn't a day

            else:
                if not time:
                    #If it hasn't an hour set 12pm as default hour
                    time = '12:00:00'
                else: #If the to-do has a limit hour add milisencods to the hour for save as timestamp
                    time = time + ':00'

                #Create timestamp
                end_at = date + ' ' + time

            #Update Activity
            todo = Activities(name, description, int(important), end_at, category, g.user.id)

            if todo.save():
                return jsonify(success=True)
            else:
                return jsonify(success=False)
        
        except Exception as e:
            return jsonify({'success':False, 'error':str(e)})

#Upate todo
@activity.route('/<int:todo_id>/update', methods=['PUT'])
@login_required
def update(todo_id):
    if request.method == "PUT":
        try:
            form = request.get_json()
            name = form['name']
            description = form['description']
            category = form['category']
            completed = form['completed']
            important = form['important']
            date = form['date']
            time = form['time']
        except:
            return jsonify({'success':False, 'error': "Invalid form"})

        if not name or not description:
            return jsonify({'success':False, 'error': "Name and description are required"})
        
        #Validate Day and hour
        if not date:
            #If the to-do hasn't a limit day set end_at as undefined
            end_at = None
            #We don't save the hour if the to-do hasn't a day

        else:
            if not time:
                #If it hasn't an hour set 12pm as default hour
                time = '12:00:00'
            else: #If the to-do has a limit hour add milisencods to the hour for save as timestamp
                time = time + ':00'

            #Create timestamp
            end_at = date + ' ' + time
            
        todo = Activities.get_activity_object(g.user.id, todo_id)
        if todo:
            if todo.update_activity(name, description, int(completed), category, int(important), end_at ):
                return jsonify({'success': True})
            else:
                return jsonify({'success': False, 'error': "We couldn't update the activity, please try again later"})

#Update tags completed and important
@activity.route('/<int:todo_id>/update/tags', methods=['PUT'])
@login_required
def updateTags(todo_id):
    if request.method == "PUT":
        try:
            form = request.get_json()
            completed = form['completed']
            important = form['important']
        except:
            return jsonify({'success':False, 'error': "Invalid form"})

        todo = Activities.get_activity_object(g.user.id,todo_id)
        if todo:
            if todo.update_activity_tags(int(completed), int(important)):
                todo = Activities.get_activity(g.user.id,todo_id)
                return jsonify({'success': True, 'todo':todo})
        else:
            return jsonify({'success':False, 'error':'to-do unexisted'})

# Delete todo
@activity.route('/<int:todo_id>/delete',methods=['DELETE'])
@login_required
def delete(todo_id):
    if request.method == "DELETE":
        todo = Activities.get_activity_object(g.user.id,todo_id)
        if todo.delete_activity():
            return jsonify({'success':True,'message':'To-do deleted successfully'})
        else:
            return jsonify({'success':False,'error':'Something went wrong, please contact with support'})
