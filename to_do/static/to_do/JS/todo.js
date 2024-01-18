import { refreshFilter } from './filter.js';
import { create, updateTags, getTodo, update, deleteTodo} from './todo_requests.js';

//This files contains all the functions to manipulate the to-do activities

let currentTodoSelected = 0;

//Start general functions

    //- printTodos(data): Print each to-do in the object data.
    //- buildTood(todo): Build a to-do to show in the list. 

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
        const textEdit = $('<p>').text('Edit');
        const iconDelete = $('<i>').addClass('fa-solid fa-trash');
        const textDelete = $('<p>').text('Delete');
        const button_edit = $('<button>').addClass('button-stable').append(iconEdit, textEdit).attr({'data-id': todo.id, 'id': 'edit'+todo.id, 'onclick':'updateTodo(this)'});
        const button_delete = $('<button>').addClass('button-danger').append(iconDelete, textDelete).attr({'data-id': todo.id, 'id': 'delete'+todo.id, 'onclick':'showAlertDeleteTodo(this)'});
        const options2 = $('<div>').addClass('to_do_element_options-2').attr({'id':'to_do_element_options-2-'+todo.id}).append(button_edit, button_delete);
    
        //Crear todo
        const todo_div = $('<li>').addClass('to_do_element').attr({'id':'to_do_element_' + todo.id}).append(title, description, options1, date_div,options2);
        
        return todo_div;
    }
//End general functions

//Start create todo
    //- createTodo(): create a todo
    //- getTodoFromForm(): Returns a json object with the to-do introduced by the user, if title or descriptions are missing, returns false
    //- refreshForm(): Reload all the list of to-do in the current category
    //- clearForm(): Clean the create form

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

    function clearForm() {
        $('#name').val('');
        $('#description').val('');
        $('#categories').val(1); 
        $('#important').prop('checked', false);
        $('#date').val('');
        $('#time').val('');
}

//End create todo

//Start update todo

    //- updateTodo(): Get the to-do selected from the database.
    //- selectTodo(todo): Check if is necessary just select a todo or unselect and select, also call the function to fill the form
    //- selectTodoDiv(todo_id): Select a to-do for edit. Remove important and completed checkbox and add style to the current to-do selected. 
    //- unselectTodoDiv(tod_id): Unselect the current to-do for edit. Restore the checkbox for important and completed fields and remove the style.
    //- fillFormUpdate(todo): Mofied the form create to use it for update and fill the inputs.
    //- getDateHour(end_at): Receives a string with the nex format: "%d-%m-%Y at %H:%i" and return an object with the date and time separate
    //- removeEditButtons(): Remove the edit buttons in the update form. It is called in the function fillFormUpdate(todo) to avoid buttons duplicate
    //- addEditButtons(todo_id): Add edit and cancel buttons to the form for update a to-do.
    //- removeCompleteCheckbox(): Remove the completed checkbox in the update form. It is called in the function fillFormUpdate(todo) to avoid checkbox duplicate
    //- addCompleted(): Add the completed checkbox in the update form.
    //- editTodo(button): Validation and request to update a todo. 
    //- refreshFilter():  It is a function imported from filter.js, it reloads the list of to-do for the filter. 
    //- cancelUpdate(): It is function to call all the functions necessary to cancel the edit proccess and clear the form
    //- restoreSaveButton(): Add the save button to use the create form 
    //- updateCompleted(checkbox): Update the tag completed for the selected to-do 
    //- updateImportant(checkbox): Update the tago completed for the selected to-do
    //- verifyFilterTags(): Check the current filter. Depending the filter how it is going to be treated the selected to-do
    //- refreshTodo(tags): Refresh the todo title style when the tag completed is modified in the filter all
    //- removeCompleted(): It is use for remove a to-do marked as completed in any filter, except important, all and completed. First add the completed style to the title and with a delay, remove the to-do from the list
    //- removeUncompleted(): Remove a todo that doesn't belongs to to complete filter. First it remove the completed title style and with a delay, remove the to-do from the list.
    //- removeImportant(): Remove a todo that doesn't belongs to to important filter

    export function updateTodo(button){
        button = $(button);
        let todo_id = button.data('id');
        getTodo(todo_id).then(data => {
            let todo = data['todo'];
            selectTodo(todo);
        }).catch(error => console.log(error));
    }

    function selectTodo(todo){
        //Check if is neccesary unselect a to-do
        if (currentTodoSelected != 0) unselectTodoDiv(currentTodoSelected);
        currentTodoSelected = todo.id;
        selectTodoDiv(todo.id);
        fillFormUpdate(todo);
    }

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

    function fillFormUpdate(todo){
        removeEditButtons(); //Remove the old edit buttons
        addEditButtons(todo.id);
        removeCompletedCheckbox(); //Remove the old completed checkbox
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

    function removeEditButtons(){
        let editButton = $('#edit-todo');
        let cancelEditButton = $('#cancel-edit');
        if (editButton.length != 0){
            editButton.remove();
            cancelEditButton.remove();
        }
    }

    function removeCompletedCheckbox(){
        if ($('#completed').length != 0){
            $('#completed').remove();
            $('#completedLabel').remove();
        }
    }

    function addCompleted(){
        let input = $('<input>').addClass('completed').prop({'type':'checkbox', 'name':'completed','id':'completed','checked':''});
        let label = $('<label>').prop({'for':'completed', 'id':'completedLabel'});
        $('#tags').append(input,label);
    }

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

    export function editTodo(){
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

    export function cancelUpdate(){
        removeEditButtons();
        restoreSaveButton();
        removeCompletedCheckbox();
        unselectTodoDiv(currentTodoSelected);
        currentTodoSelected = 0;
        $('#name').val("");
        $('#categories-form').val(1);
        $('#date').val("");
        $('#time').val("");
        $('#description').val("");
        $('#important').prop('checked',false)
    }

    function restoreSaveButton(){
        const icon = $('<i>').addClass('fa-regular fa-floppy-disk');
        const text = $('<p>').text('Save').css({'display':'inline', 'margin-left': '5px'});
        let saveButton = $('<button>').addClass('button-success').attr('id','save-todo').append(icon, text);
        $('#save').append(saveButton);
    }    

    export function updateCompleted(checkbox){
        let todo_id = checkbox.value;
        let completed = null;
        let important = null;
        
        checkbox = $(checkbox);
        
        checkbox.is(':checked') ? completed = 1 : completed = 0;
        
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

    export function updateImportant(checkbox){
        let todo_id = checkbox.value;
        let completed = null;
        let important = null;
    
        checkbox = $(checkbox);
    
        checkbox.is(':checked') ? important = 1 : important = 0;

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

    function removeCompleted(tags, todo_id){
        if(tags['completed'] == true){
            let titleDiv = $('#to_do_element_title_'+todo_id);
            let title = titleDiv.text();
            const strike = $('<strike>').text(title);
            const titleStrike = $('<h3>').append(strike);
            
            //Unmark title
            titleDiv.empty();
            titleDiv.append(titleStrike);
    
            //Remove from the list with a delay
            setTimeout(function (){
                $('#to_do_element_'+todo_id).remove();
            }, 1000);
        }
    }

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

    function removeImportant(tags,todo_id){
        if (tags['important'] == false){
            setTimeout(function (){
                $("#to_do_element_"+todo_id).remove();
            }, 1000);
        }
        removeCompleted(tags, todo_id);
    }

//End update todo

//Start delete to-do

    //- showAlertDeleteTodo(button): Let the user know that the action is going to exectue is irreversible and requeste a confirmation
    //- removeTodo(button): Request to delete the to-do
    //- deleteFloatingDialog(): Remove the alert showed. This function is imported from category.js 

    export function showAlertDeleteTodo(button){
        button = $(button);
        let todo_id = button.data('id');
            getTodo(todo_id).then(
                data => {
                    if (data['success'] == true){
                        let todo = data['todo'];
                        let dialog = $('<dialog open>').addClass('floating-dialog').attr('id','floating-dialog');
                        let msgDiv = $('<div>');
                        let buttonsDiv = $('<div>').addClass('right-center');
                        
                        
                        let message = $('<p>').append("You are going to delete the next to-do " + todo.name + ", this options is irreversible.", 
                                        $('<br>'), $('<br>'), "Are you sure you want to continue?");
                        msgDiv.append(message);
                        
                        let confirmButton = $('<button>').addClass('button-success').text('Confirm').css({'margin':'5px'}).attr({'data-id': todo_id, 'onclick':'removeTodo(this)'});
                        let cancelButton = $('<button>').addClass('button-danger').text('Cancel').css({'margin':'5px'}).attr('onclick','deleteFloatingDialog()');
                        buttonsDiv.append(confirmButton,cancelButton);
                        
                        dialog.append(msgDiv, buttonsDiv);
                        $('body').append(dialog);
                    }else{
                        alert('You are trying to delete an non-existent to-do');
                    }
                }
            ).catch(
                error => console.error(error)
            )
    }

    export function removeTodo(button){
        let todo_id = $(button).attr('data-id')
            deleteFloatingDialog();
            deleteTodo(todo_id).then(data => {
                if(data['success'] == true){
                    $("#to_do_element_"+todo_id).remove();
                    alert(data['message']);
                }else{
                    alert(data['error']);
                }
            }).catch(error => console.log(error));
    }

//End delete to-do