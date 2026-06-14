import parser

if __name__ == '__main__':
    load_path = input("Input the realtive file name of the wanted txt exam file relative to the top level CWD (propably 'online-exam-system/')\n")
    save_path = input("Input the realtive file name of the file, where the data should be saved as a JSON file, relative to the top level CWD (propably 'online-exam-system/') \n")

    parser.parse(load_path, save_path)