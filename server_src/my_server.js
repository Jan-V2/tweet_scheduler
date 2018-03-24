let fs = require('fs');
let _ = require("lodash");
let rimraf = require("rimraf");
let utils = require("./my_node_utils");

let tweets_dir = "/public/saved_tweets/";
let abs_path_tweets_dir = utils.get_parent_dir(__dirname) + tweets_dir;

function run(app) {

    app.post("/submit", (req, res) => {
        let data = req.body;
        let save_dir = abs_path_tweets_dir + data.datetime + "/";
        fs.mkdir(save_dir);

        //validation
        if(data.text._length > 280){ res.send("The text of the tweet is longer than the max of 280.")}


        // Saves the tweet
        for (let i in _.range(data.img_count)){//verify
            save_image(i);
        }
        fs.writeFile(save_dir + "tweet_text.txt" , data.text, function(err) {
            if(err) {return console.log(err);}
        });

        console.log("tweet saved");
        res.send("ok");


        function save_image(idx) {
            let img_data = data["img" + idx];
            let get_img_type_regex = /image\/(\w+);base64/;
            let clean_image_regex =  /data:image\/\w+;base64,/;

            let img_type = img_data.match(get_img_type_regex)[1];
            let img_data_decoded = img_data.replace(clean_image_regex, "");

            fs.writeFile(save_dir + "img"+idx+"." + img_type, img_data_decoded ,"base64" ,(err) => {
                if(err) {return console.log(err);}});
            console.log("saved image");
        }

        function append_to_cron(append_str) {
            utils.run_shell_cmd("crontab -l", (err, stdout, stderr) => {
                let cmd = "echo " + "\"" + stdout  + append_str + "\""  + " > ~/temp";
                utils.run_shell_cmd(cmd,(err, stdout2, stderr)  => {
                    utils.run_shell_cmd("crontab "+"~/temp",(err, stdout3, stderr)  => {
                        utils.run_shell_cmd("rm ~/temp",(err, stdout4, stderr)  => {
                            console.log("Sucsessfully installed new crontab.");
                        });
                    });
                });
            });
        }

    });



    app.post("/delete_dir", (req, res) => {
        let path = abs_path_tweets_dir + req.body.dir;
        if (fs.existsSync(path)) {
            rimraf(path, () => {res.send("ok")}, () => {res.send("Could not delete tweet.")});
        }else{
            res.send("The tweet doesn't seem to exist.")
        }
    });
}

module.exports = run;