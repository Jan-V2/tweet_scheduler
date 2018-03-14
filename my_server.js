let fs = require('fs');
let _ = require("lodash");
let rimraf = require("rimraf");

let tweets_dir = "/public/saved_tweets/";
let abs_path = __dirname+ tweets_dir;

function run(app) {
    app.post("/submit", (req, res) => {
        let data = req.body;
        let save_dir = abs_path + data.datetime + "/";
        fs.mkdir(save_dir);

        let save_image = (idx) => {
            let img_data = data["img" + idx];
            let get_img_type_regex = /image\/(\w+);base64/;
            let clean_image_regex =  /data:image\/\w+;base64,/;

            let img_type = img_data.match(get_img_type_regex)[1];
            let img_data_decoded = img_data.replace(clean_image_regex, "");

            fs.writeFile(save_dir + "img"+idx+"." + img_type, img_data_decoded ,"base64" ,(err) => {
                if(err) {return console.log(err);}});
            console.log("saved image");
        };

        for (let i in _.range(data.img_count)){
            save_image(i);
        }

        fs.writeFile(save_dir + "text.txt" , data.text, function(err) {
            if(err) {return console.log(err);}
        });
        console.log("tweet saved");
        res.send("Success")
    });

    app.post("/delete_dir", (req, res) => {
        let path = abs_path + req.body.dir;
        if (fs.existsSync(path)) {
            rimraf(path, () => {res.send("Success")}, () => {res.send("Could not delete tweet.")});
        }else{
            res.send("The tweet doesn't seem to exist.")
        }
    });
}






module.exports = run;