import { allTodo, planned, today, important, completed, filter } from './filters.js';
import { printTodo } from './todo.js';


$(document).ready(function() {
    checkFilter();
})

//Check if some radio input (filter) changed
function checkFilter(){
    $('body').on('change', '.filter-list input[type=radio]', function () {
        
        //standard filters and their functions 
        const FILTERS = {
            'all': allTodo,
            'planned': planned,
            'today': today,
            'important': important,
            'completed': completed
        }
        
        //Current filter selected
        let radio = $(this).val();
        
        //Check which filter is selected and update the list
        FILTERS[radio] ? 
        FILTERS[radio]().then(data => printTodo(data)).catch(error => console.error(error)) : 
        filter(radio).then(data => printTodo(data)).catch(error => console.error(error));
    });    
}

//Reload all the todo in the current category
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
    FILTERS[selectedFilter]().then(data => printTodo(data)).catch(error => console.error(error)) : 
    filter(selectedFilter).then(data => printTodo(data)).catch(error => console.error(error));
}