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

function run(app, log) {

    app.post("/submit", (req, res) => {
        const img_types = [
            "png", "jpg",
            "jpeg", "gif"
        ];
        let data = req.body;
        let datetime_str = data.datetime;
        let datetime = undefined;

        //validation
        try {
            datetime = helpers.dir_name_to_timestamp(datetime_str);
        }catch(err) {
            log.e(err);
            res.send("Recieved invalid timestamp.")
        }

        // Checks tweet length and timestamp.
        if(data.text._length > 280){ res.send("The text of the tweet is longer than the max of 280.")}
        if(datetime <= Date.now()){
            res.send("Could not save tweet. The scheduled time has to be after the current time.")
        }

        // Extracts the images (if any) and checks the types
        let images = get_images();
        if (!check_image_types(images)){
            res.send("Wrong file types, you can only have 1 gif or 4 images")
        }

        //creates the save dir
        let save_dir = abs_path_tweets_dir + datetime_str + "/";
        try{
            fs.mkdir(save_dir);
        } catch(err) {
            log.e(err);
            res.send("There is another tweet already scheduled at this time and date.")
        }

        // Saves the tweet
        for (let i in _.range(images.length)){
            save_image(images[i], i);
        }

        fs.writeFile(save_dir + "tweet_text.txt" , data.text, function(err) {
            if(err) {return log.e(err);}
        });

        try{
            append_to_cron(get_cronline(datetime, save_dir));
        }catch(err) {
            log.e(err);
            res.send("Could not schedule tweet");
        }

        log.i("tweet saved ok");
        res.send("ok");

        function get_images() {
            let imgs = Array();
            const get_img_type_regex = /image\/(\w+);base64/;
            const clean_image_regex =  /data:image\/\w+;base64,/;
            let max_img_count = 4;
            for (let i in _.range(max_img_count)){
                let img = data["img" + i];
                if (img !== undefined){
                    imgs.push({
                        data:img.replace(clean_image_regex, ""),
                        type:img.match(get_img_type_regex)[1]
                    })
                }
            }
            return imgs;
        }

        function check_image_types(images) {
            // a tweet can only contain 1 gif and up to 4 images. this function checks for that.
            if (images.length > 0){
                let found_gif = false;
                images.forEach((img) => {
                    if (img_types.indexOf(img.type) > -1){
                        if (img.type === "gif"){
                            if (found_gif){
                                return false;
                            }else{found_gif = true}
                        }
                    }else{return false;}
                });
            }
            return true;
        }

        function save_image(img, idx) {
            fs.writeFile(save_dir + "img"+idx+"." + img.type, img.data ,"base64" ,(err) => {
                if(err) {return console.log(err);}});
            log.i("saved image");
        }

        function append_to_cron(append_str) {
            utils.run_shell_cmd("crontab -l", (err, stdout, stderr) => {
                let cmd = "echo " + "\"" + stdout  + append_str + "\""  + " > ~/temp";
                utils.run_shell_cmd(cmd,(err, stdout2, stderr)  => {
                    utils.run_shell_cmd("crontab "+"~/temp",(err, stdout3, stderr)  => {
                        utils.run_shell_cmd("rm ~/temp",(err, stdout4, stderr)  => {
                            log.i("Sucsessfully installed new crontab.");
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