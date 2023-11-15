$(document).ready(function() {
    showForm();
    deleteFormCategory();
    createCategory();
})

// Show form to add category when the user click the option
function showForm(){
    $('body').on('click', '#add-category', function(){
        if ($('#pop-up-form-category').length == 0){
            form = buildForm();
            $(form).insertAfter("#add-category");
        }
    });
}

//Build the form to add a category 
function buildForm(){
    var form = $('<div>').addClass('pop-up-form-category').attr('id', 'pop-up-form-category').append(
        $('<div>').addClass('flash').attr('id', 'error-category'),
        $('<br>'),
        $('<label>').text('Name'),
        $('<br>'),
        $('<input>').addClass('input-text').attr({ type: 'text', placeholder: 'Name', id: 'title', name: 'title' }),
        $('<br>'),
        $('<br>'),
        $('<label>').text('Description:'),
        $('<br>'),
        $('<input>').addClass('input-text').attr({ type: 'textarea', rows: '5', cols: '50', placeholder: 'Description', id: 'desc', name: 'desc' }),
        $('<br>'),
        $('<br>'),
        $('<div>').addClass('options-category').append(
            $('<button>').addClass('button-stable').attr('id', 'save-category').text('Guardar ').css({display: 'inline', "margin-right": '10px'}),
            $('<button>').addClass('button-danger').attr('id', 'cancel-category').text('Cancel')
        )
    );

    return form;
}

// If the user press the button cancel, delete the form to add category
function deleteFormCategory(){
     $('body').on('click', '#cancel-category', function(){
        if($('#pop-up-form-category').length != 0){
            $('#pop-up-form-category').remove();
        }
    });
}

//If the user press the button save, request the server create the category and update the page
function createCategory(){
    $('body').on('click', '#save-category', function(){
        // Get values from the form
        let title = $('#title').val();
        let desc = $('#desc').val();

        //Validate values
        if(title == '' || desc == ''){
            alert('All inputs are required');
        }

        //Request parameters
        let url = "/category/create";
        let inputs = {
            title: title,
            desc: desc
        }
        
        //Send request to the server
        $.post(url,inputs, function(data){
            //If the request is success
            if(data['success'] == true){
                //Delete form and confirm operation to the user
                $('#pop-up-form-category').remove();
                $('#success-transaction').append('Category added successfully');
                
                //Update filters
                updateFilter(data['category']);

                //Confirm the operation to the user
                setTimeout(function (){
                    $('#success-transaction').empty();
                }, 5000);
            }
            else{
                $('#error-category').append("Something went wrong")
            }
        });
    });
}

//Update the filter list
function updateFilter(category){
    if (category == null){
        alert('Your categorie is saved, but something went wrong, please reload the page to see it');
    }else{
        let filter = buildFilterElement();
        $('#custome-filters').append(fiilter);
    }
}

//Build and element to add on the filter list. 
function buildFilterElement(){
    var label = $('<label class="container">').text(category.name);
    var input = $('<input>').attr({
        type: 'radio',
        name: 'radio',
        id: 'category' + category.id,
        value: category.id
    });
    var span = $('<span class="checkmark">');
    label.append(input, span);

    return label;
}