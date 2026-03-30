import sqlite3

class Database:
    def __init__(self, db_name="Recicladora.db"):
        self._con = sqlite3.connect(db_name)
        self._cur = self._con.cursor()
        self.update_schema()

    def update_schema(self):
        self._cur.execute("""
        CREATE TABLE IF NOT EXISTS item (
            id INTEGER PRIMARY KEY,
            name TEXT CHECK(length(name) > 0 AND length(name) < 50),
            stock REAL CHECK (stock >= 0),
            unit_mesaure CHECK(unit_mesaure IN ('cantidad', 'kilos', 'litros')),
            price REAL CHECK(price > 0)
        )
        """)
        
        try:
            # Intentar migrar datos de la vieja tabla 'item' a la nueva estructura
            self._cur.execute("""
            INSERT INTO item (id, name, stock, unit_mesaure, price)
            SELECT id, name, stock, unit_mesaure, price FROM item_old
            """)
            self._cur.execute("DROP TABLE item_old")
        except sqlite3.OperationalError:
            # Si no existe la tabla vieja, simplemente continuar
            pass

        self._con.commit()

    def fetch_all(self):
        self._cur.execute("SELECT * FROM item")
        return self._cur.fetchall()

    def buyItem(self, name, stock, unit_mesaure, price):
        # Buscar si ya existe un ítem con el mismo nombre y unidad de medida
        self._cur.execute(""" 
        SELECT id, stock FROM item
        WHERE name = ? AND unit_mesaure = ? 
        """, (name, unit_mesaure))
        result = self._cur.fetchone()

        if result:
            # Si existe, actualizar el stock sumando al existente
            item_id, current_stock = result
            new_stock = current_stock + stock
            self._cur.execute(""" 
            UPDATE item 
            SET stock = ?
            WHERE id = ?
            """, (new_stock, item_id))
        else:
            # Si no existe, insertar nuevo
            self._cur.execute(""" 
            INSERT INTO item(name, stock, unit_mesaure, price)
            VALUES (?, ?, ?, ?)
            """, (name, stock, unit_mesaure, price))
        
        self._con.commit()


    def sell(self, item_id, cantidad):
        self._cur.execute("""
        UPDATE item
        SET stock = stock - ?
        WHERE id = ? AND stock >= ?
        """, (cantidad, item_id, cantidad))
    
        self._con.commit()

    def get_item(self, item_id):
        self._cur.execute("SELECT * FROM item WHERE id = ?", (item_id,))
        return self._cur.fetchone()

    def marketItems(self):
        item_id = int(input("Ingrese ID del producto: "))
    
        item = self.get_item(item_id)

        if not item:
            print("Producto no encontrado")
            return

        id_, name, price, stock, unit = item

        print(f"Producto: {name}")
        print(f"Precio por {unit}: {price}")
        print(f"Stock disponible: {stock}")

        cantidad = float(input(f"Ingrese cantidad en {unit}: "))

        if cantidad > stock:
            print("No hay suficiente stock")
            return

        total = cantidad * price
        print(f"Total a pagar: {total}")

        confirm = input("Confirmar venta? (s/n): ")

        if confirm.lower() == "s":
            self.sell(id_, cantidad)
            print("Venta realizada")
        else:
            print("Venta cancelada")



    def close(self):
        self._con.close()


def getConnection():
    return sqlite3.connect("Recicladora.db")
