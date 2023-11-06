$(document).ready(function() {
    //Check if some radio input (filter) changed
    $('body').on('change', '.filter-list input[type=radio]', function () {
        
        //standard filters and their functions 
        const FILTERS = {
            'all': allTodo,
            'planned': planned,
            'today': today,
            'important': important
        }
        
        //Current filter selected
        let radio = $(this).val();
        
        //All the to-do asociated to it's filter
        const todo = FILTERS[radio] ? FILTERS[radio]() : filter(radio);
    });    
})

//Request and show all todo
function allTodo(){
    url = "/activities";
    $.get(url, function(data){
        printTodo(data);
    });
}

//Request and show all todo planned
function planned(){
    url = "/activities/planned";
    $.get(url, function(data){
        if(data != null){
            printTodo(data);
        }else{
            alert('Something went wrong');
        }
    });
}

//Request the 
function today(){
    url = "/activities/today";
    $.get(url, function(data){
        if(data != null){
            printTodo(data);
        }else{
            alert('Something went wrong');
        }
    });
}

function important(){
    url = "/activities/importants";
    $.get(url, function(data){
        if(data != null){
            printTodo(data);
        }else{
            alert('Something went wrong');
        }
    });
}

function filter(category){
    url = "/activities/category" ;
    $.get(url,{category_id:category}, function(data){
        if(data != null){
            printTodo(data);
        }else{
            alert('Something went wrong');
        }
    });
}

function printTodo(data){
    $('#to_do-list-container').empty();
    $.each(data,function(index,todo){
        if(todo != null){
            let todo_div = buildTodo(todo);
            $('#to_do-list-container').append(todo_div);
        }
    });
}

function formatTimestamp(timestamp) {
    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString('es-ES', options).replace(/[/]/g, '-').replace(/,/, ' at ');
    return formattedDate;
}

function buildTodo(todo){

    //Title
    const titleTag = $('<h3>').text(todo.name);
    const strike = $('<strike>').text(todo.name);
    const titleStrike = $('<h3>').append(strike);
    const title = todo.completed ?  
        $('<div>').addClass('to_do_element_title').append(titleStrike) :
        $('<div>').addClass('to_do_element_title').append(titleTag);
    
    //Description
    const description = $('<div>').addClass('to_do_element_description').append($('<p>').text(todo.description));

    //Completed element1
    const completedCheckbox = todo.completed ?  
        $('<input>').addClass('completed').attr({'type': 'checkbox', 'checked': 'checked', 'name': 'completed'+todo.id, 'id': 'completed'+todo.id}) :  
        $('<input>').addClass('completed').attr({'type': 'checkbox',  'name': 'completed'+todo.id, 'id': 'completed'+todo.id});

    const completedLabel = $('<label>').attr('for','completed'+todo.id).text('Completed');
    const completed = $('<div>').addClass('element1').append(completedCheckbox, completedLabel);

    //Important element2
    const importantCheckbox = todo.important ? 
        $('<input>').addClass('important').attr({'type': 'checkbox', 'checked': 'checked',  'name': 'important'+todo.id, 'id': 'important'+todo.id}) :
        $('<input>').addClass('important').attr({'type': 'checkbox',  'name': 'important'+todo.id, 'id': 'important'+todo.id});

    const importantLabel = $('<label>').attr('for','important'+todo.id).text('Important');
    const important = $('<div>').addClass('element2').append(importantCheckbox, importantLabel);
    
    //Category - element3
    const category = $('<div>').addClass('element3').text(todo.category + ' ').append($('<i>').addClass('fa-solid fa-layer-group'))
    
    //OPTIONS 1
    const grid_options = todo.category != 'null' ? 
        $('<div>').addClass('grid-operations').append(completed, important,category):
        $('<div>').addClass('grid-operations').append(completed, important);

    const options1 = $('<div>').addClass('to_do_element_options-1').append(grid_options);
    
    //Date
    const date_text = todo.end_at ? formatTimestamp(todo.end_at) : 'Undefined';
    const iconDate = $('<i>').addClass('fa-regular fa-clock');
    const date_div = $('<div>').addClass('to_do_element_date').append($('<p>').text(date_text+' ').append(iconDate));

    //OPTIONS 2
    const iconEdit = $('<i>').addClass('fa-regular fa-pen-to-square').css({'padding-left': '10px'});
    const link = $('<a>').attr('href', '/'+todo.id+'/update').text(' Editar');
    const button_edit = $('<div>').addClass('button-stable').append(iconEdit, link);
    const options2 = $('<div>').addClass('to_do_element_options-2').append(button_edit);

    //Crear todo
    const todo_div = $('<li>').addClass('to_do_element').append(title, description, options1, date_div,options2);
    
    return todo_div;
}
