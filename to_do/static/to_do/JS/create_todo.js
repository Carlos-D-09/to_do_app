import { refreshFilter } from './filter.js';
import { clearForm } from './todo.js';

$(document).ready(function() {
    createTodo();
});

function requestCreate(todo){
    return new Promise((resolve, reject) => {
        let url = "/create";
        $.post(url,todo,function(data){
            resolve(data);
        }).fail(function (error) { 
            reject(error);
         });
    });
}

//When the user clicks the button save for create a new todo
function createTodo(){
    $('body').on('click', '#save-todo', function(){
        let todo = getTodo();
        
        requestCreate(todo).then(data => {
            if(data['success'] == true){
                refreshFilter();
                clearForm();
                alert('The to-do was added succesfully');
            }
        }).catch(error => console.log(error));
    });
}

function getTodo() { 
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

    return todo;
}