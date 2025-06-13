from flask import Flask, render_template, request, redirect, url_for
import sqlite3
import os

# Initialize Flask with instance folder config
app = Flask(__name__, instance_relative_config=True)

# Ensure instance folder exists
os.makedirs(app.instance_path, exist_ok=True)

# Database path in instance directory
DATABASE = os.path.join(app.instance_path, 'database.db')

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Setup DB
def init_db():
    conn = get_db_connection()
    conn.execute('''CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT, 
                        task TEXT NOT NULL, 
                        isCompleted BOOLEAN NOT NULL DEFAULT 0)''')
    conn.commit()
    conn.close()

init_db()

@app.route("/")
def index():
    conn = get_db_connection()
    todos = conn.execute('SELECT * FROM users').fetchall()
    conn.close()
    return render_template("index.html", todos=todos)

@app.route("/add", methods=["POST"])
def addTask():
    task = request.form.get("task")
    conn = get_db_connection()
    conn.execute('INSERT INTO users (task, isCompleted) VALUES (?, ?)', (task, False))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

@app.route("/delete/<int:id>")
def deleteTask(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM users WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

@app.route("/complete/<int:id>")
def completeTask(id):
    conn = get_db_connection()
    conn.execute('UPDATE users SET isCompleted = 1 WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

if __name__ == "__main__":
    app.run(debug=True)
