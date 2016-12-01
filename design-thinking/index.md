# How to think design

In this post, I'm going to do my best to explain the core insights of design thinking, and just enough of the tools that have been developed over the years to be dangerous.

Design Thinking has become a bit of a buzz word lately, but it's become a buzz word for good reasons.  The success of applying design thinking to different industries and problems (look at IDEO, or Frog) is kinda like the success of the manufacturing revolution of the 80's and 90's, or of robust engineering (I chose those examples because they're the ones I'm most familiar with).  For me, for each of these three movements (and many others) there are two important aspects. First, each movement has a small set of rules, observations or perspectives that really define the movement and capture most of the insights.  A smart, motivated team could take just those observations and develop, on their own and in fairly short order, approaches that would get them 80% of the way there.  Second, each of these movements has had a lot of smart people spend a lot of time studying, measuring and thinking through applications of those rules and insights, and learning these methods can get you further, faster, than trying to rederive them yourself.

To that end, I'm going to start by sharing my take on what are the key insights for design thinking.  After that, I'll walk through several tools that we find really useful and widely applicable in out projects.

## My Key Insights for Design Thinking

I always feel there are a few key insights to understanding a new concept.  In the case of the manufacturing revolutions, two of those insights would be to match you manufacturing metrics as closely as possibly to company profit/revenue, and to instrument **everything**.  The core goal of most institutions in applying design thinking is to do a better job meeting customer needs, which in the long term can lead to customer growth, better market lock-in, and new products.  In my view, this breaks down into two components: How do we discover user needs and understand how well they are satisfied, and how do we generate ideas to fill those needs?  Building products without anyone actually having a need to be fulfilled is a classic failure mode for big companies and startups alike, while finding a need which excites customers then doing a terrible job executing on it disappoints everyone (look at most recent video game remasters).  For the first problem, **finding and evaluating user needs**, the insights I consider key are:

+ **Users don't know what they want**: Simply asking users what they want does not provide useful responses, generally.  Instead, it's much better to study users as they interact with your product/problem, and derive needs from their actions
+ **Only the users really know what problems they face**: Opposite the first point, non-users speculating as to what the real problems are will usually be even more wrong.  This point may seems really obvious, but it is dangerously easy to inject your own views, from poorly crafted interview questions to cherry-picking responses.
+ **"Users" can refer to much more than just then end user**: The phrase "stakeholders" is often used here.  This is really a matter of how you scope you design process, but you can generally treat groups such as your support or manufacturing teams as users and consider their needs in designing products.  Likewise, you may discover people using your product who you never expected to buy it.  An oft-cited example is Oxo, who designed their products for arthritics and old people, but discovered most adults enjoy comfortable cookware.

And that's it! In my view, if you keep those 3 points in mind and are diligent in ensuring you don't violate them, you'll do a far better job than most in discovering opportunities to please your users. As for the second problem, **generating good ideas**, I try to stick to the following ideas:

+ **More ideas at the start = better final idea**: This is another observation that may seem obvious, but has inspired a whole field in it its own right.  The easiest way to generate more *good* ideas, is to generate more ideas overall.  Likewise, you want to generate ideas that are *different* from ones you already have.  This is where concepts like fixation become important, and the structure of your design process (especially feedback and metrics) can have a huge impact, both positive and negative
+ **Experience is useful**: While coming up with a bunch of whacky, implausible ideas is fun and has use at some points in the process, experience and understanding of user needs is important in eventually generating ideas that *work*.  This is where ideas such as co-creation, lead users and empathy techniques become really useful.

Finally, there is one overriding principle: **Iterate**.  How do you tell your idea is good?  You apply the need-evaluating methods to it, generating prototypes.  How do you refine your ideas?  You apply the idea-generating methods.  You iterate frequently, bouncing between methods and motives, refining and generating ideas as appropriate.

## Methods

Now, while I think the ideas mentioned above are critical to producing good designs, lots of smart and experienced people have developed lots of good ways of implementing those principles for particular cases, and using these methods can save a lot of time and trouble.  Here's a brief rundown of the methods we use, and my thoughts on their application

### Discovering user needs

+ Articulated use: You have a person, ideally a typically user, try out your product and record what parts go well & what don't.  You can ask the user to speak through the process, or ask them questions during it.
+ Journey maps/user activity diagrams: In my view, these are kind of a parent of the articulated use.  For these methods, you follow users through their routine, noting what they are doing, what parts went well and what parts didn't, and where users interact.  This info is really useful when designing systems and processes, and helps you discover needs hiding in the interactions between individual products.
+ Likes/dislikes: This is a personal favorite of mine, as it is both relatively low-effort and can be used in a lot of situations.  One challenge in interviewing users directly is asking suitably broad questions.  In this case, you pick a particular activity/feature/subject, and ask the user to talk through what parts they liked, and what parts they didn't.
+ Personas: This is more an information management technique, but you create fake personalities that represent broad categories of users.  This is useful for designers, to quick consider the implications of their decisions on *Persona X*, rather then abstractly referencing some enormous document of user needs.
+ Lead users/empathic lead users: This is another personal favorite.  Lead users are your extreme users, people pushing your project or problem to the limits.  These users will discover potential needs before anyone else, and will often start improvising solutions to their problems.  If you can't study lead users, you can simulate it by, say, having a designer wear oven mitts, or a blindfold, or earplugs, and try to use your product.

The methods above will give you many *insights*, but they don't directly translate to needs.  This is where things can get fuzzy; our usual approach is to make a big document listing our observations, then all the designers individually look through the observations and list what *needs* each observation reveals.  As a group, we then group and sort those *interpreted needs*, and move forward from there.

### Generating ideas

Before listing these methods, it's important to mention fixation.  Fixation is the tendency, even by experienced designers, to have difficulty thinking of different ideas once one idea has been proposed.  Many of these methods are attempting to address this problem.

+ [Mindmapping](https://en.wikipedia.org/wiki/Mind_map).
+ [6-3-5](https://www.youtube.com/watch?v=yCgENHW0nzY): We often pair these two techniques, and they are personal favorites of mine.
+ Analogy: There are many systems out there, such as asknature, which will present you with ideas from other domains which may lead to creative ideas in your own domain.
+ Triz: This is a cool technique that uses a vast dataset of patents to identify common methods of resolving engineering conflicts.  If you can map your problem onto those conflicts, you can get quick descriptions of, abstractly, how others improved their designs.  There are many online tools to assist with applying this technique.
+ Morphological Matrix: If you can break your ideation into different *functions*, you can list all your ideas for solving those functions as lists, then consider designs as paths connecting elements from each list.
+ Pugh Charts: If you know how you'll rank design success, you can place your ideas side-by-side and mark if you think each idea will do well, average or poorly in each category.  You then try to attack the poor-performing aspect of each design.

I hope this is useful!
