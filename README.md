# To do app

This is a little project that I am doing while I learn Flask. It is a simple to-do list to put into practice basic concepts about flask. 

**Requirements:**
-  python >= 3.x
-  flask >= 2.3.x
-  pip >= 23.x
-  MySQL (default DBMS to create automatically the needed tables) 

Python modules:
  - mysql.connector

**Installation**

**Windows (PowerShell)**
After clone the repo into your project folder, enter the folder "to_do_app" and you have to execute, the following commands:
1. python -m venv venv
2. . venv/scripts/activate
3. pip3 install Flask

With the first command, we create a virtual environment to run the project, the second one runs the virtual environment, and the last one installs Flask into the virtual environment. 

The next step is to run the script to create the database tables, but we need to set the context for the application. To do that, we are going to use the next commands: 
1. $env:FLASK_APP="to_do"
2. $env:FLASK_DATABSE_HOST="your_host"
3. $env:FLASK_DATABASE="your_database_name"
4. $env:FLASK_DATABASE_USER="database_user"
5. $env:FLASK_DATABASE_PASSWORD="user_password"
6. $env:FLASK_DATABASE_PORT="your_database_port"

To execute the script for creating the database tables and the seeding, you have to execute the app first and then stop it, To run the app, we can use any of these commands, depending on the mode we want to execute the app:
- flask run
- flask run --debug 

Once we have run the app at least one time, we can use the script to run database table creation and seed:
- flask init-db
- flask seed-db

**Linux**

After cloning the repo into your project folder, enter the folder "to_do_app" and you have to execute, the following commands:
1. python3 -m venv venv
2. . venv/bin/activate
3. pip3 install Flask

With the first command, we create a virtual environment to run the project, the second one runs the virtual environment, and the last one installs Flask into the virtual environment. 

The next step is to run the script to create the database tables, but we need to set the context for the application. To do that, we are going to use the next commands: 
1. export FLASK_APP=to_do
2. export FLASK_DATABSE_HOST="your_host"
3. export FLASK_DATABASE="your_database_name"
4. export FLASK_DATABASE_USER="database_user"
5. export FLASK_DATABASE_PASSWORD="user_password"
6. export FLASK_DATABASE_PORT="your_database_port"

To execute the script for creating the database tables and the seeding, you have to execute the app first and then stop it, To run the app, we can use any of these commands, depending on the mode we want to execute the app:
- flask run
- flask run --debug 

Once we have run the app at least one time, we can use the script to run database table creation and seed:
- flask init-db
- flask seed-db
