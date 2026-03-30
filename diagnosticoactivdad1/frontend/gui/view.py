import tkinter as tk
from tkinter import messagebox, ttk, Label, Button
import sys
print(sys.path)
from backend.control.controller import appControl 


class Itemview:
    def __init__(self, root, control):
        self.root = root
        self.control = control
        self.root.title("Sistema de Gestion de la Recicladora MDQ")


        self.carrito = []
        self.total_venta = 0.0
        self.controll = appControl()
        self.name_var = tk.StringVar()
        self.stock_var = tk.StringVar()
        self.unit_mesaure_var = tk.StringVar()
        self.price_var = tk.StringVar()

        self.create_main_windows()
        self.setupFrom()
        self.setupTable()
        self.showItems()


    def create_main_windows(self):
        self.root.configure(bg= "#73cfdb")

        self.main_frame = tk.Frame(self.root, bg= "#56a5af", bd=3, relief= "solid")
        self.main_frame.pack(padx=10, pady=10, fill="both", expand=True)
        title = Label(self.root, text="Menú principal", font=("Arial", 16))
        title.pack(pady=10)

    def showItems(self):
        from backend.modelo.model import getAllItem
        try:
            data = getAllItem()
            print(f"Datos obtenidos: {data}")  # Ver qué devuelve
            if data:
                for item in data:
                    print(item)
            else:
                print("No hay datos en la base de datos")
            self.refreshTable(data)
        except Exception as e:
            print(f"Error al obtener datos: {e}")
            messagebox.showerror("Error", f"No se pudieron cargar los datos: {e}")

    def addItem(self):
        name = self.name_var.get().strip()
        stock = self.stock_var.get().strip()
        unit = self.unit_mesaure_var.get().strip()
        price = self.price_var.get().strip()

        print(f"Valores recibidos -> Name: '{name}', Stock: '{stock}', Unit: '{unit}', Price: '{price}'")

        if not name or not stock or not unit or not price:
            print("Al menos uno de los campos está vacío")
            messagebox.showwarning("Advertencia", "Todos los campos son obligatorios")
            return

        try:
            stock = float(stock)
            price = float(price)
        except ValueError:
            print("Error: Stock o precio no son válidos")
            messagebox.showerror("Error", "Stock y precio deben ser números válidos")
            return

        self.controll.addItem(name, stock, unit, price)
        self.clearInputs()  # Limpiar campos
        self.showItems() 

    def setupFrom(self):
       
        from_frame = tk.Frame(self.root)
        from_frame.pack(padx=10, pady=10)

        tk.Label(from_frame, text="Nombre:").grid(row=0, column=0)
        tk.Entry(from_frame, textvariable=self.name_var).grid(row=0, column=1)

        tk.Label(from_frame, text="Stock disponible:").grid(row=1, column=0)
        tk.Entry(from_frame, textvariable=self.stock_var).grid(row=1, column=1)

        tk.Label(from_frame, text="Tipo de medida:").grid(row=2, column=0)
        tk.Entry(from_frame, textvariable=self.unit_mesaure_var).grid(row=2, column=1)

        tk.Label(from_frame, text="Precio:").grid(row=3, column=0)
        tk.Entry(from_frame, textvariable=self.price_var).grid(row=3, column=1)

        tk.Button(from_frame, text="Comprar items", command=self.addItem).grid(row=4, column=0, columnspan=2)

        #zona venta
        venta_frame = tk.Frame(self.root)
        venta_frame.pack(padx=10, pady=10)

        tk.Label(venta_frame, text="Formulario de Venta").pack()

        tk.Label(venta_frame, text="Seleccione un producto de la tabla").pack()
        
        tk.Label(venta_frame, text="2. Ingrese cantidad a vender:").pack()
        self.entry_cantidad_venta = tk.Entry(venta_frame)
        self.entry_cantidad_venta.pack()

        tk.Button(venta_frame, text="Agregar al Carrito", command=self.agregarAlCarrito).pack(pady=5)

        # Etiqueta para mostrar detalles del producto seleccionado
        self.label_detalle_venta = tk.Label(venta_frame, text="", fg="blue")
        self.label_detalle_venta.pack(pady=5)

        # Botón para actualizar detalles del producto seleccionado
        tk.Button(venta_frame, text="Actualizar Detalles", command=self.actualizarDetalleVenta).pack(pady=5)

        # Botón para procesar toda la venta
        tk.Button(venta_frame, text="Procesar Venta Completa", command=self.procesarVentaCompleta, bg="red", fg="white").pack(pady=10)

        # Etiqueta para mostrar el total actual
        self.label_total_venta = tk.Label(venta_frame, text="Total: $0.00", fg="green", font=("Arial", 12, "bold"))
        self.label_total_venta.pack()

        
    def agregarAlCarrito(self):
        """Agregar un producto al carrito de ventas"""
        item_id = self.getSelectionId()
        if not item_id:
            messagebox.showerror("Error", "Seleccione un producto de la tabla")
            return

        try:
            cantidad = float(self.entry_cantidad_venta.get())
            if cantidad <= 0:
                messagebox.showerror("Error", "Cantidad inválida")
                return
        except ValueError:
            messagebox.showerror("Error", "Ingrese una cantidad válida")
            return

        # Obtener el producto de la base de datos
        from backend.modelo.model import get_item
        item = get_item(item_id)
        
        if not item:
            messagebox.showerror("Error", "Producto no encontrado")
            return

        id_, name, stock, unit, price = item

        if cantidad > stock:
            messagebox.showerror("Error", f"No hay suficiente stock. Disponible: {stock} {unit}")
            return

        # Calcular subtotal
        subtotal = cantidad * price

        # Agregar al carrito
        self.carrito.append({
            'id': id_,
            'nombre': name,
            'cantidad': cantidad,
            'unidad': unit,
            'precio_unitario': price,
            'subtotal': subtotal
        })

        # Actualizar total
        self.total_venta += subtotal
        self.label_total_venta.config(text=f"Total: ${self.total_venta:.2f}")

        # Limpiar campo y mostrar mensaje
        self.entry_cantidad_venta.delete(0, tk.END)
        messagebox.showinfo("Éxito", f"{cantidad} {unit} de {name} agregados al carrito\nSubtotal: ${subtotal:.2f}")

    def procesarVentaCompleta(self):
        """Procesar toda la venta del carrito"""
        if not self.carrito:
            messagebox.showwarning("Advertencia", "El carrito está vacío")
            return

        # Confirmar venta
        detalle_venta = "Resumen de la venta:\n\n"
        for item in self.carrito:
            detalle_venta += f"- {item['cantidad']} {item['unidad']} de {item['nombre']} (${item['precio_unitario']:.2f}/unidad) = ${item['subtotal']:.2f}\n"
        detalle_venta += f"\nTotal: ${self.total_venta:.2f}"

        respuesta = messagebox.askyesno("Confirmar venta", detalle_venta + "\n\n¿Confirmar venta completa?")
        
        if respuesta:
            # Procesar cada ítem en el carrito
            from backend.modelo.model import marketItems
            todos_exitosos = True
            
            for item in self.carrito:
                success = marketItems(item['id'], item['cantidad'])
                if not success:
                    todos_exitosos = False
                    messagebox.showerror("Error", f"No se pudo vender {item['nombre']}")
            
            if todos_exitosos:
                messagebox.showinfo("Éxito", f"Venta completada exitosamente\nTotal: ${self.total_venta:.2f}")
                self.showItems()  # Actualizar tabla
                self.limpiarCarrito()  # Limpiar carrito
            else:
                messagebox.showerror("Error", "Algunas ventas no se pudieron completar")

    def limpiarCarrito(self):
        """Limpiar el carrito de ventas"""
        self.carrito = []
        self.total_venta = 0.0
        self.label_total_venta.config(text="Total: $0.00")
        self.entry_cantidad_venta.delete(0, tk.END)

    def setupTable(self):
        self.tree = ttk.Treeview(self.root, columns=("ID", "Nombre", "Stock", "Tipo", "Precio"), show="headings")
        
        self.tree.heading("ID", text="ID")
        self.tree.heading("Nombre", text="Nombre")
        self.tree.heading("Stock", text="Stock")
        self.tree.heading("Tipo", text="Tipo")
        self.tree.heading("Precio", text="Precio")

        self.tree.pack(padx=10, pady=10)

    def clearInputs(self):
        self.name_var.set("")
        self.stock_var.set("")
        self.unit_mesaure_var.set("")
        self.price_var.set("")

    def showError(self, errors):
        messagebox.showerror("Errores de validación", "\n".join(errors))

    def refreshTable(self, data):
        for row in self.tree.get_children():
            self.tree.delete(row)
        for item in data:
            self.tree.insert("", "end", values=item)
    
    def getSelectionId(self):
        selected = self.tree.selection()
        if selected:
            return self.tree.item(selected[0])["values"][0]
        return None
    
    def getstock(self):
        return float(self.entry_cantidad.get())
    
    def actualizarDetalleVenta(self):
        item_id = self.getSelectionId()
        if item_id:
            from backend.modelo.model import get_item
            item = get_item(item_id)
            
            if item:
                id_, name, stock, unit, price = item
                detalle = f"Producto: {name}\nStock disponible: {stock} {unit}\nPrecio unitario: ${price}"
                self.label_detalle_venta.config(text=detalle)
        else:
            self.label_detalle_venta.config(text="Seleccione un producto de la tabla")

    def sellItem(self):
        item_id = self.getSelectionId()
        if not item_id:
            messagebox.showerror("Error", "Seleccione un producto de la tabla")
            return

        try:
            cantidad = float(self.entry_cantidad_venta.get())
            if cantidad <= 0:
                messagebox.showerror("Error", "Cantidad inválida")
                return
        except ValueError:
            messagebox.showerror("Error", "Ingrese una cantidad válida")
            return

        # Obtener el producto de la base de datos
        from backend.modelo.model import get_item
        item = get_item(item_id)
        
        if not item:
            messagebox.showerror("Error", "Producto no encontrado")
            return

        id_, name, stock, unit, price = item

        if cantidad > stock:
            messagebox.showerror("Error", f"No hay suficiente stock. Disponible: {stock} {unit}")
            return

        # Calcular total
        total = cantidad * price

        # Confirmar venta
        respuesta = messagebox.askyesno("Confirmar venta", 
                                    f"Producto: {name}\n"
                                    f"Cantidad: {cantidad} {unit}\n"
                                    f"Precio unitario: ${price}\n"
                                    f"Total: ${total}\n\n"
                                    f"¿Confirmar venta?")
        
        if respuesta:
            # Realizar la venta
            from backend.modelo.model import marketItems
            success = marketItems(item_id, cantidad)

            if success:
                messagebox.showinfo("Éxito", 
                                f"Venta realizada exitosamente\n"
                                f"Producto: {name}\n"
                                f"Cantidad: {cantidad} {unit}\n"
                                f"Total: ${total}")
                self.showItems()  # Actualizar tabla
                self.entry_cantidad_venta.delete(0, tk.END)  # Limpiar campo
            else:
                messagebox.showerror("Error", "No se pudo realizar la venta")
    
    def actualizarDetalleVenta(self):
        """Actualizar los detalles del producto seleccionado"""
        item_id = self.getSelectionId()
        if item_id:
            from backend.modelo.model import get_item
            item = get_item(item_id)
            
            if item:
                id_, name, stock, unit, price = item
                detalle = f"Producto: {name}\nStock disponible: {stock} {unit}\nPrecio unitario: ${price}"
                self.label_detalle_venta.config(text=detalle)
        else:
            self.label_detalle_venta.config(text="Seleccione un producto de la tabla")