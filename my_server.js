let fs = require('fs');
let _ = require("lodash");

let base_dir = __dirname+"/saved_tweets/";

function run(app) {
    app.post("/submit", (req, res) => {
        let data = req.body;
        let save_dir = base_dir + data.datetime + "/";
        fs.mkdir(save_dir);

        let save_image = (idx) => {
            let img_data = data["img" + idx];
            let get_img_type = /image\/(\w+);base64/;
            let clean_image_regex =  /data:image\/\w+;base64,/;

            let img_type = img_data.match(get_img_type)[1];
            let img_data_decoded = img_data.replace(clean_image_regex, "");

            fs.writeFile(save_dir + "img"+idx+"." + img_type, img_data_decoded ,"base64" ,(err) => {
                if(err) {return console.log(err);}})
        };

        for (let i in _.range(data.img_count)){
            save_image(i);
        }

        fs.writeFile(save_dir + "txt" , data.text, function(err) {
            if(err) {return console.log(err);}
        });
        console.log("tweet saved");
        res.send("sucsess")
    });
}






module.exports = run;