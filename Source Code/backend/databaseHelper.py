from array import array
import sqlite3
from flask import current_app, g
import hashlib
import os
import json 
DBNAME = os.path.join(os.path.curdir, "CP476TP.db")



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
            userID INTEGER NOT NULL,
            name VARCHAR,
            tier_labels VARCHAR,
            displayImage VARCHAR,
            FOREIGN KEY ( userID ) REFERENCES users( uid )
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
            userID INTEGER NOT NULL,
            templateID INTEGER NOT NULL,
            rankings VARCHAR,
            listName VARCHAR,
            FOREIGN KEY( userID ) REFERENCES users( uid ) ON DELETE CASCADE,
            FOREIGN KEY( templateID ) REFERENCES templates( uid ) ON DELETE CASCADE
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
            templateID INTEGER NOT NULL,
            imageID int,
            image VARCHAR,
            FOREIGN KEY ( templateID ) REFERENCES templates( uid ) ON DELETE CASCADE
        )
        '''
    cur.execute(sql)
    conn.commit()
    cur.close()
    conn.close()

# Should i modify this function so it assumes that templateId has already been created? I think yes
def createTierListNoTemplate(userID, templateId, tempName, listName, labels, rankings, titleImage, images):
    #check to see if template exists already if not then create one
    if templateId == -1:
        templateId = createTemplate(userID, listName, labels, titleImage, images)

    #check if tierlist has already been made if so call updateTierListTable()
    insertTierListTable(userID,templateId,rankings, listName)

    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()
    sql = f''' SELECT t.uid FROM tierLists as t WHERE t.userID = ? AND t.listName = ? '''
    data = [userID, listName]

    cur.execute(sql,data)
    tlID = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return tlID

def createTierListFromTemplate(userID, templateId, listName, rankings):
    #check to see if template exists already if not then create one

    #check if tierlist has already been made if so call updateTierListTable()
    insertTierListTable(userID, templateId, rankings, listName)

    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()
    sql = f''' SELECT t.uid FROM tierLists as t WHERE t.userID = ? AND t.listName = ? '''
    data = [userID, listName]

    cur.execute(sql,data)
    tlID = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return tlID


def deleteImage(imageID):
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()

    sql = ''' DELETE FROM images where uid = ?'''
    
    data = [imageID]
    cur.execute(sql,data)
    conn.commit()
    cur.close()
    conn.close()


# needs userID to confirm its the user's template
def deleteTemplate(userID, templateId):
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()
    cur.execute('PRAGMA foreign_keys = ON')
    sql = ''' DELETE FROM templates WHERE userID = ? AND uid = ? '''
    data = [userID, templateId]
    print(f"DELETING useriD: {userID} template id: {templateId}")

    cur.execute(sql,data)
    conn.commit()
    cur.close()
    conn.close()


# needs userID to confirm its the user's tier list
def deleteTierList(userID, listID):
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()
    cur.execute('PRAGMA foreign_keys = ON')
    sql = ''' DELETE FROM tierLists WHERE userID = ? AND uid = ? '''
    data = [userID, listID]

    cur.execute(sql,data)
    conn.commit()
    cur.close()
    conn.close()


#Allows user to change rankings of previosuly set list
def updateTierList(userID, tierListID, rankings):
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()
    sql = ''' UPDATE tierLists SET rankings= ? WHERE userID = ? AND uid = ?'''

    data = [rankings,userID,tierListID]

    cur.execute(sql,data)
    conn.commit()
    cur.close()
    conn.close()


# Create template is called when user wants to create a new template 
def createTemplate(userID, title, labels, titleImage, images) -> int:
    templateID = insertTemplate(userID,title,labels, titleImage)
    
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()
    print(f"userID: {userID} template name: {title}")
    # Used to find template ID of newly inserted template
    sql = f''' SELECT t.uid FROM templates as t WHERE t.userID = ? AND t.uid = ? '''
    
    data = [userID, templateID]
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


def getTierLists(userID=None, templateID = None) -> array:
    # get template ID
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()
    
    if userID == None:
        sql = '''SELECT * FROM tierLists WHERE userID = ?'''
        data = [userID]
    else:
        sql = '''SELECT * FROM tierLists WHERE templateID = ? '''
        data = [templateID]
    
    cur.execute(sql,data)
    tierLists = cur.fetchall()
    cur.close()
    conn.close()
    return tierLists


def getTemplatesFromUser(userID) -> array:
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()

    sql = '''SELECT * FROM templates WHERE userID = ? '''
    data = [userID]
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

    sql = ''' SELECT imageID FROM images WHERE templateID = ? '''

    data = [template[0]]

    cur.execute(sql,data)
    images = cur.fetchall()

    template = {
        "templateId": template[0],
        "userId": template[1],
        "templateName": template[2],
        "labels": template[3],
        "imageIds": [image[0] for image in images]
        }

    
    cur.close()
    conn.close()

    return template

def getTemplateDisplayImage(templateId):
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()

    sql = '''SELECT displayImage FROM templates WHERE uid = ? '''
    data = [templateId]
    cur.execute(sql,data)
    displayImage = cur.fetchone()[0]
    cur.close()

    conn.close()
    print(displayImage)
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

    print(user[0])
    cur.close()
    conn.close()
    if len(user) == 0:
        userID = -1
    else:
        userID = user[0][0]
    return userID


def insertTemplate(userID, title, labels, dispmage) -> int:
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()

    sql = '''INSERT INTO templates(userID,name,tier_labels,displayImage) VALUES (?,?,?,?)'''

    data = [userID, title, json.dumps(labels), dispmage]
    cur.execute(sql, data)
    conn.commit()

    sql = ''' SELECT uid FROM templates WHERE userID = ? AND name = ? '''
    data = [userID, title]
    cur.execute(sql, data)
    templateId = cur.fetchall()[0][0]
    
    cur.close()
    conn.close()
    return templateId


def insertTierListTable(userID, templateId, rankings, listName):
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()

    sql = '''INSERT INTO tierLists(userID,templateID,rankings,listName) VALUES (?,?,?, ?)'''
    data = [userID, templateId, json.dumps(rankings), listName]

    cur.execute(sql, data)
    conn.commit()
    cur.close()
    conn.close()


def insertImage(templateId, imageId, image):
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()

    sql = '''INSERT INTO images(templateID,imageID,image) VALUES (?,?,?)'''

    data = [templateId,imageId,image]
    cur.execute(sql,data)
    conn.commit()
    cur.close()
    conn.close()

def getImage(templateId, imageId) -> str:
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()

    sql = '''SELECT image FROM images WHERE templateID = ? AND imageID = ? '''

    data = [templateId, imageId]
    cur.execute(sql, data)
    img = cur.fetchone()[0]
    cur.close()
    conn.close()
    print(f"img: {img}")

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
    insertUser("Jake","badPassword")
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

TEMP_IMG = "data:image/png;base64,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"

if __name__ == "__main__":
    dropTables()
    populateDB()
    testDB()