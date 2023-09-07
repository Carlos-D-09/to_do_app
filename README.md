# To do aplication 

This is a little proyect that I am doing while I learn Flask. It is a simple to do list for put in practice basic concepts about flask. 

**Requirements:**
-  python 3.x
-  flask 2.3.x
-  pip 23.x
-  MySQL (default DBMS for create automatically the needed tables) 

**Installation**

**Linux**

After clone the repo into your proyect folder, you have to execute in the same folder, the next commands:
1. python3 -m venv venv
2. . venv/bin/activate
3. pip3 install Flask

With this 3 commands we have installed the necessary tools for run the application, now we need to create the a database into MySQL for the aplication, no matters the name. 

The next step is run the script for create de database tables, but we need to set the context for the application. To do that, we are going to use the next commands: 
1. export FLASK_APP=to_do
2. export FLASK_DATABSE_HOST="your_host"
3. export FLASK_DATABASE="your_database_name"
4. export FLASK_DATABASE_USER="database_user"
5. export FLASK_DATABASE_PASSWORD="user_password"

For execute the script for create the database tables, use the next command: 
- flask init-db

Finally for run the app, we can use any of this commands, depending the mode we want to execute the app:
- flask run
- flask run --debug 
