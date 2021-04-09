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
            image VARCHAR,
            FOREIGN KEY ( templateID ) REFERENCES templates( uid ) ON DELETE CASCADE
        )
        '''
    cur.execute(sql)
    conn.commit()
    cur.close()
    conn.close()

# Should i modify this function so it assumes that tempID has already been created? I think yes
def createTierList(userID,tempID,listName,labels,rankings,titleImage,images):
    #check to see if template exists already if not then create one
    if tempID == -1:
        tempID = createTemplate(userID,listName,labels, titleImage, images)

    #check if tierlist has already been made if so call updateTierListTable()
    insertTierListTable(userID,tempID,rankings, listName)

    conn = sqlite3.connect()
    cur = conn.cursor()
    sql = f''' SELECT t.uid FROM tierLists as t WHERE t.userID = ? AND t.listName = ? '''
    data = [userID, listName]

    cur.execute(sql,data)
    tlID = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return tlID

def createTierListFromTemplate(userID,tempID,listName,rankings):
    #check to see if template exists already if not then create one

    #check if tierlist has already been made if so call updateTierListTable()
    insertTierListTable(userID,tempID,rankings, listName)

    conn = sqlite3.connect()
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
def deleteTemplate(userID, tempID):
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()
    cur.execute('PRAGMA foreign_keys = ON')
    sql = ''' DELETE FROM templates WHERE userID = ? AND uid = ? '''
    data = [userID, tempID]
    print(f"DELETING useriD: {userID} template id: {tempID}")

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
    insertTemplate(userID,title,labels, titleImage)
    
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()
    print(f"userID: {userID} template name: {title}")
    # Used to find template ID of newly inserted template
    sql = f''' SELECT t.uid FROM templates as t WHERE t.userID = ? AND t.name = ? '''
    
    data = [userID, title]
    cur.execute(sql,data)
    tempID = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()
    print(f"temp id: {tempID}")

    # RN assumeing images is an array of base64 encoded strings... However I will most likely have to do some string manipulation to turn in array
    
    for i in images:
        insertImage(tempID,i)
    return tempID


def getTierLists(userID=None, templateID = None) -> array:
    # get template ID
    conn = sqlite3.connect()
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


def getTemplates(userID) -> array:
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()

    sql = '''SELECT * FROM templates WHERE userID = ? '''
    cur.execute(sql)
    templates = cur.fetchall()
    conn.close()
    cur.close()
    return templates


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
    
def userExists(name):
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()

    sql = '''SELECT * FROM users WHERE username = ? '''

    data = [name]
    cur.execute(sql,data)
    user = cur.fetchall()
    cur.close()

    conn.close()
    return len(user) != 0

def userLogin(name,password):
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


def insertTemplate(userID, title, labels, dispmage):
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()

    sql = '''INSERT INTO templates(userID,name,tier_labels,displayImage) VALUES (?,?,?,?)'''

    data = [userID,title,labels,dispmage]
    cur.execute(sql,data)
    conn.commit()
    cur.close()
    conn.close()


def insertTierListTable(userID, tempID, rankings, listName):
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()

    sql = '''INSERT INTO tierLists(userID,templateID,rankings,listName) VALUES (?,?,?, ?)'''
    data = [userID,tempID,rankings, listName]

    cur.execute(sql,data)
    conn.commit()
    cur.close()
    conn.close()


def insertImage(tempID, image):
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()

    sql = '''INSERT INTO images(templateID,image) VALUES (?,?)'''

    data = [tempID,image]
    cur.execute(sql,data)
    conn.commit()
    cur.close()
    conn.close()

def extractTemplateInfo(self,jsonString):
    
    values = json.loads(jsonString)

    userID = values['userID']

    rankings = values['rankings']

    listName = values['listName']

    images = values['images']

    titleImage = values['titleImage']



    pass

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
    
    f = open("imageHolderFile","r")
    images = f.readlines()
    f.close()
    newF = open("titleImage.txt","r")
    titleImage = newF.readline()
    newF.close()
    #createTemplate(2,"Levi's MarioList","S+,A,B,C,D,F", images)

    insertTemplate(1,"marioList","S,A,B,C,D,F",titleImage)
    print("does exist: ")
    createTierList(2,-1, "Levi's Mario","S,A,F","S:Mario,Bowser\A:Peach, Wario\F:Toad, Waluigi",titleImage,images)
    #deleteTierList(2,1)

if __name__ == "__main__":
    dropTables()
    populateDB()
    testDB()