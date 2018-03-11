let add_image_button = $("button#add_image");
let submit_button = $("input[type='submit']");
let text_area = $("textarea#tweet_text_input");
let char_counter = $("span#char_count");
let filepicker = $('input#filepicker')[0];
let picker_clear_button = $("button#picker_clear");
let datetime_picker_div = $("div#datetime_picker")[0];
let fr = new FileReader();

let max_imgs = 4;
let loaded_image = null;
const image_url_length = 0;
const max_chars = 280;
const get_charcounter_text = () => {return text_area.val().length +  "/"+ max_chars + " characters"};
const clear_filepicker = () => {filepicker.value = ""; picker_clear_button.hide()};


function init() {
    picker_clear_button.hide();
    text_area.val("");
    char_counter.text(get_charcounter_text());
    clear_filepicker();
    $('#timepicker').timepicki({
        show_meridian:false,
        overflow_minutes:true,
        disable_keyboard_mobile: true,
        step_size_minutes:10});
}
init();

$("document").ready(() => {

    picker_clear_button.click((e) => {
        clear_filepicker()
    });

    $("#filepicker").change(function() {
        if (filepicker.files.length > 0){
            console.log("Test");
            picker_clear_button.show()
        }
    });

    text_area.bind('input propertychange', function () {
        char_counter.text(get_charcounter_text());
    });

    $(() => {//This checks if there are less than max n of preloaded_images.
        submit_button.click(function () {
            let $fileUpload = $("input[type='file']");
            let imgs = parseInt($fileUpload[0].files.length);
            if (imgs > max_imgs) {
                alert("You can only upload a maximum of " + max_imgs + " files");
            }
        });
    });

    submit_button.click((event) => {
        let imgs = Array();
        const img_count = filepicker.files.length;
        let tweet_text = text_area.val();

        if (img_count > 0 || tweet_text.length > 0) {
            if (img_count > 0) {
                load_image(onload_callback, filepicker.files[0]);
            } else {
                do_post()
            }
        }

        function do_post() {
            let data = {
                text: tweet_text,
                datetime: new Date().getTime(),
                img_count: img_count
            };

            if (img_count > 0) {
                for (let i in _.range(img_count)) {
                    // noinspection JSUnfilteredForInLoop
                    data["img" + i] = imgs[i]
                }
                console.log();
            }
            $.post("/submit",
                data,
                function (data, status) {
                    console.log("tweet submitted")
                });
        }

        function onload_callback(e) {
            imgs.push(e.target.result);
            if (imgs.length >= img_count) {
                do_post()
            } else {
                load_image(onload_callback, filepicker.files[imgs.length])
            }
        }

        function load_image(onload_callback, file) {
            console.log("test");
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