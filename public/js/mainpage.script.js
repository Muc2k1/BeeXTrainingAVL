// import jquery from "./jquery";

function validate() {
    var specialChars = /[^a-zA-Z0-9 ]/g;
    if (document.login.name.value.match(specialChars)) {
        alert("Player name only characters A-Z, a-z and 0-9 are allowed!")
        document.login.name.focus();
        return false;
    }
    if (document.login.room.value.match(specialChars)) {
        alert("Room name only characters A-Z, a-z and 0-9 are allowed!")
        document.login.room.focus();
        return false;
    }
    return (true);
}
$("#play").click(() => {
    $("#play").css("color", "red");
    $("#describe").css("color", "black");
    $("#play_form").show(100);
    $("#des_form").hide(100);
})
$("#describe").click(() => {
    $("#play").css("color", "black");
    $("#describe").css("color", "red");
    $("#des_form").show(100);
    $("#play_form").hide(100);
})