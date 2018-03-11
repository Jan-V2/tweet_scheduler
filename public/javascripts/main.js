let add_image_button = document.getElementById("add_image");
let submit_button = document.getElementById("submit");
let text_area = document.getElementsByClassName("tweet_text_input")[0];





submit_button.addEventListener("click", (event) => {
    let send = text_area.value;
    console.log(send);
    $.post("submit",
        {
            text: send
        },
        function(data, status){
            alert("Data: " + data + "\nStatus: " + status)
    });
});



