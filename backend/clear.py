import os
import shutil
from pathlib import Path

default_paths = ['backend/results/','backend/JSON/', 'exams/']

for default_path in default_paths:
    for item in os.listdir(default_path):
        path = f"{default_path}{item}"
        if input(f"You are about to remove the file or folder at {path}. To confirm, please write the path:\n") == path:
            if Path(path).exists():
                if Path(path).is_file():
                    os.remove(path)
                elif Path(path).is_dir():
                    shutil.rmtree(path)
        else:
            continue
