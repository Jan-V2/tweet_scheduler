let add_image_button = $("button#add_image");
let submit_button = $("input[type='submit']");
let text_area = $("textarea#tweet_text_input");
let char_counter = $("span#char_count");
let filepicker = $('input#filepicker')[0];
let picker_clear_button = $("button#picker_clear");
let datapicker = $("input[type=date]");
let timepicker = $('#timepicker');

let test = $("button#but");//for testing


let fr = new FileReader();
let today;
let max_imgs = 4;
let loaded_image = null;
const image_url_length = 0;
const max_chars = 280;

//one line funcs
const get_charcounter_text = () => {return text_area.val().length +  "/"+ max_chars + " characters"};
const clear_filepicker = () => {filepicker.value = ""; picker_clear_button.hide()};


function init() {
    picker_clear_button.hide();
    text_area.val("");
    char_counter.text(get_charcounter_text());
    clear_filepicker();
    init_date_and_time_pickers();
}
init();


function init_date_and_time_pickers() {
    let d = new Date();
    timepicker.val(d.getHours() + ":" + d.getMinutes());
    datapicker.val("");
    timepicker.timepicki({
        show_meridian:false,
        min_hour_value:0,
        max_hour_value:23,
        overflow_minutes:true,
        disable_keyboard_mobile: true,
        step_size_minutes:10,
    });
    //preloads the time pickers arrows
    preload_img("../images/top_arr.png","../images/bot_arr.png");
    set_date_min();

    function set_date_min() {
        let _today = new Date();
        let dd = _today.getDate();
        let mm = _today.getMonth()+1; //January is 0!
        let yyyy = _today.getFullYear();
        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }

        _today = yyyy+'-'+mm+'-'+dd;
        today = _today;
        document.getElementById("date-picker").setAttribute("min", today);
    }
}


$("document").ready(() => {


    $("div#main_div").css({
        'width': (text_area.width() + 'px')
    });

    test.click((e) => {
        console.log(datapicker[0].value + "_" + timepicker[0].value.replace(":", "-"));
    });


    picker_clear_button.click((e) => {clear_filepicker()});
    text_area.bind('input propertychange', function () {char_counter.text(get_charcounter_text())});

    $("#filepicker").change(function() {
        if (filepicker.files.length > 0){picker_clear_button.show()}
    });

    submit_button.click((event) => {
        let imgs = Array();
        const img_count = filepicker.files.length;
        let tweet_text = text_area.val();
        let datetime_str = get_time_str();

        if (datetime_str !== null) {
            if (img_count > 0 || tweet_text.length > 0) {
                if (check_image_number()){
                    if (check_time_bounds()) {
                        if (img_count > 0) {
                            load_image(filepicker.files[0]);
                        } else {do_post()}
                    }else{alert("The scheduled time has to be after the current time.")}
                } else{alert("You can only upload a maximum of " + max_imgs + " files")}
            } else {alert("You need to have a tweet, before you can submit it.")}
        } else {alert("Time or date not found please add a time/date")}

        function check_image_number() {
            let $fileUpload = $("input[type='file']");
            let imgs = parseInt($fileUpload[0].files.length);
            return imgs <= max_imgs;
        }

        function get_time_str() {
            let time = timepicker[0].value;
            let date = datapicker[0].value;
            if (time !== "" && date !== "" ){
                return date  + "_" + time.replace(":", "-");
            }else{
                return null
            }
        }

        function check_time_bounds() {
            if (datapicker[0].value === today){
                let _alert = () => {};
                let d = new Date();
                let h = d.getHours();
                let m = d.getMinutes();
                let input = timepicker[0].value.split(":");

                if(+ input[0] < h){
                    return +input[1] >= m;
                }else {
                    return false
                }
            }else{
                return true
            }
        }



        function do_post() {
            let data = {
                text: tweet_text,
                datetime: datetime_str,
                img_count: img_count
            };

            if (img_count > 0) {
                for (let i in _.range(img_count)) {
                    // noinspection JSUnfilteredForInLoop
                    data["img" + i] = imgs[i]
                }
            }
            $.post("/submit",
                data,
                function (data, status) {
                    if (data === "ok"){
                        init();
                        alert("Successfully added tweet.")
                    }else{
                        alert(data);
                    }
                });
        }

        function onload_callback(e) {
            imgs.push(e.target.result);
            if (imgs.length >= img_count) {
                do_post()
            } else {
                load_image(filepicker.files[imgs.length])
            }
        }

        function load_image(file) {
            if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
                alert('The File APIs are not fully supported in this browser.');
                return;
            }

            //fr.readAsText(file);
            fr.onload = onload_callback;
            fr.readAsDataURL(file)
        }
    });

});