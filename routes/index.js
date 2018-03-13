let express = require('express');
let router = express.Router();
let my_utils = require("./../my_node_utils");
let _ = require("lodash");
fs = require("fs");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});



router.get('/tweets', function(req, res, next) {
    let root_dir = my_utils.get_parent_dir(__dirname);
    let tweetdirs = my_utils.get_dir_list(root_dir + "/public/saved_tweets");


    function get_tweets() {
        let tweets = Array();
        let text_file_name = "text.txt";

        tweetdirs.map((dir) => {let r = fs.readdirSync(dir);r.push(dir);return r}).reverse().forEach((files) => {
            let tweet = {"img_count": files.length -2};
            let subdir = files[files.length-1].replace(root_dir, "");
            for (let i in _.range(files.length)){
                let file = files[i];
                if (file.indexOf("img") !== -1){
                    let img_name = file.replace(/\.\w+$/, "");
                    let img_save_subdir = subdir.replace("/public", "");
                    tweet[img_name] = img_save_subdir + "/" + files[i]
                }else if (file === text_file_name){
                    let path = "." + subdir + "/" + text_file_name;
                    tweet["txt"] = fs.readFileSync(path, "utf8");
                }else {
                    if (file.indexOf(root_dir) === -1) {
                        throw "The file " + file + " could not be parsed.";}
                }
            }
            tweets.push(tweet)
        });
        return tweets
    }
    let tweets = get_tweets();
    res.render('tweet_list', {tweets:tweets });
});



module.exports = router;
