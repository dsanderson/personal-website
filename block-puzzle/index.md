# Block Puzzle Solver

Ryan, one of the postdocs in our lab, keeps two wooden puzzles on his desk at school.  He mentioned he had written a computer program to solve one puzzle, but the other remained unsolved.  Obviously, I couldn't let a challenge like that stand, so I dedicated way too much time solving it on my own computer.

The puzzle involves assembling several shapes into a 3X4X5 rectangular prism.  A picture of the assembled puzzle is below, as well as the silhouette of each individual shapes.  First, let's make some terminology:

* **Shape**: One of the puzzle pieces
* **Pose**: A particular rotation and position of a particular shape.  Each shape has several possible poses, and the complete puzzle will have a single pose for each shape.
* **State**: A collection of poses, representing a partially (or completely!) solved puzzle.  In a *valid* state, each shape only appears zero or one times, and none of the poses overlap.

![](/block-puzzle/solved-web.jpg)

![](/block-puzzle/shapes-web.jpg)

## Starting out

My language of choice is python.  While this complicates writing anything fast or scalable, I wanted to treat this puzzle as more of a logic/algorithm puzzle than relying on pure speed, in the vein of [Project Euler](https://projecteuler.net/).  So, the starting point was deciding how to represent the state of the puzzle.  Upfront, I expected a *lot* of time would go into checking the puzzle for completion, checking for collisions, and adding and removing shapes.  After a while, I decided to represent the state of the puzzle as a single, 60-bit number, where each bit represents a particular cubic space in the puzzle, and a 1 bit indicates that space is filled.  This allows overlaps to be identified by taking a bitwise **OR** and checking if the result isn't zero, and allows states to be combined through a simple bitwise **AND**.  One nice result is that poses can be stored as states of a single shape.  This also provided an elegant way of handling symmetries in the poses: I could brute-force the various rotations and positions of each shape, saving it as a set.  I've put the code at the end of the post: it generates a list-of-lists, one for each shape, with all the possible poses for that shape, and saves it to the pickled file "poses.pcl".  With this file (or just the shape data from the code), you can try solving it better :P

If you're wondering the number of poses for each shape, wonder no more!
```
█████ Has 12 poses
________________
██ Has 133 poses
________________
███
  ██ Has 224 poses
________________
████
█ Has 224 poses
________________
 █
███
 █ Has 40 poses
________________
████
 █ Has 224 poses
________________
███
  █
  █ Has 160 poses
________________
███
 █
 █ Has 160 poses
________________
██
 ██
  █ Has 160 poses
________________
███ Has 86 poses
________________
 █
███
  █ Has 320 poses
________________
██
 █
 ██ Has 160 poses
________________
███
█ █ Has 252 poses
```

## No brute strong enough :(

Multiplying the number of poses for each shape together tells us how many states we'd need to check if we wanted to naively brute force the problem.  The answer is about 326e25, which is a *lot*.  If we could check one state per nanosecond, it would take us 7 times the age of the universe to check them all.  So, we need *some* simple speedups.  For my first attempt, there were two major tricks.  As we work our way through the shapes, adding them one at a time, we remove poses from shapes yet-to-be-added that would overlap with the poses we've already added.  This both shrinks the search space significantly as we add more shapes, and allows us to abort a particular search path early if a particular shape can't fit in anywhere.  Second, we try shapes with fewer possible poses first.  The hope was, since we remove poses greedily, this would shrink the search space for later shapes as efficiently as possible.  However, because I wanted to try something fast, I fixed the order of shapes upfront, based on their total number of unique poses.

## Solving puzzles on a geological timescale...

After processing all of the shapes into poses, we end up with...

...

About 6000 years to exhaust the space.  I left the code running over night, as I only care about getting a single solution, but no luck.

## And slightly less geological

This is when my roommate [Josh](http://ketts.tech) had a suggestion.  Rather than just discarding states when we run out of poses, we discard states when they contain an unfillable hole.  This is a bit slower, as we need to run all remaining poses for all remaining shapes on each state (though there probably exists some ideal tradeoff between how frequently we check and how many poses remain), but it did bring our solve time down to ~4,500 years!

## Failed attempts to be clever

First off, was trying what I already did with the individual shapes, at a higher level.  My hope was, by precomputing combinations of shapes into smaller regions (say, a single layer of the box, or the corners), I would find a lot of the combinations were impossible, and thus have a smaller number of partial states to brute-force for the final solve.  It didn't work; I couldn't find a well-defined intermediate region to fill, that was both easy to brute force (could be filled with a small number of shapes), and had a small number of possible solutions (so we could assemble the intermediate states into final solutions quickly).  At this point, I was kinda frustrated with attempts that would search exhaustively, so I decided to throw a quick simulated annealer at it.  It's surprisingly easy to write a (bad) annealer; I adapted mine from [stack overflow](https://stackoverflow.com/questions/19757551/basics-of-simulated-annealing-in-python).  Again, no luck; running overnight found no solutions.

## The solution

Was something I should have done at the beginning.  Remember how I mentioned that I fixed the order to try shapes upfront, with shapes with the fewest unique poses going first?  I switched that over to pick, after adding each shape, the shape with the fewest *remaining* poses.  This approach found dozens of solutions, and found the first one almost instantly.

The lesson?  If you think you have a strategy, make sure the strategy executes on the most up-to-date information possible, before giving up.

Below is the solution, shown as the position of each individual shape.

```
Shape 0:
#####  -----  -----
-----  -----  -----
-----  -----  -----
-----  -----  -----

Shape 1:
-----  -----  #----
-----  -----  #----
-----  -----  -----
-----  -----  -----

Shape 2:
-----  #----  -----
-----  #----  -----
-----  #----  #----
-----  -----  #----

Shape 3:
-----  -----  -----
-----  -----  -----
-----  -----  -----
-----  ####-  ---#-

Shape 4:
-----  -----  -----
#----  -----  -----
#----  -----  -----
###--  -----  -----

Shape 5:
-----  -----  -----
-----  -----  --#--
-----  -----  --##-
-----  -----  -##--

Shape 6:
-----  -----  -----
-----  -----  -----
-#---  -###-  -#---
-----  -----  -----

Shape 7:
-----  -----  -----
---#-  -###-  -#---
-----  -----  -----
-----  -----  -----

Shape 8:
-----  -----  -----
-##--  -----  -----
--##-  -----  -----
---#-  -----  -----

Shape 9:
-----  -----  -####
-----  -----  ---#-
-----  -----  -----
-----  -----  -----

Shape 10:
-----  -###-  -----
-----  -----  -----
-----  -----  -----
-----  -----  -----

Shape 11:
-----  ----#  -----
----#  ----#  ----#
-----  ----#  -----
-----  -----  -----

Shape 12:
-----  -----  -----
-----  -----  -----
----#  -----  ----#
----#  ----#  ----#
```

## The pose-generating code

```
import copy, pickle

box_x = 5
box_y = 4
box_z = 3

def points2num(points):
    raw = copy.deepcopy([0]*box_x*box_y*box_z)
    for p in points:
        i = p[0]+p[1]*box_x+p[2]*box_x*box_y
        raw[i] = 1
    #assembly into string
    s = [str(r) for r in raw]
    s = ''.join(s)
    #convert to number
    n = int(s,2)
    return n

def check_bounds(shape):
    bounds = True
    for p in shape:
        if p[0]<0 or p[0]>=box_x:
            bounds = False
            break
        if p[1]<0 or p[1]>=box_y:
            bounds = False
            break
        if p[2]<0 or p[2]>=box_z:
            bounds = False
            break
    return bounds

def shift_shape(shape):
    for x in xrange(box_x):
        for y in xrange(box_y):
            for z in xrange(box_z):
                new_shape = []
                for p in shape:
                    new_shape.append((p[0]+x,p[1]+y,p[2]+z))
                yield copy.deepcopy(new_shape)

def get_unique_poses(shape, rotations):
    uniques = set()
    rots = rotate_shape(shape, rotations)
    for r in rots:
        for s in shift_shape(r):
            if check_bounds(s):
                uniques.add(points2num(s))
    l = list(uniques)
    l.sort()
    return l

def rotate_shape(shape, rotations):
    rots = []
    for r in rotations:
        new_shape = []
        for p in shape:
            point = ((r[0][0]*p[r[1][0]]), (r[0][1]*p[r[1][1]]), (r[0][2]*p[r[1][2]]))
            new_shape.append(copy.deepcopy(point))
        rots.append(tuple(new_shape))
    return rots

#L appears in 3 and
s0 = ((0,0,0),(0,0,1),(0,0,2),(0,0,3),(0,0,4)) #5 long
s1 = ((0,0,0),(0,0,1)) #2 long
s2 = ((0,0,0),(0,0,1),(0,0,2),(0,1,2),(0,1,3)) #assemetric z
s3 = ((0,0,0),(0,0,1),(0,1,0),(0,0,2),(0,0,3)) #L
s4 = ((0,0,0),(0,0,1),(0,1,1),(0,-1,1),(0,0,2)) #cross
s5 = ((0,0,0),(0,0,1),(0,1,1),(0,0,2),(0,0,3)) #short off t
s6 = ((0,0,0),(0,0,1),(0,0,2),(0,1,2),(0,2,2)) #big L (symmetric)
s7 = ((0,0,0),(0,0,1),(0,1,1),(0,2,1),(0,0,2)) #normal t
s8 = ((0,0,0),(0,0,1),(0,1,1),(0,1,2),(0,2,2)) #staircase
s9 = ((0,0,0),(0,0,1),(0,0,2)) #3 long
#s10 = ((0,0,0),(0,0,1),(0,0,2),(0,0,3),(0,1,3)) #L again >:(
s10 = ((0,0,0),(0,0,1),(0,-1,1),(0,0,2),(0,1,2))
s11 = ((0,0,0),(0,0,1),(0,1,1),(0,2,1),(0,2,2)) #normal z
s12 = ((0,0,0),(0,1,0),(0,0,1),(0,0,2),(0,1,2)) #u

rotations = [((-1, -1, -1), (0, 1, 2)), ((-1, -1, -1), (0, 2, 1)), ((-1, -1, -1), (1, 0, 2)), ((-1, -1, -1), (1, 2, 0)), ((-1, -1, -1), (2, 0, 1)), ((-1, -1, -1), (2, 1, 0)), ((-1, -1, 1), (0, 1, 2)), ((-1, -1, 1), (0, 2, 1)), ((-1, -1, 1), (1, 0, 2)), ((-1, -1, 1), (1, 2, 0)), ((-1, -1, 1), (2, 0, 1)), ((-1, -1, 1), (2, 1, 0)), ((-1, 1, -1), (0, 1, 2)), ((-1, 1, -1), (0, 2, 1)), ((-1, 1, -1), (1, 0, 2)), ((-1, 1, -1), (1, 2, 0)), ((-1, 1, -1), (2, 0, 1)), ((-1, 1, -1), (2, 1, 0)), ((-1, 1, 1), (0, 1, 2)), ((-1, 1, 1), (0, 2, 1)), ((-1, 1, 1), (1, 0, 2)), ((-1, 1, 1), (1, 2, 0)), ((-1, 1, 1), (2, 0, 1)), ((-1, 1, 1), (2, 1, 0)), ((1, -1, -1), (0, 1, 2)), ((1, -1, -1), (0, 2, 1)), ((1, -1, -1), (1, 0, 2)), ((1, -1, -1), (1, 2, 0)), ((1, -1, -1), (2, 0, 1)), ((1, -1, -1), (2, 1, 0)), ((1, -1, 1), (0, 1, 2)), ((1, -1, 1), (0, 2, 1)), ((1, -1, 1), (1, 0, 2)), ((1, -1, 1), (1, 2, 0)), ((1, -1, 1), (2, 0, 1)), ((1, -1, 1), (2, 1, 0)), ((1, 1, -1), (0, 1, 2)), ((1, 1, -1), (0, 2, 1)), ((1, 1, -1), (1, 0, 2)), ((1, 1, -1), (1, 2, 0)), ((1, 1, -1), (2, 0, 1)), ((1, 1, -1), (2, 1, 0)), ((1, 1, 1), (0, 1, 2)), ((1, 1, 1), (0, 2, 1)), ((1, 1, 1), (1, 0, 2)), ((1, 1, 1), (1, 2, 0)), ((1, 1, 1), (2, 0, 1)), ((1, 1, 1), (2, 1, 0))]

shapes = [s0,s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12]

poses = []
for s in shapes:
    poses.append(tuple(get_unique_poses(s,rotations)))

for i,p in enumerate(poses):
    print 'Shape {}:\t{} poses'.format(i,len(p))

tot = 1
for p in poses:
    tot = tot*len(p)
print '{} trivial combinations'.format(tot)

f = open('poses.pcl','wb')
pickle.dump(poses,f)
f.close()
```
