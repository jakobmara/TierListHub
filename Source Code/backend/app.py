from databaseHelper import *
from flask import Flask, request, jsonify, Response
from flask_cors import CORS, cross_origin
import json
import base64

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.debug= True

@app.route('/uploadTemplate', methods=["POST"])
@cross_origin()
def uploadTemplate():
    request_json = request.get_json()

    if request_json is not None:
        userId = request_json['userId']
        if userIdExists(userId):
            print(request_json['tierList'])
            templateId = createTemplateFromJson(request_json)
            request_json['templateId'] = templateId
            tierListId = createTierListFromJson(request_json)
            
            resp = {
                "templateId": templateId,
                "tierListId": tierListId,
                "status_code": 200
            }

            return resp

    return "No JSON attached", 400

@app.route('/signUp', methods = ['POST'])
@cross_origin()
def addUser():
    data = json.loads(request.data.decode('UTF-8'))
    user = data["username"]
    password = data["password"]
    print(f"USER: {user}")
    if userNameExists(user):
        print("user already ")
        resp = jsonify({"errorMessage": "username already exists"})
    else:
        print("sucessfully added")
        insertUser(user,password)
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
    uID = getUidFromLogin(user, password)
    if uID != -1:
        print("Sucessfully logged in ")
        resp = jsonify({"errorMessage": "no errors", "userID": uID})
    else:
        print("invalid password or username")
        resp = jsonify({"errorMessage": "invalid password or username"})
    return resp

    
    


@app.route('/image')
@cross_origin()
def image():
    image_data = base64.b64decode(x)
    return Response(image_data, mimetype='image/png')
