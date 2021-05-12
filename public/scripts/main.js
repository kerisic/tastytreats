$(document).ready(function () {
    $("#submit").click(function (e) {
        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let message = document.getElementById('message').value;

        if (name.length == 0) {
            alert("Please input a name");
        } else if (email.length == 0) {
            alert("Please input an email");
        } else if (message.length == 0) {
            alert("Please input a message");
        }
    });

    $('h1').click(function () {
        window.location.replace('/')
    });
});