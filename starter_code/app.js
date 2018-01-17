//hide
$('.main-container').hide();
//login
var provider = new firebase.auth.GoogleAuthProvider();
var user;

//write the login listener here
$('#login_button').click(loginWithGoogle);

//write the signIn function here
function loginWithGoogle(){
    firebase.auth().signInWithPopup(provider)
        .then(function(result) {
            user = result.user;
            $('.login-container').hide();
            $('.main-container').show();
            setUser();
        });
}

//write the setUser function
function setUser(){
    $('.users-container').html(
        `
            <li>
                <img src="${user.photoURL}" alt="user">
                <p>${user.displayName}</p>
            </li>
        `
    )
}

//send the message
$('#send_message').click(saveMessage);

//write the save message
function saveMessage(){
    firebase.database().ref("chat").push({
        text:$('#message_text').val(),
        photoURL:user.photoURL,
        displayName: user.displayName,
        date: Date.now()
    });
    $('#message_text').val("");

}

//write the function to read the messages
firebase.database().ref("chat").on("child_added", function(snap){
    var message = snap.val();
    console.log(message.photoURL, message.text);
    $('.messages-box').append(
        `
            <li class="list-group-item">
                    <img src="${message.photoURL}" alt="user">
                    <span>${message.text}</span>
                </li>
        `
    );
    $('.messages-box').scrollTop($('.chat-box').height() + 8000);
});


//finally write the logout function and listener
$('#logout_button').click(logOut);

function logOut(){
    firebase.auth().signOut();
    $('.login-container').show();
    $('.main-container').hide();
}

//plus
$('#message_text').keydown(function(e){
    console.log(e.which);
    if(e.which === 13){
        saveMessage();
    }
});
