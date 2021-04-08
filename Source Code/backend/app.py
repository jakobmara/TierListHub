from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

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
def getTemplateId():
    userId = request.args.get('userId')
    templateId = request.args.get('templateId')
    image = request.args.get('image')
    #Create template in DB and return template ID
    resp = jsonify({"templateId": 1})
    resp.status_code = 200
    return resp
