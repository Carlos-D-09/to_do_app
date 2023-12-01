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
    return c.fetchone()
# End MySQL consults

@category.route('/category')
@login_required
def returnCategories():
    categories = getCategories()
    return jsonify(categories)

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
            return jsonify(success=False)

        success, category = createCategory(name, desc)
        response = {
            'success': success,
            'category': category
        }

        return jsonify(response)

@category.route('/category/<int:category_id>', methods=['GET'])
@login_required
def returnCategory(category_id):
    if request.method == "GET":
        category = getCategory(category_id)
        return category