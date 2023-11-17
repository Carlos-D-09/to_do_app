//This file contains the function for update from the list the tags completed and important

//Get the tags to update completed checkbox
function updateCompleted(checkbox){
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

    tags = {
        important: important, 
        completed: completed
    }

    updateTags(tags, todo_id);
}

//Get the tags to update important checkbox
function updateImportant(checkbox){
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

    updateTags(tags, todo_id);
}

//Request to the server update the tags
function updateTags(tags, todo_id){
    //Send request to the server
    let url = "/"+ todo_id +"/update/tags";
    $.post(url,tags, function(data){
        if(data['success'] == true){
            let todo = data['todo'];

            //Cases when the filter completed or important are selected
            verifyFilterTags(todo);

            //Remove a todo completed
            if(tags['completed'] == true){
                $("#to_do_element_"+todo_id).remove();
            }
        }else{
            alert('Something went wront trying to update the tag');
        }
    });
}

//If the the filter important or completed is selected and the tag completed or important have changed, delete from the view for the filter.
function verifyFilterTags(todo){
    let selectedFilter = $('#default-filters input[name="radio"]:checked').val();
    if (selectedFilter != undefined){
        let important = todo.important;
        let completed = todo.completed;
        const tags = {
            'important' : important,
            'completed' : completed
        }
        
        const FILTERS = {
            'important': removeImportant,
            'completed': removeCompleted
        }

        if (FILTERS[selectedFilter]) FILTERS[selectedFilter](tags,todo.id);
    }
}

//Remove a todo that doesn't belongs to to important filter 
function removeImportant(tags,todo_id){
    if (tags['important'] == false){
        $("#to_do_element_"+todo_id).remove();
    }
}

//Remove a todo that doesn't belongs to to complete filter 
function removeCompleted(tags,todo_id){
    if (tags['completed'] == false){
        $("#to_do_element_"+todo_id).remove();
    }
}