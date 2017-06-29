import os, subprocess, glob, sys, fnmatch

pngs = []
jpgs = []
gifs = []

matches = []
for root, dirnames, filenames in os.walk('.'):
    for filename in fnmatch.filter(filenames, '*.png'):
        pngs.append(os.path.join(root, filename))
    for filename in fnmatch.filter(filenames, '*.jpg'):
        jpgs.append(os.path.join(root, filename))
    for filename in fnmatch.filter(filenames, '*.gif'):
        gifs.append(os.path.join(root, filename))

def is_web(fname):
    fn = fname.split(".")[-2]
    if len(fn)<4:
        return False
    return fn[-4:]=='-web'

def rename(fname):
    fn = fname.split(".")
    fn[-2] = fn[-2]+"-web"
    fn = ".".join(fn)
    return fn

for p in pngs:
    if not is_web(p):
        print "Converting {}".format(p)
        fn = rename(p)
        command = ["convert", p, "-quality", "85", "-resize", "600", fn]
        subprocess.call(command)
    else:
        print "Skipping {}".format(p)

for j in jpgs:
    if not is_web(j):
        print "Converting {}".format(j)
        fn = rename(j)
        command = ["convert", j, "-quality", "80", "-resize", "600", fn]
        subprocess.call(command)
    else:
        print "Skipping {}".format(j)

for g in gifs:
    if not is_web(g):
        print "Converting {}".format(g)
        fn = rename(g)
        command = ["convert", g, "-layers", "Optimize", "-resize", "600", fn]
        subprocess.call(command)
    else:
        print "Skipping {}".format(g)
