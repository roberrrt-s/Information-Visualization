import json
import operator

# finds the most referenced subreddits in the dataset
def get_most_ref_subs(amount):

    with open('source_target.json') as f:
        data = json.load(f)

        subreddits = {}

        for edge in data:

            # check if subreddit has already been added to dict, if so increase amount
            if edge['TARGET_SUBREDDIT'] in subreddits:
                subreddits[edge['TARGET_SUBREDDIT']] += 1

            # if new subreddit, add it to dict
            else:
                subreddits[edge['TARGET_SUBREDDIT']] = 1

        sorted_subs = sorted(subreddits.items(), key=operator.itemgetter(1), reverse=True)

        top_subs = sorted_subs[:amount]

        with open('top%dmostrefsubs.txt' % amount, 'w') as outfile:
            json.dump(top_subs, outfile)

# finds the subreddits with the most crossposts in the dataset
def get_most_posts_subs(amount):

    with open('source_target.json') as f:
        data = json.load(f)

        subreddits = {}

        for edge in data:

            # check if subreddit has already been added to dict, if so increase amount
            if edge['SOURCE_SUBREDDIT'] in subreddits:
                subreddits[edge['SOURCE_SUBREDDIT']] += 1

            # if new subreddit, add it to dict
            else:
                subreddits[edge['SOURCE_SUBREDDIT']] = 1

        sorted_subs = sorted(subreddits.items(), key=operator.itemgetter(1), reverse=True)

        top_subs = sorted_subs[:amount]

        with open('top%dmostpostssubs.txt' % amount, 'w') as outfile:
            json.dump(top_subs, outfile)


get_most_ref_subs(150)
get_most_posts_subs(150)
