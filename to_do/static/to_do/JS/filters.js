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

            //Start update collapsed view

            //Get data value from the event target
            let filter = event.target.dataset.value;

            updateCollapsedFilters(filter);

            
            let currentUncollapseFilter = document.querySelector('[name="filter"]:checked');
            currentUncollapseFilter.removeAttribute('checked');
            updateUncollapsedFilters(filter);

            //Update to-do list according the selected filter
            updateTodoList(filter, true);

            //add edit and delete buttons in case of personal filters
            if(!FILTERS[filter]){
                showOptionsCollapsedButtons(filter);
            }else{
                removeCollpasedEditDeleteButtons();
            }
        }
    })
}

//Event listener for uncollapsed filter list
function filtersUncollapsed(filters){
    filters.addEventListener('click',function(event){
        if(event.target.matches('input[name=filter]')){
            
            //Get the input value
            let radio = event.target.value;
            
            updateCollapsedFilters(radio);

            updateUncollapsedFilters(radio);

            //Update to-do list
            updateTodoList(radio);
        }
    });
}

function updateCollapsedFilters(filter){
    //Change the old selected filter style
    toggleCollapsedFilterSelected(previousCollapsedFilter, true);

    //Change the current selected filter style
    toggleCollapsedFilterSelected(filter);

    previousCollapsedFilter = filter;
}

function updateUncollapsedFilters(filter){
    toggleUncollapsedFilterSelected(filter)
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
        }
    }
}

//If the filter is default, remove posible edit and delete buttons and update the description, otherwise, add the edit and delete buttons. 
function toggleUncollapsedFilterSelected(filter){    
    //Check if the filter selected is a default or a custome filter
    if(FILTERS[filter]){
        document.getElementById('filter-'+filter).checked = true;
        //Update the description for a custome filter
        document.getElementById('options-category').innerHTML = '';
        document.getElementById('options-category-collapse').innerHTML = '';
        refreshDescription(capitalizeFirstLetter(filter), DESCRIPTIONS[filter]);
    }else{
        //Resfresh the description for a custome filter 
        document.getElementById(`category${filter}`).checked = true;
        getCategory(filter).then(
            data => {
                if(data['success']){
                    let category = data['category'];
                    refreshDescription(capitalizeFirstLetter(category['name']), category['description']);
                }else{
                    alert(data['error']);
                }
            }
        ).catch(
            error => console.error(error)
        );
        showOptionsButtons(filter);
    }
}

export function removeCollpasedEditDeleteButtons(){
    let deleteButton = document.getElementById('category-delete-button');
    let editButton = document.getElementById('category-edit-button');

    if(deleteButton && editButton){
        let todoButton = document.getElementById('mobile-add-todo');
        let categoryButton = document.getElementById('mobile-add-category');
        
        todoButton.style['min-width'] = '80px';
        categoryButton.style['min-width'] = '80px';
        editButton.remove();
        deleteButton.remove();
    }
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
    //Select first filter for uncollapsed view
    let selectedFilter = document.querySelector('input[name="filter"]:checked');
    selectedFilter.checked = true;
    
    let newSelectedFilter = document.querySelectorAll('input[name="filter"]')[0];
    newSelectedFilter.checked = true;

    document.getElementById('options-category').innerHTML = '';
    document.getElementById('options-category-collapse').innerHTML = '';
    refreshFilterContent();
    refreshDescription('All', DESCRIPTIONS['all']);

    //Select first filter for collapsed view
    let selectedCollapsedFilter = document.querySelector('[name="filters-collapsed"].selected');
    selectedCollapsedFilter.classList.remove('selected');
    
    document.getElementById('filter-collapsed-all').classList.add('selected');

    previousCollapsedFilter = "all";
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

//Add the edit and delete buttons to the collapsed view
function showOptionsCollapsedButtons(value){
    getCategory(value).then(
        data => {
            if(data['success']){
                let category = data['category'];
                let deleteButton = document.getElementById('category-delete-button');
                let editButton = document.getElementById('category-edit-button');
                let todoButton = document.getElementById('mobile-add-todo');
                let categoryButton = document.getElementById('mobile-add-category');
                
                todoButton.style['min-width'] = '100px';
                categoryButton.style['min-width'] = '120px';

                if(!deleteButton && !editButton){
                    let options_container = document.getElementById('options-collapse');
                    
                    deleteButton = bulidDeleteCategoryButtonCollapsedView(category.id);
                    editButton = bulidEditCategoryButtonCollapsedView(category.id);

                    removeCollpasedEditDeleteButtons();
                    options_container.append(editButton, deleteButton);
                }else{
                    deleteButton.setAttribute('onclick',`showAlertDeleteCategory(${category.id})`)
                    editButton.setAttribute('onclick',`showCollapsedEditForm(${category.id})`)
                }


            }else{
                console.log(data['error']);
            }
        }
    ).catch(
        error => console.log(error)
    );
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

function bulidDeleteCategoryButtonCollapsedView(category_id){
    let button = document.createElement('button');
    button.className =  'button-rounded-layout danger';
    button.style['min-width'] = '130px';
    button.setAttribute('onclick', `showAlertDeleteCategory(${category_id})`)
    button.setAttribute('id', `category-delete-button`);

    let icon = document.createElement('i');
    icon.className = 'fa-solid fa-trash';

    let text = document.createElement('p');
    text.textContent = 'Delete category'

    button.append(icon, text);

    return button
}

function bulidEditCategoryButtonCollapsedView(category_id){
    let button = document.createElement('button');
    button.className =  'button-rounded-layout info';
    button.style['min-width'] = '120px';
    button.setAttribute('onclick', `showUpdateFormCategory(${category_id})`)
    button.setAttribute('id', `category-edit-button`);

    let icon = document.createElement('i');
    icon.className = 'fa-solid fa-trash';

    let text = document.createElement('p');
    text.textContent = 'Edit category'

    button.append(icon, text);

    return button
}