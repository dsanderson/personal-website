import sys, os, json

if __name__ == '__main__':
    fnconfigs = sys.argv[-1]
    configs = json.loads(open(fnconfigs, 'r').read())
    articles = []
    for c in configs.keys():
        try:
            if configs[c]["summary"]["type"] == "article":
                articles.append(configs[c]["summary"])
        except KeyError:
            pass
    articles.sort(key = lambda x: x["published"])
    articles = articles[::-1]
    page = ""
    for a in articles:
        datum = """
<div class="article-box"><a href={link}>
    <h2 class="page-title">{title}</h2>
    <p class="catagories">{catagories}</p>
    <p class="description">{description}</p></a>
</div>
""".format(link=a["link"],title=a["title"],catagories=", ".join(a["catagory"]),description=a["description"])
        page += datum
    #add header and footer
    utils_dir = os.path.join(os.getcwd(), 'utils')
    f = open(os.path.join(utils_dir,'index.template'),'r')
    header_blob = f.read()
    f.close()

    f = open(os.path.join(utils_dir,'footer.template'),'r')
    footer_blob = f.read()
    f.close()

    out_file = header_blob + '\n' + page + '\n' + footer_blob

    out_path = "index.html"
    f = open(out_path,'w')
    f.write(out_file)
    f.close()
