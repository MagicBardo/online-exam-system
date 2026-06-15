from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)

def saveData(data):
    filename = f"{data['name']}_{data['finishedTime']}.json"
    with open(f'backend/results/{data['exam']}/{filename}.json', 'w', encoding='utf-8') as f:
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
    "student",
    "exam",
    "finishTime",
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
    
    # check if exam exists
    exam = data["exam"]
    path = f"JSON/{exam}.json"

    if not os.path.exists(path):
        return {
            "error": "Exam does not exist"
    }, 400

    # save
    saveData(data)

    return jsonify({
        "status": "success"
    })

app.run()