# tweet_scheduler
A webapp that allows you to upload tweets and schedule them.

I know you can do this in tweetdeck, but i don't like tweetdeck that much..
Besides i just thought it'd be a fun  project.

### features
+ A website on which you can upload tweets to be automatically send out at time of your choosing.
+ The ability to attach a gif or an image(s) to your tweet.
+ A webpage where you can view your scheduled tweets and see when they will be sent out. 
On this page you can also delete any scheduled tweets.
+ Both client and serverside validation.
+ Logging for both the server and the posting script.

### Installation
First make sure that you that you have installed the following: python 3 or higher, virtualenv, npm
and make sure that you are on a linux machine, that has cron available.

Also make sure that you have a set of twitter api keys. if you don't have them, get them [here](https://developer.twitter.com/en/docs/basics/authentication/guides/access-tokens).

Then open up a terminal, in the directory in which you want to install the program and paste the following commands.

````bash
git clone https://github.com/johnvanderholt/tweet_scheduler.git tweet_scheduler
cd tweet_scheduler/
npm install
cd posting_script
mkdir venv
virtualenv ./venv/ --python=python3.5
./venv/bin/pip3 install -r reqs.txt
````

Then create a file called twitter_api_key in the posting_script directory, and paste in you twitter api keys, each on a seperate line, in the following order.
1. consumer key
2. consumer secret
3. access token
4. access token_secret

If you don't have api keys you can get them [here](https://developer.twitter.com/en/docs/basics/authentication/guides/access-tokens).

### Usage
Once you have successfully completed the installation, open up a terminal window in the 
project directory, and type `npm start`. 

Then open your browser and go to `http://localhost:3000/` to access the website.

### Features you could contribute.
I'm done with this project. but if you want to you could still help improve it.
+ It's not crossplatform. it uses cron for scheduling so you'd have to run it on a linux server. 
So you could add a crossplatform scheduler.
+ Improving the interface. I just dropped in a basic template, so there is quite a lot of room for impovement.
+ A login system that identifies specific users and safely stores their api keys. 
It currently only supports 1 user, and he/she has to manually paste their api keys into a file.


Hope you enjoy :).
