from flask import (
    Blueprint,
    flash,
    g, render_template, request, url_for, redirect, abort, jsonify
)
from to_do.db import get_db

#Función para proteger todos nuestros endpoints
from to_do.auth import login_required


category = Blueprint('category', __name__, url_prefix='')

# Start MySQL consults
def createCategory(name, desc):
    db, c = get_db()
    c.execute('INSERT INTO category (created_by, name, description) VALUES (%s, %s, %s)',
              (g.user['id'], name, desc)
    )
    db.commit()
    
    category = getCategory(c.lastrowid)

    return True, category

#Returns all the categories that belongs to the logged user and the standard categories. 
def getCategories():
    db, c = get_db()
    c.execute(
        'SELECT id, name FROM category WHERE created_by = %s or created_by = 1', (g.user['id'], )
    )
    return c.fetchall()

#Return the requested category
def getCategory(category_id):
    db, c = get_db()
    c.execute(
        'SELECT id, name, description FROM category WHERE created_by = %s and id = %s', (g.user['id'], category_id)
    )
    category = c.fetchone()
    return category

#Set undefined all tha activities with the category_id selected 
def setUndefined(category_id):
    db, c = get_db()
    c.execute(
        'UPDATE activity SET category=1 WHERE created_by=%s and category=%s',
        (g.user['id'], category_id)
    )
    db.commit()

    return True

#Update category
def updateCategory(category_id, name, desc):
    db, c = get_db()
    c.execute(
        'UPDATE category SET name = %s, description = %s WHERE id = %s and created_by = %s', (name, desc, category_id, g.user['id'])
    )
    db.commit()
    category = getCategory(category_id)
    return True, category, 'Category update successfully'

#Delete category
def deleteCategory(category_id):
    db, c = get_db()

    #Consult if exist an activity asociated with the category for delete. 
    c.execute (
        'SELECT id FROM activity WHERE created_by = %s and category = %s', (g.user['id'], category_id)
    )
    categories = c.fetchall()

    if categories == []:
        c.execute(
            'DELETE FROM category WHERE id = %s and created_by = %s', (category_id, g.user['id'])
        )
        db.commit()
        return True, 'Category deleted succesfully'
    else:
        return False, 'Something went wrong trying to delete a category, please contact with support'

# End MySQL consults
    
#Route to return all the categories that belongs to the logged user 
@category.route('/category')
@login_required
def returnCategories():
    categories = getCategories()
    return jsonify(categories)

#Route to create a category
@category.route('/category/create', methods=['POST'])
@login_required
def create():
    if request.method == "POST":
        name = request.form['title']
        desc = request.form['desc']
        
        error = None
        if not name:
            error = "Name is required"
        if not desc:
            error = "Description is required"
        if error is not None:
            return jsonify({'success': False, 'error': error})

        success, category = createCategory(name, desc)
        response = {
            'success': success,
            'category': category
        }

        return jsonify(response)

#Route to get an specific category
@category.route('/category/<int:category_id>', methods=['GET'])
@login_required
def returnCategory(category_id):
    if request.method == "GET":
        category = getCategory(category_id)
        if category is not None:
            return jsonify({'success':True,'category': category})
        else:
            return jsonify({'success':False,'error':"The category doesn't exist"})
        
#Route to update a category
@category.route('/category/<int:category_id>/update', methods=['POST'])
@login_required
def editCategory(category_id):
    if request.method == "POST":
        name = request.form['title']
        desc = request.form['desc']
        
        error = None
        if not name:
            error = "Name is required"
        if not desc:
            error = "Description is required"
        if error is not None:
            return jsonify({'success': False, 'error': error})
        
        category = getCategory(category_id)
        if category is not None:
            success, category, message = updateCategory(category_id, name, desc)
            if success:
                return jsonify({'success':success, 'category' :category, 'message': message})
            else:
                return jsonify({'success':success, 'error': message})
        else:
             return jsonify({'success': False, 'error': 'You are trying to edit an unexisting category'})

#Route to delete a category
@category.route('/category/<int:category_id>/delete', methods=['POST'])
@login_required
def removeCategory(category_id):
    if request.method == "POST":
        category = getCategory(category_id)
        if category is not None:
            setUndefined(category_id)
            success, message = deleteCategory(category_id)
            if success:
                return jsonify({'success': success, 'message': message})
            else:
                return jsonify({'success': success, 'error': message})
                
        else:
            return jsonify({'success': False, 'error': 'You are trying to delete an unexisting category'})