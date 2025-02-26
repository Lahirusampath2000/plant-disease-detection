from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    SECRET_KEY = os.environ["SECRET_KEY"]

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True

    SQLALCHEMY_DATABASE_URI = R"sqlite:///app.db"

    SESSION_TYPE="redis"
    SESSION_Permaent=False