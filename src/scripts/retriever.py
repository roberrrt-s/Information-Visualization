import praw

reddit = praw.Reddit(client_id='kh7fIqiKp5aLpg',
                     client_secret='eK59n4IC4WcVAYvGAAooxlOlmhQ',
                     password='40InfoVis',
                     user_agent='testscript by /u/InfoVis40',
                     username='InfoVis40')

# example, this retrieves the 10 hottest posts on the soccer subreddit
# for submission in reddit.subreddit('soccer').hot(limit=10):
#     print(submission.title)
#     print('--------------------')

# find all subreddits that the user (InfoVis40) is subscribed to
def find_subscribed_subreddits():

    subscribed_subreddits = list(reddit.user.subreddits(limit=None))
    subs = []

    for subreddit in subscribed_subreddits:
        subs.append(subreddit.title)

    return subs


# returns, in descending order, active subreddits based on the amount of karma earned there
# not sure if this works, can't test bc account has no karma yet
def get_subs_karma():

    subreddits = reddit.user.karma()
    subs = []

    for subreddit in subreddits:
        title = subreddit.title
        karma_dict = subreddits[subreddit]
        link_karma = karma_dict[link_karma]
        comment_karma = karma_dict[comment_karma]

        dictionary = {
            'title' : title,
            'link_karma' : link_karma,
            'comment_karma' : comment_karma
        }

        subs.append(dictionary)
        
    return subs

# print(get_subs_karma())
