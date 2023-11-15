$(document).ready(function() {
    createTodo();
});

//When the user clicks the button save for create a new todo
function createTodo(){
    $('body').on('click', '#save-todo', function(){
        //Get values in the form
        let name = $('#name').val();
        let description = $('#description').val();
        let category = $('#categories').val();
        let important = $('#important');
        important.is(':checked') ?
            important = 1 :
            important = 0;
        let date = $('#date').val();
        let time = $('#time').val();

        //Validate values required
        if (name == '' || description == '' ){
            alert("Title and description are required");
            return false;
        }

        //Build a json object
        let todo = {
            name: name,
            description: description,
            category: category,
            important: important,
            date: date,
            time: time
        }
        
        //Send request to create a todo
        let url = "/create";
        $.post(url,todo,function(data){
            //If exist and error in the data 
            if(data['error']){
                alert(data['error']);
                return false;
            }
            if(data['success'] == true){
                verifyFilter();
                clearForm();
                alert('The to-do was added succesfully');
            }else{ 
                alert('Something went wrong trying to add a to-do');
            }
        });
    });
}

//Check wich filter is selected and update the list of to-do using that filter
function verifyFilter(){
    var selectedFilter = $('#default-filters input[name="radio"]:checked').val();

    //The functions assigned are implemented on filters.js file, filter function is in that file too
    const FILTERS = {
        'all': allTodo,
        'planned': planned,
        'today': today,
        'important': important,
        'completed': completed
    }

    //Check which filter is select and update the list
    FILTERS[selectedFilter] ? FILTERS[selectedFilter]() : filter(selectedFilter);
}

//Empty the form for create a to-do
function clearForm() {
    $('#name').val('');
    $('#description').val('');
    $('#categories').val(1); 
    $('#important').prop('checked', false);
    $('#date').val('');
    $('#time').val('');
}
