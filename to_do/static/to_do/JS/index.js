import { allTodo, planned, today, important, completed } from "./requests.js";
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

document.addEventListener('DOMContentLoaded', ()=>{
    category_dropdown_click();
    category_dropdown_menu();
    category_add_click();
    category_cancel_click();
    checkFilter();
});

//Listener to display category dropdown menu
function category_dropdown_click(){
    let category_button = document.getElementById('category-dropdown-button');
    let dropdown_menu = document.getElementById('categories-dropdown');
    category_button.addEventListener('click',()=>{
        dropdown_menu.classList.toggle('active') ? dropdown_menu.classList.remove('hide') : dropdown_menu.classList.add('hide');
    })
}

//Listener to change the text inside the category dropdown button each time the value inside the dropdown has changed
function category_dropdown_menu(){
    let categories_radio = document.querySelectorAll('input[name="category"]');
    let button = document.getElementById('category-dropdown-button');
    categories_radio.forEach(element => {
        element.addEventListener('click', ()=> {
            let label_text = document.getElementById('label-category-'+element.value);
            button.textContent = label_text.textContent;
        }); 
    });
}

//Listener to display floating category form
function category_add_click(){
    let category_link = document.getElementById('add-category');
    category_link.addEventListener('click', ()=>{
        let category_form = document.getElementById('floating-category-form');
        if (category_form.classList.contains('active') == false){
            category_form.classList.remove('hide');
            category_form.classList.add('active');
        }  
    });
}

//Listener to detect when the user cancel the category creation
function category_cancel_click(){
    let category_cancel = document.getElementById('cancel-category');
    let category_form = document.getElementById('floating-category-form');
    category_cancel.addEventListener('click', ()=>{
        category_form.classList.remove('active');
        category_form.classList.add('hide');
    });
}

//Check if some radio input (filter) changed
function checkFilter(){
    let filters = document.querySelectorAll('input[name=filter]');
    filters.forEach(filter => {
        filter.addEventListener('click', ()=> {
            //Current filter selected
            let radio = filter.value;
            
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
                // refreshDescription(capitalizeFirstLetter(radio), DESCRIPTIONS[radio]);
            
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