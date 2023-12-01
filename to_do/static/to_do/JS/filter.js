import { allTodo, planned, today, important, completed, filter } from './filter_requests.js';
import { printTodos } from './todo.js';
import { getCategory } from './category_requests.js';

//Check if some radio input (filter) changed
export function checkFilter(){
    $('body').on('change', '.filter-list input[type=radio]', function () {
        
        //standard filters and their functions 
        const FILTERS = {
            'all': allTodo,
            'planned': planned,
            'today': today,
            'important': important,
            'completed': completed
        }
        
        //Standard descriptions
        const DESCRIPTIONS = {
            'all': "Here you can see all your activiaties, doesn't matter the category, if they are completed, uncompleted, important, not important, etc",
            'planned': "You can see your uncompleted activites for the follow days",
            'today': "You can see your uncompleted activities for today",
            'important': "You can see your uncompleted important activities",
            'completed': "You can see your completed activities, doesn't matter the category or if they are important or not"
        }
        
        //Current filter selected
        let radio = $(this).val();
        
        //Check which filter is selected and update the list
        if (FILTERS[radio]){ //Update default filters

            //Update todo list 
            FILTERS[radio]().then(
                data => printTodos(data)
            ).catch(
                error => console.error(error)
            );    
            
            //Update description
            updateDescription(capitalizeFirstLetter(radio), DESCRIPTIONS[radio]);
        
        }else{ //Update category filter

            //Update todo list 
            filter(radio).then(
                data => printTodos(data)
            ).catch(
                error => console.error(error)
            );
            
            let category = null;
            getCategory(radio).then(
                data => updateDescription(capitalizeFirstLetter(data['name']), data['description'])
            ).catch(
                error => console.error(error)
            );

        }
    });    
}

//Reload all the list of todo in the current category
export function refreshFilter(){
    var selectedFilter = $('.filter-list input[name="radio"]:checked').val();
    const FILTERS = {
        'all': allTodo,
        'planned': planned,
        'today': today,
        'important': important,
        'completed': completed
    }

    //Check which filter is select and update the list
    FILTERS[selectedFilter] ? 
    FILTERS[selectedFilter]().then(data => printTodos(data)).catch(error => console.error(error)) : 
    filter(selectedFilter).then(data => printTodos(data)).catch(error => console.error(error));
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//Change the description in the column info
function updateDescription(name, description){
    let descContainer = $('#category-desc');
    let title = $('<h1>').text(name);
    let desc = $('<p>').text(description);
    descContainer.empty();
    descContainer.append(title, desc);
}