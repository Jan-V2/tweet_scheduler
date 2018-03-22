from pprint import pprint

import tweepy
import argparse
import os
import sh

tweet_text_filename = "tweet_text.txt"

# for debug
# create_test_double_log(results, keys, tweeted_games_log_path)
# for line in get_tweeted_games_log(tweeted_games_log_path):
#     print(str(line))

def get_api():
    pass

def delete_cron_line(unique_id):
    pass

def get_media_ids(folder_path):
    pass

def get_tweet_text(folder_path):
    pass

#todo arguments path is standard -u for unique string -t if it's a test
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("path", type=str,
                        help="the path to a tweetdata folder")
    parser.add_argument("-u", "--unique_string", type=str,
                        help="the unique string that will be used to delete a line from the crontab")
    parser.add_argument("-t", "--test", help="whether this is a test or not.\n if so then the tweet won't actually be send.", action="store_true")
    args = parser.parse_args()
    path = args.path
    u_str = args.unique_string
    is_test = args.test
    if not os.path.isdir(path):
        raise Exception("Path argument is not a directory.")
    else:
        files = [f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))]
        if tweet_text_filename not in files:
            raise Exception("No tweet_text.txt at the provided path.")

    crontab = sh.crontab("-l").stdout.decode("ascii")
    try:
        crontab.index(u_str)
    except ValueError:
        raise Exception("The crontab does not contain the unique string.")


    # check path exitst
    # check is unique string is in crontab
    #
    #
    # send_tweet = False
    # delete_cron_line = False
    # api = get_api()
    # mediaids = get_media_ids()
    # if mediaids == None:
    #     api.update(get_tweet_text(path))
    # else:
    #     api.update(get_tweet_text(path), mediaids=mediaids)
