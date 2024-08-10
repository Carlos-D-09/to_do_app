//Print each to-do in todos
export function printTodos(todos){
    //Clear the list before print the new data
    let to_do_list = document.getElementById('to_do-list-container');
    to_do_list.innerHTML = "";
    todos.forEach(todo => {
        let todo_element = buildTodo(todo);
        to_do_list.append(todo_element);
    });
}

//Build a to-do HTML element
function buildTodo(todo){

    //Title
    let title = buildTodoTitle(todo.name, todo.id, todo.completed);
    
    //Description
    let description = buildTodoDescription(todo.description, todo.id);

    //Completed checkbox - element1
    let completed = buildTodoCompleted(todo.completed, todo.id);

    //Important checkbox - element2
    let important = buildTodoImportant(todo.important, todo.id);
    
    //Category - element3
    let category = buildTodoCategory(todo.category);
    
    //OPTIONS 1
    let grid_options1 = document.createElement('div');
    grid_options1.className = 'grid-operations';
    todo.category != 'null' ? grid_options1.append(completed, important, category) : grid_options1.append(completed, important);

    let options1 = document.createElement('div');
    options1.className = 'to_do_element_options-1';
    options1.append(grid_options1);
    
    //Date
    let date = buildTodoDate(todo.end_at);

    //OPTIONS 2
    let [button_delete, button_edit] = buildTodoButtons(todo.id);

    let options2 = document.createElement('div');
    options2.className = 'to_do_element_options-2';
    options2.setAttribute('id','to_do_element_options-2-'+todo.id);
    options2.append(button_edit, button_delete); 

    //Crear todo
    let todo_div = document.createElement('li');
    todo_div.className = 'to_do_element';
    todo_div.setAttribute('id','to_do_element_'+todo.id);
    todo_div.append(title, description, options1, date, options2);
    
    return todo_div;
}

function buildTodoTitle(title, todo_id, completed){
    let titleTag = document.createElement('h3');
    titleTag.textContent = title;

    let strike = document.createElement('strike');
    strike.textContent = title;
    
    let titleStrike = document.createElement('h3');
    titleStrike.append(strike);

    let title_div = document.createElement('div');
    title_div.className = 'to_do_element_title';
    completed ? title_div.append(titleStrike) : title_div.append(titleTag);
    title_div.setAttribute('id','to_do_element_title_'+todo_id);

    return title_div;
}

function buildTodoDescription(description, todo_id){
    let description_text = document.createElement('p');
    description_text.textContent = description;
    
    let desc_div = document.createElement('div');
    desc_div.className = 'to_do_element_description';
    desc_div.setAttribute('id','to_do_element_description_'+todo_id);
    desc_div.append(description_text);

    return desc_div;
}

function buildTodoCompleted(completed, todo_id){
    let completedCheckbox = document.createElement('input');
    completedCheckbox.className = 'completed';
    completedCheckbox.setAttribute('type', 'checkbox');
    completedCheckbox.setAttribute('name', 'completed'+todo_id);
    completedCheckbox.setAttribute('id', 'completed'+todo_id);
    completedCheckbox.setAttribute('value', todo_id);
    completedCheckbox.setAttribute('onclick','updateCompleted(this)');
    
    if (completed) completedCheckbox.setAttribute('checked','checked');

    let completedLabel = document.createElement('label');
    completedLabel.textContent = 'Completed';
    completedLabel.setAttribute('for','completed'+todo_id);

    let completed_div = document.createElement('div');
    completed_div.className = 'element1';
    completed_div.append(completedCheckbox, completedLabel);

    return completed_div;
}

function buildTodoImportant(important, todo_id){
    let importantCheckbox  = document.createElement('input');
    importantCheckbox.className = 'important';
    importantCheckbox.setAttribute('type', 'checkbox');
    importantCheckbox.setAttribute('name', 'important'+todo_id);
    importantCheckbox.setAttribute('id', 'important'+todo_id);
    importantCheckbox.setAttribute('value', todo_id);
    importantCheckbox.setAttribute('onclick', 'updateImportant(this)');

    if (important) importantCheckbox.setAttribute('checked', 'checked');

    let importantLabel = document.createElement('label');
    importantLabel.setAttribute('for','important'+todo_id);
    importantLabel.textContent = 'Important';
    
    let important_div = document.createElement('div');
    important_div.className = 'element2';
    important_div.append(importantCheckbox, importantLabel);

    return important_div;
}

function buildTodoCategory(category){
    let text = ' ' + category;

    let icon = document.createElement('i');
    icon.className = 'fa-solid fa-layer-group';

    let category_div = document.createElement('div');
    category_div.className = 'element3';

    category_div.append(icon, text);

    return category_div;
}

function buildTodoDate(date){
    let iconDate = document.createElement('i');
    iconDate.className = 'fa-regular fa-clock';
    
    let date_text = document.createElement('p');
    date ? date_text.textContent = date + ' ' : date_text.textContent = 'Undefined ';
    date_text.append(iconDate);

    let date_div = document.createElement('div');
    date_div.className = 'to_do_element_date';
    date_div.append(date_text);

    return date_div;
}

function buildTodoButtons(todo_id){
    let iconEdit = document.createElement('i');
    iconEdit.className = 'fa-regular fa-pen-to-square';

    let textEdit = document.createElement('p');
    textEdit.textContent = 'Edit';

    let iconDelete = document.createElement('i');
    iconDelete.className = 'fa-solid fa-trash';
    
    let textDelete = document.createElement('p');
    textDelete.textContent = 'Delete';

    let button_edit = document.createElement('button');
    button_edit.className = 'button-layout info';
    button_edit.setAttribute('data-id', todo_id);
    button_edit.setAttribute('id', 'edit'+todo_id);
    button_edit.setAttribute('onclick', 'updateTodo(this)');
    button_edit.append(iconEdit, textEdit);
    
    let button_delete = document.createElement('button');
    button_delete.className = 'button-layout danger';
    button_delete.setAttribute('data-id', todo_id);
    button_delete.setAttribute('id', 'delete'+todo_id);
    button_delete.setAttribute('onclick', 'showAlertDeleteTodo(this)');
    button_delete.append(iconDelete, textDelete);

    return [button_delete, button_edit];
}