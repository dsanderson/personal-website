import os, sys, subprocess, re

def match(path, patterns):
    for pattern in patterns:
        if re.match(pattern[0],path) != None:
            for func in pattern[1]:
                func(path)
            break

def default_md(path):
    #get the directory for the utilities, including the header and footer template
    utils_dir = os.getcwd()
    #get the filename from the path
    f_name = os.path.basename(path)
    print "Print compiling {} to markdown, and adding templates".format(f_name)
    f_path = os.path.dirname(path)
    #remove the filetype from the name
    f_name = f_name.rstrip('.md')
    #create the output path
    out_path = os.path.join(f_path,f_name+'.html')
    #construct the shell command for pandoc
    command = ['pandoc',path,'-o',out_path]
    subprocess.call(command)

    #Add the header and footer
    f = open(out_path,'r')
    f_blob = f.read()
    f.close()

    f = open(os.path.join(utils_dir,'header.template'),'r')
    header_blob = f.read()
    f.close()

    f = open(os.path.join(utils_dir,'footer.template'),'r')
    footer_blob = f.read()
    f.close()

    out_file = header_blob + '\n' + f_blob + '\n' + footer_blob

    f = open(out_path,'w')
    f.write(out_file)
    f.close()

patterns = [
    ('.*\.md$',[default_md]),
]
