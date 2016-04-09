import sys, os, subprocess
import processors

# This file moves up one directory, then uses os.walk to recurse into all lower directories.
# In each directory, it checks the files against the patterns in the processors.patterns list.
# This process is will go through the list, in order, until a pattern matches.  When a pattern matches,
# the functions in the associated function list are run.
#

for root, dirs, files in os.walk('..'):
    print "Entering {}".format(root)
    for f in files:
        processors.match(os.path.join(root,f),processors.patterns)
