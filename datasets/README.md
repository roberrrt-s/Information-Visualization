## start.py tutorial
Use this file to create new JSON files with the specific data you need. For now start.py has the functions get_most_ref_subs()
and get_most_posts_subs(). The former will create a file with the top most references/crossposted subreddits and the latter will show
the subreddits on which the most crossposts have been made (both in descending order).  
  
key: subreddit name  
value: amount of references/posts made
  
To create new files, just call the function you need in start.py with the amount of subreddits you want between the brackets (e.g. 
get_most_ref_subs(150)).
