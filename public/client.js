var socket = io();

//listen server-send-username
socket.on('server-send-fail', (data) => {
    alert(`${data} exist`);
});


socket.on('server-send-usersOnline', (data) => {
    $("#boxContent").html("");
    data.forEach((user) => {
        $("#boxContent").append("<div id='users'>" + user + "</div>");
    });
    
});

socket.on('server-send-success', (data) => {
    $("#loginForm").hide(2000);
    $("#chatForm").show(1000);
    $("#currentUser").html(data);
});

//server send msg

socket.on('server-send-msg', (data) => {
    $("#listMessages").append("<p>" + data.name + ": " + data.msg + "</p>");
});


$(document).ready(function(){
    $("#loginForm").show();
    $("#chatForm").hide();

    //send username
    $("#btnRegister").click(function(){
        socket.emit('client-username', $("#username").val());
    });

    //client send message
    $("#btnSendMessage").click(function(){
        socket.emit('client-send-msg', $("#txtMessage").val());
        $("#txtMessage").val('')
    });
    
    //logout
    $("#btnLogout").click(function(){
        socket.emit('logout');

        $("#chatForm").hide(2000);
        $("#loginForm").show(1000);
        
    })

})

