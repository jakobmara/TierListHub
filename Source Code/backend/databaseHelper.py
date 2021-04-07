import sqlite3
from flask import current_app, g
import hashlib
import os
DBNAME = os.path.join(os.path.curdir, "CP476TP.db")



def createUserTable():
    conn = sqlite3.connect(DBNAME)
    cur = conn.cursor()
    sql = ''' 
        CREATE TABLE users(
            uid INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR,
            password VARCHAR
        )
        '''
    cur.execute(sql)
    conn.commit()
    cur.close()
    conn.close()



def createTemplateTable():
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()
    
    sql = ''' 
        CREATE TABLE templates(
            uid INTEGER PRIMARY KEY AUTOINCREMENT,
            userID INTEGER,
            name VARCHAR,
            tier_labels VARCHAR,
            FOREIGN KEY (userID) REFERENCES users(id)
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
            uid INTEGER PRIMARY KEY AUTOINCREMENT,
            userID INTEGER,
            templateID INTEGER,
            rankings VARCHAR,
            FOREIGN KEY(userID) REFERENCES users(id),
            FOREIGN KEY(templateID) REFERENCES templates(id)
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
            uid INTEGER PRIMARY KEY AUTOINCREMENT,
            templateID INTEGER,
            image VARCHAR,
            FOREIGN KEY (templateID) REFERENCES templates(id)
        )
        '''
    cur.execute(sql)
    conn.commit()
    cur.close()
    conn.close()

def createTemplate(userID, title, labels,images):
    insertTemplate(userID,title,labels)
    
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()

    # Used to find template ID of newly inserted template
    sql = f''' SELECT t.uid FROM templates as t WHERE t.userID = {userID} and t.name = {title} 
            '''
    
    cur.execute(sql)
    tempID = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()
    print(f"temp id: {tempID}")

    # RN assumeing images is an array of base64 encoded strings... However I will most likely have to do some string manipulation to turn in array
    for i in images:
        insertImage(tempID,images)


def insertUser(name, password):
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()

    newPass = hashlib.sha1(password.encode('utf-8')).hexdigest()

    sql = f'''INSERT INTO users(username,password) VALUES ("{name}","{newPass}")'''
    
    cur.execute(sql)
    conn.commit()
    cur.close()
    conn.close()
    

def insertTemplate(userID, title, labels):
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()

    sql = f'''INSERT INTO templates(userID,name,tier_labels) VALUES ({userID},"{title}","{labels}")'''

    cur.execute(sql)
    conn.commit()
    cur.close()
    conn.close()


def insertTierListTable(userID, tempID, rankings):
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()

    sql = f'''INSERT INTO tierLists(userID,templateID,rankings) VALUES ({userID},{tempID},"{rankings}")'''


    cur.execute(sql)
    conn.commit()
    cur.close()
    conn.close()


def insertImage(tempID, image):
    conn = sqlite3.connect(DBNAME)

    cur = conn.cursor()

    sql = f'''INSERT INTO images(templateID,image) VALUES ({tempID},{image})'''

    cur.execute(sql)
    conn.commit()
    cur.close()
    conn.close()


def convertToBinaryData(filename):
    # Convert digital data to binary format
    with open(filename, 'rb') as file:
        blobData = file.read()
    return blobData


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
    cursor.execute("DROP TABLE IF EXISTS tierList")
    cursor.close()
    conn.commit()
    conn.close()

def testDB():
    insertUser("Jake","badPassword")
    insertUser("Levi","badPassword")
    insertTemplate(2,"marioList","S,A,B,C,D,F")
    insertTierListTable(2,1,"S:Mario,Luigi,Bowser/A:Peach,Wario/F:Daisy,Toad")

    conn = sqlite3.connect(DBNAME)

    cursor = conn.cursor()
    sSql =  '''
            SELECT * FROM users
            '''
    cursor.execute(sSql)
    result = cursor.fetchall()
    print(result)



    
    fSql = ''' SELECT u.uid, u.username FROM users as u
            INNER JOIN templates ON u.uid=templates.userID
            '''
    cursor.execute(fSql)
    result = cursor.fetchall()
    print(result)

    cursor.close()
    conn.close()


    createTemplate()

if __name__ == "__main__":
    dropTables()
    populateDB()
    testDB()