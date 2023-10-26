$(document).ready(function(){
    enableRegisterButton();
    // Start validation to enable register button
    $('#password').on("change", function(){
        enableRegisterButton();
    });
    $('#re_password').on("change",function(){
        enableRegisterButton();
    });
    $('#username').on("change",function(){
        enableRegisterButton();
    });
    //End validation to enable register button

    //Validate inputs
    $('#register').click(function(){
        username = $('#username').val();
        password = $('#password').val();
        re_password = $('#re_password').val();
        
        if(password == '' || re_password == '' || username == ''){
            alert('All inputs are required');
            return false;
        }
        if(password != re_password){
            alert('The passwords must to be the same');
            return false;
        }
    });
})

function enableRegisterButton(){
    let password = $('#password').val();
    let re_password = $('#re_password').val();
    let username = $('#username').val();
    
    if (password == '' || re_password == '' || username == ''){
        $('#register').prop('disabled', true);
    }
    else{
        $('#register').prop('disabled', false);
    }
}