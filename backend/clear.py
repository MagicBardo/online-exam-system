import os

default_paths = ['backend/JSON/', 'exams/']

for default_path in default_paths:
    for item in os.listdir(default_path):
        path = f"{default_path}{item}"
        if input(f"You are about to remove the file at {path}. To confirm, please write the path:\n") == path:
            os.remove(path)
        else:
            continue
