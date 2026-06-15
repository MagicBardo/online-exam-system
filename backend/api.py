from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

def saveData(data):
    folder = f"backend/results/{data['exam']}"
    os.makedirs(folder, exist_ok=True)

    time = data["finishedTime"].replace(":", "-").replace(",", "")

    filename = f"{data['name']}_{time}.json"
    path = os.path.join(folder, filename)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

@app.route("/submit", methods=["POST"])
def submit():

    data = request.get_json(silent=True)

    # validate
    # check if data received
    if data is None:
        return {"error": "No JSON received"}, 400
    
    # check required fileds
    required = [
    "name",
    "class",
    "exam",
    "answers"
    ]

    for field in required:
        if field not in data:
            return {
                "error": f"Missing field: {field}"
            }, 400

    # check instances of important parameters
    if not isinstance(data["exam"], str):
        return {"error": "Exam must be string"}, 400

    if not isinstance(data["answers"], list):
        return {"error": "Answers must be list"}, 400

    if not isinstance(data["name"], str):
        return {"error": "Name must be string"}, 400

    # save
    saveData(data)

    return jsonify({
        "status": "success"
    })

app.run()