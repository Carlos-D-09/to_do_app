$(document).ready(function() {
    $('body').on('click', '#add-category', function(){
        if ($('#pop-up-form-category').length == 0){
            form = '<div class="pop-up-form-category" id="pop-up-form-category">'+
                        '<div class="flash" id="error-category"></div>' +
                        '<br><label for="title">Name</label><br>' +
                        '<input class="input-text" type="text" placeholder="Name" id="title" name="title"><br>' +
                        '<br><label for="desc">Description:</label><br>' +
                        '<input class="input-text" type="textarea" rows="5" columns="50" placeholder="Description" id="desc" name="desc"><br>' +
                        '<br>' +
                        '<div class="options-category">' +
                        '    <button class="button-stable" style="display: inline;" id="save-category">Guardar</button>' +
                        '    <button class="button-danger" id="cancel-category">Cancel</button>' +
                        '</div>'+
                    '</div>';
            $(form).insertAfter("#add-category");
        }
    });

    $('body').on('click', '#cancel-category', function(){
        if($('#pop-up-form-category').length != 0){
            $('#pop-up-form-category').remove();
        }
    });

    $('body').on('click', '#save-category', function(){
        title = $('#title').val();
        desc = $('#desc').val(); // <- aquí faltaba el símbolo de "#" antes de "desc"
        if(title == '' || desc == ''){
            alert('All inputs are required');
        }
        url = "/category/create";
        inputs = {
            title: title,
            desc: desc
        }

        $.post(url,inputs, function(data){
            if(data['success'] == true){
                $('#pop-up-form-category').removeClass("pop-up-form-category");
                $('#pop-up-form-category').remove();
                $('#success-transaction').append('Category added successfully');
                setTimeout(function (){
                    $('#success-transaction').empty();
                }, 5000);
            }
            else{
                $('#error-category').append("Something went wrong")
            }
        });
    });
})