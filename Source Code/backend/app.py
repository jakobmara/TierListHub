from flask.helpers import url_for
from databaseHelper import *
from flask import Flask, request, jsonify, Response
from flask_cors import CORS, cross_origin
import json
import base64

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.debug= True


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
        resp.status_code = 404

    else:
        print("sucessfully added")
        insertUser(user, password)
        newuserId = getUidFromLogin(user,password)
        resp = jsonify({"errorMessage": "no errors", "userId": newuserId})
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
        resp = jsonify({"errorMessage": "no errors", "userId": uID})
        resp.status_code = 200

    else:
        print("invalid password or username")
        resp = jsonify({"errorMessage": "invalid password or username"})
        resp.status_code = 404

   
    return resp

    
TEMP_IMG = "data:image/png;base64,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"


@app.route('/uploadTemplate', methods=["POST"])
@cross_origin()
def uploadTemplate():
    request_json = request.get_json()
    if request_json is not None:
        userId = request_json['userId']
        if userIdExists(userId):
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


@app.route('/image/<templateId>/<imageId>', methods=['GET'])
@cross_origin()
def getImageFromTemplate(templateId, imageId):
    print(templateId)
    print(imageId)
    b64EncodedImg = getImage(templateId, imageId)
    mimeType = b64EncodedImg[b64EncodedImg.index(':') + 1:b64EncodedImg.index(';')]
    actualB64Img = b64EncodedImg[b64EncodedImg.index(','):]
    image_data = base64.b64decode(actualB64Img)
    print(mimeType)
    return Response(image_data, mimetype=mimeType)


@app.route('/image/<templateId>', methods=['GET'])
@cross_origin()
def getTemplateImage(templateId):
    print(templateId)
    b64EncodedImg = getTemplateDisplayImage(templateId)
    mimeType = b64EncodedImg[b64EncodedImg.index(':') + 1:b64EncodedImg.index(';')]
    actualB64Img = b64EncodedImg[b64EncodedImg.index(','):]
    image_data = base64.b64decode(actualB64Img)
    print(mimeType)
    return Response(image_data, mimetype=mimeType)


@app.route('/template/<templateId>', methods=['GET'])
@cross_origin()
def getTemplateJson(templateId):
    print(f"TemplateId: {templateId}")
    template_data = getTemplateFromTemplateId(templateId)
    if template_data is not None:
        template_data['items'] = {imageId:
            url_for('getImageFromTemplate', templateId= template_data['templateId'], imageId= imageId, _external=True)
            for imageId in template_data['imageIds']}
        print(template_data)
        return jsonify(template_data)
    return "Template not found", 400


@app.route('/uploadTierlist', methods=["POST"])
@cross_origin()
def uploadTierlist():
    request_json = request.get_json()

    if request_json is not None and userIdExists(request_json['userId']) and templateIdExists(request_json['templateId']):
        tierListId = createTierListFromJson(request_json)
        resp = {
            "templateId": request_json['templateId'],
            "tierListId": tierListId,
            "status_code": 200
        }

        return resp

    return "Bad Request", 400


@app.route('/getUsername/<userId>', methods =['GET'])
@cross_origin()
def getUserNameFromId(userId):
    print(f"USerId: {userId}")

    name = getUserName(userId)

    resp = jsonify({"userName": name})
    resp.status_code = 200
    print(resp)
    return resp 

@app.route('/templates', methods =["GET"])
@cross_origin()
def getTemplates():
    print(request.args)
    pageNum = int(request.args.get('page'))
    pageSize = int(request.args.get('size'))
    templates = getTemplatePage(pageNum,pageSize)
    
    formatted_templates = [{
        "id" : template[0],
        "title" : template[2],
        "img" : url_for('getTemplateImage', templateId=template[0] , _external=True),
        "author": getUserName(template[1])
    } for template in templates]

    resp = jsonify(formatted_templates)
    resp.status_code = 200
    return resp

@app.route('/tierLists', methods =["GET"])
@cross_origin()
def getTierLists():
    print(request.args)
    tempId = int(request.args.get('templateId'))
    lists = getTierListFromTemplate(tempId)

    images = getImagesFromTemplate(tempId)

    imageURLs = []
    for i in images:
        imageURLs.append(url_for('getImageFromTemplate', templateId=tempId, imageId=i[0], _external=True))

    formatted_lists = [{
        "id" : l[0],
        "title" : l[4],
        "images" : imageURLs,
        "rankings": json.loads(l[3]),
        "author": getUserName(l[1])
    } for l in lists]

    resp = jsonify(formatted_lists)
    resp.status_code = 200
    return resp