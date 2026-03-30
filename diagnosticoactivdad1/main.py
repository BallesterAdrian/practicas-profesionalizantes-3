import tkinter as tk
from backend.control.controller import appControl
from frontend.gui.view import Itemview

if __name__ == "__main__":
    root = tk.Tk()

    control = appControl()
    app = Itemview(root, control)

    root.mainloop()