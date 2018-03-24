from my_utils.platform_vars import *
from my_utils.my_logging import log_message as log, logfile_name, log_and_raise_exept, log_return
import tweepy
import argparse
import os
import sh
import re
import shutil

tweet_text_filename = "tweet_text.txt"
logfile_name = "posting_script"
log_return()

def get_files(path):
    return [f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))]

def get_api():
    with open(ROOTDIR + dir_sep + "twitter_api_key", mode="r", encoding="UTF-8") as file :
        keys = file.read().split("\n")

    consumer_key = keys[0]
    consumer_secret = keys[1]
    access_token = keys[2]
    access_token_secret = keys[3]

    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)

    api = tweepy.API(auth)
    return api

def delete_cron_line(crontab, unique_id):
    tempfile = ROOTDIR + dir_sep + "temp"
    # maybe add recursive func that removes double line returns
    regex = r'.*' + unique_id + '.*'
    crontab = re.sub(regex, "", crontab)
    with open(tempfile, mode="w") as file:
        file.write(crontab)
    try:
        sh.crontab(tempfile)
    except sh.ErrorReturnCode:
        log_and_raise_exept("Could not install new crontab. Crontab was not modified")
    os.remove(tempfile)


def get_media_ids(path, api):
    media_ids = []
    files = get_files(path)
    for i in range(4):
        for file in files:
            present = False
            try:
                file.index("img" + str(i))
                present = True
            except ValueError:
                pass
            if present:
                # from this stackoverflow post https://stackoverflow.com/questions/43490332/sending-multiple-medias-with-tweepy
                media_ids.append(api.media_upload(path+dir_sep+file).media_id)
    if media_ids is []:
        return None
    return media_ids

def get_tweet_text(path):
    with open(path + dir_sep + tweet_text_filename, mode="r", encoding="UTF-8") as file:
        return file.read()


#arguments path is standard -u for unique string (which will be removed from crontab) -t if it's a test -k if you don't want do delete the files afterwards
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("path", type=str,
                        help="the path to a tweetdata folder")
    parser.add_argument("-u", "--unique_string", type=str,
                        help="the unique string that will be used to delete a line from the crontab")
    parser.add_argument("-t", "--test", help="whether this is a test or not.\n if so then the tweet won't actually be send.", action="store_true")
    parser.add_argument("-k", "--keep", help="use this if you don't want to delete the data after posting", action="store_true")
    args = parser.parse_args()
    path = args.path
    unique_id = args.unique_string
    is_test = args.test
    keep_files = args.keep
    if not os.path.isdir(path):
        raise log_and_raise_exept("Path argument is not a directory: " + path)
    else:
        files = get_files(path)
        if tweet_text_filename not in files:
            raise log_and_raise_exept("No tweet_text.txt at the provided path: " + path)
    if unique_id is not None:
        crontab = sh.crontab("-l").stdout.decode("ascii")
        try:
            crontab.index(unique_id)
        except ValueError:
            log_and_raise_exept("The crontab does not contain the unique string: " + unique_id)

    api = get_api()
    tweet_text = get_tweet_text(path)
    media_ids = get_media_ids(path, api)

    if not is_test:
        try:
            if media_ids is None:
                api.update_status(status=tweet_text)
            else:
                api.update_status(status=tweet_text, media_ids=media_ids)
        except Exception as e:
            log(str(e))
            raise e

    if unique_id is not None:
        delete_cron_line(crontab, unique_id)

    if not keep_files:
        shutil.rmtree(path)# not tested

    log("Sucsessfully posted tweet")