$(document).ready(function(){
    googleAuthListener();
    
});

function googleAuthListener(){
    $('#google-auth').on('click',function(){
        window.location.href = "/auth/google-login";
    })
}