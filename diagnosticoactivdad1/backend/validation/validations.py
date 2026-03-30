def validationItem(name, stock, unit_mesaure, price):
    error = []
    if not name.scrip(): 
        error.append("nombre del item obligatorio")
    if not stock.isdigit() or int(stock) < 0:
        error.append("el stock no puede estar en numeros negativos")
    if not unit_mesaure.scrip(): 
        error.append("elija el tipo de medida correspondiente, cantidad, kilos o litros")
    if not price.isdigit() or int(price) <= 0:
        error.append("el precio tiene que ser mayor de 0")