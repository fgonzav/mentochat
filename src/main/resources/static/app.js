class Message{
	constructor(id, name, content){
		this.id = id;
		this.name = name;
		this.content = content;
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
    var socket = new SockJS('/chat-wsock');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/chat', function (msg) {
            id = JSON.parse(msg.body).id;
            showMessage(JSON.parse(msg.body).name, JSON.parse(msg.body).content);
        });
        stompClient.send("/app/connect", {}, new Message(null, $("#name").val(), null).toJson());
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendMessage(message) {
    stompClient.send("/app/handle", {}, new Message(id, null, message).toJson());
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
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendMessage($("#message").val()); });
});