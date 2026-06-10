import parser

load_path = input("Input the realtive file name of the wanted exam file (.txt) \n")

save_path = input("Input the realtive file name of the file, where the data should be saved as a JSON file \n")

parser.parse(load_path, save_path)