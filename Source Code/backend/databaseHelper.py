from array import array
import sqlite3
from flask import current_app, g
import hashlib
import os
import json 
DBNAME = os.path.join(os.path.curdir, "userData.db")



def createUserTable():
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()
    sql = ''' 
        CREATE TABLE users(
            uid INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            username VARCHAR,
            password VARCHAR
        )
        '''
    cur.execute(sql)
    conn.commit()
    cur.close()
    conn.close()


# helper function for createTemplate and createTierList
def createTemplateTable():
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()
    
    sql = ''' 
        CREATE TABLE templates(
            uid INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            userId INTEGER NOT NULL,
            name VARCHAR,
            tier_labels VARCHAR,
            displayImage VARCHAR,
            FOREIGN KEY ( userId ) REFERENCES users( uid )
        )
        '''
    cur.execute(sql)
    conn.commit()
    cur.close()
    conn.close()


def createTierListTable():
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()
    sql = ''' 
        CREATE TABLE tierLists(
            uid INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            userId INTEGER NOT NULL,
            templateId INTEGER NOT NULL,
            rankings VARCHAR,
            listName VARCHAR,
            FOREIGN KEY( userId ) REFERENCES users( uid ) ON DELETE CASCADE,
            FOREIGN KEY( templateId ) REFERENCES templates( uid ) ON DELETE CASCADE
        )
        '''
    cur.execute(sql)
    conn.commit()
    cur.close()
    conn.close()


def createImageTable():
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()
    sql = ''' 
        CREATE TABLE images(
            uid INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            templateId INTEGER NOT NULL,
            imageId int,
            image VARCHAR,
            FOREIGN KEY ( templateId ) REFERENCES templates( uid ) ON DELETE CASCADE
        )
        '''
    cur.execute(sql)
    conn.commit()
    cur.close()
    conn.close()

# Should i modify this function so it assumes that templateId has already been created? I think yes
def createTierListNoTemplate(userId, templateId, tempName, listName, labels, rankings, titleImage, images):
    #check to see if template exists already if not then create one
    if templateId == -1:
        templateId = createTemplate(userId, listName, labels, titleImage, images)

    #check if tierlist has already been made if so call updateTierListTable()
    insertTierListTable(userId,templateId,rankings, listName)

    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()
    sql = f''' SELECT t.uid FROM tierLists as t WHERE t.userId = ? AND t.listName = ? '''
    data = [userId, listName]

    cur.execute(sql,data)
    tlID = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return tlID

def createTierListFromTemplate(userId, templateId, listName, rankings):
    #check to see if template exists already if not then create one

    #check if tierlist has already been made if so call updateTierListTable()
    insertTierListTable(userId, templateId, rankings, listName)

    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()
    sql = f''' SELECT t.uid FROM tierLists as t WHERE t.userId = ? AND t.listName = ? '''
    data = [userId, listName]

    cur.execute(sql,data)
    tlID = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return tlID


def deleteImage(imageId):
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()

    sql = ''' DELETE FROM images where uid = ?'''
    
    data = [imageId]
    cur.execute(sql,data)
    conn.commit()
    cur.close()
    conn.close()


# needs userId to confirm its the user's template
def deleteTemplate(userId, templateId):
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()
    cur.execute('PRAGMA foreign_keys = ON')
    sql = ''' DELETE FROM templates WHERE userId = ? AND uid = ? '''
    data = [userId, templateId]
    print(f"DELETING userId: {userId} template id: {templateId}")

    cur.execute(sql,data)
    conn.commit()
    cur.close()
    conn.close()


# needs userId to confirm its the user's tier list
def deleteTierList(userId, listID):
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()
    cur.execute('PRAGMA foreign_keys = ON')
    sql = ''' DELETE FROM tierLists WHERE userId = ? AND uid = ? '''
    data = [userId, listID]

    cur.execute(sql,data)
    conn.commit()
    cur.close()
    conn.close()


#Allows user to change rankings of previosuly set list
def updateTierList(userId, tierListID, rankings):
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()
    sql = ''' UPDATE tierLists SET rankings= ? WHERE userId = ? AND uid = ?'''

    data = [rankings,userId,tierListID]

    cur.execute(sql,data)
    conn.commit()
    cur.close()
    conn.close()


# Create template is called when user wants to create a new template 
def createTemplate(userId, title, labels, titleImage, images) -> int:
    templateId = insertTemplate(userId,title,labels, titleImage)
    
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()
    print(f"userId: {userId} template name: {title}")
    # Used to find template ID of newly inserted template
    sql = f''' SELECT t.uid FROM templates as t WHERE t.userId = ? AND t.uid = ? '''
    
    data = [userId, templateId]
    cur.execute(sql,data)
    templateId = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()
    print(f"temp id: {templateId}")

    # RN assumeing images is an array of base64 encoded strings... However I will most likely have to do some string manipulation to turn in array
    
    for id in images:
        insertImage(templateId, id, images[id])
    
    return templateId


def getTierLists(userId) -> array:
    # get template ID
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()
    
    sql = '''SELECT * FROM tierLists WHERE userId = ?'''
    data = [userId]
    
    cur.execute(sql, data)
    tierLists = cur.fetchall()
    cur.close()
    conn.close()
    return tierLists


def getTemplatesFromUser(userId) -> array:
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()

    sql = '''SELECT * FROM templates WHERE userId = ? '''
    data = [userId]
    cur.execute(sql,data)
    templates = cur.fetchall()
    cur.close()

    conn.close()
    return templates

def getTemplateFromTemplateId(templateId) -> array:
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()

    sql = '''SELECT * FROM templates WHERE uid = ? '''
    
    data = [templateId]

    cur.execute(sql,data)
    template = cur.fetchone()
    if template == None:
        return None

    sql = ''' SELECT imageId FROM images WHERE templateId = ? '''

    data = [template[0]]

    cur.execute(sql,data)
    images = cur.fetchall()

    templateMap = {
        "templateId": template[0],
        "userId": template[1],
        "templateName": template[2],
        "labels": json.loads(template[3]),
        "imageIds": [image[0] for image in images],
        "author" : getUserName(template[1])
        }

    print(f"labels:")
    print(type(template[3]))
    cur.close()
    conn.close()

    return templateMap

def getTemplateDisplayImage(templateId):
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()

    sql = '''SELECT displayImage FROM templates WHERE uid = ? '''
    data = [templateId]
    cur.execute(sql,data)
    displayImage = cur.fetchone()[0]
    
    cur.close()
    conn.close()
    
    return displayImage

def insertUser(name, password):
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()

    newPass = hashlib.sha1(password.encode('utf-8')).hexdigest()

    sql = f'''INSERT INTO users(username,password) VALUES (?,?)'''
    data = [name, newPass]
    cur.execute(sql,data)
    conn.commit()
    cur.close()
    conn.close()


def templateIdExists(tId):
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()

    sql = '''SELECT * FROM templates WHERE uid = ? '''

    data = [tId]
    cur.execute(sql, data)
    user = cur.fetchall()
    cur.close()

    conn.close()
    return len(user) != 0


def userIdExists(uid):
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()

    sql = '''SELECT * FROM users WHERE uid = ? '''

    data = [uid]
    cur.execute(sql, data)
    user = cur.fetchall()
    cur.close()

    conn.close()
    return len(user) != 0

def userNameExists(name):
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()

    sql = '''SELECT * FROM users WHERE username = ? '''

    data = [name]
    cur.execute(sql,data)
    user = cur.fetchall()
    cur.close()

    conn.close()
    return len(user) != 0

def getUidFromLogin(name, password):
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()

    newPass = hashlib.sha1(password.encode('utf-8')).hexdigest()
    print(f"username: {name} password: {newPass}")
    sql = '''SELECT * FROM users WHERE username = ? AND password = ? '''
    data = [name,newPass]

    cur.execute(sql,data)

    user = cur.fetchall()
    cur.close()
    conn.close()
    if len(user) == 0:
        userId = -1
    else:
        userId = user[0][0]
    return userId

def getUserName(userId):
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()
    sql = ''' SELECT username FROM users WHERE uid = ?'''
    print(f"userID for getUserName: {userId}")
    data = [userId]
    cur.execute(sql, data)
    name = cur.fetchone()[0]
    cur.close()
    conn.close()

    return name

def insertTemplate(userId, title, labels, dispmage) -> int:
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()

    sql = '''INSERT INTO templates(userId,name,tier_labels,displayImage) VALUES (?,?,?,?)'''

    data = [userId, title, json.dumps(labels), dispmage]
    cur.execute(sql, data)
    conn.commit()

    sql = ''' SELECT uid FROM templates WHERE userId = ? AND name = ? '''
    data = [userId, title]
    cur.execute(sql, data)
    templateId = cur.fetchall()[0][0]
    
    cur.close()
    conn.close()
    return templateId


def insertTierListTable(userId, templateId, rankings, listName):
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()

    sql = '''INSERT INTO tierLists(userId,templateId,rankings,listName) VALUES (?,?,?, ?)'''
    data = [userId, templateId, json.dumps(rankings), listName]

    cur.execute(sql, data)
    conn.commit()
    cur.close()
    conn.close()


def insertImage(templateId, imageId, image):
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()

    sql = '''INSERT INTO images(templateId,imageId,image) VALUES (?,?,?)'''

    data = [templateId,imageId,image]
    cur.execute(sql,data)
    conn.commit()
    cur.close()
    conn.close()

def getImage(templateId, imageId) -> str:
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()

    sql = '''SELECT image FROM images WHERE templateId = ? AND imageId = ? '''

    data = [templateId, imageId]
    cur.execute(sql, data)
    img = cur.fetchone()[0]
    cur.close()
    conn.close()

    return img

def createTemplateFromJson(jsonObject) -> int:
    userId = jsonObject['userId']  
    templateTitle = jsonObject['templateTitle']
    titleImage = jsonObject['templateImage']
    tierLabels = {tier['id']: tier['tierName']  for tier in jsonObject['tierList']}
    templateImages = {item['id']: item['b64Img'] for tier in jsonObject['tierList'] for item in tier['items']}
    
    return createTemplate(userId, templateTitle, tierLabels, titleImage, templateImages)
    
    
def createTierListFromJson(jsonObject):
    userId = jsonObject['userId']
    templateId = jsonObject['templateId']
    rankings = {tier['id']: [item['id'] for item in tier['items']]  for tier in jsonObject['tierList']}
    tierListName = jsonObject['tierListName']
    return createTierListFromTemplate(userId, templateId, tierListName, rankings)
    
def getTemplatePage(pageNum, pageSize):
    conn =sqlite3.connect(DBNAME)
    cur = conn.cursor()

    sql = ''' SELECT * FROM templates'''

    cur.execute(sql)
    templates = cur.fetchall()

    templatePage = templates[(pageNum-1) * pageSize:pageNum*pageSize]
    templatePage = templatePage[::-1]

    cur.close()
    conn.close()
    
    return templatePage

def getTierListFromTemplate(templateId):
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()
    sql = ''' SELECT * FROM tierLists WHERE templateId = ?'''

    data = [templateId]
    cur.execute(sql,data)
    tierLists = cur.fetchall()
    tierLists = tierLists[::-1]

    cur.close()
    conn.close()

    return tierLists

def getImagesFromTemplate(templateID):
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()
    sql = ''' SELECT uid, image FROM images WHERE templateId = ?'''

    data = [templateID]

    cur.execute(sql,data)
    images = cur.fetchall()

    cur.close()
    conn.close()

    return images

def getUserPage(userId):
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()

    userTemplates = getTemplatesFromUser(userId) #array of template objects created by user

    userTierLists = getTierLists(userId) #array of tierList objects created by user

    


def populateDB():
    createUserTable()
    createTemplateTable()
    createTierListTable()
    createImageTable()


def dropTables():
    conn = sqlite3.connect(DBNAME)
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS users")
    cursor.execute("DROP TABLE IF EXISTS templates")
    cursor.execute("DROP TABLE IF EXISTS images")
    cursor.execute("DROP TABLE IF EXISTS tierLists")
    cursor.close()
    conn.commit()
    conn.close()

def testDB():
    TEMP_IMG = "data:image/png;base64,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"
    insertUser("jake","bad")
    insertUser("Levi","badPassword")
    '''
    f = open("imageHolderFile","r")
    images = f.readlines()
    f.close()
    newF = open("titleImage.txt","r")
    titleImage = newF.readline()
    newF.close()
    '''
    #createTemplate(2,"Levi's MarioList","S+,A,B,C,D,F", images)

    insertTemplate(1,"marioList","S,A,B,C,D,F", TEMP_IMG)
    print("does exist: ")
    #createTierList(2,-1, "mario rankings", "Levi's Mario","S,A,F","S:Mario,Bowser\A:Peach, Wario\F:Toad, Waluigi",titleImage,images)
    #deleteTierList(2,1)


if __name__ == "__main__":
    dropTables()
    populateDB()
    #testDB()