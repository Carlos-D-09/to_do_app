from flask import current_app
from werkzeug.security import generate_password_hash

tables = [
    'SET FOREIGN_KEY_CHECKS=0',
    'DROP TABLE IF EXISTS activity',
    'DROP TABLE IF EXISTS user',
    'DROP TABLE IF EXISTS category',
    'DROP TABLE IF EXISTS sub_category',
    'SET FOREIGN_KEY_CHECKS=1',
    """
        CREATE TABLE user (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(256) NOT NULL
        )
    """, 
    """
        CREATE TABLE category(
            id INT PRIMARY KEY AUTO_INCREMENT,
            created_by INT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            name VARCHAR(50) NOT NULL,
            description VARCHAR(250) NOT NULL
        )
    """,
    """
        CREATE TABLE activity(
            id INT PRIMARY KEY AUTO_INCREMENT, 
            created_by INT NOT NULL, 
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            name VARCHAR(50) NOT NULL,
            description VARCHAR(250) NOT NULL,
            completed BOOLEAN NOT NULL,
            category INT NOT NULL,
            important BOOLEAN NOT NULL,
            end_at TIMESTAMP, 
            FOREIGN KEY (category) REFERENCES category(id),
            FOREIGN KEY (created_by) REFERENCES user(id)
        )
    """

]

pwd = generate_password_hash('12345'+'dev')

seeder = [
    "INSERT INTO user (username, password) VALUES ('test user','" + pwd + "')",
    "INSERT INTO category (created_by, name, description) VALUES ('1', 'null', 'This category indicates that the user does not assign a category')"
]