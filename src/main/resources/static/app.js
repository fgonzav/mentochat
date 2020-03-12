class Message{
	constructor(id, name, content, type){
		this.id = id;
		this.name = name;
		this.content = content;
		this.type = type;
	}

	toJson(){
		return JSON.stringify(this);
	}
}

var stompClient = null;
var id = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#name").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    $("#message").prop("disabled", !connected);
    $("#send").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#chatbox").html("");
}

function connect() {
	if(!validateName())
		return;
    var socket = new SockJS('/chat-wsock');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/chat', function (msg) {

			if(JSON.parse(msg.body).type == 2 && id == JSON.parse(msg.body).id){
				disconnect(true);
				return;
			}

            if(id == null)
                id = JSON.parse(msg.body).id;
            showMessage(JSON.parse(msg.body).name, JSON.parse(msg.body).content);
        });
        stompClient.send("/app/connect", {}, new Message(null, $("#name").val(), null, 1).toJson());
    });
}

function validateName(){
	$("#nameHelp").html("");
	$("#nameHelp").addClass("hide");
	if($("#name").val().trim() == ""){
		$("#name-container").removeClass("has-error");
		$("#name-container").addClass("has-error");

		$("#nameHelp").removeClass("hide");
		$("#nameHelp").html("Empty name is not allowed");
		$("#nameHelp").show();
		return false;
	}
	$("#name-container").removeClass("has-error");
	$("#nameHelp").hide();
	return true;
}

function disconnect(byInactivity) {
    if (stompClient !== null) {
        if(!byInactivity){
            stompClient.send("/app/disconnect", {}, new Message(id, null, null, 2).toJson());
        }
        stompClient.disconnect();
    }
    setConnected(false);
    id = null;
    console.log("Disconnected");
}

function sendMessage(message) {
	if(message.trim() != ""){
        stompClient.send("/app/handle", {}, new Message(id, null, message, 3).toJson());
    }
}

function showMessage(name, message) {
    $("#chatbox").append("<tr><td>" + name + ": " + message + "</td></tr>");
    updateScroll();
}

function updateScroll(){
	$('.conversation-container').scrollTop($('.conversation-container')[0].scrollHeight);
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(false); });
    $( "#send" ).click(function() {
        sendMessage($("#message").val());
        $("#message").val("");
    });
    $("#message").keypress(function (e) {
        if(e.which == 13 && !e.shiftKey) {
            $("#send").click();
            e.preventDefault();
        }
    });
});