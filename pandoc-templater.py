import sys, os, glob, subprocess

def default_md(path):
    #get the directory for the utilities, including the header and footer template
    utils_dir = os.path.join(os.getcwd(), 'utils')
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

if __name__ == '__main__':
    path = sys.argv[-1]
    if os.path.isdir(path):
        files = glob.glob(os.path.join(path,'*.md'))
    else:
        files = [path]
    for f in files:
        default_md(f)
