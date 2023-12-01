import { refreshFilter } from './filter.js';
import { create, updateTags, getTodo, update} from './todo_requests.js';

//This files contains all the functions to manipulate the to-do activities

let currentTodoSelected = 0;

//When the user clicks the button save, create a new to-do
export function createTodo(){
    $('body').on('click', '#save-todo', function(){
        let todo = getTodoFromForm();

        if (todo == false){
            alert("Title and description are required");
            return false;
        }else{
            create(todo).then(data => {
                refreshFilter();
                clearForm();
                alert('The to-do was added succesfully');
            }).catch(error => console.log(error));
        }
        
    });
}

//When the user click the button to update a to-do from the form. Get the todo and request the update
export function listenEditTodo(){
    $('body').on('click','#edit-todo', function(){
        //Get todo
        let todo = getTodoFromForm(true);
        todo['id'] = $('#edit-todo').attr('data-id');
        
        //Validate to-do
        if (todo == false){
            alert("Title and description are required");
            return false;
        }else{
            //Request to-do update
            update(todo).then(data => {
                refreshFilter();
                cancelUpdate();
                alert('The to-do was updated succesfully');
            }).catch(error => console.log(error));
        }
    });
}

//Function when the user clicks the button to edit from the list of to-do, select the to-do choosen and fill the form to update it 
export function updateTodo(button){
    button = $(button);
    let todo_id = button.data('id');
    getTodo(todo_id).then(data => {
        let todo = data;
        selectTodo(todo);
    }).catch(error => console.log(error));
}

//Update the tag completed 
export function updateCompleted(checkbox){
    let todo_id = checkbox.value;
    let completed = null;
    let important = null;
    
    checkbox = $(checkbox);
    
    checkbox.is(':checked') ? 
    completed = 1 :
    completed = 0;
    let importantInput = $('#important'+todo_id);
    importantInput.is(':checked') ?
    important = 1 :
    important = 0;
    
    let tags = {
        important: important, 
        completed: completed
    }
    updateTags(tags, todo_id).then(data => {
        if(data['success'] == true){
            verifyFilterTags(data['todo']);
        }
    }).catch(error => console.log(error));
}

//Update the tag important
export function updateImportant(checkbox){
    let todo_id = checkbox.value;
    let completed = null;
    let important = null;

    checkbox = $(checkbox);

    checkbox.is(':checked') ? 
    important = 1 :
    important = 0;
    let completedInput = $('#completed'+todo_id);
    completedInput.is(':checked') ?
        completed = 1 :
        completed = 0;

    let tags = {
        important: important, 
        completed: completed
    }

    updateTags(tags, todo_id).then(data => {
        if(data['success'] == true){
            verifyFilterTags(data['todo']);
        }
    }).catch(error => console.log(error));
}

//Returns a json object with the to-do introudced by the user
function getTodoFromForm(update = false) { 
    //Get values in the form
    let name = $('#name').val();
    let description = $('#description').val();
    let category = $('#categories-form').val();
    let important = $('#important');
    important.is(':checked') ?
        important = 1 :
        important = 0;
    let date = $('#date').val();
    let time = $('#time').val();
    
    //Validate values required
    if (name == '' || description == '' ){
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

    if (update == true){
        let completed = $('#completed');
        completed.is(':checked') ?
        completed = 1 : 
        completed = 0;

        todo['completed'] = completed
    }

    return todo;
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

//Print all the to-do in the object data
export function printTodos(data){
    //Clear the list before print the new data
    $('#to_do-list-container').empty();
    $.each(data,function(index,todo){
        if(todo != null){
            let todo_div = buildTodo(todo);
            $('#to_do-list-container').append(todo_div);
        }
    });
}

//If the the filter important or completed is selected, delete from the view for the filter.
function verifyFilterTags(todo){
    let selectedFilter = $('#default-filters input[name="radio"]:checked').val();
    let important = todo.important;
    let completed = todo.completed;
    const tags = {
        'important' : important,
        'completed' : completed
    }
    
    const FILTERS = {
        'all': refreshTodo,
        'completed': removeUncompleted,
        'important': removeImportant
    }

    FILTERS[selectedFilter] ? FILTERS[selectedFilter](tags,todo.id) : removeCompleted(tags, todo.id)
}

//Remove a todo that doesn't belongs to to important filter 
function removeImportant(tags,todo_id){
    if (tags['important'] == false){
        setTimeout(function (){
            $("#to_do_element_"+todo_id).remove();
        }, 1000);
    }
    removeCompleted(tags, todo_id);
}

//Remove a todo that doesn't belongs to to complete filter 
function removeUncompleted(tags,todo_id){
    if (tags['completed'] == false){
        let titleDiv = $('#to_do_element_title_'+todo_id);
        let title = titleDiv.text();
        titleDiv.empty();
        const titleTag = $('<h3>').text(title);
        titleDiv.append(titleTag);
        setTimeout(function (){
            $("#to_do_element_"+todo_id).remove();
        }, 1000);
    }
}

//Refresh a todo title when the tag completed is modified in the filter all
function refreshTodo(tags, todo_id){
    let titleDiv = $('#to_do_element_title_'+todo_id);
    let title = titleDiv.text();
    const titleTag = $('<h3>').text(title);
    const strike = $('<strike>').text(title);
    const titleStrike = $('<h3>').append(strike);
    titleDiv.empty();

    if(tags['completed'] == true){
        titleDiv.append(titleStrike);
    }
    else{
        titleDiv.append(titleTag);
    }
}

//Remove a to-do fromm the list when it is marked as completed. It is use for all the filters except all and completed
function removeCompleted(tags, todo_id){
    if(tags['completed'] == true){
        let titleDiv = $('#to_do_element_title_'+todo_id);
        let title = titleDiv.text();
        const strike = $('<strike>').text(title);
        const titleStrike = $('<h3>').append(strike);
        titleDiv.empty();
        titleDiv.append(titleStrike);
        setTimeout(function (){
            $('#to_do_element_'+todo_id).remove();
        }, 1000);
    }
}

//Disable tags important and completed, remove edit button, change todos background that is modifing 
//and fill the form for update the todo with the current info and fill form for update
function selectTodo(todo){
    //Select and unselect todo div
    if (currentTodoSelected != 0) unselectTodoDiv(currentTodoSelected);
    currentTodoSelected = todo.id;
    selectTodoDiv(todo.id);
    fillFormUpdate(todo);
}

//Change backgraound color to normal, add edit button and enable important and completed tags 
function unselectTodoDiv(todo_id){
    //Modified background color 
    let todo_list = $("#to_do_element_" + todo_id);
    todo_list.css({'background-color': 'rgb(214, 214, 214)'});

    //Add Edit button
    const iconEdit = $('<i>').addClass('fa-regular fa-pen-to-square');
    const textEdit = $('<p>').text('Edit')
    const button_edit = $('<button>').addClass('button-stable edit-button').append(iconEdit, textEdit).attr({'data-id': todo_id, 'id': 'edit'+todo_id, 'onclick':'updateTodo(this)'});
    $('#to_do_element_options-2-'+todo_id).append(button_edit);
    
    //Disable important and completed tag
    $('#important'+todo_id).prop('disabled', false);
    $('#completed'+todo_id).prop('disabled', false);
}

//Change background color to selected, remove edit button and disable important and completed tags
function selectTodoDiv(todo_id){
    //Modified background color 
    let todo_list = $("#to_do_element_" + todo_id);
    todo_list.css({'background-color': 'rgb(196, 196, 196)'});

    //Remove edit button
    $('#edit'+todo_id).remove();

    //Disable important and completed tag
    $('#important'+todo_id).prop('disabled', true);
    $('#completed'+todo_id).prop('disabled', true);
}

//Fill the form with the selected update 
function fillFormUpdate(todo){
    removeEditButtons();
    addEditButtons(todo.id);
    removeCompletedForm();
    addCompleted();

    $('#name').val(todo.name);
    $('#categories-form').val(todo.category_id);
    if (todo.end_at){
        let end_at = getDateHour(todo.end_at);
        $('#date').val(end_at.date);
        $('#time').val(end_at.time);
    }else{
        $('#date').val("");
        $('#time').val("");
    }
    $('#description').val(todo.description);
    $('#important').prop('checked',todo.important)
    $('#completed').prop('checked',todo.completed)
}

//Add to the form the input completed 
function addCompleted(){
    let input = $('<input>').addClass('completed').prop({'type':'checkbox', 'name':'completed','id':'completed','checked':''});
    let label = $('<label>').prop({'for':'completed', 'id':'completedLabel'});
    $('#tags').append(input,label);
}

//Delete from the form the input completed
function removeCompletedForm(){
    if ($('#completed').length != 0){
        $('#completed').remove();
        $('#completedLabel').remove();
    }
}

// Split date and hour on the string end_at 
function getDateHour(end_at) {
    const partes = end_at.split(' at '); // Dividir la cadena en fecha y hora

    const fechaParte = partes[0]; // Obtener la parte de la fecha
    const horaParte = partes[1]; // Obtener la parte de la hora

    const fecha = fechaParte.split('-'); // Dividir la parte de la fecha
    const hora = horaParte.split(':'); // Dividir la parte de la hora

    const fechaSeparada = {
        day: parseInt(fecha[0]) >= 0 && parseInt(fecha[0]) <= 9 ? '0' + parseInt(fecha[0]) :  parseInt(fecha[0]),
        month: parseInt(fecha[1]) >= 0 && parseInt(fecha[1]) <= 9 ? '0' + parseInt(fecha[1]) :  parseInt(fecha[1]),
        year: parseInt(fecha[2]) >= 0 && parseInt(fecha[2]) <= 9 ? '0' + parseInt(fecha[2]) :  parseInt(fecha[2])
    };

    const horaSeparada = {
        hours: parseInt(hora[0]) >= 0 && parseInt(hora[0]) <= 9 ? '0' + parseInt(hora[0]) :  parseInt(hora[0]),
        minutes: parseInt(hora[1]) >= 0 && parseInt(hora[1]) <= 9 ? '0' + parseInt(hora[1]) :  parseInt(hora[1])
    };

    return { 
        date: fechaSeparada.year + '-' + fechaSeparada.month + '-' + fechaSeparada.day,
        time: horaSeparada.hours + ':' + horaSeparada.minutes
    };
}

//Add to the form the buttons edit and cancel
function addEditButtons(todo_id){
    //Iconos
    const iconEdit = $('<i>').addClass('fa-regular fa-pen-to-square');
    const iconCancel = $('<i>').addClass('fa-solid fa-xmark');
    //Textos
    const textEdit = $('<p>').text('Edit').css('padding-left','5px')
    const textCancel = $('<p>').text('Cancel').css({'display':'inline', 'padding-left':'5px'})
    //Buttons
    let editButton = $('<button>').append(iconEdit, textEdit).addClass('button-stable edit-button').attr({'id': 'edit-todo', 'data-id':todo_id}).css({'height':'50%', 'margin-right':'2px'});
    let cancelButton = $('<button>').append(iconCancel, textCancel).addClass('button-danger edit-button').attr({'id':'cancel-edit', 'onclick':'cancelUpdate()'}).css({'height':'50%','margin-left':'3px'});
    
    //Remove save button and add edit buttons
    $('#save-todo').remove();
    $('#save').append(editButton, cancelButton);
}

// Remove edit buttons, restore save button, remove completed input and unselect to-do from the list
export function cancelUpdate(){
    removeEditButtons();
    restoreSaveButton();
    removeCompletedForm();
    unselectTodoDiv(currentTodoSelected);
    currentTodoSelected = 0;
    $('#name').val("");
    $('#categories-form').val(1);
    $('#date').val("");
    $('#time').val("");
    $('#description').val("");
    $('#important').prop('checked',false)
}

//Remove Edit and cancel buttons from the form 
function removeEditButtons(){
    let editButton = $('#edit-todo');
    let cancelEditButton = $('#cancel-edit');
    if (editButton.length != 0){
        editButton.remove();
        cancelEditButton.remove();
    }
}

//Add the save button 
function restoreSaveButton(){
    const icon = $('<i>').addClass('fa-regular fa-floppy-disk');
    const text = $('<p>').text('Save').css({'display':'inline', 'margin-left': '5px'});
    let saveButton = $('<button>').addClass('button-success').attr('id','save-todo').append(icon, text);
    $('#save').append(saveButton);
}

//Build the structure for a todo
function buildTodo(todo){

    //Title
    const titleTag = $('<h3>').text(todo.name);
    const strike = $('<strike>').text(todo.name);
    const titleStrike = $('<h3>').append(strike);

    const title = todo.completed ?  
        $('<div>').addClass('to_do_element_title').attr({'id': 'to_do_element_title_'+todo.id}).append(titleStrike) :
        $('<div>').addClass('to_do_element_title').attr({'id': 'to_do_element_title_'+todo.id}).append(titleTag);
    
    //Description
    const description = $('<div>').addClass('to_do_element_description').attr({'id': 'to_do_element_description_'+todo.id}).append($('<p>').text(todo.description));

    //Completed element1
    const completedCheckbox = todo.completed ?  
        $('<input>').addClass('completed').attr({'type': 'checkbox', 'checked': 'checked', 'name': 'completed'+todo.id, 'id': 'completed'+todo.id, 'value': todo.id, 'onclick':'updateCompleted(this)'}) :  
        $('<input>').addClass('completed').attr({'type': 'checkbox',  'name': 'completed'+todo.id, 'id': 'completed'+todo.id, 'value': todo.id,'onclick':'updateCompleted(this)'});

    const completedLabel = $('<label>').attr('for','completed'+todo.id).text('Completed');
    const completed = $('<div>').addClass('element1').append(completedCheckbox, completedLabel);

    //Important element2
    const importantCheckbox = todo.important ? 
        $('<input>').addClass('important').attr({'type': 'checkbox', 'checked': 'checked',  'name': 'important'+todo.id, 'id': 'important'+todo.id, 'value': todo.id, 'onclick':'updateImportant(this)'}) :
        $('<input>').addClass('important').attr({'type': 'checkbox',  'name': 'important'+todo.id, 'id': 'important'+todo.id, 'value': todo.id, 'onclick':'updateImportant(this)'});

    const importantLabel = $('<label>').attr('for','important'+todo.id).text('Important');
    const important = $('<div>').addClass('element2').append(importantCheckbox, importantLabel);
    
    //Category - element3
    const text = ' ' + todo.category;
    const category = $('<div>').addClass('element3').append($('<i>').addClass('fa-solid fa-layer-group'), text)
    
    //OPTIONS 1
    const grid_options = todo.category != 'null' ? 
        $('<div>').addClass('grid-operations').append(completed, important,category):
        $('<div>').addClass('grid-operations').append(completed, important);

    const options1 = $('<div>').addClass('to_do_element_options-1').append(grid_options);
    
    //Date
    const date_text = todo.end_at ? todo.end_at : 'Undefined';
    const iconDate = $('<i>').addClass('fa-regular fa-clock');
    const date_div = $('<div>').addClass('to_do_element_date').append($('<p>').text(date_text+' ').append(iconDate));

    //OPTIONS 2
    const iconEdit = $('<i>').addClass('fa-regular fa-pen-to-square');
    const textEdit = $('<p>').text('Edit')
    const button_edit = $('<button>').addClass('button-stable edit-button').append(iconEdit, textEdit).attr({'data-id': todo.id, 'id': 'edit'+todo.id, 'onclick':'updateTodo(this)'});
    const options2 = $('<div>').addClass('to_do_element_options-2').attr({'id':'to_do_element_options-2-'+todo.id}).append(button_edit);

    //Crear todo
    const todo_div = $('<li>').addClass('to_do_element').attr({'id':'to_do_element_' + todo.id}).append(title, description, options1, date_div,options2);
    
    return todo_div;
}