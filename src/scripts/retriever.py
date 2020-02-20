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

print(find_subscribed_subreddits())