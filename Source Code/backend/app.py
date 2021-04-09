from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import json
import databaseHelper

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.debug= True

@app.route('/getTemplateId')
@cross_origin()
def getTemplateId():
    userId = request.args.get('userId')
    #Create template in DB and return template ID
    resp = jsonify({"templateId": 1})
    resp.status_code = 200
    return resp

@app.route('/uploadImage', methods=["POST"])
@cross_origin()
def getTemplateIds():
    userId = request.args.get('userId')
    templateId = request.args.get('templateId')
    image = request.args.get('image')
    #Create template in DB and return template ID
    resp = jsonify({"templateId": 1})
    resp.status_code = 200
    return resp

@app.route('/signUp', methods = ['POST'])
@cross_origin()
def addUser():
    data = json.loads(request.data.decode('UTF-8'))
    user = data["username"]
    password = data["password"]
    print(f"USER: {user}")
    if databaseHelper.userExists(user):
        print("user already ")
        resp = jsonify({"errorMessage": "username already exists"})
    else:
        print("sucessfully added")
        databaseHelper.insertUser(user,password)
        resp = jsonify({"errorMessage": "no errors"})

    resp.status_code = 200
    return resp

@app.route('/login', methods = ['POST'])
@cross_origin()
def userLogin():
    data = json.loads(request.data.decode('UTF-8'))
    user = data["username"]
    password = data["password"]
    print(f"USER: {user}")
    uID = databaseHelper.userLogin(user,password)
    if uID != -1:
        print("Sucessfully logged in ")
        resp = jsonify({"errorMessage": "no errors", "userID": uID})
    else:
        print("invalid password or username")
        resp = jsonify({"errorMessage": "invalid password or username"})

    resp.status_code = 200
    return resp