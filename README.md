# To do app

This is a little project that I am doing while I learn Flask. It is a simple to-do list to put into practice basic concepts about flask. 

**Requirements:**
-  python >= 3.x
-  flask >= 2.3.x
-  pip >= 23.x
-  MySQL (default DBMS to create automatically the needed tables) 

Python modules:
  - mysql-connector-python
  - python-dotenv

**Installation**

**Windows (PowerShell)**

After clone the repo into your project folder, enter the folder "to_do_app" and you have to execute, the following commands:
1. python -m venv venv
2. . venv/scripts/activate
3. pip3 install Flask mysql-connector-python python-dotenv

Now you have to copy the file .env.example and rename it for .env. Then you have to edit the default parameters for your parameters.

To execute the script for creating the database tables and the seeding, you have to execute the app at least one time and then stop it. To run the app, we can use any of these commands, depending on the mode we want to execute the app:
- flask run
- flask run --debug 

Once we have run the app at least one time, we can use the script to run database table creation:
- flask init-db

**Linux**

After cloning the repo into your project folder, enter the folder "to_do_app" and you have to execute, the following commands:
1. python3 -m venv venv
2. . venv/bin/activate
3. pip3 install Flask mysql-connector-python python-dotenv

Now you have to copy the file .env.example and rename it for .env. Then you have to edit the default parameters for your parameters.

To execute the script for creating the database tables and the seeding, you have to execute the app first and then stop it, To run the app, we can use any of these commands, depending on the mode we want to execute the app:
- flask run
- flask run --debug 

Once we have run the app at least one time, we can use the script to run database table creation and seed:
- flask init-db
- flask seed-db
