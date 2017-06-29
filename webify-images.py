import os, subprocess, glob, sys

pngs = glob.glob("*.png")
jpgs = glob.glob("*.jpg")
gifs = glob.glob("*.gif")

def is_web(fname):
    fn = fname.split(".")[-2]
    if len(fn)<4:
        return False
    return fn[-4:]=='-web'

def rename(fname):
    fn = fname.split(".")
    fn[-2] = fn[-2]+"-web"
    fn = fn.join(".")
    return fn

for p in pngs:
    if not is_web(p):
        print "Converting {}".format(p)
        fn = rename(p)
        command = ["convert" p "-depth" "24" "-define" "png:compression-filter=1" "-define" "png:compression-level=9" "-define" "png:compression-strategy=2" fn]
        subprocess.call(command)
    else:
        print "Skipping {}".format(p)

for j in jpgs:
    if not is_web(j):
        print "Converting {}".format(j)
        fn = rename(j)
        command = ["convert" j "-quality" "80" fn]
        subprocess.call(command)
    else:
        print "Skipping {}".format(j)

for g in gifs:
    if not is_web(g):
        print "Converting {}".format(g)
        fn = rename(g)
        command = ["convert" g "-layers" "Optimize" fn]
        subprocess.call(command)
    else:
        print "Skipping {}".format(g)
