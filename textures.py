f_out = open("./textures.txt", 'w')
f = open("./blockInfoOut.txt", 'r')

while True:
    line = f.readline()
    if not line:
        break
    line = line[:-1].split("*")
    string = '\t"'+line[0]+'":{\n\t\t"name":"'+line[0].title()+'",\n\t\t"id":"'+line[1].split(",")[0]+'",\n\t\t"textures":{\n\t\t\t"side":{\n\t\t\t\t"file":"'+line[0]+".png"+'",\n\t\t\t},\n\t\t},\n\t},\n'

    f_out.write(string)



f.close()
f_out.close()