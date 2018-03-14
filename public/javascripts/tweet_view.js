
function seconds_to_timestring(secs) {
    const m = Math;
    const secs_minutes = 60;
    const secs_hours = 60 * secs_minutes;
    const secs_days = 24 * secs_hours;

    let seconds = secs % secs_minutes;
    let minutes = m.floor(secs / secs_days);
    let hours = m.floor(secs / secs_days);
    let days = m.floor(secs / secs_days);

    function get_str(count, name, add_comma_space) {
        let ret = "";
        if (count > 0){
            ret += count + " " + name;
            if (count > 1){
                ret += "s"
            }
        }
        if (ret !== "" && add_comma_space){
            ret += ", "
        }
        return ret;
    }
    return get_str(days, "day", true) + get_str(hours, "hour", true) + get_str(minutes, "minute", true) + get_str(seconds, "second", false)
}


$("document").ready((e) => {

    $("ul#tweet_list").click((e) => {
        let id = e.originalEvent.target.id;
        let btn_str = "button_";
        if(id.indexOf(btn_str) === 0) {
            if(confirm("Are you sure you would like to delete this tweet.")){
                let dir = $("input#dir_label_" + id.replace(btn_str, "")).val();
                $.post("/delete_dir",
                    {dir: dir},
                    function (data, status) {
                        if (data === "Success") {
                            console.log("1");
                            location.reload(true);
                        }else {
                            console.log("2");
                            alert(data)
                        }
                    });
            }}
    });

    let n_tweets = + $("input#n_tweets")[0].value;
    let seconds_per_update = 1;

    function update_timestamps() {
        for (let i in _.range(n_tweets)){
            let val_field =  $("#timestamp_val_" + i);
            let secs = val_field.val();
            let timestamp = $("#timestamp_" + i);
            if (secs > 0){
                val_field.val(secs - seconds_per_update);
                timestamp.text("This will be posted in about " + seconds_to_timestring(secs))
            } else {
                timestamp.text("This tweet should have been posted!");
            }
        }
    }

    update_timestamps();
    let timestamp_updater = setInterval((e) => {update_timestamps()}, seconds_per_update * 1000);
});