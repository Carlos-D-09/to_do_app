import { allTodo, planned, today, important, completed, filter } from './filter_requests.js';
import { printTodos } from './todo.js';
import { getCategory } from './category/requests.js';

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

//Check if some radio input (filter) changed
export function checkFilter(){
    $('body').on('change', '.filter-list input[type=radio]', function () {
        
        //Current filter selected
        let radio = $(this).val();
        
        //Check which filter is selected and update the list
        if (FILTERS[radio]){ //Update default filters
            
            //Remove edit buttons
            $('#options-category').empty();

            //Update todo list 
            FILTERS[radio]().then(
                data => printTodos(data)
            ).catch(
                error => console.error(error)
            );    
            
            //Update description
            refreshDescription(capitalizeFirstLetter(radio), DESCRIPTIONS[radio]);
        
        }else{ //Update category filter

            //Show delete and edit buttons
            showOptionsButtons();

            //Update todo list 
            filter(radio).then(
                data => printTodos(data)
            ).catch(
                error => console.error(error)
            );
            getCategory(radio).then(
                data => {
                    let category = data['category'];
                    refreshDescription(capitalizeFirstLetter(category['name']), category['description']);
                }
            ).catch(
                error => console.error(error)
            );

        }
    });    
}

export function selectFirstFilter(){
    let selectedFilter = $('.filter-list input[name="radio"]:checked');
    selectedFilter.prop('checked', false);
    
    let newSelectedFilter = $('.filter-list input[name="radio"]').first();
    newSelectedFilter.prop('checked', true);

    let optionsCategory = $('#options-category');
    optionsCategory.empty()
    refreshFilter();
    refreshDescription('All', DESCRIPTIONS['all']);
}

//Reload all the list of todo in the current category
export function refreshFilter(){
    let selectedFilter = $('.filter-list input[name="radio"]:checked').val();

    //Check which filter is select and update the list
    FILTERS[selectedFilter] ? 
    FILTERS[selectedFilter]().then(data => printTodos(data)).catch(error => console.error(error)) : 
    filter(selectedFilter).then(data => printTodos(data)).catch(error => console.error(error));
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//Change the description in the column info
function refreshDescription(name, description){
    let titleContainer = $('#category-title');
    let title = $('<h1>').text(name);
    titleContainer.empty();
    
    titleContainer.append(title);

    let descContainer = $('#category-desc');
    let desc = $('<p>').text(description);
    descContainer.empty();
    descContainer.append(desc);
}

//Add delete and edit button in screen when a custome filter is selected
function showOptionsButtons(){
    let optionsCategory = $('#options-category');
    optionsCategory.empty();

    let deleteButton = buildDeleteButton();
    let editButton = buildEditButton();

    optionsCategory.append(editButton, deleteButton);

}

//Return delete icon
function buildDeleteButton(){
    let div = $('<div>').addClass('right-center');
    let icon = $('<i>').addClass('fa-solid fa-trash fa-xl delete-category').attr('onclick','showAlertDeleteCategory()');

    div.append(icon);

    return div;
}

//Return edit buton
function buildEditButton(){
    let div = $('<div>').addClass('left-center');
    let icon = $('<i>').addClass('fa-regular fa-pen-to-square fa-xl edit-category').attr('onclick','showUpdateFormCategory()');

    div.append(icon);

    return div;
}

export function disableEnableFilterList(status){
    $("#default-filters input[type=radio]").prop('disable',status);
}

