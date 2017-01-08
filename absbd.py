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

    #we dump all the config files in a single json document at the top level, so other commands can access the metadata
    with open("absbd_all_configs.json",'w') as f:
        f.write(json.dumps(configs))

    #now that we have the order of items, we execute the command for each item.
    for fn in order:
        #by default, the command is called from the root directory.  If you want path interpolation, use the {loc}, {configs} or {root} block in your command
        #run_loc allows you to change the working directory
        location = os.path.dirname(fn)
        configs_path = os.path.join(workdir, "absbd_all_configs.json")
        if "run" in configs[fn].keys():
            run_data = configs[fn]["run"]
            run_dir = None
            if type(run_data)==dict:
                run_dir = run_data["location"].format(loc=location, root=workdir, configs=configs_path)
                run_command = run_data["command"].format(loc=location, root=workdir, configs=configs_path)
                os.chdir(run_dir)
            else:
                run_command = run_data.format(loc=location, root=workdir, configs=configs_path)
            subprocess.call(run_command, shell=True)
            if run_dir != None:
                os.chdir(workdir)
