from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(150), nullable=False)
    password= db.Column(db.Text, nullable=False) 