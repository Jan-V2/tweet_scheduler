let fs = require('fs');
let _ = require("lodash");
let rimraf = require("rimraf");
let utils = require("./my_node_utils");
let helpers = require("./helper_funcs");

let tweets_dir = "/public/saved_tweets/";
let rootdir = utils.get_parent_dir(__dirname);
let abs_path_tweets_dir = rootdir + tweets_dir;
let posting_script_path = rootdir + "/posting_script/post_main.py";
let posting_script_env_path = rootdir + "/posting_script/venv/bin/python3";

function run(app) {

    app.post("/submit", (req, res) => {
        let data = req.body;
        let datetime_str = data.datetime;
        let datetime = undefined;
        try {
            datetime = helpers.dir_name_to_timestamp(datetime_str);
        }catch(err) {
            log.e(err);
            res.send("Recieved invalid timestamp.")
        }
        //validation
        if(data.text._length > 280){ res.send("The text of the tweet is longer than the max of 280.")}
        if( datetime <= Date.now()){
            res.send("Could not save tweet. The scheduled time has to be after the current time.")
        }

        // Saves the tweet
        let save_dir = abs_path_tweets_dir + datetime_str + "/";
        fs.mkdir(save_dir);

        for (let i in _.range(data.img_count)){//todo verify
            save_image(i);
        }
        fs.writeFile(save_dir + "tweet_text.txt" , data.text, function(err) {
            if(err) {return console.log(err);}
        });

        append_to_cron(get_cronline(datetime, save_dir));

        log.e("tweet saved");
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

        function get_cronline(datet, path) {
            let u_id = utils.get_random_aplhanumeric(10);
            let ret = "";
            let spc = " ";
            ret += datet.getMinutes() + spc + datet.getHours() + spc + datet.getDay() + spc + datet.getMonth() + " * ";
            ret += posting_script_env_path + spc + posting_script_path + spc + path + " -u \"" +u_id + "\" -k -t";
            return ret;
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