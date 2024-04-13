$(document).ready(function(){
    

    validate_inputs();
    delete_flash_alert();
});

function register_button_listener(){
    $('body').on('click','#registrar', function(){
        window.location = '/auth/register';
    });
}

function validate_inputs(){
    $('body').on('click','#login', function(){
        let username = $('#username').val();
        let password = $('#password').val();
        
        if(password == '' || username == ''){
            alert('All inputs are required');
            return false;
        }
    })
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