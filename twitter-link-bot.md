# Twitter link aggregating bot

So this project is yet another attempt to assuage the creeping horror at the shear amount of information added online, and my inability to come anywhere close to comprehending it.  Twitter is an amazing source of semi-structured data that mirrors what communities are currently discussing, and various bots exist to [cross-post stories](http://devel.uttendorfer.net/hn-bot-top-stories/), [predict economic trends based on people's emotions](http://arxiv.org/abs/1010.3003), and [easily note new items of interest](http://blog.andrewcantino.com/blog/2014/03/17/know-when-the-world-changes-with-huginn/).  Writing bots seemed pretty painless, so I decided to take a stab at it.

## The bot

The bot is based on the [tweepy](http://www.tweepy.org/) python library, which provides a wonderful interface to the Twitter API and to the tweets themselves.  As mentioned above, the hope is to tap some tiny portion of the deluge of info on Twitter, and compress it.  Specifically, I would like to see the popular links on twitter for topics I'm interested in.  I decided to start with robotics, as that is a subject I'm really interested in, and a new enough field that cool robots often hit the internet before they hit papers.

My goal was to get this done fast and easy.  I run Jupyter on a Digital Ocean VPS, so I can access and run python code from anywhere on the internet.  Since I would only use this 2-3 times a day, a streaming approach seemed too heavyweight-it would be easy to fail and loose content, requiring more monitoring infrastructure that I didn't want.  The twitter REST API provides the ability to search tweets-with this, and the tweepy documentation, I could collect tweets containing certain terms.  A (literal) rough sketch of the code is below:
![image](images/twitter-link-bot/code.png)

Step one is the authentication.  This is mostly done following the tweepy documentation: Log into twitter, got to apps.twitter.com, and register an new app.  From this, you can get the `consumer key` and `consumer secret`, which are necessary to do the OAuth-dance.  The code below will use the `consumer key` and `consumer secret` to request an OAuth URL.

```
import tweepy
consumer_key = "XXX"
consumer_secret = "XXX"
auth = tweepy.OAuthHandler(consumer_key,consumer_secret)
redirect_url = auth.get_authorization_url()
print redirect_url
```

You should see something like `u'https://api.twitter.com/oauth/authorize?oauth_token=XXXX'`.  If you go to that URL (without the leading 'u' or quotation marks), you'll get a numeric OAuth key.  Plug that key into the line below
```
access_token = auth.get_access_token('OAuth key')
```
And tweepy will fetch the access token and associated secret.  If you `print access_token`, you'll see a tuple with two strings; the first is the `access_token` itself, the second is the `access_token_secret`.  Using these four strings (the `consumer_key`, `consumer_secret`, `access_token` and `access_token_secret`), we can now use the twitter API!

So, I want to pass (or, in this case, hard-code) a list of terms, which tweepy will use to search for recent tweets, then aggregate the most popular links, and display them.  Below is the code:
```
import collections, tweepy, copy

#create twitter session
consumer_key = u'X'
consumer_secret = u'X'
access_token = u'X'
access_token_secret = u'X'
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)

#Terms to search
terms = ['robotics','robots','automata']
results = {}

#search for each term, and add the results to a dictionary-maximum 1000 tweets per term
for term in terms:
    tweets = []
    print 'Finding tweets containing the word {}'.format(term)
    for tweet in tweepy.Cursor(api.search,
                           q=term,
                           count=100,
                           result_type="recent",
                           include_entities=True,
                           lang="en").items():
        tweets.append(copy.deepcopy(tweet))
        if len(tweets)>=1000:
            break
    results[term] = copy.deepcopy(tweets)
    print 'Done'

#for each term, print some basic stats, find the most oft-tweeted terms, and print them in a nice list
for term in terms:
    print ''
    urls = []
    for tweet in results[term]:
        try:
            for u in tweet.entities['urls']:
                urls.append(u['expanded_url'])
        except:
            pass
    print 'Found {} tweets containing "{}," first tweet at {}'.format(len(results[term]),term,results[term][-1].created_at)
    print 'Fourd {} URLs'.format(len(urls))
    url_counter = collections.Counter(urls)
    print "{}: Top 10 most common URLs:".format(term)
    for u in url_counter.most_common(10):
        print "{}\t{}".format(u[1],u[0])
```

The first ~10 lines are just importing useful libraries, and boilerplate to authenticate with twitter.  Line 13 has the good stuff, where we list terms we want to search twitter for.  Due to API rate limiting, there should be a maximum of ~15 terms, but I haven't come anywhere close to that yet.  We also create an empty dictionary, to hold the tweets we get from the each search term.

The next block of code (lines 15-29) downloads the actual tweets.  For each term in the list from earlier, a search request is made, and the tweets returned are iterated over.  Each tweet is added to the `tweets` array, up to a maximum of 1000 tweets.  The `tweet` array is then copied into the `results` dictionary, using the search term as a key.  I make a copy using `copy.deepcopy`, as I've been burned enough times by mutability that I tend to make copies of complex objects before sticking them in arrays to process.

The next block (lines 31-46) actually gives us the results we want.  For each term, the URL's are pulled out from each tweet and stored in a separate array.  There will be a lot of duplicated URLs--this is a good thing! We stick the array into a `Counter` object (line 41).  This is a type provided by the standard `collections` library, and it will count the number of occurrences of an item in an iterable.  It gives us the nice `most_common()` function, which we use to get the most common URLs, which we print along with their count.  Done!

This has already proved a handy tool for me, bringing up news items on robots that I would otherwise miss as they fail to hit the ranks of Hacker News or reddit.  My next steps include de-shortening the URLs, and using likes and retweet data to improve the counting approach.
