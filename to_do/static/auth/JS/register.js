$(document).ready(function(){

    validate_inputs();

    delete_flash_alert();
})

function validate_inputs(){
    $('#register').click(function(){
        let username = $('#username').val();
        let password = $('#password').val();
        let email = $('#email').val();
        
        if(password == '' || email == '' || username == ''){
            alert('All inputs are required');
            return false;
        }
    });
}

function delete_flash_alert(){
    let alert = $('#flash-message');
    if (alert.length > 0 ){
        setTimeout(function(){
            setTimeout(function(){
                alert.remove();
            },1000);
            alert.removeClass('show').addClass('remove');
        },2000);
    }
}