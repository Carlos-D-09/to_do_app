import { refreshFilterContent } from './filters.js';
import { createTodo, updateTags, getTodo, updateTodo, deleteTodo} from './requests.js';
import { buildTodoButtons, clearForm, removeEditButtons, 
    addEditButtons, addCompleted, removeCompletedCheckbox, restoreSaveButton,
    deleteFloatingDialog
} from "./utils.js";

let CURRENT_TODO_SELECTED = 0;

//Listener to display category dropdown menu
export function categoryDropdownClick(){
    let category_button = document.getElementById('category-dropdown-button');
    let dropdown_menu = document.getElementById('categories-dropdown-container');
    category_button.addEventListener('click',()=>{
        dropdown_menu.classList.toggle('active') ? dropdown_menu.classList.remove('hide') : dropdown_menu.classList.add('hide');
    })
}

//Listener to change the text inside the category dropdown button each time the value inside the dropdown has changed
export function categoryDropdownMenu(){
    let categories_radio = document.querySelectorAll('input[name="category"]');
    let button = document.getElementById('category-dropdown-button');
    categories_radio.forEach(element => {
        element.addEventListener('click', ()=> {
            let label_text = document.getElementById('label-category-'+element.value);
            button.textContent = label_text.textContent;
        }); 
    });
}

//Listener to create a to-do
export function saveTodoClick(){
    document.getElementById('save').addEventListener('click', (event)=>{
        if (event.target.matches('#save-todo')) {
            let todo = getTodoFromForm();
            if (todo == false){
                alert("Title and description are required");
                return false;
            }else{
                createTodo(todo).then(data => {
                    if(data['success']){
                        refreshFilterContent();
                        clearForm();
                        alert('The to-do was added succesfully');
                    }else{
                        alert("We couldn't save your to-do");
                        console.log(data['error']);
                    }
                }).catch(error => console.log(error));
            }
        }
    });
}

//Get and validate to-do values from the form 
function getTodoFromForm(update = false) { 
    //Get values in the form
    let name = document.getElementById('name').value;
    let description = document.getElementById('description').value;
    let category = document.querySelector('input[name="category"]:checked').value;
    let important = document.getElementById('important');
    important.checked ?
        important = 1 :
        important = 0;
    let date = document.getElementById('date').value;
    let time = document.getElementById('time').value;
    
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
        let completed = document.getElementById('completed');
        completed.checked == true?
        completed = 1 : 
        completed = 0;

        todo['completed'] = completed
    }

    return todo;
}

//Function called when the edit button is pressed on a to-do
export function updateTodoClick(button){
    let todo_id = button.dataset.id;
    getTodo(todo_id).then(data => {
        let todo = data['todo'];
        selectTodo(todo);
    }).catch(error => console.log(error));
}

//Check if is necessary just select a todo or unselect and select, also call the function to fill the form
function selectTodo(todo){
    //Check if it's neccesary unselect a to-do
    if (CURRENT_TODO_SELECTED != 0) unselectTodoDiv(CURRENT_TODO_SELECTED);
    CURRENT_TODO_SELECTED = todo.id;
    selectTodoDiv(todo.id);
    fillFormUpdate(todo);
}

//Select a to-do for edit. Remove important and completed checkbox and add style to the current to-do selected. 
function selectTodoDiv(todo_id){
    //Modified background color 
    let todo = document.getElementById(`to_do_element_${todo_id}`);
    todo.style.backgroundColor = 'var(--todo-selected)';

    //Remove edit button
    document.getElementById(`edit${todo_id}`).remove();
    document.getElementById(`delete${todo_id}`).remove();
    
    //Disable important and completed tag
    document.getElementById(`important${todo_id}`).disabled = true;
    document.getElementById(`completed${todo_id}`).disabled = true;
}

//Unselect the current to-do for edit. Restore the checkbox for important and completed fields and remove the style.
function unselectTodoDiv(todo_id){
    //Modified background color 
    let todo = document.getElementById(`to_do_element_${todo_id}`);
    todo.style.backgroundColor = 'var(--background-color)';
    
    //Add delete and edit buttons
    let [button_delete, button_edit] = buildTodoButtons(todo_id);

    let todo_buttons = document.getElementById(`to_do_element_options-2-${todo_id}`);
    todo_buttons.append(button_edit, button_delete);

    document.getElementById(`important${todo_id}`).disabled = false;
    document.getElementById(`completed${todo_id}`).disabled = false;
}

//Modified the create form to use it for update, and fill the inputs.
function fillFormUpdate(todo){
    removeEditButtons(); //Remove posible cancel en edit buttons
    addEditButtons(todo.id);
    removeCompletedCheckbox(); //Remove the old completed checkbox
    addCompleted(todo.completed);
    document.getElementById('name').value = todo.name;
    document.getElementById('description').value = todo.description;
    document.getElementById('important').checked = todo.important;
    document.getElementById('category-dropdown-button').textContent = todo.category;
    document.getElementById(`category-${todo.category_id}`).checked = true;
    if (todo.end_at){
        let end_at = getDateHour(todo.end_at);
        document.getElementById('date').value = end_at.date;
        document.getElementById('time').value = end_at.time;
    }else{
        document.getElementById('date').value = '';
        document.getElementById('time').value = '';
    }
}

//Receives a string with the nex format: "%d-%m-%Y at %H:%i" and return an object with the date and time separate
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

//It call all the functions necessary to cancel the edit proccess and clear the form
export function cancelUpdate(){
    removeEditButtons();
    restoreSaveButton();
    removeCompletedCheckbox();
    unselectTodoDiv(CURRENT_TODO_SELECTED);
    CURRENT_TODO_SELECTED = 0;
    document.getElementById('name').value = '';
    document.querySelector('input[name="category"]:checked').checked = false;
    document.getElementById('category-1').checked = true;
    document.getElementById('category-dropdown-button').textContent = 'Undefined';
    document.getElementById('date').value = '';
    document.getElementById('time').value = '';
    document.getElementById('description').value = '';
    document.getElementById('important').checked = false;
}

// Validate the form data and request to update the selected todo. 
export function editTodo(){
    document.getElementById('save').addEventListener('click', (event) => {
        if (event.target.matches('#edit-todo')){
            //Get todo
            let todo = getTodoFromForm(true);
            
            //Validate to-do
            if (todo == false){
                alert("Title and description are required");
                return false;
            }else{
                todo['id'] = document.getElementById('edit-todo').dataset.id;
                //Request to-do update
                updateTodo(todo).then(data => {
                    if (data['success']){
                        refreshFilterContent();
                        cancelUpdate();
                        alert('The to-do was updated succesfully');
                    }else{
                        alert(data['error']);
                    }
                }).catch(error => console.log(error));
            }

        }
    });
}

//Update the tag completed and important for the selected to-do 
export function changeTags(todo_id){
    let important = document.getElementById(`important${todo_id}`);
    let completed = document.getElementById(`completed${todo_id}`);
    
    completed.checked == true ? completed = 1 : completed = 0;
    important.checked == true ? important = 1 : important = 0;
    
    let tags = {
        important: important, 
        completed: completed
    }
    
     updateTags(tags, todo_id).then(data => {
        if(data['success'] == true){
            verifyFilterTags(data['todo']);
        }else{
            alert(data['error']);
        }
    }).catch(error => console.log(error));
}

// Check the current filter. Depending the filter how it is going to be treated the selected to-do
function verifyFilterTags(todo){
    let selectedFilter = document.querySelector('input[name="filter"]:checked').value;
    let important = todo.important;
    let completed = todo.completed;
    const tags = {
        'important' : important,
        'completed' : completed
    }
    
    const FILTERS = {
        'all': refreshTodo, //If the filter selected is all, just refresh to-do
        'completed': removeUncompleted, //If the filter selected is completed, check if the to-do was marked as uncompleted and remove it
        'important': removeUnimportant //If the filter selected is important, check if the to-do was marked as unimportant
    }

    FILTERS[selectedFilter] ? FILTERS[selectedFilter](tags,todo.id) : refreshTodo(tags, todo.id)
}

//Refresh the to-do title style according the attribute completed
function refreshTodo(tags, todo_id){
    let titleDiv = document.getElementById(`to_do_element_title_${todo_id}`);
    let title = titleDiv.textContent;
    
    let titleTag = document.createElement('h3');
    titleTag.textContent = title;
    
    let strike = document.createElement('strike');
    strike.textContent = title;
    
    let titleStrike = document.createElement('h3');
    titleStrike.append(strike);

    titleDiv.innerHTML = "";

    if(tags['completed'] == true){
        titleDiv.append(titleStrike);
    }
    else{
        titleDiv.append(titleTag);
    }
}

// Remove a to-do that doesn't belongs to to complete filter. First it remove the completed title style and with a delay, remove the to-do from the list.
function removeUncompleted(tags,todo_id){
    if (tags['completed'] == false){
        let titleDiv = document.getElementById(`to_do_element_title_${todo_id}`);
        let title = titleDiv.textContent;
        
        let titleTag = document.createElement('h3');
        titleTag.textContent = title;
        titleDiv.innerHTML = "";
        titleDiv.append(titleTag);

        setTimeout(function (){
            document.getElementById(`to_do_element_${todo_id}`).remove();
        }, 1000);
    }
}

// Remove a to-do that doesn't belongs to to important filter
function removeUnimportant(tags,todo_id){
    if (tags['important'] == false){
        setTimeout(function (){
            document.getElementById(`to_do_element_${todo_id}`).remove();
        }, 1000);
    }
}

// Let the user know that the action is going to exectue is irreversible and requeste a confirmation
export function showAlertDeleteTodo(button){
    let todo_id = button.dataset.id;
        getTodo(todo_id).then(
            data => {
                if (data['success'] == true){
                    let dialog = buildAlertDelete(data['todo']);
                    document.body.append(dialog);
                }else{
                    alert('You are trying to delete an non-existent to-do');
                }
            }
        ).catch(
            error => console.error(error)
        )
}

function buildAlertDelete(todo){
    let dialog = document.createElement('dialog');
    dialog.className = 'floating-dialog active';
    dialog.setAttribute('id','floating-dialog');
    dialog.setAttribute('open','');
    
    let msgDiv = document.createElement('div');
    msgDiv.className = 'floating-dialog-message';

    let buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'floating-dialog-buttons';
    
    let message = document.createElement('p');
    let question = document.createElement('b');
    question.textContent = 'Are your sure you want to continue?';
    message.textContent = `You are going to delete the next to-do: ${todo.name}, This transaction is irreversible. `;
    message.append(document.createElement('br'), document.createElement('br'), question);

    msgDiv.append(message);
    
    let confirmButton = document.createElement('button');
    confirmButton.className = 'button-layout success';
    confirmButton.textContent = 'Confirm';
    confirmButton.setAttribute('data-id',todo.id);
    confirmButton.setAttribute('onclick','removeTodo(this)');

    let cancelButton = document.createElement('button');
    cancelButton.className = 'button-layout danger';
    cancelButton.textContent = 'Cancel';
    cancelButton.setAttribute('onclick','deleteFloatingDialog()');
    
    buttonsDiv.append(confirmButton,cancelButton);
    
    dialog.append(msgDiv, buttonsDiv);
    
    return dialog;
}

export function removeTodo(button){
    let todo_id = button.dataset.id;
    deleteFloatingDialog();
    deleteTodo(todo_id).then(data => {
        if(data['success'] == true){
            document.getElementById("to_do_element_"+todo_id).remove();
            setTimeout(function(){
                alert(data['message']);
            }, 1000);
        }else{
            alert(data['error']);
        }
    }).catch(error => console.log(error));
}