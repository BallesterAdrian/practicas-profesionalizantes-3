from backend.server.db import getConnection
from backend.server.db import Database

def buyItem(name, stock, unit_mesaure, price):
    db = Database()
    db.buyItem(name, stock, unit_mesaure, price)
        
def getAllItem():
    with getConnection() as conex:
        cursor = conex.cursor()
        cursor.execute("SELECT id, name, stock, unit_mesaure, price FROM item")
        return cursor.fetchall()
    
def marketItems(id_item, stock):
    with getConnection() as conex:
        cursor = conex.cursor()
        cursor.execute(
            "UPDATE item SET stock = stock - ? WHERE id = ? AND stock >= ?",
            (stock, id_item, stock)
        )
        if cursor.rowcount == 0:
            return False
        conex.commit()
        return True
    
def get_item(id):
    with getConnection() as conex:
        cursor = conex.cursor()
        cursor.execute(" SELECT * FROM item WHERE id = ?", (id,))
        return cursor.fetchone()

