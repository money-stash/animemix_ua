from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder=".")

@app.route("/")
def index():
    return send_from_directory("pages", "animemix.html")

@app.route("/pages/<path:filename>")
def pages(filename):
    return send_from_directory("pages", filename)

@app.route("/components/<path:filename>")
def components(filename):
    return send_from_directory("components", filename)

@app.route("/scripts/<path:filename>")
def scripts(filename):
    return send_from_directory("scripts", filename)

@app.route("/stylesheets/<path:filename>")
def stylesheets(filename):
    return send_from_directory("stylesheets", filename)

@app.route("/dist/<path:filename>")
def dist(filename):
    return send_from_directory("dist", filename)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(debug=True, port=port)
