import re
import json

def read_file(path):
    with open(path, "r", encoding="utf-8") as file:
        return [line.rstrip() for line in file]
      
import re


def convert_latex(text):
    return re.sub(r"\$(.*?)\$", r"\\(\1\\)", text)


def get_content(filename):
    data = {
        "title": None,
        "code": None,
        "time": None,
        "questions": []
    }

    with open(filename, "r", encoding="utf-8") as file:
        lines = [line.rstrip() for line in file]

    i = 0

    while i < len(lines):
        line = lines[i].strip()

        # Metadata
        if line.startswith("TITLE:"):
            data["title"] = line.split(":", 1)[1].strip()

        elif line.startswith("CODE:"):
            data["code"] = line.split(":", 1)[1].strip()

        elif line.startswith("TIME:"):
            data["time"] = int(line.split(":", 1)[1].strip())

        # Question
        elif line.startswith("QUESTION"):
            q = {}

            # Read question type
            start = line.find("TYPE=")
            end = line.find(")")
            q["type"] = line[start + 5:end]

            # Skip blank lines
            i += 1
            while i < len(lines) and lines[i].strip() == "":
                i += 1

            # Read question text
            q["question"] = convert_latex(lines[i].strip())

            # Multiple Choice
            if q["type"] == "multiple-choice":
                q["options"] = []
                q["correct"] = None

                # Find OPTIONS:
                while i < len(lines) and "OPTIONS:" not in lines[i]:
                    i += 1
                i += 1

                option_number = 0

                while i < len(lines):
                    current = lines[i].strip()

                    if current == "":
                        i += 1
                        continue

                    if current.startswith("QUESTION"):
                        i -= 1
                        break

                    if current.startswith("-"):
                        option = current[1:].strip()

                        # Check for correct answer marker
                        is_correct = option.endswith("*")
                        if is_correct:
                            option = option[:-1].strip()

                        # Convert LaTeX
                        option = convert_latex(option)

                        if is_correct:
                            q["correct"] = option_number

                        q["options"].append(option)
                        option_number += 1

                    i += 1

            # Number question
            elif q["type"] == "number":
                q["answer"] = None

                while i < len(lines):
                    current = lines[i].strip()

                    if current.startswith("ANSWER:"):
                        q["answer"] = float(current.split(":", 1)[1].strip())

                    if current.startswith("QUESTION"):
                        i -= 1
                        break

                    i += 1

            data["questions"].append(q)

        i += 1

    return data

def write_JSON(path, content):
    data = json.dumps(content, indent=4)
    with open(path, 'w', encoding='utf-8') as file:
        file.write(data)

def parse(read_path, save_path):
    write_JSON(save_path, get_content(read_path))




