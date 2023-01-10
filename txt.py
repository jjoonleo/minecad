
import os


f = open("./blockInfo.txt", 'r')
f_out = open("./blockInfoOut.txt", 'w')


path = "./public/static/textures"
file_list = os.listdir(path)

blocks = []

while True:
    line = f.readline()
    if not line:
        break
    if not (line[0] == '/' or line[0] == " "):
        if (line.split("(")[0].lower() + ".png" in file_list):
            f_out.write(line.split("(")[0].lower()+"*")
            f_out.write(line.split("(")[1].split(")")[0]+"\n")
            blocks.append(line.split("(")[0]+".png")
line = f.readline()
print(line)
f.close()
f_out.close()


for block in blocks:
    if not (block in file_list):
        print(block)
