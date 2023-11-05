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
# End MySQL consults


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

        createCategory(name, desc)

        return jsonify(success=True)
