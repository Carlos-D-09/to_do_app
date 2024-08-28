import { allTodo, planned, today, important, completed, filter, getCategory } from "./requests.js";
import { filterDescriptionCollapse, printTodos, refreshDescription } from "./utils.js";

let previousCollapsedFilter = 'all';

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

//Listener to detect when the window is resized
export function filterWindowResize(){
    window.addEventListener('resize', debounce(syncronizeFiltersList, 300));
}

// Debounce function to syncronice filters
function debounce(func, delay) {
    let timerId;
    return function(...args) {
        clearTimeout(timerId);
        if (typeof func === 'function') {
            timerId = setTimeout(() => func.apply(this, args), delay);
        }
    };
}

function syncronizeFiltersList(){
    //Get the filter checked on the filter list 
    let uncollapsedFilter = document.querySelector('input[name="filter"]:checked');
    
    if (!uncollapsedFilter) return;
    
    const currentFilterValue = uncollapsedFilter.value;
    const isLargeScreen = window.innerWidth > 1200;
    
    // Syncronize uncollapsed filter with collapsed filter when the window is resized with a width bigger than 1200px 
    if(isLargeScreen && currentFilterValue != previousCollapsedFilter){
        //Unmark the selected filter
        uncollapsedFilter.setAttribute('checked',false);
    
        //Get the current uncollapsed filter based on the selected on collapsed filter list
        const elementId = FILTERS[previousCollapsedFilter] ? `filter-${previousCollapsedFilter}` : `category${previousCollapsedFilter}`;
    
        //Mark as checked
        document.getElementById(elementId).setAttribute('checked',true);
    
        toggleUncollapsedFilterSelected(previousCollapsedFilter);
    
        previousCollapsedFilter = currentFilterValue;
    } 

    //Syncronize collapsed filter with uncollapsed filter when the window is resized with a width lower than 1200px
    if(!isLargeScreen && currentFilterValue != previousCollapsedFilter){ 
        toggleCollapsedFilterSelected(previousCollapsedFilter, true);

        toggleCollapsedFilterSelected(currentFilterValue);

        //Update previousCollapsedFilter value. 
        previousCollapsedFilter = currentFilterValue;
    }
}

//Change the filter style and if the filter is not a default, add the edit and delete buttons
function toggleCollapsedFilterSelected(filter, remove=false){
    const elementID =  FILTERS[filter] ? `filter-collapsed-${filter}` : `filter-collapsed-category${filter}`;

    if(remove){
        document.getElementById(elementID).classList.remove('selected');
    }else{
        if(FILTERS[filter]){
            document.getElementById(elementID).classList.add('selected');
        }else{
            document.getElementById(elementID).classList.add('selected');
            //add edit buttons
            //Logica por agregar
        }
    }
}

//If the filter is default, remove posible edit and delete buttons and update the description, otherwise, add the edit and delete buttons. 
function toggleUncollapsedFilterSelected(filter){    
    //Check if the filter selected is a default or a custome filter
    if(FILTERS[filter]){
        //Update the description for a custome filter
        document.getElementById('options-category').innerHTML = '';
        document.getElementById('options-category-collapse').innerHTML = '';
        refreshDescription(capitalizeFirstLetter(filter), DESCRIPTIONS[filter]);
    }else{
        //Resfresh the description for a custome filter 
        document.getElementById(`category${filter}`).setAttribute('checked',true);
        getCategory(filter).then(
            data => {
                let category = data['category'];
                refreshDescription(capitalizeFirstLetter(category['name']), category['description']);
            }
        ).catch(
            error => console.error(error)
        );
        showOptionsButtons(filter);
    }
}

//Add event listeners to each filter list (Collapsed and uncollapsed)
export function checkFilters(){
    let filters = document.getElementById('filter-list');
    let filters2 = document.getElementById('filter-list-collapse');
    filtersUncollapsed(filters);
    filtersCollapsed(filters2);    
}

//Event listener for collapsed filter list
function filtersCollapsed(filters){
    filters.addEventListener('click', function(event){
        if(event.target.getAttribute('name') == 'filters-collapsed'){
            
            //Get data value from the event target
            let filter = event.target.dataset.value;
            
            //Change the old selected filter style
            toggleCollapsedFilterSelected(previousCollapsedFilter, true);

            //Change the current selected filter style
            toggleCollapsedFilterSelected(filter);

            //Update current filter
            previousCollapsedFilter = filter;

            //Update to-do list according the selected filter
            updateTodoList(filter, true);
        }
    })
}

//Event listener for uncollapsed filter list
function filtersUncollapsed(filters){
    filters.addEventListener('click',function(event){
        if(event.target.matches('input[name=filter]')){
            
            //Get the input value
            let radio = event.target.value;
            
            //Change the current filter selected by the user
            toggleUncollapsedFilterSelected(radio)

            //Update to-do list
            updateTodoList(radio);
        }
    });
}

//Make the request to get the to-do list according the filter passed on value 
function updateTodoList(value, collapsed=false){

    if (FILTERS[value]){ //Update default filters
        FILTERS[value]().then(
            data => printTodos(data)
        ).catch(
            error => console.error(error)
        );
    
    }else{ //Update personlize filter
        filter(value).then(
            data => printTodos(data)
        ).catch(
            error => console.error(error)
        );

        //Get the description for a personlize filter
        if(collapsed == false){
            getCategory(value).then(
                data => {
                    let category = data['category'];
                    refreshDescription(capitalizeFirstLetter(category['name']), category['description']);
                }
            ).catch(
                error => console.error(error)
            );
        }

    }
}

export function selectFirstFilter(){
    let selectedFilter = document.querySelector('input[name="filter"]:checked');
    selectedFilter.setAttribute('checked', false);
    
    let newSelectedFilter = document.querySelectorAll('input[name="filter"]')[0];
    newSelectedFilter.checked = true;

    document.getElementById('options-category').innerHTML = '';
    document.getElementById('options-category-collapse').innerHTML = '';
    refreshFilterContent();
    refreshDescription('All', DESCRIPTIONS['all']);
}

export function refreshFilterElement(category_id, name){
    let filter = document.getElementById(`label-category-${category_id}-name`);
    filter.textContent = name;
}

//Reload the list of to-do in the current category
export function refreshFilterContent(){
    let selectedFilter = document.querySelector('input[name="filter"]:checked').value;

    //Check which filter is select and update the list
    FILTERS[selectedFilter] ? 
    FILTERS[selectedFilter]().then(data => printTodos(data)).catch(error => console.error(error)) : 
    filter(selectedFilter).then(data => printTodos(data)).catch(error => console.error(error));
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//Add delete and edit button in screen, when a custome filter is selected
function showOptionsButtons(category_id){
    let optionsCategory = null;
    if(filterDescriptionCollapse()){
        optionsCategory = document.getElementById('options-category-collapse');
    }else{
        optionsCategory = document.getElementById('options-category');
    }
    optionsCategory.innerHTML = "";
    
    let deleteButton = buildDeleteButton(category_id);
    let editButton = buildEditButton(category_id);
    
    optionsCategory.append(editButton, deleteButton);

}

//Return delete icon
function buildDeleteButton(category_id){
    let div = document.createElement('div');
    div.className = 'delete-category';

    let icon = document.createElement('i');
    icon.className = 'fa-solid fa-trash fa-xl delete-category';
    icon.setAttribute('onclick', `showAlertDeleteCategory(${category_id})`); 

    div.append(icon);

    return div;
}

//Return edit buton
function buildEditButton(category_id){
    let div = document.createElement('div');
    div.className = 'edit-category';
    
    let icon = document.createElement('i');
    icon.className = 'fa-regular fa-pen-to-square fa-xl edit-category';
    icon.setAttribute('onclick', `showUpdateFormCategory(${category_id})`); 

    div.append(icon);

    return div;
}