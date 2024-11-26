import tkinter as tk
from tkinter import ttk, messagebox
import math

# Constants
WINDOW_WIDTH = 800
WINDOW_HEIGHT = 600
CANVAS_SIZE = 300
CIRCLE_CENTER = 150
CIRCLE_RADIUS = 100

FRACTIONS = {
    "1": 1,
    "1/2": 0.5,
    "1/3": 1/3,
    "1/4": 0.25,
    "1/8": 0.125
}

class PieChart:
    def __init__(self, canvas, center_x, center_y, radius):
        self.canvas = canvas
        self.center_x = center_x
        self.center_y = center_y
        self.radius = radius

    def draw_fractions(self, fractions):
        self.canvas.delete("all")
        
        # Draw white background circle
        self.canvas.create_oval(
            self.center_x - self.radius - 2,
            self.center_y - self.radius - 2,
            self.center_x + self.radius + 2,
            self.center_y + self.radius + 2,
            fill='white',
            outline='white',
            width=3
        )
        
        # Draw the main circle outline
        self.canvas.create_oval(
            self.center_x - self.radius,
            self.center_y - self.radius,
            self.center_x + self.radius,
            self.center_y + self.radius,
            outline='black'
        )
        
        if fractions:
            start_angle = 0
            
            # Draw each added fraction piece
            for fraction in fractions:
                extent_angle = fraction * 360
                
                # Draw white outline arc
                self.canvas.create_arc(
                    self.center_x - self.radius - 1,
                    self.center_y - self.radius - 1,
                    self.center_x + self.radius + 1,
                    self.center_y + self.radius + 1,
                    start=start_angle,
                    extent=extent_angle,
                    fill='white',
                    outline='white',
                    width=5
                )
                
                # Draw filled blue arc with white outline
                self.canvas.create_arc(
                    self.center_x - self.radius,
                    self.center_y - self.radius,
                    self.center_x + self.radius,
                    self.center_y + self.radius,
                    start=start_angle,
                    extent=extent_angle,
                    fill='blue',
                    outline='white',
                    width=2
                )
                
                start_angle += extent_angle

    # Keep the old draw method for compatibility
    def draw(self, current_sum):
        self.draw_fractions([current_sum] if current_sum > 0 else [])

class FractionPieGame:
    def __init__(self, root):
        self.root = root
        self.root.title("Fraction Pie Game")
        self.root.geometry(f"{WINDOW_WIDTH}x{WINDOW_HEIGHT}")
        
        # Game state
        self.current_sum = 0
        self.selected_fraction = None
        self.fractions = FRACTIONS
        self.added_fractions = []  # Keep track of added fractions
        
        self.setup_ui()
        
    def setup_ui(self):
        # Create main containers
        self.left_frame = ttk.Frame(self.root, padding="10")
        self.left_frame.grid(row=0, column=0, sticky="nsew")
        
        self.right_frame = ttk.Frame(self.root, padding="10")
        self.right_frame.grid(row=0, column=1, sticky="nsew")
        
        # Canvas for pie chart
        self.canvas = tk.Canvas(self.left_frame, width=CANVAS_SIZE, height=CANVAS_SIZE, bg='white')
        self.canvas.grid(row=0, column=0, padx=10, pady=10)
        
        # Initialize pie chart
        self.pie_chart = PieChart(self.canvas, CIRCLE_CENTER, CIRCLE_CENTER, CIRCLE_RADIUS)
        
        # Score display
        self.score_label = ttk.Label(
            self.left_frame,
            text=f"Current Sum: {self.current_sum:.3f}",
            font=('Arial', 14)
        )
        self.score_label.grid(row=1, column=0, pady=10)
        
        # Create draggable fraction buttons with white background
        style = ttk.Style()
        style.configure("Fraction.TLabel", background="white", relief="raised", borderwidth=2)
        
        for i, fraction in enumerate(self.fractions.keys()):
            btn = ttk.Label(
                self.right_frame,
                text=fraction,
                padding=10,
                style="Fraction.TLabel"
            )
            btn.grid(row=i, column=0, pady=5, padx=10, sticky="ew")
            
            # Make the label draggable
            btn.bind("<ButtonPress-1>", self.on_drag_start)
            btn.bind("<B1-Motion>", self.on_drag_motion)
            btn.bind("<ButtonRelease-1>", self.on_drag_release)
        
        # Reset button
        self.reset_btn = ttk.Button(
            self.right_frame,
            text="Reset Game",
            command=self.reset_game
        )
        self.reset_btn.grid(row=len(self.fractions), column=0, pady=20)
        
        self.pie_chart.draw(self.current_sum)
        
    def on_drag_start(self, event):
        widget = event.widget
        widget._drag_start_x = event.x
        widget._drag_start_y = event.y
        self.selected_fraction = widget.cget("text")
        
    def on_drag_motion(self, event):
        widget = event.widget
        x = widget.winfo_x() + event.x - widget._drag_start_x
        y = widget.winfo_y() + event.y - widget._drag_start_y
        widget.place(x=x, y=y)
        
    def on_drag_release(self, event):
        widget = event.widget
        
        # Check if released over the pie chart
        canvas_x = self.canvas.winfo_rootx()
        canvas_y = self.canvas.winfo_rooty()
        canvas_width = self.canvas.winfo_width()
        canvas_height = self.canvas.winfo_height()
        
        mouse_x = self.root.winfo_pointerx()
        mouse_y = self.root.winfo_pointery()
        
        if (canvas_x <= mouse_x <= canvas_x + canvas_width and
            canvas_y <= mouse_y <= canvas_y + canvas_height):
            self.add_fraction(self.selected_fraction)
        
        # Reset the label position
        widget.place_forget()
        widget.grid(
            row=list(self.fractions.keys()).index(widget.cget("text")),
            column=0,
            pady=5,
            padx=10,
            sticky="ew"
        )
        
    def add_fraction(self, fraction):
        new_sum = self.current_sum + self.fractions[fraction]
        
        if new_sum <= 1:
            self.current_sum = new_sum
            self.added_fractions.append(self.fractions[fraction])  # Store the added fraction
            self.score_label.config(text=f"Current Sum: {self.current_sum:.3f}")
            self.pie_chart.draw_fractions(self.added_fractions)  # Pass the list of fractions
            
            if math.isclose(self.current_sum, 1, rel_tol=1e-9):
                messagebox.showinfo(
                    "Congratulations!",
                    "You've reached 1! You won the game!"
                )
        else:
            messagebox.showwarning(
                "Invalid Move",
                "Adding this fraction would exceed 1!"
            )
    
    def reset_game(self):
        self.current_sum = 0
        self.added_fractions = []  # Reset the added fractions list
        self.score_label.config(text=f"Current Sum: {self.current_sum:.3f}")
        self.pie_chart.draw_fractions([])

if __name__ == "__main__":
    root = tk.Tk()
    game = FractionPieGame(root)
    root.mainloop()