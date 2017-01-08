# A Better Site By Design

I like static websites.  They're easy to reason about, they're reliable, and they capture the original intent of how the web would organize information.  When starting this site, I wanted it to have educational value for me.  While that education could have been learning some static site generator and their plugin ecosystem, I decided to build my own system to generate my site (hence the pun on my university's motto, "A Better World By Design").  Here I'll run through the history of how this site works, and my current approach.

## V0: pandoc and python

I like markdown, and wanted to get better at it.  My original intent for this website was to feature text-heavy postings by myself, to talk about my research and side projects.  I decided to use [Pandoc](http://pandoc.org/) to compile markdown posts into html files.  The very original version just dumped all the files into the root directory.  However, I wasn't happy with the lack of organization and all the trailing `.html`s in the urls, so I decided each page went into its own folder, containing a file called `index.md` that would be compiled by pandoc into `index.html`.

This worked for generating the bulk of the content, but I wanted the site to have fancy headers and footers, which seemed tricky through pandoc.  I also needed a way to call pandoc in all the directories containing markdown files.  So, I threw together a quick python script that would walk through the directories, calling pandoc on markdown files, and adding to the head and tail of each compiled html file the content of header.template and footer.template, respectively.  The nice thing about this script is that it was easy to right and had no package dependencies beyond pandoc, so I could run it on my windows machine (where I do most of my writing).

While this approach worked (mostly) for generating articles, it couldn't generate any meta-pages, such as a home page that lists articles.  I was doing that manually, adding new articles by directly editing the home page html, which slowed down the writing process and made it harder to experiment with designs.  Also, I ran into issues with the individual articles; often I would want to modify the html of the page directly, say to change the code highlighting in a code block with highlight.js, or to embed some js widget, or tweak the formatting.  I think all these are possible with Pandoc, but it was clumsy.  Directly editing the compiled html would cause the change to be overwritten anytime I rebuilt the page.

## V1: "Any sufficiently complicated C or Fortran program contains an ad-hoc, informally-specified, bug-ridden, slow implementation of half of Common Lisp."

I took the above quote from Philip Greenspun as inspiration.  Reflecting on the problems I had with manually tweaking the compiled markdown, and the effort in modifying the homepage to include new links, I decided I wanted to be able to basically edit html with more concise markup.  I had been messing around with [Elm](http://elm-lang.org/) (which is really fun!), and had seen some recent Hacker News articles on S-expressions.  So, I decided to create an S-expression compiler.

Again, my goal was to minimize markup without losing flexibility.  That is, I wanted to use arbitrary tags, I wanted to be able to add attributes to those tags easily, and I wanted to be able to ignore as much markup as possible if I didn't need it.  The grammer I settled on is the following: `(tag [[attrs]] [content])`.  A tag is a keyword; if a matching keyword is found in a python dictionary, the function associated with that dictionary item is run.  Otherwise, the tag is used as the html tag name.  This means a paragraph, which might be 7 keystrokes in html, and 2 in markdown, is 4 keystrokes in my markup: `(p )` will compile to `<p></p>`.  If `[attrs]` is included, the content within the square brackets is placed within the tag as attributes.  If no attributes are needed, you can leave out the brackets entirely!  The code attempts to parse parenteticals in the content as s-expressions.  By default, the code has a handful of special tags: `raw` to avoid parsing the contents, and `import` and `import_raw` to load html or s-exressions from a specified file.  More functions can be easily added by passing other python filenames at the command line, files that specify additional tag-function pairs.

I... haven't really used this :-/.  It turns out, the real problem wasn't expressiveness in writing content, but in bespoke behavior on a per-page basis and in managing metadata about pages to generate the home page.  That led me to yet another tool...

## V2: absbd.py

Short for a better site by design, absbd.py is a single file, less than 100 lines long with no dependencies outside the standard library, that compiles this website.  Essentially, it finds all files that end in absbd.json in the directory tree below or at the same level as it.

```
import os, sys, subprocess, json, fnmatch

def glob2(pattern):
    base = os.path.dirname(pattern)
    if base=='':
        base=workdir
    match = os.path.basename(pattern)
    #print base
    #print match
    files = []
    for root, dirnames, fnames in os.walk(base):
        #print root, dirnames, fnames
        for fname in fnmatch.filter(fnames, match):
            #print fname
            files.append(os.path.join(root, fname))
            #print files
    return files

if __name__ == '__main__':
    workdir = os.getcwd()
    #fetch all the configuration files
    files = glob2("*absbd.json")
    if "-t" in sys.argv:
        print files
    #load files to handle dependencies
    configs = {}
    for fn in files:
        with open(fn,'r') as f:
            if "-t" in sys.argv:
                print fn
            configs[fn] = json.loads(f.read())
```

It only cares about two objects in each json file: a list or wildcard of other absbd.json files that must be run in advance of the current file, and a command to run.  The below code handles (non-cyclical) dependencies by, basically, walking the tree of referenced files and enumerating files in the order the walk terminates at them.  Files are then executed in the order they are enumerated.

```
#compute dependency order
  dep_ids = set([-1])
  dep_mapping = {}

  def _compute_dependencies(fn, configs, dep_mapping, dep_ids):
      if fn in dep_mapping:
          return dep_mapping, dep_ids
      elif "dependencies" in configs[fn]:
          #handle list of dependencies
          location = os.path.dirname(fn)
          if type(configs[fn]["dependencies"])==list:
              deps = []
              for g in configs[fn]["dependencies"]:
                  deps += glob2(g.format(loc=location, root=workdir))
          else:
              deps = glob2(configs[fn]["dependencies"].format(loc=location, root=workdir))
          deps = set(deps)
          deps.discard(fn)
          for dep in deps:
              dep_mapping, dep_ids = _compute_dependencies(dep, configs, dep_mapping, dep_ids)
      dep_mapping[fn] = max(dep_ids)+1
      dep_ids.add(max(dep_ids)+1)
      return dep_mapping, dep_ids

  for fn in configs.keys():
      dep_mapping, dep_ids = _compute_dependencies(fn, configs, dep_mapping, dep_ids)

  order = configs.keys()
  order.sort(key = lambda x:dep_mapping[x])
  if "-t" in sys.argv:
      print order
```

It dumps all the json config files into a single global file, so metadata included in the json files can be accessed by later scripts.  Finally, it runs all the specified commands, providing path interpolation for the root directory, the config file directory, and the file containing all the configs.

This allowed me to mostly reuse the pandoc compiling and templating code from earlier, without any trouble using s-expressions in the future.  It also allowed me to generate homepages, by using the json metadata.  A sample config file is below.

```
{"summary":{"title":"A Better Site By Design","description":"Why use something elegant and reliable, when you can build a terrible implementation yourself?",
  "type":"article","catagory":["programming"],"link":"/this-site","published":1483886541},
"run":"python pandoc-templater.py {loc}"}
```

Anyway, I'm pretty happy with things right now.  All this should be on github soon, but in the meantime, this will hopefully motivate me to write more :).
