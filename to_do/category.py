from flask import (
    Blueprint,
    flash,
    g, render_template, request, url_for, redirect, abort, jsonify
)

#Función para proteger todos nuestros endpoints
from .auth import login_required
from .database.Models.categories import Categories
from .database.Models.activities import Activities


category = Blueprint('category', __name__, url_prefix='')
#Route to return all the categories that belongs to the logged user 
@category.route('/category')
@login_required
def return_categories():
    categories = Categories.get_categories(g.user.id)
    return jsonify(categories)

#Route to create a category
@category.route('/category/create', methods=['POST'])
@login_required
def create_category():
    if request.method == "POST":
        try:
            form = request.get_json();
            name = form['title']
            desc = form['desc']
        except Exception as e:
            print(f"Error al recuperar los parametros del formulario: {e}")
            return jsonify({'success': False,'error':"Invalid form"})

        
        if not name or not desc:
            print(name, desc)
            return jsonify({'success': False, 'error': "Name and Description are required"})
        
        category = Categories(name, desc, g.user.id)
        if category.save():
            new_category = Categories.get_category(g.user.id,category.id)
            return jsonify({'success': True, 'category': new_category})
        else:
            return jsonify({'success': False,'error':"Something went wrong"})

#Route to get an specific category
@category.route('/category/<int:category_id>', methods=['GET'])
@login_required
def return_category(category_id):
    if request.method == "GET":
        category = Categories.get_category(g.user.id,category_id)
        if category is not None:
            return jsonify({'success':True,'category': category})
        else:
            return jsonify({'success':False,'error':"The category doesn't exist"})
        
#Route to update a category
@category.route('/category/<int:category_id>/update', methods=['PUT'])
@login_required
def edit_category(category_id):
    if request.method == "PUT":
        form = request.get_json()
        name = form['name']
        desc = form['description']
        
        if not name or not desc:
            return jsonify({'success': False, 'error': "Name and Description are required"})
        
        category = Categories.get_category_object(g.user.id, category_id)
        if category is not None:
            if category.update_category(name, desc):
                return jsonify({'success':True, 'category' : Categories.get_category(g.user.id, category_id), 'message': "Category successfully updated"})
            else:
                return jsonify({'success':False, 'error': 'Something went wrong trying to update a category'})
        else:
             return jsonify({'success': False, 'error': 'You are trying to update an unexisting category'})

#Route to delete a category
@category.route('/category/<int:category_id>/delete', methods=['DELETE'])
@login_required
def remove_category(category_id):
    if request.method == "DELETE":
        category = Categories.get_category_object(g.user.id, category_id)
        if category is not None:
            if Activities.set_all_activities_undefined(g.user.id,category.id):
                if category.delete_category():
                    return jsonify({'success': True, 'message': 'Category deleted successfully'})
            else:
                return jsonify({'success': False, 'error': 'Something went wrong trying to update a category'})
                
        else:
            return jsonify({'success': False, 'error': 'You are trying to delete an unexisting category'})