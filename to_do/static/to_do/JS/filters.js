import { allTodo, planned, today, important, completed, filter, getCategory } from "./requests.js";
import { printTodos } from "./utils.js";

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
    let filters = document.getElementById('filter-list');
    filters.addEventListener('click',function(event){
        if(event.target.matches('input[name=filter]')){
            //Current category selected
            let radio = event.target.value;
            
            //Check which filter is selected and update the list
            if (FILTERS[radio]){ //Update default filters

                //Remove edit buttons
                document.getElementById('options-category').innerHTML = '';

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
                        console.log(category)
                        refreshDescription(capitalizeFirstLetter(category['name']), category['description']);
                    }
                ).catch(
                    error => console.error(error)
                );

            }
        }
    });
}

function selectFirstFilter(){
    let selectedFilter = document.querySelector('input[name="filter"]:checked');
    selectedFilter.setAttribute('checked', false);
    
    let newSelectedFilter = document.querySelectorAll('input[name="filter"]').first();
    newSelectedFilter.setAttribute('checked', 'checked');

    let optionsCategory = document.getElementById('options-category');
    optionsCategory.innerHTML = "";
    refreshFilter();
    refreshDescription('All', DESCRIPTIONS['all']);
}

//Reload the list of to-do in the current category
export function refreshFilter(){
    let selectedFilter = document.querySelector('input[name="filter"]:checked').value;

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
    let titleContainer = document.getElementById('category-title');
    let title = document.createElement('h1');
    title.textContent = name
    titleContainer.innerHTML = "";
    
    titleContainer.append(title);

    let descContainer = document.getElementById('category-desc');
    let desc = document.createElement('p');
    desc.textContent = description;
    descContainer.innerHTML = "";
    descContainer.append(desc);
}

//Add delete and edit button in screen, when a custome filter is selected
function showOptionsButtons(){
    let optionsCategory = document.getElementById('options-category');
    optionsCategory.innerHTML = "";

    let deleteButton = buildDeleteButton();
    let editButton = buildEditButton();

    optionsCategory.append(editButton, deleteButton);

}

//Return delete icon
function buildDeleteButton(){
    let div = document.createElement('div');
    div.className = 'delete-category';

    let icon = document.createElement('i');
    icon.className = 'fa-solid fa-trash fa-xl delete-category';
    icon.setAttribute('onclick', 'showAlertDeleteCategory()'); 

    div.append(icon);

    return div;
}

//Return edit buton
function buildEditButton(){
    let div = document.createElement('div');
    div.className = 'edit-category';
    
    let icon = document.createElement('i');
    icon.className = 'fa-regular fa-pen-to-square fa-xl edit-category';
    icon.setAttribute('onclick', 'showUpdateFormCategory()'); 

    div.append(icon);

    return div;
}

//Disabled or enabled filter list 
function disableEnableFilterList(status){
    let filters = document.querySelectorAll('input[name="filter"]');
    filters.forEach(filter => {
        filter.disabled = status;
    })
}

