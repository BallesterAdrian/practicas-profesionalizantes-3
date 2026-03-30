from backend.validation.validations import validationItem
from backend.modelo.model import buyItem, getAllItem, marketItems, get_item
from backend.server.db import Database
db = Database()

class appControl:
    def __init__(self):
        Database()


    def addItem(self, name, stock, unit, price):
        return buyItem(name, stock, unit, price)


    def getAllItems(self):
        return getAllItem()

    def refreshTable(self):
        data = getAllItem()
        self.view.refreshTable(data)

    def sellSelection(self): #error de logica que despues tengo que ver no pido ninguna variable aqui
        carrito = []
        totall = 0

        while True:
            item_id = self.view.getSelectionId()

            if not item_id or item_id == 0:
                break
        
            item = get_item(item_id)

            if not item:
                print("Producto no encontrado")
                continue

            id_, name, stock, price = item

            cantidad = self.view.getstock()

            if cantidad > stock:
                print("No hay suficiente stock")
                continue

            total = cantidad * price
            totall += total

            carrito.append((item_id, cantidad))

            for item_id, stock in carrito:
                success = marketItems(item_id, cantidad)

                if not success:
                    print("Error en la venta")
                    return

            print(f"Total a pagar: {totall}")    
            self.refreshTable()

        
        

        

        

        





