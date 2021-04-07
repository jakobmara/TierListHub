from flask import Flask

app = Flask(__name__)

@app.route('/create')
def hello_world():
    return 'Hello, World!'

    